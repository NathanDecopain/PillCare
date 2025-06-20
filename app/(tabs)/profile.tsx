import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { db, storage, auth } from "config/firebase-config";
import { useAuthContext } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function ProfilePage() {
    const router = useRouter();

    const { session, logout } = useAuthContext();

    const handleLogout = async () => {
        logout();
        router.navigate("/")
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileContainer}>
                    <Image source={require("assets/icon/userPfp.jpg")} style={styles.profileImage} />
                    <Text style={styles.name}>{session?.firstName} {session?.lastName}</Text>
                    <Text style={styles.subtitle}>{session?.email}</Text>
                </View>

                {/* Information Section */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>{session?.phoneNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date of Birth:</Text>
                        <Text style={styles.infoValue}>
                            {session?.dateOfBirth ? session.dateOfBirth : "Not available"}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>About Me:</Text>
                        <Text style={styles.infoValue}>
                            Je sais pas si cette section est necessaire, je vais la garder pour l'instant
                        </Text>
                    </View>
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.navigate("/editProfile")}
                >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.button} onPress={() => router.push("/medications")}>
                    <Text style={styles.buttonText}>My Medications</Text>
                </TouchableOpacity>


                {/* Bouton de déconnexion */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
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
    scrollContent: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#CDD8F5",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    infoSection: {
        marginVertical: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    infoRow: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    infoValue: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    editButton: {
        backgroundColor: "#7B83EB",
        borderRadius: 30,
        width: width * 0.9,
        alignSelf: "center",
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#E57373",
        borderRadius: 30,
        width: width * 0.9,
        alignSelf: "center",
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#7B83EB",
        borderRadius: 30,
        width: width * 0.9,
        alignSelf: "center",
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});