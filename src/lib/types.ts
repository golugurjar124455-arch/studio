export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  investedAmount: number;
  currentValue: number;
  stocks: number;
  mutualFunds: number;
  gold: number;
  profitLoss: number;
  updatedAt: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}
