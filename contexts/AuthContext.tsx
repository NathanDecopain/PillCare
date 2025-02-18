import React, {createContext, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {auth, db} from "config/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {doc, getDoc, setDoc} from "firebase/firestore";

type AuthContext = {
    session: AppUser | null,
    loading: boolean,
    emailLogin: (email: string, password: string) => Promise<{ isLoggedIn: boolean, error: string | null }>,
    emailRegister: (email: string, password: string) => Promise<{ isRegistered: boolean, error: string | null }>
    logout: () => void
}

// Context is null if not encapsulated in Provider
const AuthContext = createContext<AuthContext | null>(null);

// Provider object. Determines what data is passed down to children components
// on AuthContext consumption.
export const AuthContextProvider = ({children}: {
    children: React.ReactNode
}) => {
    const [session, setSession] = useState<AppUser | null>(null); // User can be null if user is logged out
    const [loading, setLoading] = useState(true); // Access to check if user data has been fetched.

    // ON MOUNT / ON PROVIDER CONSUMPTION:
    useEffect(() => {
        // On provider consumption, start listening for auth state changes on the server.
        const unsubscribe = onAuthStateChanged(auth, async (userCred) => {
            if (!userCred) { // If user isn't logged in, remove user data from client async storage
                await AsyncStorage.removeItem("user");
                console.log("User disconnected.")
            } else {
                const sessionDataString = await AsyncStorage.getItem("user");
                if (sessionDataString) {
                    setSession(JSON.parse(sessionDataString));
                    console.log(`Logged in as ${JSON.stringify(session)}`)
                }
            }
            setLoading(false);
        });

        return () => unsubscribe(); // unsubscribe function allows to stop listening for user auth state changes in the server
    }, []);

    const emailLogin = async (email: string, password: string): Promise<{
        isLoggedIn: boolean,
        error: string | null
    }> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential) {
            return {isLoggedIn: false, error: "Échec de la connexion. Vérifiez vos identifiants."}
        }

        if (!userCredential.user.emailVerified) {
            return {
                isLoggedIn: false,
                error: "Votre adresse courriel n'a pas été vérifiée. Veuillez vérifier votre courriel."
            };
        }

        // If user logs in, store user data persistently in client async storage
        // Fetch additional user details from Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userSnapshot = await getDoc(userRef);

        // If user exists but has no entry in database, delete user account and tell user to register again.
        if (!userSnapshot.exists()) {
            console.error("La création du compte a échoué. Inscrivez-vous à nouveau.");
            await auth.currentUser?.delete();
            await logout();
            return {isLoggedIn: false, error: ""}
        }
        const userData = userSnapshot.data();

        // Store user details persistently with async storage
        const userDetails: AppUser = {
            email: userCredential.user.email,
            emailVerified: userCredential.user.emailVerified,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.phoneNumber,
            userID: userCredential.user.uid
        };

        await AsyncStorage.setItem("user", JSON.stringify(userDetails), () => {
            console.log("Stored user data in AsyncStorage.")
        })

        const sessionDataString = await AsyncStorage.getItem("user");

        setSession(JSON.parse(sessionDataString!));

        return {isLoggedIn: true, error: null};
    }

    const emailRegister = async (email: string, password: string): Promise<{
        isRegistered: boolean,
        error: string | null
    }> => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Check if user creation was successful
        if (!userCredential) return { isRegistered: false, error: "Erreur lors de l'inscription."}

        // Send email verification
        await sendEmailVerification(userCredential.user);

        // Store user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            userType: 'Patient',
            createdAt: new Date(),
        }).catch((e) => {
            // On database insertion error, delete user
            userCredential.user.delete();
            return { isRegistered: false, error: "Échec lors de la création du compte. Essayez avec un autre courriel."}
        });

        return { isRegistered: true, error: null}
    }

    const logout = async () => {
        try {
            await signOut(auth);
            await AsyncStorage.removeItem("user");
            setSession(null);
        } catch (error) {
            console.error(`Logout error: ${error}`)
        }
    }

    return (
        <AuthContext.Provider value={{session, loading, emailLogin, emailRegister, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within a AuthContextProvider")
    }

    return context
}