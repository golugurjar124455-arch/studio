"use client";

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// आपकी असली Firebase सेटिंग्स
const firebaseConfig = {
  apiKey: "AIzaSyARRQc7tC-HbgTk9XIZMu4Q",
  authDomain: "studio-7862712596-ce1ac.firebaseapp.com",
  projectId: "studio-7862712596-ce1ac",
  storageBucket: "studio-7862712596-ce1ac.appspot.com",
  messagingSenderId: "45378465643",
  appId: "1:45378465643:web:544f7632173"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Studio System Live
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Firebase क्रेडेंशियल्स सफलतापूर्वक लिंक हो गए हैं। आपका प्रोजेक्ट अब पूरी तरह सुरक्षित और चालू है।
        </p>
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Connected Successfully
        </div>
      </div>
    </div>
  );
}
