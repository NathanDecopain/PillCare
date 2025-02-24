import { Redirect } from 'expo-router';
import {useAuthContext} from "@/contexts/AuthContext";
import {Text} from "react-native";
export default function Index() {
    const { session, loading } = useAuthContext();

    // Redirect to the appropriate screen based on authentication state
    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (!session) {
        return <Redirect href="/login"/>;
    } else {
        return <Redirect href="/(tabs)/home"/>;
    }
}