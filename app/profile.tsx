import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, storage, auth } from "./config/firebase-config";
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail,} from "firebase/auth";




const { width } = Dimensions.get("window");

export default function ProfilePage() {
  const router = useRouter(); 

  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");



  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.email); // Firebase Auth user email
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setDateOfBirth(user.dateOfBirth);
        setPhoneNumber(user.phoneNumber);
        setUser(user.uid)
      }
    };
  
    fetchUser();
  }, []);


  const handleSaveChanges = async () => {
    if (user) {
      const docRef = doc(db, "Users", user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          address: address,
        });
      } else {
        await setDoc(docRef, {
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          address: address,
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

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Veuillez vous connecter pour accéder à votre profil.</h2>
      </div>
    );
  }




  return (
    <View style={styles.container}>
      {/* Header */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContainer}>
          <Image source={require("./icon/userPfp.jpg")} style={styles.profileImage} />
          <Text style={styles.name}>{firstName} {lastName}</Text>
          <Text style={styles.subtitle}>{userEmail}</Text>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{phoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>About Me:</Text>
            <Text style={styles.infoValue}>
              Je sais pas si cette section est necessaire, je vais la garder pour l'instant
            </Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/editProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
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
    height: 120,
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
  scrollContent: {
    paddingTop: 20, 
    paddingHorizontal: 20,
    paddingBottom: 30, 
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#CDD8F5",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  infoSection: {
    marginVertical: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  editButton: {
    backgroundColor: "#7B83EB",
    borderRadius: 30,
    width: width * 0.9,
    alignSelf: "center",
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});