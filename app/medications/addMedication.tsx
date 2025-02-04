import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AddMedication() {
  const router = useRouter();
  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    frequency: "Everyday",
    time: "08:00 AM",
    duration: "",
    notes: "",
  });

  const handleChange = (key: keyof typeof medication, value: string) => {
    setMedication((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!medication.name || !medication.dosage || !medication.time) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Medication added successfully!");
    router.replace("/medications");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../logo.png")} style={styles.logo} />
      </View>

      {/* Formulaire */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.label}>Medication Name</Text>
        <TextInput style={styles.input} placeholder="Enter medication name" value={medication.name} onChangeText={(text) => handleChange("name", text)}/>

        <Text style={styles.label}>Dosage</Text>
        <TextInput style={styles.input} placeholder="Enter dosage (e.g., 500mg)" value={medication.dosage} onChangeText={(text) => handleChange("dosage", text)}/>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={medication.frequency} onValueChange={(value) => handleChange("frequency", value)} style={styles.picker}>
            <Picker.Item label="Everyday" value="Everyday" />
            <Picker.Item label="Once a week" value="Once a week" />
            <Picker.Item label="Twice a day" value="Twice a day" />
            <Picker.Item label="Every 8 hours" value="Every 8 hours" />
          </Picker>
        </View>

        <Text style={styles.label}>Time</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={medication.time} onValueChange={(value) => handleChange("time", value)} style={styles.picker}>
            <Picker.Item label="08:00 AM" value="08:00 AM" />
            <Picker.Item label="12:00 PM" value="12:00 PM" />
            <Picker.Item label="06:00 PM" value="06:00 PM" />
            <Picker.Item label="10:00 PM" value="10:00 PM" />
          </Picker>
        </View>

        <Text style={styles.label}>Duration</Text>
        <TextInput style={styles.input} placeholder="Enter duration (e.g., 30 days)" value={medication.duration} onChangeText={(text) => handleChange("duration", text)}/>

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput style={[styles.input, styles.notesInput]} placeholder="Enter any additional notes" multiline value={medication.notes} onChangeText={(text) => handleChange("notes", text)}/>

        {/* Buttons */}
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace("/medications")}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#F5F5FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  notesInput: {
    height: 60,
  },
  pickerWrapper: {
    backgroundColor: "#F5F5FF",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50, 
    justifyContent: "center",
  },
  picker: {
    width: "100%",
  },
  addButton: {
    backgroundColor: "#7B83EB",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#E57373",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10, 
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
