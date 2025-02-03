import { ExpoRoot } from "expo-router";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from './config/firebase-config';
import { User } from "firebase/auth"; // Import the User type




export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState('');
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user || null);
      });
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      if (user) {
        const fetchUserType = async () => {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              setUserType(userDoc.data().userType); 
            }
          } catch (error) {
            console.error("Error fetching user type:", error);
          }
        };
        fetchUserType();
      }
    }, [user]);
}
