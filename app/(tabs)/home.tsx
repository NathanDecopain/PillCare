import {Text, StyleSheet, TouchableOpacity, View, ScrollView, Dimensions} from "react-native";
import {Agenda, AgendaList, CalendarProvider, ExpandableCalendar} from "react-native-calendars";
import {SafeAreaView} from "react-native-safe-area-context";
import {useCallback, useEffect, useState} from "react";
import {Redirect, router} from "expo-router";
import {useAuthContext} from "@/contexts/AuthContext";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "config/firebase-config";
import {HistoryEntry, HistoryEntryFromFirestore} from "@/models/HistoryEntry";
import {MarkedDates} from "react-native-calendars/src/types";
import {MedicationWithId} from "@/models/Medication";

const {width} = Dimensions.get("window");

export default function Home() {
    const {session} = useAuthContext();
    if (!session) return <Redirect href="/login"/>;

    const [history, setHistory] = useState<HistoryEntryFromFirestore[]>();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [markedDates, setMarkedDates] = useState<MarkedDates>();
    const [itemsForDate, setItemsForDate] = useState<HistoryEntryFromFirestore[]>();
    const [medications, setMedications] = useState<Map<MedicationWithId>>();

    useEffect(() => {
        fetchHistory();
        fetchMedications();
    }, []);

    // Fetch medication from the firestore database
    const fetchMedications = async () => {
        const q = query(collection(db, "usersMedication"), where("userId", "==", session.userID));
        const querySnapshot = await getDocs(q);

        // Get the data from the query snapshot
        const medicationData = Object.fromEntries(querySnapshot.docs.map(doc => [doc.id, doc.data() as MedicationWithId]));
        setMedications(medicationData);
    }

    // Fetch history entries from the firestore database
    const fetchHistory = async () => {
        const q = query(collection(db, "usersHistory"), where("userId", "==", session.userID));
        const querySnapshot = await getDocs(q);

        // Get the data from the query snapshot
        const historyData = querySnapshot.docs.map(doc => doc.data() as HistoryEntryFromFirestore);

        setHistory(historyData);
    }

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    }

    // Filter the history entries by the selected date
    useEffect(() => {
        const entries = history?.filter(entry => entry.dateTime.toDate().toISOString().split("T")[0] === selectedDate)
            .sort((a, b) => a.dateTime.toDate().getTime() - b.dateTime.toDate().getTime())

        setItemsForDate(entries);
    }, [selectedDate]);

    // Mark every date with an entry as having an item
    useEffect(() => {
        if (!history) return;
        const markedDates: MarkedDates = {};
        history.forEach(entry => {
            const date = entry.dateTime.toDate().toISOString().split("T")[0];
            markedDates[date] = {marked: true};
        });
        setMarkedDates(markedDates);
    }, [history]);

    return (
        <SafeAreaView style={styles.container}>
            <CalendarProvider date={new Date().toISOString().split("T")[0]} onDateChanged={handleDateChange}
                              showTodayButton>
                <ExpandableCalendar
                    firstDay={1}
                    markedDates={markedDates}
                />
                {/* Sélectionner les items associés à la journée sélectionnée*/}
                <ScrollView>
                    {selectedDate && itemsForDate ? itemsForDate.map((entry: HistoryEntryFromFirestore) => {
                                if (entry.type === "medication") {
                                    return (
                                        <View key={entry.id} style={styles.medicationContainer}>
                                            <Text style={styles.medicationName}>{medications?.[entry.medicationId]?.name}</Text>
                                            <View style={styles.divider}/>
                                            <Text
                                                style={styles.medicationTime}>{entry.dateTime.toDate().toLocaleTimeString("en-us", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}</Text>
                                        </View>)
                                } else {
                                    return (
                                        <View key={entry.id} style={styles.medicationContainer}>
                                            <Text style={styles.medicationName}>Observation</Text>
                                            <View style={styles.divider}/>
                                            <Text style={styles.medicationTime}>{entry.observation}</Text>
                                        </View>
                                    )
                                }
                            }
                        ) :
                        <Text>Aucun item pour cette journée</Text>
                    }
                </ScrollView>
                {/* Bouton d'ajout */}
                <TouchableOpacity style={styles.addButton} onPress={() => router.push({
                    pathname: "/addToHistory",
                    params: {date: selectedDate}
                })}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </CalendarProvider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    header: {
        width: width * 1.2,
        height: width / 1.7,
        backgroundColor: "#CDD8F5",
        borderBottomLeftRadius: width / 2,
        borderBottomRightRadius: width / 2,
        justifyContent: "flex-start",
        paddingTop: 50,
        transform: [{translateX: -(width * 0.1)}],
        overflow: "hidden",

    },
    textContainer: {
        paddingLeft: 55,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#666",
    },
    subText: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
        marginBottom: 10,
    },
    dateScrollView: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 65,
    },
    dateWrapper: {
        alignItems: "center",
        marginHorizontal: 8,
    },
    dateCircle: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    todayCircle: {
        backgroundColor: "#7B83EB",
    },
    selectedDateCircle: {
        backgroundColor: "#D3D3D3",
    },
    dayText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#666",
    },
    todayText: {
        color: "#fff",
    },
    selectedDateText: {
        color: "#666",
    },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#666",
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    medicationContainer: {
        height: 100,
        backgroundColor: "#7B83EB",
        width: width * 0.9,
        alignSelf: "center",
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    medicationName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    medicationTime: {
        color: "#fff",
        fontSize: 16,
    },
    divider: {
        height: "80%",
        width: 1,
        backgroundColor: "#fff",
        marginHorizontal: 10,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#7B83EB",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 38,
    },
});