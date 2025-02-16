import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, ScrollView
} from "react-native";
import { db, storage, auth } from "./config/firebase-config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail,} from "firebase/auth";






const { width } = Dimensions.get("window");

export default function EditProfilePage() {
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");



  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      console.log("User data from AsyncStorage:", userData); // Log the raw data
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Parsed user object:", user); // Log the parsed object
        setUserEmail(user.email);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setDateOfBirth(user.dateOfBirth);
        setPhoneNumber(user.phoneNumber);
        setUser(user.userID); // Ensure this is being set
      }
    };
  
    fetchUser();
  }, []);


  const handleSaveChanges = async () => {
    if (user) {
      const docRef = doc(db, "users", user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        });
      } else {
        await setDoc(docRef, {
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        });
      }

      alert("Profil mis à jour avec succès !");
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(userEmail, currentPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert("Mot de passe mis à jour avec succès !");
        setCurrentPassword("");
        setNewPassword("");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe : ", error);
        alert("Échec de la mise à jour du mot de passe. Veuillez vérifier votre mot de passe actuel.");
      }
    }
  };

  const handleSendPasswordReset = async () => {
    const user = auth.currentUser;
    if (user) {
      await sendPasswordResetEmail(auth, userEmail);
      alert("Un lien pour changer le mot de passe a été envoyé à votre email.");
    }
  };

  const isEmailProvider = () => {
    if (!auth.currentUser) return false;
    const providerData = auth.currentUser.providerData;
    return providerData.some((provider) => provider.providerId === "password");
  };





  return (
    <View style={styles.pageContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("./icon/logo.png")} style={styles.logo} />
      </View>

      {/* Contenu principal dans un ScrollView */}
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 80 }]}>

        {/* Photo de profil */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={require("./icon/userPfp.jpg")}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Text style={styles.editIconText}>✎</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire */}
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.label}>{user}</Text>
        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Birth date</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
        </View>

        {/* Bouton Sauvegarder */}
        <TouchableOpacity style={styles.saveButton} 
        onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
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
  container: {
    padding: 20,
    alignItems: "center",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative", // Permet de positionner l’icône par rapport à ce conteneur
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#CDD8F5",
  },
  editIcon: {
    position: "absolute",
    bottom: 5, // Ajusté pour bien coller au bas
    right: 5,  // Ajusté pour bien coller à droite
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  editIconText: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F5F5FF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#7B83EB",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
