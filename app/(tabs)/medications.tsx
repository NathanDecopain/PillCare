import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Redirect, router, useRouter} from "expo-router";
import {db} from "config/firebase-config";
import {collection, addDoc, onSnapshot, getDocs, setDoc, doc, where, query, and} from "firebase/firestore";
import {useAuthContext} from "@/contexts/AuthContext";
import {Medication, MedicationWithId} from "@/models/Medication";

const {width} = Dimensions.get("window");

const doctors = [
    {name: "Dr. Smith", specialty: "Cardiologist", email: "dr.smith@example.com", phone: "+1 514-999-1234"},
    {name: "Dr. Johnson", specialty: "Dermatologist", email: "dr.johnson@example.com", phone: "+1 514-888-5678"},
];

export default function MedicationsPage() {
    const {session} = useAuthContext();
    if (!session) {
        return <Redirect href={"/login"}/>;
    }
    const [activeTab, setActiveTab] = useState<"Medications" | "Doctors">("Medications");
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
                return; // Prevent the query if userId is invalid
            }

            const q = query(
                collection(db, "usersMedication"),
                and(where("userId", "==", session.userID) , where("isInactive", "==", false))
            );

            const querySnapshot = await getDocs(q);
            const userMedicationData = querySnapshot.docs.map(doc => ({...doc.data(), medicationId: doc.id} as MedicationWithId));
            setMedicationList(userMedicationData);
        } catch (error) {
            console.error("Error fetching medications: ", error);
        }
    };


    const handleItemPress = (item: any) => {
        if (activeTab === "Medications") {
            router.push({
                pathname: "/medications/details",
                params: {
                    id: item.id,
                },
            });
        } else {
            router.push({
                pathname: "/docteur/profile",
                params: {
                    name: item.name,
                    specialty: item.specialty,
                    email: item.email,
                    phone: item.phone,
                    hospital: item.hospital,
                    languages: item.languages,
                    availability: item.availability,
                },
            });
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
                <Image source={require("assets/icon/logo.png")} style={styles.logo}/>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab("Medications")}>
                    <Text style={[styles.tabText, activeTab === "Medications" && styles.activeTabText]}>
                        Medications
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("Doctors")}>
                    <Text style={[styles.tabText, activeTab === "Doctors" && styles.activeTabText]}>
                        Doctors
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider}/>

            <ScrollView
                contentContainerStyle={styles.scrollViewContent}>
                {(activeTab === "Medications")
                    && medicationList.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card} onPress={() => handleMedicationItemPress(item.medicationId)}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>
                                    {item.type}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    ))
                }

                {(activeTab === "Doctors")
                    && doctors.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card} onPress={() => handleItemPress(item)}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>{item.specialty}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>

            <TouchableOpacity style={styles.addButton}
                              onPress={() => router.push("/medications/addMedication")}>
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
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        color: "#000",
        fontWeight: "bold",
        textDecorationLine: "underline",
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
        shadowOffset: {width: 0, height: 4},
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
        bottom: 80,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 37,
    },
});
