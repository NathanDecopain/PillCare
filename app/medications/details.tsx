import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { MedicationWithId } from "@/models/Medication";
import { Picker } from "@react-native-picker/picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "config/firebase-config";

const { width } = Dimensions.get("window");

export default function MedicationDetails() {
    const medicationId = useLocalSearchParams().medicationId as string;
    console.log("medicationId", medicationId);
    if (!medicationId) {
        return <Redirect href={"/medications"} />;
    }

    const [medication, setMedication] = useState<MedicationWithId>();


    // Fetch the medication from the database
    useEffect(() => {
        try {
            if (medicationId) {
                getDoc(doc(db, "usersMedication", medicationId)).then((doc) => {
                    if (doc.exists()) {
                        setMedication({ ...doc.data(), medicationId: doc.id } as MedicationWithId);
                    } else {
                        console.error("No such document!");
                    }
                });
            }
        } catch (e) {
            console.error("Error fetching medications: ", e);
        }
    }, [medicationId]);

    // Handle changes to the medication object
    const handleChange = (key: keyof MedicationWithId, value: string) => {
        setMedication((prev) => ({ ...prev, [key]: value }) as MedicationWithId);
    };

    const updateMedication = async () => {
        try {
            if (medication) {
                await setDoc(doc(db, "usersMedication", medication.medicationId), medication);
                router.push("/medications");
            }
        } catch (e) {
            console.error("Error updating medication: ", e);
        }
    };

    const deleteMedication = async () => {
        try {
            if (medication) {
                await setDoc(doc(db, "usersMedication", medication.medicationId), {
                    ...medication,
                    isInactive: true
                });
                router.navigate("/medications");
            }
        } catch (e) {
            console.error("Error deleting medication: ", e);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo} />
            </View>
            {/* Contenu principal */}
            <View style={styles.container}>

                {/* Bouton de retour */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Image source={require("assets/icon/retour.png")} style={styles.backIcon} />
                </TouchableOpacity>
                {!medication ? (<Text>Loading...</Text>) : (
                    <View style={styles.form}>
                        <Text style={styles.label}>Medication Name</Text>
                        <TextInput
                            style={styles.input}
                            value={medication!.name}
                            onChangeText={(text) => handleChange("name", text)}
                        />

                        <Text style={styles.label}>Dosage</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.dosage}
                            onChangeText={(text) => handleChange("dosage", text)}
                        />

                        <Text style={styles.label}>Type</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={medication.type}
                                onValueChange={(itemValue) => handleChange("type", itemValue.toString())}
                                style={styles.picker}
                            >
                                <Picker.Item label="Prescription" value="prescription" />
                                <Picker.Item label="Supplement" value="supplement" />
                                <Picker.Item label="Over-the-counter" value="over-the-counter" />
                                <Picker.Item label="Other" value="other" />
                            </Picker>
                        </View>

                        <Text style={styles.label}>Additional Notes</Text>
                        <TextInput
                            style={[styles.input, styles.notesInput]}
                            multiline
                            value={medication.notes}
                            onChangeText={(text) => handleChange("notes", text)}
                        />
                    </View>
                )}
                {/* Bouton save */}
                <TouchableOpacity style={styles.saveButton} onPress={updateMedication}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                {/* Bouton de suppression */}
                <TouchableOpacity style={styles.cancelButton} onPress={deleteMedication}>
                    <Text style={styles.cancelButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
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
        marginTop: 45
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
        marginLeft: -10
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
    },

});
