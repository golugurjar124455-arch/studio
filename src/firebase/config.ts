'use client';

// Firebase configuration using environment variables
// Ensure these are set in your deployment environment (e.g., Firebase App Hosting)
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAs-Fake-Key-For-Development",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cointrack-pro-dev",
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
