'use client';

// Firebase configuration using environment variables
// इन वैल्यूज को आप Firebase Console -> Project Settings से बदल सकते हैं
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAs-Fake-Key-For-Setup",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cointrack-pro-dev"}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cointrack-pro-dev",
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cointrack-pro-dev"}.appspot.com`,
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
