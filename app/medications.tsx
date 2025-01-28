import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const medications = [
  { name: "Acetaminophen", frequency: "everyday" },
  { name: "Anadrol-50", frequency: "once a week" },
];

const doctors = [
  { name: "Dr. Smith", specialty: "Cardiologist" },
  { name: "Dr. Johnson", specialty: "Dermatologist" },
];

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<"Medications" | "Doctors">("Medications");

  const renderContent = () => {
    const data = activeTab === "Medications" ? medications : doctors;

    return data.map((item, index) => (
      <View style={styles.card} key={index}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            {"frequency" in item ? item.frequency : item.specialty}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon} />
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("./logo.png")} style={styles.logo} />
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

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>{renderContent()}</ScrollView>

      <TouchableOpacity style={styles.addButton}>
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
    width: width * 0.90,
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
    bottom: 80,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});
