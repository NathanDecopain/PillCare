import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "config/firebase-config";
import { collection, getDocs, query, where, and } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

const { width } = Dimensions.get("window");
type MedicationWithId = {
    createdAt: string; // You may need to use `Timestamp` from Firestore if dealing with Firestore timestamps
    dateTime: string;  // Adjust accordingly if you need a Date object instead
    dosage: string;
    historyId: string;
    medicationId: string;
    observation?: string; // Optional if it may not always be present
    type: string;
    userId: string;
};
const StatisticsPage = () => {
    const [historyData, setHistoryData] = useState<MedicationWithId[]>([]);
    const { session } = useAuthContext();

    useEffect(() => {
        if (!session?.userID) return;
        
        const fetchMedications = async () => {
            try {
                const q = query(
                    collection(db, "usersHistory"),
                    and(where("userId", "==", session.userID), where("type", "==", "medication"))
                );
                const querySnapshot = await getDocs(q);
                const userHistoryData = querySnapshot.docs.map(doc => ({
                    ...(doc.data() as MedicationWithId), // Cast Firestore data to `MedicationWithId`
                    medicationId: doc.id
                }));
                setHistoryData(userHistoryData);
                
            } catch (error) {
                console.error("Error fetching medications: ", error);
            }
        };

        fetchMedications();
    }, [session?.userID]);

    if (!session) {
        return <Redirect href={'/login'} />;
    }

    const takenCount = historyData.length;
    const notTakenCount = Math.max(0, 30 - takenCount); // Assuming 30-day tracking period
    
    const data = [
        { name: "Taken", population: takenCount, color: "#CDD8F5", legendFontColor: "#333", legendFontSize: 15 },
        { name: "Not taken", population: notTakenCount, color: "#7B83EB", legendFontColor: "#333", legendFontSize: 15 }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo} />
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Medication Statistics</Text>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={data}
                            width={width * 0.9}
                            height={200}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FD",
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
    card: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    chartContainer: {
        alignSelf: "center",
        alignItems: "center",
        borderRadius: 15,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default StatisticsPage;
