import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    time: string;
    duration: string;
    notes: string;
}

export default function MedicationDetails() {
    const params = useLocalSearchParams();
    const [medication, setMedication] = useState<Medication>({
        name: params.name?.toString() || "",
        dosage: params.dosage?.toString() || "",
        frequency: params.frequency?.toString() || "",
        time: params.time?.toString() || "",
        duration: params.duration?.toString() || "",
        notes: params.notes?.toString() || "",
    });

    const handleChange = (key: keyof Medication, value: string) => {
        setMedication((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("../logo.png")} style={styles.logo} />
            </View>

            {/* Contenu principal */}
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.label}>Medication Name</Text>
                    <TextInput
                        style={styles.input}
                        value={medication.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />

                    <Text style={styles.label}>Dosage</Text>
                    <TextInput
                        style={styles.input}
                        value={medication.dosage}
                        onChangeText={(text) => handleChange("dosage", text)}
                    />

                    <Text style={styles.label}>Frequency</Text>
                    <TextInput
                        style={styles.input}
                        value={medication.frequency}
                        onChangeText={(text) => handleChange("frequency", text)}
                    />

                    <Text style={styles.label}>Time</Text>
                    <TextInput
                        style={styles.input}
                        value={medication.time}
                        onChangeText={(text) => handleChange("time", text)}
                    />

                    <Text style={styles.label}>Duration</Text>
                    <TextInput
                        style={styles.input}
                        value={medication.duration}
                        onChangeText={(text) => handleChange("duration", text)}
                    />

                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        multiline
                        value={medication.notes}
                        onChangeText={(text) => handleChange("notes", text)}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 120,
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
});
