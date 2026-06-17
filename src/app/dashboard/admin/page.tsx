"use client"; // 👈 यह सबसे पहली लाइन होनी चाहिए

import React, { useState, useEffect } from 'react';

// 1. FIREBASE IMPORTS
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// 2. REAL FIREBASE CONFIGURATION (आपकी असली डिटेल्स सेट कर दी गई हैं)
const firebaseConfig = {
  apiKey: "AIzaSyARRQc7tC-HbgTk9XIZMu4Q",
  authDomain: "studio-7862712596-ce1ac.firebaseapp.com",
  projectId: "studio-7862712596-ce1ac",
  storageBucket: "studio-7862712596-ce1ac.appspot.com",
  messagingSenderId: "45378465643",
  appId: "1:45378465643:web:544f7632173"
};

// Next.js में डुप्लिकेट ऐप एरर से बचने के लिए सेफ इनिशियलाइजेशन
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// 3. SUB-COMPONENTS (छोटे हिस्से)
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


// 4. MAIN PAGE COMPONENT (मुख्य एडमिन पेज)
export default function AdminPage() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore से डेटा लोड करने का लॉजिक
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
  }, []); // 👈 सही सिंटैक्स ब्रैकेट ब्रैकेट यहाँ बंद है

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* हेडर */}
      <AdminHeader />

      {/* मुख्य डैशबोर्ड एरिया */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back, Admin</h2>
          <p className="text-sm text-gray-500">यहाँ से आप अपने स्टूडियो प्रोजेक्ट का पूरा डेटा मैनेज कर सकते हैं।</p>
        </div>

        {/* डेटा टेबल */}
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
