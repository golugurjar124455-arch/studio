export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
}

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  platform: 'Codex' | 'Binance' | 'Mutual Funds' | 'Stock Market' | 'Other';
  investedAmount: number;
  currentValue: number;
  profitLoss: number;
  transactions: Transaction[];
  updatedAt: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}
