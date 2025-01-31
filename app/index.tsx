import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from './config/firebase-config';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const navigation = useNavigation(); // Get the navigation prop

  const handleEmailLogin = async () => {
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      setSuccess("Login success!")
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
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


   

    </View>
  );
}
