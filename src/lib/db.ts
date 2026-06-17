'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  orderBy,
  Firestore
} from 'firebase/firestore';
import { getFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { ClientRecord, Transaction, SystemSettings } from './types';

const SESSION_KEY = 'investment_pro_session';

const DEFAULT_SETTINGS: SystemSettings = {
  gstRate: 18,
  upiRate: 2,
  currencySymbol: '$',
  platformName: 'CoinTrack Pro'
};

let settingsCache: SystemSettings | null = null;

export async function fetchSettings(): Promise<SystemSettings> {
  const db = getFirestore();
  const docRef = doc(db, 'settings', 'global');
  
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      settingsCache = snap.data() as SystemSettings;
      return settingsCache;
    }
  } catch (e) {
    // Fail silently or handle
  }
  
  settingsCache = DEFAULT_SETTINGS;
  return DEFAULT_SETTINGS;
}

export function getSettings(): SystemSettings {
  return settingsCache || DEFAULT_SETTINGS;
}

export function saveSettings(settings: SystemSettings) {
  const db = getFirestore();
  const docRef = doc(db, 'settings', 'global');
  
  setDoc(docRef, settings, { merge: true })
    .catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: settings,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
    
  settingsCache = settings;
}

export async function getAllClients(): Promise<ClientRecord[]> {
  const db = getFirestore();
  const q = query(collection(db, 'investors'), orderBy('updatedAt', 'desc'));
  
  try {
    const snap = await getDocs(q);
    const clients: ClientRecord[] = [];
    for (const clientDoc of snap.docs) {
      const data = clientDoc.data();
      const txSnap = await getDocs(collection(db, 'investors', clientDoc.id, 'transactions'));
      const transactions = txSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Transaction[];
      
      clients.push({
        id: clientDoc.id,
        ...data,
        transactions
      } as ClientRecord);
    }
    return clients;
  } catch (e) {
    return [];
  }
}

export function createClient(client: Omit<ClientRecord, 'id' | 'profitLoss' | 'updatedAt' | 'transactions'>) {
  const db = getFirestore();
  const profitLoss = client.currentValue - client.investedAmount;
  const data = {
    ...client,
    profitLoss,
    updatedAt: new Date().toISOString()
  };

  addDoc(collection(db, 'investors'), data)
    .then(async (clientRef) => {
      const initialTransaction: Omit<Transaction, 'id'> = {
        type: 'deposit',
        amount: client.investedAmount,
        date: new Date().toISOString(),
      };
      await addDoc(collection(db, 'investors', clientRef.id, 'transactions'), initialTransaction);
    })
    .catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: 'investors',
        operation: 'create',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateClientData(id: string, updates: Partial<ClientRecord>) {
  const db = getFirestore();
  const docRef = doc(db, 'investors', id);
  
  // We calculate profitLoss if investedAmount or currentValue changed
  // In a real app, you'd fetch first, but here we optimistically update
  updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
  .catch(async () => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: updates,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function addClientTransaction(
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

      const newTransaction: Omit<Transaction, 'id'> = {
        type,
        amount,
        fees: fees ? { ...fees, total: totalFees } : undefined,
        netAmount,
        date: new Date().toISOString(),
      };
      
      const txRef = collection(db, 'investors', clientId, 'transactions');
      addDoc(txRef, newTransaction)
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

export function removeClient(id: string) {
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

export function resetSystemData() {
  const db = getFirestore();
  getDocs(collection(db, 'investors')).then(snap => {
    snap.docs.forEach(d => {
      deleteDoc(doc(db, 'investors', d.id));
    });
  });
  deleteDoc(doc(db, 'settings', 'global')).then(() => {
    window.location.reload();
  });
}

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
