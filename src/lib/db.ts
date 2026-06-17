'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  Firestore
} from 'firebase/firestore';
import { getFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { ClientRecord, Transaction, SystemSettings } from './types';

const SESSION_KEY = 'investment_pro_session';

export const DEFAULT_SETTINGS: SystemSettings = {
  gstRate: 18,
  upiRate: 2,
  currencySymbol: '$',
  platformName: 'CoinTrack Pro'
};

// Save settings to Firestore
export function saveSettings(settings: SystemSettings) {
  const db = getFirestore();
  const docRef = doc(db, 'settings', 'global');
  
  setDoc(docRef, settings, { merge: true })
    .catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: settings,
      }));
    });
}

// Create a new client in Firestore
export function addClient(client: Omit<ClientRecord, 'id' | 'profitLoss' | 'updatedAt' | 'transactions'>) {
  const db = getFirestore();
  const profitLoss = client.currentValue - client.investedAmount;
  const data = {
    ...client,
    profitLoss,
    updatedAt: new Date().toISOString()
  };

  addDoc(collection(db, 'investors'), data)
    .then(async (clientRef) => {
      const initialTransaction = {
        type: 'deposit',
        amount: client.investedAmount,
        date: new Date().toISOString(),
      };
      addDoc(collection(db, 'investors', clientRef.id, 'transactions'), initialTransaction);
    })
    .catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'investors',
        operation: 'create',
        requestResourceData: data,
      }));
    });
}

// Update client data in Firestore
export function updateClient(id: string, updates: Partial<ClientRecord>) {
  const db = getFirestore();
  const docRef = doc(db, 'investors', id);
  
  updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
  .catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: updates,
    }));
  });
}

// Add a transaction for a client
export function addTransaction(
  clientId: string, 
  type: 'deposit' | 'withdrawal', 
  amount: number,
  fees?: { gst: number, upi: number }
) {
  const db = getFirestore();
  const clientRef = doc(db, 'investors', clientId);
  
  getDoc(clientRef).then(snap => {
    if (snap.exists()) {
      const c = snap.data();
      const totalFees = fees ? fees.gst + fees.upi : 0;
      const netAmount = type === 'withdrawal' ? amount - totalFees : amount;

      const newTransaction = {
        type,
        amount,
        fees: fees ? { ...fees, total: totalFees } : undefined,
        netAmount,
        date: new Date().toISOString(),
      };
      
      addDoc(collection(db, 'investors', clientId, 'transactions'), newTransaction)
        .catch(async () => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
             path: `investors/${clientId}/transactions`,
             operation: 'create',
             requestResourceData: newTransaction
           }));
        });
      
      let newInvested = c.investedAmount;
      let newCurrentValue = c.currentValue;

      if (type === 'deposit') {
        newInvested += amount;
        newCurrentValue += amount;
      } else {
        newCurrentValue -= amount;
      }

      updateDoc(clientRef, {
        investedAmount: newInvested,
        currentValue: newCurrentValue,
        profitLoss: newCurrentValue - newInvested,
        updatedAt: new Date().toISOString(),
      });
    }
  });
}

// Remove a client
export function deleteClient(id: string) {
  const db = getFirestore();
  const docRef = doc(db, 'investors', id);
  deleteDoc(docRef)
    .catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
}

// Reset system
export async function resetSystem() {
  const db = getFirestore();
  // This is a simplified reset for a demo app
  deleteDoc(doc(db, 'settings', 'global')).then(() => {
    window.location.reload();
  });
}

// Session Helpers
export function getSession() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setSession(username: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, isLoggedIn: true }));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
