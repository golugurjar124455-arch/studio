import { ClientRecord, Transaction, SystemSettings } from './types';

const CLIENTS_KEY = 'investment_pro_clients';
const SESSION_KEY = 'investment_pro_session';
const SETTINGS_KEY = 'investment_pro_settings';

const DEFAULT_SETTINGS: SystemSettings = {
  gstRate: 18,
  upiRate: 2,
  currencySymbol: '$',
  platformName: 'CoinTrack Pro'
};

export function getSettings(): SystemSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: SystemSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getClients(): ClientRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CLIENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveClients(clients: ClientRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function addClient(client: Omit<ClientRecord, 'id' | 'profitLoss' | 'updatedAt' | 'transactions'>) {
  const clients = getClients();
  const profitLoss = client.currentValue - client.investedAmount;
  
  const initialTransaction: Transaction = {
    id: crypto.randomUUID(),
    type: 'deposit',
    amount: client.investedAmount,
    date: new Date().toISOString(),
  };

  const newClient: ClientRecord = {
    ...client,
    id: crypto.randomUUID(),
    profitLoss,
    transactions: [initialTransaction],
    updatedAt: new Date().toISOString(),
  };
  saveClients([...clients, newClient]);
  return newClient;
}

export function updateClient(id: string, updates: Partial<ClientRecord>) {
  const clients = getClients();
  const updatedClients = clients.map(c => {
    if (c.id === id) {
      const merged = { ...c, ...updates, updatedAt: new Date().toISOString() };
      merged.profitLoss = (merged.currentValue || 0) - (merged.investedAmount || 0);
      return merged as ClientRecord;
    }
    return c;
  });
  saveClients(updatedClients);
}

export function addTransaction(
  clientId: string, 
  type: 'deposit' | 'withdrawal', 
  amount: number,
  fees?: { gst: number, upi: number }
) {
  const clients = getClients();
  const updatedClients = clients.map(c => {
    if (c.id === clientId) {
      const totalFees = fees ? fees.gst + fees.upi : 0;
      const netAmount = type === 'withdrawal' ? amount - totalFees : amount;

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type,
        amount,
        fees: fees ? { ...fees, total: totalFees } : undefined,
        netAmount,
        date: new Date().toISOString(),
      };
      
      const newTransactions = [...c.transactions, newTransaction];
      
      // Withdrawals reduce current value, Deposits increase invested amount
      let newInvested = c.investedAmount;
      let newCurrentValue = c.currentValue;

      if (type === 'deposit') {
        newInvested += amount;
        newCurrentValue += amount; // Assuming deposit increases value immediately
      } else {
        newCurrentValue -= amount; // Withdrawal reduces total asset value
      }

      return {
        ...c,
        transactions: newTransactions,
        investedAmount: newInvested,
        currentValue: newCurrentValue,
        profitLoss: newCurrentValue - newInvested,
        updatedAt: new Date().toISOString(),
      };
    }
    return c;
  });
  saveClients(updatedClients);
}

export function deleteClient(id: string) {
  const clients = getClients();
  saveClients(clients.filter(c => c.id !== id));
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
