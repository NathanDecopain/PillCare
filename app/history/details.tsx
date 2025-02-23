import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { and, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "config/firebase-config";
import { HistoryEntryFromFirestore } from "@/models/HistoryEntry";
import { Picker } from "@react-native-picker/picker";
import { MedicationWithId } from "@/models/Medication";
import MyDateTimePicker from "@/components/MyDateTimePicker";
import { Timestamp } from "@firebase/firestore";

const { width } = Dimensions.get("window");

export default function HistoryDetails() {
    const historyId = useLocalSearchParams().historyId as string;
    const [medicationList, setMedicationList] = useState<MedicationWithId[]>([]);

    // If history item is not found, redirect to the home page on today's date
    if (!historyId) {
        router.replace({ pathname: "/home" });
    }

    const [historyEntry, setHistoryEntry] = useState<HistoryEntryFromFirestore>();

    // Fetch the history entry from the database
    useEffect(() => {
        try {
            if (historyId) {
                getDoc(doc(db, "usersHistory", historyId)).then((doc) => {
                    if (doc.exists()) {
                        setHistoryEntry({ ...doc.data(), historyId: doc.id } as HistoryEntryFromFirestore);
                    } else {
                        console.error("No such document!");
                    }
                });
            }
        } catch (e) {
            console.error("Error fetching history entry: ", e);
        }
    }, [historyId]);

    // Fetch the medication list from the database
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const q = query(collection(db, "usersMedication"), and(where("userId", "==", historyEntry?.userId), where("isInactive", "==", false)));
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

        if (historyEntry) {
            fetchMedications();
        }
    }, [historyEntry]);

    // Handle changes to the history entry object (except dateTime)
    const handleChange = (key: keyof HistoryEntryFromFirestore, value: string) => {
        setHistoryEntry((prev) => ({ ...prev, [key]: value }) as HistoryEntryFromFirestore);
    };

    // Handle changes to the history entry object (dateTime)
    const handleDateTimeChange = (value: Date) => {
        setHistoryEntry((prev) => ({ ...prev, dateTime: Timestamp.fromDate(value) }) as HistoryEntryFromFirestore);
    };

    const updateHistoryEntry = async () => {
        try {
            if (historyEntry) {
                await setDoc(doc(db, "usersHistory", historyEntry.historyId), historyEntry);

                // Redirect to the home page on the history item's date
                router.push({
                    pathname: "/home",
                    params: { initialDay: historyEntry.dateTime.toDate().toISOString().split("T")[0] }
                })
            }
        } catch (e) {
            console.error("Error updating history entry: ", e);
        }
    };

    const deleteHistoryEntry = async () => {
        try {
            if (historyEntry) {
                await deleteDoc(doc(db, "usersHistory", historyEntry.historyId));
                router.replace({
                    pathname: "/home",
                    params: { initialDay: historyEntry?.dateTime.toDate().toISOString().split("T")[0] }
                });
            }
        } catch (e) {
            console.error("Error deleting history entry: ", e);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo} />
            </View>
            {/* Contenu principal */}
            <View style={styles.container}>
                {/* Bouton de retour */}
                <TouchableOpacity style={styles.backButton} onPress={() => {
                    router.replace({
                        pathname: "/home",
                        params: { initialDay: historyEntry?.dateTime.toDate().toISOString().split("T")[0] }
                    })
                }}>
                    <Image source={require("assets/icon/retour.png")} style={styles.backIcon} />
                </TouchableOpacity>
                {!historyEntry ? (<Text>Loading...</Text>) : (
                    <View style={styles.form}>
                        {/* Nom du médicament et picker associé */}
                        <Text style={styles.label}>Medication</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={historyEntry.medicationId}
                                onValueChange={(itemValue) => handleChange("medicationId", itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a medication" value="" />
                                {medicationList.map((medication) => (
                                    <Picker.Item key={medication.medicationId} label={medication.name} value={medication.medicationId} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={styles.label}>Date and time</Text>
                        <MyDateTimePicker dateTime={historyEntry.dateTime.toDate()}
                            setDateTime={(value) => handleDateTimeChange(value)} />

                        <Text style={styles.label}>Observation</Text>
                        <TextInput
                            style={[styles.input, styles.notesInput]}
                            multiline
                            value={historyEntry.observation}
                            onChangeText={(text) => handleChange("observation", text)}
                        />
                    </View>
                )}
                {/* Bouton save */}
                <TouchableOpacity style={styles.saveButton} onPress={updateHistoryEntry}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                {/* Bouton de suppression */}
                <TouchableOpacity style={styles.cancelButton} onPress={deleteHistoryEntry}>
                    <Text style={styles.cancelButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
        ;
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    form: {
        marginBottom: 20,
        marginTop: 45,
    },
    label: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
    },
    notesInput: {
        height: 60,
    },
    saveButton: {
        backgroundColor: "#CDD8F5",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
    },
    backIcon: {
        width: 32,
        height: 32,
        resizeMode: "contain",
        marginTop: -20,
        marginLeft: -10,
    },
    cancelButton: {
        backgroundColor: "#E57373",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    pickerWrapper: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        justifyContent: "center",
        paddingHorizontal: 10,
    },

    picker: {
        width: "100%",
        color: "#666",
    },

    dateTimePickerWrapper: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

});