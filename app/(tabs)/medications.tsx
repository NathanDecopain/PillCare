import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { db } from "config/firebase-config";
import { collection, getDocs, query, where, and } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { MedicationWithId } from "@/models/Medication";
import {DAYS_OF_WEEK, Reminder, ReminderFromFirestore} from "@/models/Reminder";

const { width } = Dimensions.get("window");

export default function MedicationsPage() {
    const { session } = useAuthContext();
    if (!session) {
        return <Redirect href={"/login"} />;
    }
    const [activeTab, setActiveTab] = useState<"Medications" | "Reminders">("Medications");
    const [medicationList, setMedicationList] = useState<Array<MedicationWithId>>([]);
    const [reminders, setReminders] = useState<Array<ReminderFromFirestore>>([]);

    useEffect(() => {
        if (session!.userID) {
            fetchMedications();
            fetchReminders();
        }
    }, [session!.userID]);

    const fetchMedications = async () => {
        try {
            if (!session?.userID) {
                console.error("Can't fetch user medications: User ID is undefined or null");
                return; // Prevent the query if userId is invalid
            }

            const q = query(
                collection(db, "usersMedication"),
                and(where("userId", "==", session.userID), where("isInactive", "==", false))
            );

            const querySnapshot = await getDocs(q);
            const userMedicationData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                medicationId: doc.id
            } as MedicationWithId));
            setMedicationList(userMedicationData);
        } catch (error) {
            console.error("Error fetching medications: ", error);
        }
    };

    const fetchReminders = async () => {
        try {
            if (!session?.userID) {
                console.error("Can't fetch user reminders: User ID is undefined or null");
                return; // Prevent the query if userId is invalid
            }

            const q = query(
                collection(db, "usersReminders"),
                and(where("userId", "==", session.userID))
            );

            const querySnapshot = await getDocs(q);
            const userReminderData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                reminderId: doc.id
            } as ReminderFromFirestore));
            setReminders(userReminderData);
            console.log("Reminders: ", userReminderData);
        } catch (error) {
            console.error("Error fetching reminders: ", error);
        }
    }


    const handleItemPress = (item: any) => {
        if (activeTab === "Medications") {
            router.push({
                pathname: "/medications/details",
                params: {
                    id: item.id,
                },
            });
        } else {
            router.push({
                pathname: "/docteur/profile",
                params: {
                    name: item.name,
                    specialty: item.specialty,
                    email: item.email,
                    phone: item.phone,
                    hospital: item.hospital,
                    languages: item.languages,
                    availability: item.availability,
                },
            });
        }
    };

    const handleMedicationItemPress = (medicationId: string) => {
        router.push({
            pathname: "/medications/details",
            params: {
                medicationId: medicationId,
            },
        });
    }

    function formatWeekdays(days: DAYS_OF_WEEK[]) {
        return days.join(", ");
    }

    const formatReminderSchedule = (reminder: ReminderFromFirestore) => {
        let schedule = "";
        if (reminder.repeatMode === "DAILY") {
            schedule = "Daily";
        } else if (reminder.repeatMode === "WEEKLY") {
            const weekDays = [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.TUESDAY,
                DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.THURSDAY,
                DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
            /* Orbs for each day of the week, style differently if active */
            return <View style={{flexDirection: "row"}}>
                {weekDays.map(day => (
                    <View key={day} style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: reminder.daysOfWeek.includes(day) ? "#ccc" : "#7B83EB",
                        marginHorizontal: 5,
                    }}>
                        <Text style={{color: "#fff", textAlign: "center"}}>{day.slice(0, 2)}</Text>
                    </View>
                ))}
            </View>;
        } else if (reminder.repeatMode === "MONTHLY") {
            schedule = "Monthly on the " + reminder.specificDate;
        } else if (reminder.repeatMode === "YEARLY") {
            schedule = "Yearly on " + reminder.specificDate;
        } else if (reminder.repeatMode === "CUSTOM") {
            schedule = "Every " + reminder.intervalDays + " days, " + reminder.intervalHours + " hours, and " + reminder.intervalMinutes + " minutes";
        }
        return <Text>{schedule}</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo}/>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab("Medications")}>
                    <Text style={[styles.tabText, activeTab === "Medications" && styles.activeTabText]}>
                        Medications
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("Reminders")}>
                    <Text style={[styles.tabText, activeTab === "Reminders" && styles.activeTabText]}>
                        Reminders
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider}/>

            <ScrollView
                contentContainerStyle={styles.scrollViewContent}>
                {(activeTab === "Medications")
                    && (medicationList.length > 0) ?  medicationList.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card}
                                          onPress={() => handleMedicationItemPress(item.medicationId)}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>
                                    {item.type}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    )) : (
                    <View style={styles.noItemsContainer}>
                        <Image source={require("assets/icon/empty.png")} style={styles.noItemsIcon} />
                        <Text style={styles.noItemsText}>No medications added yet!</Text>
                        <Text style={styles.noItemsSubText}>Tap the + button below to add one.</Text>
                    </View>
                )}

                {(activeTab === "Reminders") && <View>
                    {(reminders.length === 0) ?
                        <View style={styles.noItemsContainer}>
                            <Image source={require("assets/icon/empty.png")} style={styles.noItemsIcon} />
                            <Text style={styles.noItemsText}>No medications added yet!</Text>
                            <Text style={styles.noItemsSubText}>Tap the + button below to add one.</Text>
                        </View>                        : reminders.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.card}
                                              onPress={() => console.log("Reminder pressed: ", item)}>
                                <View style={styles.cardTextContainer}>
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <Text style={styles.cardTitle}>{item.label}</Text>
                                        <Text style={styles.cardTitle}>{item.time.toDate().toLocaleString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })}
                                        </Text>
                                    </View>
                                    {/* Orbs for each day of the week, style differently if active */}
                                    {formatReminderSchedule(item)}
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon}/>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                }
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => {
                                  switch (activeTab) {
                                      case "Medications":
                                          router.push("/medications/addMedication");
                                          break;
                                      case "Reminders":
                                          router.push("/reminders/addReminder");
                                          break;
                                  }
                              }}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        width: "100%",
        height: 110,
        backgroundColor: "#CDD8F5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
    logo: {
        width: 100,
        height: 100,
        paddingTop: 20,
        resizeMode: "contain",
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        color: "#000",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 20,
        marginBottom: 10,
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    card: {
        backgroundColor: "#7B83EB",
        width: width * 0.9,
        alignSelf: "center",
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    cardSubtitle: {
        color: "#fff",
        fontSize: 14,
    },
    arrowIcon: {
        marginLeft: "auto",
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#7B83EB",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 24,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 37,
    },
    noItemsContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        paddingHorizontal: 20,
    },
    noItemsIcon: {
        width: 100,
        height: 100,
        marginBottom: 10,
        opacity: 0.5,
    },
    noItemsText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    noItemsSubText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 10,
        textAlign: "center",
        alignSelf: "center",
        width: "100%",
        marginTop: 10
    }
});
