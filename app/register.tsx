import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { db } from './config/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase-config';

export default function Register() {
  // Declaring state with useState
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (email === '' || password === '') {
      setError('Tous les champs sont obligatoires.');
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Store user data in Firestore
      await setDoc(doc(db, 'Utilisateurs', userCredential.user.uid), {
        email: userCredential.user.email,
        password: password,
        userType: 'Patient', 
        createdAt: new Date(),
      });
  
      setSuccess('Inscription réussie !');
      setError('');
    } catch (err: any) {
      // Log and display detailed error
      console.error("Registration error:", err);
      setError(err.message || 'Erreur lors de l’inscription. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Enter your email" 
        style={styles.input} 
      /> 
      <TextInput 
        value={password} 
        onChangeText={setPassword} 
        placeholder="Enter your password" 
        style={styles.input} 
        secureTextEntry={false} //true pour encrypter le mot de passe
      />
      <TextInput 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        placeholder="Confirm your password" 
        style={styles.input} 
        secureTextEntry={false} //true pour encrypter le mot de passe
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <Button
        title="Create Account"
        onPress={handleRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
});
