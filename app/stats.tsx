import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
        <Image source={require("./logo.png")} style={styles.logo} />
    </View>
    <ScrollView style={styles.container}>

      <Text style={styles.headerTitle}>This month</Text>

      <Text style={styles.medicineName}>Acetaminophen</Text>
      <PieChart
        data={data}
        width={width}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.medicineName}>Anadrol-50</Text>
      <PieChart
        data={data}
        width={width}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
    </View>
    );
};

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
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#666",
        paddingBottom: 30,
        paddingTop: 20,
        textAlign: "center", 
        alignSelf: "center", 
        width: "100%", 
    },
    legend: {
        flexDirection: "row",
        marginTop: 10,
    },
    legendItem: {
        marginHorizontal: 10,
        fontSize: 14,
        color: "#666",
    },
    medicineName: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 20,
        marginVertical: 10,
        color: "#666",
    },
});

export default StatisticsPage;
