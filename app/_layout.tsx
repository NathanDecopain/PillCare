import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const router = useRouter();

 
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.navItem}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("./register")}>
          <Text style={styles.navItem}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/Home")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/medications")}>
          <Text style={styles.navItem}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/stats")}>
          <Text style={styles.navItem}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/profile")}>
          <Text style={styles.navItem}>Profile</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    backgroundColor: "#CDD8F5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 75,
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
