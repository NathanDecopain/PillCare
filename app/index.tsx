import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './config/firebase-config';
import { useNavigation } from '@react-navigation/native';
import { db } from './config/firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const googleProvider = new GoogleAuthProvider();
  const navigation = useNavigation(); // Get the navigation prop

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Votre adresse courriel n'a pas été vérifiée. Veuillez vérifier vos emails.");
        return;
      }
      setSuccess("Login success!")
      AsyncStorage.setItem("user", JSON.stringify(user));
      console.log(user);
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.emailVerified) {
        setError("Votre adresse courriel n'a pas été vérifiée. Veuillez vérifier vos emails.");
        return;
      }
  
      // Check if the user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (!userSnapshot.exists()) {
        // Create a new profile for the user
        await setDoc(userRef, {
          email: user.email,
          userType: 'User',
          createdAt: new Date(),
        });
      }
  
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setError('Une erreur est survenue lors de la connexion avec Google.');
    }
  };



  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
       {error ? <Text>{error}</Text> : null}
      {success ? <Text>{success}</Text> : null}
      <Button
        title="Login"
        onPress={handleEmailLogin}
      />

        <Button onPress={handleGoogleSignIn}
          title='Connexion avec Google'
        />


   

    </View>
  );
}
