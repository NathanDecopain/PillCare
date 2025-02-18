import { Redirect } from 'expo-router';
import {useAuthContext} from "@/contexts/AuthContext";

export default function Index() {
    const { user } = useAuthContext();

    // Redirect to the appropriate screen based on authentication state
    if (user) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/login" />;
    }
}