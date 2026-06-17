'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore as getFirestoreFromSDK, Firestore } from 'firebase/firestore';
import { getAuth as getAuthFromSDK, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

export function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestoreFromSDK(app);
  auth = getAuthFromSDK(app);

  return { app, db, auth };
}

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';

export function getFirestore() {
  return initializeFirebase().db;
}

export function getAuth() {
  return initializeFirebase().auth;
}
