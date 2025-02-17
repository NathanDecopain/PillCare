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
        router.replace("/authentication/login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {isAuthenticated && (
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.replace("/Home")}>
            <Image source={require("./icon/home.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/medications")}>
            <Image source={require("./icon/medication.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/stats")}>
            <Image source={require("./icon/stats.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/profile")}>
            <Image source={require("./icon/profile.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}
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
