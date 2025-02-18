import { Redirect } from 'expo-router';
import {useAuthContext} from "@/contexts/AuthContext";

export default function Index() {
    const { session } = useAuthContext();

    // Redirect to the appropriate screen based on authentication state
    if (session) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/login" />;
    }
}