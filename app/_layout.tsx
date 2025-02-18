import {AuthContextProvider} from "@/contexts/AuthContext";
import {Slot} from "expo-router";

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <Slot />
        </AuthContextProvider>
    );
}