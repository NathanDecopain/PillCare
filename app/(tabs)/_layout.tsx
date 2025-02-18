import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Redirect, Stack, Tabs} from 'expo-router';
import {AuthContextProvider, useAuthContext} from "@/contexts/AuthContext";
import React from "react";
import {Text} from "react-native";

export default function TabLayout() {
    const {session, loading} = useAuthContext();

    if (!session) {
        return <Redirect href="/login"/>;
    }

    return (
        <Tabs screenOptions={{headerShown: false, tabBarActiveTintColor: 'blue'}}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="medications"
                options={{
                    title: 'Medications',
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="circle" color={color}/>,
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
