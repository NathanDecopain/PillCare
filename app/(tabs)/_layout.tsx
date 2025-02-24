import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Redirect, Stack, Tabs} from 'expo-router';
import {AuthContextProvider, useAuthContext} from "@/contexts/AuthContext";
import React from "react";
import {Image, StyleSheet, Text} from "react-native";
import {usePushNotifications} from "@/hooks/usePushNotifications";

export default function TabLayout() {
    const {session, loading} = useAuthContext();

    if (!session) {
        return <Redirect href="/login"/>;
    }

    const {expoPushToken, notification} = usePushNotifications();

    console.log("expoPushToken", expoPushToken);

    return (
        <Tabs screenOptions={{
            headerShown: false, tabBarActiveTintColor: 'white',
            tabBarStyle: styles.navbar
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>
                }}
            />
            <Tabs.Screen
                name="medications"
                options={{
                    title: 'Medications',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="medkit" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="pie-chart" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="user" color={color}/>,
                }}
            />
        </Tabs>
    );
}


const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#CDD8F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    tabBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
})