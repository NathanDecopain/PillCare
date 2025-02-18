import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import {useRouter} from "expo-router";

export default function Navbar() {
    const router = useRouter();

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.replace("/Home")}>
                <Image source={require("assets/icon/home.png")} style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/medications")}>
                <Image source={require("assets/icon/medication.png")} style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/stats")}>
                <Image source={require("assets/icon/stats.png")} style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/profile")}>
                <Image source={require("assets/icon/profile.png")} style={styles.icon}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
})