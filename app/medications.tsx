import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "./config/firebase-config";
import { collection, addDoc, onSnapshot, getDocs, setDoc, doc } from "firebase/firestore";


const { width } = Dimensions.get("window");

const medications = [
  { name: "Acetaminophen", frequency: "Everyday", dosage: "500mg", time: "08:00 AM", duration: "30 days", notes: "Take with water" },
  { name: "Anadrol-50", frequency: "Once a week", dosage: "50mg", time: "10:00 PM", duration: "60 days", notes: "Take before bed" },
];

const doctors = [
  { name: "Dr. Smith", specialty: "Cardiologist", email: "dr.smith@example.com", phone: "+1 514-999-1234" },
  { name: "Dr. Johnson", specialty: "Dermatologist", email: "dr.johnson@example.com", phone: "+1 514-888-5678" },
];

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<"Medications" | "Doctors">("Medications");
  const [currentUser, setCurrentUser] = useState();
  const [medicationList, setMedicationList] = useState([]);
  const router = useRouter();


  
  

  const handleItemPress = (item: any) => {
    if (activeTab === "Medications") {
      router.push({
        pathname: "/medications/details",
        params: {
          name: item.name,
          frequency: item.frequency,
          dosage: item.dosage,
          time: item.time,
          duration: item.duration,
          notes: item.notes,
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
  

  const renderContent = () => {
    const data = activeTab === "Medications" ? medications : doctors;

    return data.map((item, index) => (
      <TouchableOpacity key={index} style={styles.card} onPress={() => handleItemPress(item)}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            {"frequency" in item ? item.frequency : item.specialty}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon} />
      </TouchableOpacity>
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
    fontSize: 37,
  },
});
