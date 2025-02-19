import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {Redirect, useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from "firebase/auth";
import {collection, addDoc, onSnapshot, getDocs, setDoc, doc} from "firebase/firestore";
import {db} from "config/firebase-config";
import {useAuthContext} from "@/contexts/AuthContext";
import {Medication} from "@/models/Medication";


const {width} = Dimensions.get("window");

export default function AddMedication() {
    const router = useRouter();
    const {session} = useAuthContext();

    if (!session) return <Redirect href={"/login"}/>

    const [medication, setMedication] = useState<Medication>({
        name: "",
        dosage: "",
        type: "other",
        notes: "",
        userId: session.userID,
        isInactive: false,
    });

    const handleChange = (key: keyof typeof medication, value: string) => {
        setMedication((prev) => ({...prev, [key]: value}));
    };


    const handleSubmit = async () => {
        if (!medication.name || !medication.dosage) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const docRef = await addDoc(collection(db, "usersMedication"), {
                userId: session?.userID,
                name: medication.name,
                dosage: medication.dosage,
                type: medication.type,
                notes: medication.notes,
                isInactive: false,
            });
            console.log("Medication added with ID:", docRef.id);
        } catch (error) {
            console.error("Error adding medication:", error);
        }

        alert("Medication added successfully!");
        router.navigate("/medications");
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo}/>
            </View>

            {/* Form */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.label}>Medication Name</Text>
                <TextInput style={styles.input} placeholder="Enter medication name" value={medication.name}
                           onChangeText={(text) => handleChange("name", text)}/>

                <Text style={styles.label}>Medication Type</Text>
                <Picker style={styles.picker} selectedValue={medication.type} onValueChange={(value) => handleChange("type", value)}>
                    <Picker.Item label="Prescription" value="prescription"/>
                    <Picker.Item label="Supplement" value="supplement"/>
                    <Picker.Item label="Vente libre" value="over-the-counter"/>
                    <Picker.Item label="Autre" value="other"/>
                </Picker>

                <Text style={styles.label}>Dosage</Text>
                <TextInput style={styles.input} placeholder="Enter dosage (e.g., 500mg)" value={medication.dosage}
                           onChangeText={(text) => handleChange("dosage", text)}/>

                <Text style={styles.label}>Additional Notes</Text>
                <TextInput style={[styles.input, styles.notesInput]} placeholder="Enter any additional notes" multiline
                           value={medication.notes} onChangeText={(text) => handleChange("notes", text)}/>

                {/* Buttons */}
                <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                    <Text style={styles.addButtonText}>Add Medication</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.navigate("/medications")}>
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
