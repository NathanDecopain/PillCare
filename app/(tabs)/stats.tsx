import {View, Text, StyleSheet, Dimensions, ScrollView, Image} from "react-native";
import {PieChart} from "react-native-chart-kit";
import React, {useState, useEffect} from "react";
import {collection, getDocs, query, where, and} from "firebase/firestore";
import {db} from "config/firebase-config";
import {useAuthContext} from "@/contexts/AuthContext";
import {Redirect} from "expo-router";
import {MedicationWithId} from "@/models/Medication";

const {width} = Dimensions.get("window");

const data = [
    {name: "Taken", population: 27, color: "#CDD8F5", legendFontColor: "#333", legendFontSize: 15},
    {name: "Not taken", population: 3, color: "#7B83EB", legendFontColor: "#333", legendFontSize: 15},
];

const StatisticsPage = () => {
    const [historyData, setHistoryData] = useState<MedicationWithId[]>([]);
    const [medicationNames, setMedicationNames] = useState<Record<string, string>>({});
    const {session} = useAuthContext();

    if (!session) return <Redirect href="/login"/>;

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                // Fetch medication history
                const historyQuery = query(
                    collection(db, "usersHistory"),
                    and(where("userId", "==", session.userID), where("type", "==", "medication"))
                );
                const historySnapshot = await getDocs(historyQuery);
                const userHistoryData = historySnapshot.docs.map(doc => doc.data() as MedicationWithId);
                setHistoryData(userHistoryData);

                // Get unique medication IDs
                const medicationIds = [...new Set(userHistoryData.map(med => med.medicationId))];

                // Fetch medication names
                const medQuery = query(collection(db, "usersMedication"), where("userId", "==", session.userID));
                const medSnapshot = await getDocs(medQuery);
                const medMap: Record<string, string> = {};

                medSnapshot.docs.forEach(doc => {
                    const medData = doc.data();
                    if (medicationIds.includes(doc.id)) {
                        medMap[doc.id] = medData.name;
                    }
                });

                setMedicationNames(medMap);
            } catch (error) {
                console.error("Error fetching medications: ", error);
            }
        };

        fetchMedications();
    }, [session?.userID]);

    if (!session) {
        return <Redirect href={"/login"}/>;
    }

    // Group medications by their medicationId
    const medicationCounts = historyData.reduce((acc, med) => {
        if (med.medicationId) {
            acc[med.medicationId] = (acc[med.medicationId] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const totalMedications = Object.values(medicationCounts).reduce((sum, count) => sum + count, 0);

    const fixedColors = [
        "#FF6384", "#36A2EB", "#FFCE56",
        "#4BC0C0", "#9966FF", "#FF9F40"
    ];

    const data = Object.entries(medicationCounts).map(([medicationId, count], index) => ({
        name: medicationNames[medicationId] || `Medication ${index + 1}`, // Use actual name or fallback
        population: count,
        color: fixedColors[index % fixedColors.length], // Assign colors cyclically
        legendFontColor: "#333",
        legendFontSize: 15,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("assets/icon/logo.png")} style={styles.logo}/>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>This Month</Text>
                        <View style={styles.card}>
                            <Text style={styles.medicineName}>Medication Statistics</Text>
                            <Text style={styles.medicineName}>Acetaminophen</Text>
                            <View style={styles.chartContainer}>
                                <PieChart
                                    data={data}
                                    width={width * 0.8}
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

                        <View style={styles.card}>
                            <Text style={styles.medicineName}>Anadrol-50</Text>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FD",
        alignItems: "center",
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
    scrollContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    card: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    medicineName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 5,
        textAlign: "center",
    },
    chartContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 10,
    }
});

export default StatisticsPage;
