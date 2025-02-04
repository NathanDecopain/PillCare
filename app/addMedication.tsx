import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, getDocs, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./config/firebase-config";
import { auth } from './config/firebase-config';
import { User } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";




export default function addMedication() {
    const [userEmail, setUserEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [medications, setMedications] = useState<{ id: string; quantity: number; name: string; }[]>([]);
  const [user, setUser] = useState(null);

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
        fetchmedications();
      }, []);
      

    const fetchmedications = async () =>{
        try{
            const querySnapshot = await getDocs(collection(db, "medications"));
            const medicationsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Firestore document:", data); // Log the entire doc data
                return {
                    id: doc.id,
                    quantity: 0,
                    name: data.name || '', // Safeguard in case `name` is not available
                    ...data, // Ensure other data fields are properly included
                };
            });

            setMedications(medicationsList);
        } catch (error){
            console.error("error fetching object: ", error)
        }
    };


    const ajoutMedication = async () =>{
        if (!user) {
            console.error("No user is logged in!");
            return;
        }
        
        try{
            const selectedmedications = medications.filter((item) => item.quantity > 0 );

            // Add a new document with a generated id.
            
            const docRef = await addDoc(collection(db, "usersMedication"), {
                items: selectedmedications.map(({id,name,quantity})=>({
                    userId : user,
                    id,
                    name,
                    quantity
                })),
                borrowedAt: new Date()
        });
        console.log("Medication added with ID:", docRef.id);
    } catch (error) {
        console.error("Error adding medication:", error);
    }
};


return (
    <View >
      <Text >Available Medications</Text>
      <Text>{userEmail}</Text>
      <Text>{user}</Text>
  
      {medications.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text >{item.name}</Text>
              <TextInput
                keyboardType="numeric"
                value={String(item.quantity)}
                onChangeText={(text) => {
                  const updatedMedications = medications.map((med) =>
                    med.id === item.id ? { ...med, quantity: Number(text) } : med
                  );
                  setMedications(updatedMedications);
                }}

              />
            </View>
          )}
        />
      )}
  
      <TouchableOpacity onPress={ajoutMedication}>
        <Text >Add Medication</Text>
      </TouchableOpacity>
    </View>
  );
}


  