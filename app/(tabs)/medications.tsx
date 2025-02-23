import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { db } from "config/firebase-config";
import { collection, getDocs, query, where, and } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { MedicationWithId } from "@/models/Medication";

const { width } = Dimensions.get("window");

export default function MedicationsPage() {
    const { session } = useAuthContext();
    if (!session) {
        return <Redirect href={"/login"} />;
    }

    const [medicationList, setMedicationList] = useState<Array<MedicationWithId>>([]);

    useEffect(() => {
        if (session!.userID) {
            fetchMedications();
        }
    }, [session!.userID]);

    const fetchMedications = async () => {
        try {
            if (!session?.userID) {
                console.error("Can't fetch user medications: User ID is undefined or null");
                return;
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

    const handleMedicationItemPress = (medicationId: string) => {
        router.push({
            pathname: "/medications/details",
            params: {
                medicationId: medicationId,
            },
        });
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo} />
            </View>

            <View style={styles.divider} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.title}>Medications</Text>

                {medicationList.length > 0 ? (
                    medicationList.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card} onPress={() => handleMedicationItemPress(item.medicationId)}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>
                                    {item.type}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.noItemsContainer}>
                        <Image source={require("assets/icon/empty.png")} style={styles.noItemsIcon} />
                        <Text style={styles.noItemsText}>No medications added yet!</Text>
                        <Text style={styles.noItemsSubText}>Tap the + button below to add one.</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/medications/addMedication")}>
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
