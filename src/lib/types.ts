export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  investedAmount: number;
  currentValue: number;
  profitLoss: number;
  updatedAt: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}