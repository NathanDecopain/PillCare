import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/medications")}>
          <Text style={styles.navItem}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text style={styles.navItem}>Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#CDD8F5", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    height: 60, 
    position: "absolute", 
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 25,
  },
  navItem: {
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
});
