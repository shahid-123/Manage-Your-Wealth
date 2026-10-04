export type CurrencyUnit = 'AUTO' | 'RUPEE' | 'LAKH' | 'CRORE';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isDemo?: boolean;
}

export interface SalaryDetails {
  netSalaryInHand: number; // Only Net salary in hand is required
}

export interface OtherIncome {
  id: string;
  source: string;
  category: 'BUSINESS' | 'RENTAL' | 'DIVIDEND' | 'INTEREST' | 'OTHER';
  monthlyAmount: number;
}

export interface ExpenseItem {
  id: string;
  category: string;
  monthlyAmount: number;
}

export interface LoanItem {
  id: string;
  name: string;
  type: 'HOME_LOAN' | 'CAR_LOAN' | 'PERSONAL_LOAN' | 'EDUCATION_LOAN' | 'OTHER';
  outstandingAmount: number;
  monthlyEmi: number;
  interestRate: number;
}

export interface InvestmentItem {
  id: string;
  name: string;
  category: 'MUTUAL_FUND' | 'STOCK' | 'ETF' | 'GOLD' | 'FD' | 'PPF' | 'OTHER';
  investedAmount: number;
  currentValue: number;
  monthlySip: number;
}

export interface NpsDetails {
  pranNumber?: string;
  currentCorpus: number;
  employeeMonthlyContribution: number;
  employerMonthlyContribution: number;
  expectedCagr: number; // e.g. 9.0%
  currentAge: number;
  retirementAge: number;
}
