'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc
} from 'firebase/firestore';
import { getFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { ClientRecord, SystemSettings } from './types';

const SESSION_KEY = 'investment_pro_session';

export const DEFAULT_SETTINGS: SystemSettings = {
  gstRate: 18,
  upiRate: 2,
  currencySymbol: '₹',
  platformName: 'CoinTrack Pro'
};

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

export function addClient(client: Omit<ClientRecord, 'id' | 'profitLoss' | 'updatedAt'>) {
  const db = getFirestore();
  const profitLoss = client.currentValue - client.investedAmount;
  const data = {
    ...client,
    profitLoss,
    updatedAt: new Date().toISOString()
  };

  addDoc(collection(db, 'investors'), data)
    .catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'investors',
        operation: 'create',
        requestResourceData: data,
      }));
    });
}

export function addTransaction(
  clientId: string, 
  currentInvested: number,
  currentValue: number,
  type: 'deposit' | 'withdrawal', 
  amount: number,
  fees?: { gst: number, upi: number }
) {
  const db = getFirestore();
  const clientRef = doc(db, 'investors', clientId);
  
  const totalFees = fees ? fees.gst + fees.upi : 0;
  const netAmount = type === 'withdrawal' ? amount - totalFees : amount;

  const newTransaction = {
    type,
    amount,
    fees: fees ? { ...fees, total: totalFees } : null,
    netAmount,
    date: new Date().toISOString(),
  };
  
  addDoc(collection(db, 'investors', clientId, 'transactions'), newTransaction);
  
  let newInvested = currentInvested;
  let newCurrentValue = currentValue;

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

export function updateClient(id: string, data: Partial<ClientRecord>) {
  const db = getFirestore();
  const docRef = doc(db, 'investors', id);
  updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export function deleteClient(id: string) {
  const db = getFirestore();
  deleteDoc(doc(db, 'investors', id));
}

export function setSession(username: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, isLoggedIn: true }));
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
