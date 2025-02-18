import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const data = [
    { name: "Taken", population: 27, color: "#CDD8F5", legendFontColor: "#333", legendFontSize: 15 },
    { name: "Not taken", population: 3, color: "#7B83EB", legendFontColor: "#333", legendFontSize: 15 },
];

const StatisticsPage = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                setUserEmail(user.email);
            }
        };

        fetchUser();
    }, []);

    return (
    <View style={styles.container}>
        
    <View style={styles.header}>
        <Image source={require("assets/icon/logo.png")} style={styles.logo} />
    </View>
    <ScrollView style={styles.container}>

                <View style={styles.card}>
                    
                    <Text style={styles.medicineName}>Acetaminophen</Text>
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
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 5,
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
    medicineName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#555",
        marginBottom: 5,
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
