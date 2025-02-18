import {AuthContextProvider} from "@/contexts/AuthContext";
import {Slot} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <GestureHandlerRootView>
                <Slot />
            </GestureHandlerRootView>
        </AuthContextProvider>
    );
}