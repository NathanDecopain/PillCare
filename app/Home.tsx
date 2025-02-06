import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView } from "react-native";
import {router} from "expo-router";

const { width } = Dimensions.get("window"); 

const dates = [
  { day: "Tue", date: 22 },
  { day: "Wed", date: 23 },
  { day: "Thu", date: 24, selected: true },
  { day: "Fri", date: 25 },
  { day: "Sat", date: 26 },
  { day: "Sun", date: 27 },
  { day: "Mon", date: 28 },
];

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Today</Text>
          <Text style={styles.subText}>January 24</Text>
        </View>

        <FlatList
          data={dates}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false} 
          bounces={false} 
          contentContainerStyle={styles.dateList}
          keyExtractor={(item) => item.date.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.dateCircle,
                item.selected && styles.selectedDateCircle, 
              ]}
            >
              <Text style={[styles.dateText, item.selected && styles.selectedDateText]}>
                {item.date}
              </Text>
              <Text style={[styles.dayText, item.selected && styles.selectedDayText]}>
                {item.day}
              </Text>
            </View>
          )}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.medicationContainer}>
            <Text style={styles.medicationName}>Acetaminophen</Text>
            <View style={styles.divider} />
            <Text style={styles.medicationTime}>Taken 9:12pm</Text>
          </View>

      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText} onPress={() => router.push("/history/addHistoryEntryForm")}>+</Text>
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
    width: width * 1.2, 
    height: width / 1.7,
    backgroundColor: "#CDD8F5",
    borderBottomLeftRadius: width / 2,
    borderBottomRightRadius: width / 2,
    justifyContent: "flex-start",
    paddingTop: 50,
    transform: [{ translateX: -(width * 0.1) }],
    overflow: "hidden", 
  },
  textContainer: {
    paddingLeft: 55,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    marginBottom: 10,
  },
  dateList: {
    justifyContent: "center", 
    alignItems: "center", 
    marginLeft: width * 0.1, 
    marginTop: -15, 
    paddingRight: width * 0.1, 
  },
  dateCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedDateCircle: {
    backgroundColor: "#7B83EB",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDateText: {
    color: "#fff",
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  selectedDayText: {
    color: "#fff",
  },
  scrollViewContent: {
    paddingBottom: 80, 
  },
  medicationContainer: {
    height: 100,
    backgroundColor: "#7B83EB",
    width: width * 0.90,
    alignSelf: "center",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  medicationName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  medicationTime: {
    color: "#fff",
    fontSize: 16,
  },
  divider: {
    height: "80%",
    width: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10,
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
    fontSize: 38,
  },
});
