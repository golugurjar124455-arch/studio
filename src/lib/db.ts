import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyARRQc7tC-HbgTk9XIZMu4Q",
  authDomain: "studio-7862712596-ce1ac.firebaseapp.com",
  projectId: "studio-7862712596-ce1ac",
  storageBucket: "studio-7862712596-ce1ac.appspot.com",
  messagingSenderId: "45378465643",
  appId: "1:45378465643:web:544f7632173"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default db;
