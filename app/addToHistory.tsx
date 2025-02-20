import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {Redirect, useLocalSearchParams, useRouter} from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import {addDoc, and, collection, getDocs, query, setDoc, where} from "firebase/firestore";
import {db} from "config/firebase-config";
import {MedicationWithId} from "@/models/Medication";
import {useAuthContext} from "@/contexts/AuthContext";
import {HistoryEntry} from "@/models/HistoryEntry";

const {width} = Dimensions.get("window");

export default function AddToHistory() {
    const {session} = useAuthContext();
    const router = useRouter();
    const dateParam = useLocalSearchParams().date.toString();
    if (!session) return <Redirect href={"/login"}/>

    const [userMedications, setUserMedications] = useState<MedicationWithId[]>()
    const [selectedMedication, setSelectedMedication] = useState<MedicationWithId>()
    const [historyEntry, setHistoryEntry] = useState<HistoryEntry>({
        userId: session.userID,
        type: "medication", // Medication or observation
        medicationId: "",
        dateTime: dateParam ? new Date(dateParam) : new Date(),
        dosage: "",
        observation: "",
        createdAt: new Date(),
    });

    // Use effect to fetch user medications
    useEffect(() => {
        fetchUserMedications().catch(
            (error) => console.error("Error fetching user medications: ", error)
        );
    }, []);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleChange = (key: keyof typeof historyEntry, value: string) => {
        setHistoryEntry((prev) => ({...prev, [key]: value}));
    };

    const handleSubmit = () => {
        {/* Check if type is medication or observation */
        }
        if (!(historyEntry.type === "medication" || historyEntry.type === "observation")) {
            alert("Please choose a type of entry.");
        }

        {/* Checks for medication entry */
        }
        if (historyEntry.type === "medication" && !(historyEntry.dateTime && historyEntry.medicationId)) {
            alert("Please fill in all required fields.");
            return;
        }

        if (historyEntry.type === "observation" && !(historyEntry.dateTime && historyEntry.observation)) {
            alert("Please fill in all required fields.");
            return;
        }

        {/* TODO: Insert history entry into the database */}
        try {
            const data: HistoryEntry = {
                userId: session?.userID,
                type: historyEntry.type,
                medicationId: historyEntry.medicationId,
                dateTime: historyEntry.dateTime,
                dosage: historyEntry.dosage,
                observation: historyEntry.observation,
                createdAt: new Date(),
            }
            const docRef = addDoc(collection(db, "usersHistory"), data)
        } catch (error) {
            console.error("Error adding history entry:", error);
        }

        alert("Medication logged successfully!");
        router.navigate("/home");
    };

    const formatDate = (dateTime: Date) => {
        const today = new Date(); // Get today's date
        const inputDate = dateTime; // Convert input to a Date object

        // Check if the date is today
        if (
            inputDate.getDate() === today.getDate() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear()
        ) {
            return "Today";
        }

        // Check if the year is the current year
        const isCurrentYear = inputDate.getFullYear() === today.getFullYear();

        // Format the date as "Monday Feb. 3"
        const options = {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: isCurrentYear ? undefined : 'numeric'
        };
        return inputDate.toLocaleDateString('en-US', options);
    }

    function formatTime(dateTime: Date) {
        const inputTime = dateTime; // Convert input to a Date object

        const options = {
            hour: 'numeric', // Use numeric hour (e.g., 8, 12)
            minute: '2-digit', // Use two-digit minutes (e.g., 00, 30)
            hour12: true // Use 12-hour clock (AM/PM)
        };
        return inputTime.toLocaleTimeString('en-US', options);
    }

    const handleDateChange = (event, selectedDate) => {
        handleChange("dateTime", selectedDate);
        setShowDatePicker(false);
    }

    const handleTimeChange = (event, selectedTime) => {
        handleChange("dateTime", selectedTime);
        setShowTimePicker(false);
    }

    // Fetch user medications from the database
    const fetchUserMedications = async () => {
        const q = query(
            collection(db, "usersMedication"),
            and(where("userId", "==", session.userID) , where("isInactive", "==", false))
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({...doc.data(), medicationId: doc.id} as MedicationWithId));
        setUserMedications(data);
    }

    const handleSelectMedication = (medicationId: string) => {
        // Change the selected medication ID in the history entry
        handleChange("medicationId", medicationId);

        // Change the dosage to the default dosage of the medication
        const selectedMedication = userMedications?.find((medication) => medication.medicationId === medicationId);
        if (selectedMedication) {
            handleChange("dosage", selectedMedication.dosage);
        }
    }

    return (
        <View style={styles.container}>
            {/* Formulaire */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.label}>What do you want to log?</Text>
                <View style={styles.pickerWrapper}>
                    <Picker selectedValue={historyEntry.type} onValueChange={(value) => handleChange("type", value)}
                            style={styles.picker}>
                        <Picker.Item key={1} label="Medication I took" value="medication"/>
                        <Picker.Item key={2} label="An observation on my health" value="observation"/>
                    </Picker>
                </View>
                {/*Date and time picker*/}
                <Text style={styles.label}>Time</Text>
                <View style={styles.dateTimePickerWrapper}>
                    {/* Show date picker when date is pressed */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text>{formatDate(historyEntry.dateTime)}</Text>
                    </TouchableOpacity>
                    {/* Show time picker when time is pressed */}
                    <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <Text>{formatTime(historyEntry.dateTime)}</Text>
                    </TouchableOpacity>
                </View>

                {/*Date picker modal*/}
                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={historyEntry.dateTime}
                        mode={"date"}
                        is24Hour={true}
                        onChange={handleDateChange}
                    />
                )}

                {/*Time picker modal*/}
                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={historyEntry.dateTime}
                        mode={"time"}
                        is24Hour={true}
                        onChange={handleTimeChange}
                    />
                )}

                {/* Medication log */}
                {historyEntry.type === "medication" && userMedications && <>
                    <Text style={styles.label}>Medication</Text>

                    {/*User medications dropdown*/}
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={null} onValueChange={(value) => handleSelectMedication(value)}
                                style={styles.picker}>
                            <Picker.Item label="Select a medication" value={null}/>
                            {userMedications.map((item) => <Picker.Item key={item.medicationId} label={item.name} value={item.medicationId}/>)}
                        </Picker>
                    </View>

                    {/* Dosage if changed */}
                    <Text style={styles.label}>Dosage</Text>
                    <TextInput style={styles.input} placeholder="Enter dosage (e.g., 500mg)"
                               value={historyEntry.dosage} onChangeText={(text) => handleChange("dosage", text)}/>

                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput style={[styles.input, styles.notesInput]} placeholder="Enter any additional notes"
                               multiline value={historyEntry.observation}
                               onChangeText={(text) => handleChange("observation", text)}/>
                </>
                }

                {/* Observation log */}
                {historyEntry.type === "observation" && <>
                    <Text style={styles.label}>Observation</Text>
                    <TextInput style={[styles.input, styles.notesInput]} placeholder="Enter any additional notes"
                               multiline value={historyEntry.observation}
                               onChangeText={(text) => handleChange("observation", text)}/>
                </>
                }

                {/* Buttons */}
                <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                    <Text style={styles.addButtonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace("/home")}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
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
        height: 120,
        backgroundColor: "#CDD8F5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    input: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    notesInput: {
        height: 60,
    },
    pickerWrapper: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        justifyContent: "center",
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
    picker: {
        width: "100%",
    },
    addButton: {
        backgroundColor: "#7B83EB",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
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
});
