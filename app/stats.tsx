import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const data = [
    { name: "Taken", population: 27, color: "#CDD8F5", legendFontColor: "#333", legendFontSize: 15 },
    { name: "Not taken", population: 3, color: "#7B83EB", legendFontColor: "#333", legendFontSize: 15 },
];

const StatisticsPage = () => {
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
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        paddingBottom: 30,
        paddingTop: 20,
    },
    legend: {
        flexDirection: "row",
        marginTop: 10,
    },
    legendItem: {
        marginHorizontal: 10,
        fontSize: 14,
        color: "#333",
    },
    medicineName: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 20,
        marginVertical: 10,
        color: "#333",
    },
});

export default StatisticsPage;
