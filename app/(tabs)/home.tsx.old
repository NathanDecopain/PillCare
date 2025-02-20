import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import {Redirect, router} from "expo-router";
import {useAuthContext} from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function Home() {
  const [dates, setDates] = useState<{ day: string; date: number; fullDate: string; selected?: boolean; isToday?: boolean }[]>([]);
  const [today, setToday] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const todayIndexRef = useRef(0);

  const {session} = useAuthContext();

  useEffect(() => {
    const currentDate = new Date();
    const formattedToday = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    setToday(formattedToday);
    setSelectedDate(formattedToday);
    const generateDates = () => {
      const generatedDates = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const fullDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const isToday = date.toDateString() === currentDate.toDateString();
        if (isToday) todayIndexRef.current = i;

        generatedDates.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: date.getDate(),
          fullDate,
          isToday,
        });
      }

      return generatedDates;
    };

    setDates(generateDates());
  }, []);

  const scrollToToday = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: todayIndexRef.current * 60,
        animated: true,
      });
      setSelectedDate(today);
    }
  };

  // Fonction pour sélectionner une date et l'afficher
  const selectDate = (dateString: string) => {
    setSelectedDate(dateString);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={scrollToToday}>
            <Text style={styles.headerText}>Today</Text>
          </TouchableOpacity>
          <Text style={styles.subText}>{selectedDate}</Text>
        </View>

        {/* Cercles avec jours à l'intérieur */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.dateScrollView}>
            {dates.map((item) => (
              <TouchableOpacity key={item.fullDate} onPress={() => selectDate(item.fullDate)}>
                <View style={styles.dateWrapper}>
                  <View style={[
                    styles.dateCircle,
                    item.isToday ? styles.todayCircle : item.fullDate === selectedDate && styles.selectedDateCircle
                  ]}>
                    <Text style={[
                      styles.dayText,
                      item.isToday ? styles.todayText : item.fullDate === selectedDate && styles.selectedDateText
                    ]}>
                      {item.day}
                    </Text>
                    <Text style={[
                      styles.dateText,
                      item.isToday ? styles.todayText : item.fullDate === selectedDate && styles.selectedDateText
                    ]}>
                      {item.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Contenu défilant */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.medicationContainer}>
          <Text style={styles.medicationName}>Acetaminophen</Text>
          <View style={styles.divider} />
          <Text style={styles.medicationTime}>Taken 9:12 pm</Text>
        </View>
      </ScrollView>

      {/* Bouton d'ajout */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addToHistory")}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: "#666",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  dateScrollView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 65,
  },
  dateWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  dateCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  todayCircle: {
    backgroundColor: "#7B83EB", 
  },
  selectedDateCircle: {
    backgroundColor: "#D3D3D3",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  todayText: {
    color: "#fff",
  },
  selectedDateText: {
    color: "#666",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  medicationContainer: {
    height: 100,
    backgroundColor: "#7B83EB",
    width: width * 0.9,
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