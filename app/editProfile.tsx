import React, { useState } from "react";
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView
} from "react-native";

const { width } = Dimensions.get("window");

export default function EditProfilePage() {
    const [fullName, setFullName] = useState("Jonathan Dubois");
    const [email, setEmail] = useState("john.dubois@hotmail.com");
    const [phone, setPhone] = useState("+1 (514) 467-8263");
    const [birthDate, setBirthDate] = useState("January 9, 1993");

    return (
        <View style={styles.pageContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("./logo.png")} style={styles.logo} />
            </View>

            {/* ScrollView */}
            <ScrollView contentContainerStyle={styles.container}>

                {/* Photo de profil */}
                <View style={styles.profilePictureContainer}>
                    <Image
                        source={require("./userPfp.jpg")}
                        style={styles.profilePicture}
                    />
                    <TouchableOpacity style={styles.editIcon}>
                        <Text style={styles.editIconText}>✎</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Birth date</Text>
                    <TextInput
                        style={styles.input}
                        value={birthDate}
                        onChangeText={setBirthDate}
                    />
                </View>

                {/* Bouton Sauvegarder */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
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

    },
    logo: {
        width: 100,
        height: 100,
        paddingTop: 20,
        resizeMode: "contain",
    },
    container: {
        padding: 20,
        alignItems: "center",
    },
    profilePictureContainer: {
        alignItems: "center",
        marginBottom: 30,
        position: "relative", 
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#CDD8F5",
    },
    editIcon: {
        position: "absolute",
        bottom: 5,
        right: 5, 
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    editIconText: {
        fontSize: 16,
        color: "#666",
    },
    form: {
        width: "100%",
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
        width: "100%",
    },
    saveButton: {
        backgroundColor: "#7B83EB",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        width: "100%",
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});
