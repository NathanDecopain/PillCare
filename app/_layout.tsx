import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase-config";

export default function Layout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        router.replace("/"); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return null; // Empêche l'affichage tant que l'état de connexion n'est pas déterminé

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Ensure the Stack is properly placed to handle page navigation */}
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
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
