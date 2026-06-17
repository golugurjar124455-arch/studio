export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  fees?: {
    gst: number;
    upi: number;
    total: number;
  };
  netAmount?: number;
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
  platform: 'Forex' | 'Crypto' | 'Stocks' | 'Mutual Funds' | 'Commodities' | 'Options' | 'Indices' | 'Codex' | 'Other';
  investedAmount: number;
  currentValue: number;
  profitLoss: number;
  transactions: Transaction[];
  updatedAt: string;
}

export interface SystemSettings {
  gstRate: number;
  upiRate: number;
  currencySymbol: string;
  platformName: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}
