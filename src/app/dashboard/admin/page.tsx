"use client"; // 👈 यह लाइन सबसे ऊपर होना अनिवार्य है

import React, { useState, useEffect } from 'react';

// 1. FIREBASE IMPORTS
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// 2. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js के लिए सुरक्षित रूप से Firebase इनिशियलाइज़ करना
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// 3. SUB-COMPONENTS
const AdminHeader = () => {
  return (
    <div className="w-full p-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide">Studio Admin Dashboard</h1>
      <div className="text-sm bg-green-600 px-3 py-1 rounded-full text-white font-medium">
        Live Status: Connected
      </div>
    </div>
  );
};

const DataRow = ({ item, index }: { item: any; index: number }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="p-3 text-sm text-gray-700">{index + 1}</td>
      <td className="p-3 text-sm text-gray-900 font-medium">{item.name || 'No Name'}</td>
      <td className="p-3 text-sm text-gray-600">{item.email || 'No Email'}</td>
      <td className="p-3 text-sm text-gray-600">{item.role || 'User'}</td>
    </tr>
  );
};


// 4. MAIN PAGE COMPONENT
export default function AdminPage() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase Firestore से डेटा लाने का लॉजिक
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setDataList(items);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 👈 यहाँ पहले कोष्ठक बंद होना छूट गया था, जिसे अब ठीक कर दिया गया है।

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* हेडर कॉम्पोनेंट */}
      <AdminHeader />

      {/* मुख्य कंटेंट एरिया */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back, Admin</h2>
          <p className="text-sm text-gray-500">यहाँ से आप अपने स्टूडियो प्रोजेक्ट का पूरा डेटा मैनेज कर सकते हैं।</p>
        </div>

        {/* डेटा टेबल कार्ड */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Registered Users / Studio Data</h3>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500 font-medium animate-pulse">
              Loading dashboard data...
            </div>
          ) : dataList.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              कोई डेटा नहीं मिला। कृपया Firebase Firestore चेक करें।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <th className="p-3 text-sm">S.No</th>
                    <th className="p-3 text-sm">Name</th>
                    <th className="p-3 text-sm">Email</th>
                    <th className="p-3 text-sm">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((item, index) => (
                    <DataRow key={item.id || index} item={item} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
