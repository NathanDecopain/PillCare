import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7pBVOvje0bYZrOQKSarsV8MkVxDpuq3I",
  authDomain: "examen-mi-session-9d623.firebaseapp.com",
  projectId: "examen-mi-session-9d623",
  storageBucket: "examen-mi-session-9d623.appspot.com",
  messagingSenderId: "263737313753",
  appId: "1:263737313753:web:9f3a6c58b140f866b4f1c8",
  measurementId: "G-HLHVJ8X483"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

const storage = getStorage(app);

// Authentication
const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) }); // Initialize auth with the app

export { db, auth, storage };

export default app;