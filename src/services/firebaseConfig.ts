import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore - Required for React Native persistence with Firebase JS SDK
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD9pO__kW5-DkEAATI4MeeEeS0NIMKFngI",
  authDomain: "taskmasterapp-ed88d.firebaseapp.com",
  projectId: "taskmasterapp-ed88d",
  storageBucket: "taskmasterapp-ed88d.firebasestorage.app",
  messagingSenderId: "1083635518285",
  appId: "1:1083635518285:web:1f3e6a0eb7959abe9b0504",
  measurementId: "G-SHJSFXTSE9"
};

// Initialize Firebase App (prevents re-initializing if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistent storage on mobile
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
