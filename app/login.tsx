import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from "expo-router"; 
import { auth } from 'config/firebase-config';
import { db } from 'config/firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from "@/contexts/AuthContext";

export default function Login() {
  const { emailLogin } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const googleProvider = new GoogleAuthProvider();
  const router = useRouter(); 

  const handleEmailLogin = async () => {
    try {
      // Check if email and password are present
      if (!(email && password)) {
        setError("Veuillez remplir tous les champs.");
        return
      }

      const {isLoggedIn, error} = await emailLogin(email, password);

      if (!isLoggedIn) {
        setError(error || "Échec de la connexion. Vérifiez vos identifiants.");
        return;
      }

      setError("")
      setSuccess("Connexion réussie!");
      setTimeout(() => router.replace("/"), 1000); // Wait 1 second and redirect
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("assets/icon/logo.png")} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Log in</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
        />

        {/* Mot de passe */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {/* Bouton Connexion */}
        <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {/*Redirection vers l'inscription */}
        <TouchableOpacity onPress={() => router.push("/register")} style={styles.registerLink}>
          <Text style={styles.registerText}>
            Don't have an account ? <Text style={styles.registerTextBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    height: 110,
    backgroundColor: "#CDD8F5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,

},
logo: {
    width: 100,
    height: 100,
    paddingTop: 20,
    resizeMode: "contain",
},
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F5F5FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#7B83EB",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
  },
  registerTextBold: {
    color: "#7B83EB",
    fontWeight: "bold",
  },
});
