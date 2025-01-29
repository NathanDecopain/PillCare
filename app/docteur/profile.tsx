import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

export default function DoctorProfile() {
    const params = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("../logo.png")} style={styles.logo} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Pfp & name */}
                <View style={styles.profileContainer}>
                    <Image source={require("../userPfp.jpg")} style={styles.profileImage} />
                    <Text style={styles.name}>{params.name || "Nom non spécifié"}</Text>
                    <Text style={styles.subtitle}>{params.specialty || "Spécialité non spécifiée"}</Text>
                </View>

                {/* Information Section */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Hôpital / Clinique :</Text>
                        <Text style={styles.infoValue}>{params.hospital || "Non spécifié"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Langues parlées :</Text>
                        <Text style={styles.infoValue}>{params.languages || "Non spécifié"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Disponibilités :</Text>
                        <Text style={styles.infoValue}>{params.availability || "Non spécifié"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email :</Text>
                        <Text style={styles.infoValue}>{params.email || "Non spécifié"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Téléphone :</Text>
                        <Text style={styles.infoValue}>{params.phone || "Non spécifié"}</Text>
                    </View>
                </View>
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
});
