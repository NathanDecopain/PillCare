import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {Redirect, useLocalSearchParams, useRouter} from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {db} from "config/firebase-config";
import {useAuthContext} from "@/contexts/AuthContext";
import {DAYS_OF_WEEK, Reminder, reminderType, repeatMode} from "@/models/Reminder";
import {MedicationWithId} from "@/models/Medication";
import {Checkbox} from "expo-checkbox"; // Import the Medication model

const {width} = Dimensions.get("window");

export default function AddReminder() {
    const {session} = useAuthContext();
    const router = useRouter();
    if (!session) return <Redirect href={"/login"}/>;

    const [reminder, setReminder] = useState<Reminder>({
        userId: session.userID,
        type: reminderType.MEDICATION, // Default to MEDICATION
        label: "",
        description: "",
        time: new Date(),
        startDate: new Date(),
        endDate: undefined,
        daysOfWeek: [],
        specificDate: undefined,
        intervalDays: undefined,
        intervalHours: undefined,
        intervalMinutes: undefined,
        repeatMode: repeatMode.DAILY, // Default to DAILY
        isActive: true,
    });

    const [userMedications, setUserMedications] = useState<MedicationWithId[]>([]); // State for user medications
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Fetch user medications on component mount
    useEffect(() => {
        const fetchUserMedications = async () => {
            if (!session?.userID) return;

            const q = query(
                collection(db, "usersMedication"),
                where("userId", "==", session.userID),
                where("isInactive", "==", false) // Only fetch active medications
            );
            const querySnapshot = await getDocs(q);
            const medications = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                medicationId: doc.id,
            })) as MedicationWithId[];
            setUserMedications(medications);
        };

        fetchUserMedications().catch((error) => {
            console.error("Error fetching user medications:", error);
        });
    }, [session]);

    const handleChange = (key: keyof Reminder, value: string | string[] | number | boolean | Date | undefined) => {
        setReminder((prev) => ({...prev, [key]: value}));
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!reminder.type || !reminder.time || !reminder.startDate) {
            alert("Please fill in all required fields.");
            return;
        }

        // Validate medicationId if type is MEDICATION
        if (reminder.type === reminderType.MEDICATION && !reminder.medicationId) {
            alert("Please select a medication.");
            return;
        }

        // Validate daysOfWeek if repeatMode is WEEKLY
        if (reminder.repeatMode === repeatMode.WEEKLY && reminder.daysOfWeek.length === 0) {
            alert("Please select at least one day of the week for weekly reminders.");
            return;
        }

        // Validate interval fields if repeatMode is CUSTOM
        if (reminder.repeatMode === repeatMode.CUSTOM && !(reminder.intervalHours || reminder.intervalMinutes)) {
            alert("Please specify an interval for custom reminders.");
            return;
        }

        try {
            // Add the reminder to Firestore
            const data: Reminder = {
                // Remove undefined fields
                ...Object.fromEntries(Object.entries(reminder).filter(([_, v]) => v !== undefined)) as Reminder,
                userId: session.userID,
                isActive: true,
            };

            await addDoc(collection(db, "usersReminders"), data);
            alert("Reminder created successfully!");
            router.navigate("/home");
        } catch (error) {
            console.error("Error adding reminder:", error);
            alert("Failed to create reminder. Please try again.");
        }
    };

    const formatDate = (date: Date) => {
        // If date is today, return "Today", else return the formatted date
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return `Today`;
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleStartDateChange = (event, selectedDate) => {
        handleChange("startDate", selectedDate);
        setShowStartDatePicker(false);
    };

    const handleEndDateChange = (event, selectedDate) => {
        handleChange("endDate", selectedDate);
        setShowEndDatePicker(false);
    };

    const handleTimeChange = (event, selectedTime) => {
        handleChange("time", selectedTime);
        setShowTimePicker(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Reminder Type */}
                <Text style={styles.label}>Reminder to...</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={reminder.type}
                        onValueChange={(value) => handleChange("type", value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Take a medication" value={reminderType.MEDICATION}/>
                        <Picker.Item label="Log an observation" value={reminderType.OBSERVATION}/>
                    </Picker>
                </View>

                {/* Medication Picker (only for MEDICATION type) */}
                {reminder.type === reminderType.MEDICATION && (
                    <>
                        <Text style={styles.label}>Which medication?</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={reminder.medicationId}
                                onValueChange={(value) => handleChange("medicationId", value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a medication" value={null}/>
                                {userMedications.map((medication) => (
                                    <Picker.Item
                                        key={medication.medicationId}
                                        label={medication.name}
                                        value={medication.medicationId}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}

                {/* Title */}
                <Text style={styles.label}>Label</Text>
                <TextInput
                    style={styles.input}
                    placeholder={reminder.type === reminderType.MEDICATION ? "ex: Take medication (dose 1 of 2)" : "ex: Take blood pressure?"}
                    value={reminder.label}
                    onChangeText={(text) => handleChange("label", text)}
                />

                {/* Label */}
                <Text style={styles.label}>Precisions (optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Additional info"
                    value={reminder.description}
                    onChangeText={(text) => handleChange("description", text)}
                />

                <Text style={styles.label}>When?</Text>

                {/* Time */}
                <View style={styles.dateTimePickerWrapper}>
                    <Text style={styles.label}>At</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <Text>{formatTime(new Date(reminder.time))}</Text>
                    </TouchableOpacity>
                </View>

                {/* Start Date */}
                <View style={styles.dateTimePickerWrapper}>
                    <Text style={styles.label}>Starting</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                        <Text>{formatDate(new Date(reminder.startDate))}</Text>
                    </TouchableOpacity>
                </View>

                {/* End Date */}
                <View style={styles.dateTimePickerWrapper}>
                    <View style={{flexDirection: "row", alignItems: "center", columnGap: 5}}>
                        <Checkbox
                            value={reminder.endDate !== undefined}
                            onValueChange={(value) => handleChange("endDate", value ? new Date() : undefined)}
                        />
                        <Text style={styles.label}>Ends?</Text>
                    </View>
                    {reminder.endDate && (
                        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                            <Text>{formatDate(new Date(reminder.endDate))}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Start Date Picker */}
                {showStartDatePicker && (
                    <DateTimePicker
                        testID="startDatePicker"
                        value={new Date(reminder.startDate)}
                        mode="date"
                        is24Hour={true}
                        onChange={handleStartDateChange}
                    />
                )}

                {/* Start Date Picker */}
                {showEndDatePicker && (
                    <DateTimePicker
                        testID="endDatePicker"
                        value={new Date(reminder.endDate)}
                        mode="date"
                        is24Hour={true}
                        onChange={handleEndDateChange}
                    />
                )}

                {/* Time Picker */}
                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={new Date(reminder.time)}
                        mode="time"
                        is24Hour={true}
                        onChange={handleTimeChange}
                    />
                )}

                {/* Repeat Mode */}
                <Text style={styles.label}>Remind me every...</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={reminder.repeatMode}
                        onValueChange={(value) => handleChange("repeatMode", value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Day" value={repeatMode.DAILY}/>
                        <Picker.Item label="Week" value={repeatMode.WEEKLY}/>
                        <Picker.Item label="Month" value={repeatMode.MONTHLY}/>
                        <Picker.Item label="Year" value={repeatMode.YEARLY}/>
                        <Picker.Item label="Custom" value={repeatMode.CUSTOM}/>
                    </Picker>
                </View>

                {/* Days of Week (for Weekly Repeat) */}
                {reminder.repeatMode === repeatMode.WEEKLY && (
                    <>
                        <Text style={styles.label}>On</Text>
                        {Object.values(DAYS_OF_WEEK).map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={styles.dayButton}
                                onPress={() => {
                                    const updatedDays = reminder.daysOfWeek.includes(day)
                                        ? reminder.daysOfWeek.filter((d) => d !== day)
                                        : [...reminder.daysOfWeek, day];
                                    handleChange("daysOfWeek", updatedDays);
                                }}
                            >
                                <Text style={reminder.daysOfWeek.includes(day) ? styles.selectedDay : styles.dayText}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {/* Custom Interval (for Custom Repeat) */}
                {reminder.repeatMode === repeatMode.CUSTOM && (
                    <>
                        <Text style={styles.label}>Custom Interval</Text>
                        <View style={styles.intervalContainer}>
                            <TextInput
                                style={[styles.input, styles.intervalInput]}
                                placeholder="Hours"
                                keyboardType="numeric"
                                value={reminder.intervalHours?.toString() || ""}
                                onChangeText={(text) => handleChange("intervalHours", parseInt(text) || 0)}
                            />
                            <TextInput
                                style={[styles.input, styles.intervalInput]}
                                placeholder="Minutes"
                                keyboardType="numeric"
                                value={reminder.intervalMinutes?.toString() || ""}
                                onChangeText={(text) => handleChange("intervalMinutes", parseInt(text) || 0)}
                            />
                        </View>
                    </>
                )}

                {/* Submit Button */}
                <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                    <Text style={styles.addButtonText}>Create Reminder</Text>
                </TouchableOpacity>

                {/* Cancel Button */}
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
    pickerWrapper: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        justifyContent: "center",
    },
    picker: {
        width: "100%",
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
    dayButton: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    selectedDay: {
        fontWeight: "bold",
        color: "#7B83EB",
    },
    dayText: {
        color: "#333",
    },
    intervalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    intervalInput: {
        flex: 1,
        marginHorizontal: 5,
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