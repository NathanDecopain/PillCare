import { Text, StyleSheet, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "config/firebase-config";
import { HistoryEntryFromFirestore } from "@/models/HistoryEntry";
import { MarkedDates } from "react-native-calendars/src/types";
import { MedicationWithId } from "@/models/Medication";

const { width } = Dimensions.get("window");

// Utility function to format dates
const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function Home() {
    const { session } = useAuthContext();
    const initialDay = useLocalSearchParams().initialDay as string;
    const today = useMemo(() => formatDate(new Date()), []);
    const [history, setHistory] = useState<HistoryEntryFromFirestore[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(initialDay || today);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [medications, setMedications] = useState<Record<string, MedicationWithId>>({});

    // Redirect if not logged in
    if (!session) return <Redirect href="/login" />;

    // Fetch history and medications concurrently
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historySnapshot, medicationSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "usersHistory"), where("userId", "==", session.userID))),
                    getDocs(query(collection(db, "usersMedication"), where("userId", "==", session.userID))),
                ]);

                const historyData = historySnapshot.docs.map(doc => ({ ...doc.data(), historyId: doc.id } as HistoryEntryFromFirestore));
                const medicationData = Object.fromEntries(medicationSnapshot.docs.map(doc => [doc.id, doc.data() as MedicationWithId]));

                setHistory(historyData);
                setMedications(medicationData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [session.userID]);

    // Filter history entries for the selected date
    const itemsForDate = useMemo(() => {
        return history
            .filter(entry => formatDate(entry.dateTime.toDate()) === selectedDate)
            .sort((a, b) => a.dateTime.toDate().getTime() - b.dateTime.toDate().getTime());
    }, [history, selectedDate]);

    // Mark dates with entries
    useEffect(() => {
        const newMarkedDates: MarkedDates = {};
        history.forEach(entry => {
            const date = formatDate(entry.dateTime.toDate());
            newMarkedDates[date] = { marked: true };
        });
        setMarkedDates(newMarkedDates);
    }, [history]);

    const handleDateChange = useCallback((date: string) => {
        setSelectedDate(date);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <CalendarProvider date={selectedDate} onDateChanged={handleDateChange} showTodayButton>
                <ExpandableCalendar enableSwipeMonths={false} markedDates={markedDates} />
                <ScrollView>
                    {itemsForDate.length > 0 ? (
                        itemsForDate.map(entry => (
                            <TouchableOpacity
                                key={entry.historyId}
                                onPress={() => router.push({ pathname: "/history/details", params: { historyId: entry.historyId } })}
                            >
                                <View style={styles.medicationContainer}>
                                    <Text style={styles.medicationName}>
                                        {entry.type === "medication" && entry.medicationId
                                            ? medications[entry.medicationId]?.name
                                            : "Observation"}
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.medicationTime}>
                                        {entry.type === "medication"
                                            ? entry.dateTime.toDate().toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })
                                            : entry.observation}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>Aucun item pour cette journée</Text>
                    )}
                </ScrollView>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push({ pathname: "/addToHistory", params: { date: selectedDate + "T" + new Date().toISOString().split("T")[1] } })}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </CalendarProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
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
        shadowOffset: { width: 0, height: 4 },
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 38,
    },
});