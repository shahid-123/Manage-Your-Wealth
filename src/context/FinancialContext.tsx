import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SalaryDetails,
  OtherIncome,
  ExpenseItem,
  LoanItem,
  InvestmentItem,
  NpsDetails,
  CurrencyUnit,
} from '../types/financial';
import { useAuth } from './AuthContext';

export type SimpleActiveTab =
  | 'DASHBOARD'
  | 'SALARY_INCOME'
  | 'EXPENSES'
  | 'LOANS'
  | 'INVESTMENTS'
  | 'NPS'
  | 'COMMUNITY';

interface FinancialContextType {
  activeTab: SimpleActiveTab;
  setActiveTab: (tab: SimpleActiveTab) => void;
  currencyUnit: CurrencyUnit;
  setCurrencyUnit: (unit: CurrencyUnit) => void;

  // 1. Salary
  salary: SalaryDetails;
  updateSalary: (patch: Partial<SalaryDetails>) => void;
  netSalaryMonthly: number;
  estimatedGrossSalary: number;
  estimatedBasicSalary: number;
  estimatedDaAllowance: number;
  grossSalaryMonthly: number;

  // 2. Other Incomes
  otherIncomes: OtherIncome[];
  addOtherIncome: (item: Omit<OtherIncome, 'id'>) => void;
  deleteOtherIncome: (id: string) => void;
  totalOtherIncomeMonthly: number;

  // Total Inflow
  totalMonthlyInflow: number;

  // 3. Expenses
  expenses: ExpenseItem[];
  addExpense: (item: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (id: string, patch: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  totalMonthlyExpenses: number;

  // 4. Loans & Debt
  loans: LoanItem[];
  addLoan: (item: Omit<LoanItem, 'id'>) => void;
  updateLoan: (id: string, patch: Partial<LoanItem>) => void;
  deleteLoan: (id: string) => void;
  totalLoanOutstanding: number;
  totalMonthlyEmi: number;

  // 5. Investments
  investments: InvestmentItem[];
  addInvestment: (item: Omit<InvestmentItem, 'id'>) => void;
  updateInvestment: (id: string, patch: Partial<InvestmentItem>) => void;
  deleteInvestment: (id: string) => void;
  totalInvestedAmount: number;
  totalCurrentInvestmentsValue: number;
  totalMonthlySip: number;

  // 6. NPS
  nps: NpsDetails;
  updateNps: (patch: Partial<NpsDetails>) => void;
  projectedNpsRetirementCorpus: number;

  // Summary KPIs
  totalAssets: number;
  netWorth: number;
  monthlySavings: number;
  savingsRatePercent: number;

  resetUserDataToDefault: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Initial values for Demo / Salaried user
const DEFAULT_SALARY: SalaryDetails = {
  netSalaryInHand: 135000,
};

const DEFAULT_OTHER_INCOMES: OtherIncome[] = [
  { id: 'inc-1', source: 'Dividends & Interest', category: 'DIVIDEND', monthlyAmount: 6500 },
  { id: 'inc-2', source: 'Rental / Secondary', category: 'RENTAL', monthlyAmount: 15000 },
];

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: 'exp-1', category: 'Groceries & Food', monthlyAmount: 18000 },
  { id: 'exp-2', category: 'Utilities & Maintenance', monthlyAmount: 8500 },
  { id: 'exp-3', category: 'Child Education & Schooling', monthlyAmount: 14000 },
  { id: 'exp-4', category: 'Transport & Fuel', monthlyAmount: 7000 },
  { id: 'exp-5', category: 'Healthcare & Insurance', monthlyAmount: 5500 },
  { id: 'exp-6', category: 'Personal & Lifestyle', monthlyAmount: 12000 },
];

const DEFAULT_LOANS: LoanItem[] = [
  {
    id: 'loan-1',
    name: 'SBI Housing Term Loan',
    type: 'HOME_LOAN',
    outstandingAmount: 2850000,
    monthlyEmi: 32500,
    interestRate: 8.4,
  },
  {
    id: 'loan-2',
    name: 'Car Vehicle Loan',
    type: 'CAR_LOAN',
    outstandingAmount: 220000,
    monthlyEmi: 14800,
    interestRate: 8.7,
  },
];

const DEFAULT_INVESTMENTS: InvestmentItem[] = [
  {
    id: 'inv-1',
    name: 'Parag Parikh Flexi Cap Mutual Fund',
    category: 'MUTUAL_FUND',
    investedAmount: 850000,
    currentValue: 1240000,
    monthlySip: 25000,
  },
  {
    id: 'inv-2',
    name: 'Nifty 50 Index ETF (NIFTYBEES)',
    category: 'ETF',
    investedAmount: 600000,
    currentValue: 890000,
    monthlySip: 15000,
  },
  {
    id: 'inv-3',
    name: 'Sovereign Gold Bonds / Gold ETF',
    category: 'GOLD',
    investedAmount: 350000,
    currentValue: 480000,
    monthlySip: 5000,
  },
  {
    id: 'inv-4',
    name: 'Bank Fixed Deposit & Emergency Cash',
    category: 'FD',
    investedAmount: 500000,
    currentValue: 540000,
    monthlySip: 5000,
  },
];

const DEFAULT_NPS: NpsDetails = {
  pranNumber: '110029384756',
  currentCorpus: 4665000, // ₹46.65 Lakh
  employeeMonthlyContribution: 15000,
  employerMonthlyContribution: 15000,
  expectedCagr: 9.0,
  currentAge: 39,
  retirementAge: 60,
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SimpleActiveTab>('DASHBOARD');
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('AUTO');

  const userKey = currentUser ? `USER_${currentUser.id}` : 'GUEST';

  const [salary, setSalary] = useState<SalaryDetails>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_SALARY`);
      return saved ? JSON.parse(saved) : DEFAULT_SALARY;
    } catch {
      return DEFAULT_SALARY;
    }
  });

  const [otherIncomes, setOtherIncomes] = useState<OtherIncome[]>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_OTHER_INCOME`);
      return saved ? JSON.parse(saved) : DEFAULT_OTHER_INCOMES;
    } catch {
      return DEFAULT_OTHER_INCOMES;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_EXPENSES`);
      return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  const [loans, setLoans] = useState<LoanItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_LOANS`);
      return saved ? JSON.parse(saved) : DEFAULT_LOANS;
    } catch {
      return DEFAULT_LOANS;
    }
  });

  const [investments, setInvestments] = useState<InvestmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_INVESTMENTS`);
      return saved ? JSON.parse(saved) : DEFAULT_INVESTMENTS;
    } catch {
      return DEFAULT_INVESTMENTS;
    }
  });

  const [nps, setNps] = useState<NpsDetails>(() => {
    try {
      const saved = localStorage.getItem(`${userKey}_NPS`);
      return saved ? JSON.parse(saved) : DEFAULT_NPS;
    } catch {
      return DEFAULT_NPS;
    }
  });

  // Reload when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    try {
      const savedSalary = localStorage.getItem(`${userKey}_SALARY`);
      if (savedSalary) setSalary(JSON.parse(savedSalary));
      else if (currentUser.isDemo) setSalary(DEFAULT_SALARY);

      const savedIncome = localStorage.getItem(`${userKey}_OTHER_INCOME`);
      if (savedIncome) setOtherIncomes(JSON.parse(savedIncome));
      else if (currentUser.isDemo) setOtherIncomes(DEFAULT_OTHER_INCOMES);

      const savedExp = localStorage.getItem(`${userKey}_EXPENSES`);
      if (savedExp) setExpenses(JSON.parse(savedExp));
      else if (currentUser.isDemo) setExpenses(DEFAULT_EXPENSES);

      const savedLoans = localStorage.getItem(`${userKey}_LOANS`);
      if (savedLoans) setLoans(JSON.parse(savedLoans));
      else if (currentUser.isDemo) setLoans(DEFAULT_LOANS);

      const savedInv = localStorage.getItem(`${userKey}_INVESTMENTS`);
      if (savedInv) setInvestments(JSON.parse(savedInv));
      else if (currentUser.isDemo) setInvestments(DEFAULT_INVESTMENTS);

      const savedNps = localStorage.getItem(`${userKey}_NPS`);
      if (savedNps) setNps(JSON.parse(savedNps));
      else if (currentUser.isDemo) setNps(DEFAULT_NPS);
    } catch {
      // ignore
    }
  }, [currentUser?.id]);

  // Save changes
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`${userKey}_SALARY`, JSON.stringify(salary));
      localStorage.setItem(`${userKey}_OTHER_INCOME`, JSON.stringify(otherIncomes));
      localStorage.setItem(`${userKey}_EXPENSES`, JSON.stringify(expenses));
      localStorage.setItem(`${userKey}_LOANS`, JSON.stringify(loans));
      localStorage.setItem(`${userKey}_INVESTMENTS`, JSON.stringify(investments));
      localStorage.setItem(`${userKey}_NPS`, JSON.stringify(nps));
    } catch {
      // ignore
    }
  }, [salary, otherIncomes, expenses, loans, investments, nps, userKey]);

  // Derived Calculations
  // Primary Net In-Hand Salary
  const netSalaryMonthly = useMemo(() => {
    return salary.netSalaryInHand || 0;
  }, [salary.netSalaryInHand]);

  // Standard Indian salary estimation:
  // In-hand is typically ~82-85% of gross (after ~15-18% deductions like PF, TDS)
  const estimatedGrossSalary = useMemo(() => {
    return Math.round(netSalaryMonthly * 1.18);
  }, [netSalaryMonthly]);

  // Basic salary is typically ~48% of gross
  const estimatedBasicSalary = useMemo(() => {
    return Math.round(estimatedGrossSalary * 0.48);
  }, [estimatedGrossSalary]);

  // DA & other allowances make up the balance
  const estimatedDaAllowance = useMemo(() => {
    return Math.max(0, estimatedGrossSalary - estimatedBasicSalary - Math.round(estimatedGrossSalary * 0.18));
  }, [estimatedGrossSalary, estimatedBasicSalary]);

  const grossSalaryMonthly = estimatedGrossSalary;

  const totalOtherIncomeMonthly = useMemo(() => {
    return otherIncomes.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
  }, [otherIncomes]);

  const totalMonthlyInflow = useMemo(() => {
    return netSalaryMonthly + totalOtherIncomeMonthly;
  }, [netSalaryMonthly, totalOtherIncomeMonthly]);

  const totalMonthlyExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
  }, [expenses]);

  const totalLoanOutstanding = useMemo(() => {
    return loans.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
  }, [loans]);

  const totalMonthlyEmi = useMemo(() => {
    return loans.reduce((acc, curr) => acc + curr.monthlyEmi, 0);
  }, [loans]);

  const totalInvestedAmount = useMemo(() => {
    return investments.reduce((acc, curr) => acc + curr.investedAmount, 0);
  }, [investments]);

  const totalCurrentInvestmentsValue = useMemo(() => {
    return investments.reduce((acc, curr) => acc + curr.currentValue, 0);
  }, [investments]);

  const totalMonthlySip = useMemo(() => {
    return investments.reduce((acc, curr) => acc + curr.monthlySip, 0);
  }, [investments]);

  // NPS projection at retirement age:
  // Simple deterministic compound formula
  const projectedNpsRetirementCorpus = useMemo(() => {
    const years = Math.max(1, nps.retirementAge - nps.currentAge);
    const r = nps.expectedCagr / 100;
    const monthlyRate = r / 12;
    const monthlyContrib = nps.employeeMonthlyContribution + nps.employerMonthlyContribution;
    const n = years * 12;

    // Opening corpus compounded
    const fvOpening = nps.currentCorpus * Math.pow(1 + r, years);

    // Monthly contribution compounded annuity
    const fvContrib =
      monthlyRate > 0
        ? monthlyContrib * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate)
        : monthlyContrib * n;

    return Math.round(fvOpening + fvContrib);
  }, [nps]);

  // Total Assets = Investments + NPS Corpus
  const totalAssets = useMemo(() => {
    return totalCurrentInvestmentsValue + nps.currentCorpus;
  }, [totalCurrentInvestmentsValue, nps.currentCorpus]);

  // Net Worth = Total Assets - Total Loan Outstanding
  const netWorth = useMemo(() => {
    return totalAssets - totalLoanOutstanding;
  }, [totalAssets, totalLoanOutstanding]);

  // Monthly Savings = Inflow - Expenses - Loan EMIs
  const monthlySavings = useMemo(() => {
    return Math.max(0, netSalaryMonthly + totalOtherIncomeMonthly - totalMonthlyExpenses - totalMonthlyEmi);
  }, [netSalaryMonthly, totalOtherIncomeMonthly, totalMonthlyExpenses, totalMonthlyEmi]);

  const savingsRatePercent = useMemo(() => {
    if (totalMonthlyInflow <= 0) return 0;
    const totalInvestedMonthly = totalMonthlySip + nps.employeeMonthlyContribution + nps.employerMonthlyContribution;
    return Number(((totalInvestedMonthly / totalMonthlyInflow) * 100).toFixed(1));
  }, [totalMonthlyInflow, totalMonthlySip, nps.employeeMonthlyContribution, nps.employerMonthlyContribution]);

  // Action helpers
  const updateSalary = (patch: Partial<SalaryDetails>) => {
    setSalary((prev) => ({ ...prev, ...patch }));
  };

  const addOtherIncome = (item: Omit<OtherIncome, 'id'>) => {
    const newItem: OtherIncome = { ...item, id: `inc-${Date.now()}` };
    setOtherIncomes((prev) => [...prev, newItem]);
  };

  const deleteOtherIncome = (id: string) => {
    setOtherIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const addExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = { ...item, id: `exp-${Date.now()}` };
    setExpenses((prev) => [...prev, newItem]);
  };

  const updateExpense = (id: string, patch: Partial<ExpenseItem>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addLoan = (item: Omit<LoanItem, 'id'>) => {
    const newItem: LoanItem = { ...item, id: `loan-${Date.now()}` };
    setLoans((prev) => [...prev, newItem]);
  };

  const updateLoan = (id: string, patch: Partial<LoanItem>) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const deleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  const addInvestment = (item: Omit<InvestmentItem, 'id'>) => {
    const newItem: InvestmentItem = { ...item, id: `inv-${Date.now()}` };
    setInvestments((prev) => [...prev, newItem]);
  };

  const updateInvestment = (id: string, patch: Partial<InvestmentItem>) => {
    setInvestments((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv)));
  };

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  };

  const updateNps = (patch: Partial<NpsDetails>) => {
    setNps((prev) => ({ ...prev, ...patch }));
  };

  const resetUserDataToDefault = () => {
    setSalary(DEFAULT_SALARY);
    setOtherIncomes(DEFAULT_OTHER_INCOMES);
    setExpenses(DEFAULT_EXPENSES);
    setLoans(DEFAULT_LOANS);
    setInvestments(DEFAULT_INVESTMENTS);
    setNps(DEFAULT_NPS);
  };

  return (
    <FinancialContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currencyUnit,
        setCurrencyUnit,
        salary,
        updateSalary,
        grossSalaryMonthly,
        netSalaryMonthly,
        estimatedGrossSalary,
        estimatedBasicSalary,
        estimatedDaAllowance,
        otherIncomes,
        addOtherIncome,
        deleteOtherIncome,
        totalOtherIncomeMonthly,
        totalMonthlyInflow,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        totalMonthlyExpenses,
        loans,
        addLoan,
        updateLoan,
        deleteLoan,
        totalLoanOutstanding,
        totalMonthlyEmi,
        investments,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        totalInvestedAmount,
        totalCurrentInvestmentsValue,
        totalMonthlySip,
        nps,
        updateNps,
        projectedNpsRetirementCorpus,
        totalAssets,
        netWorth,
        monthlySavings,
        savingsRatePercent,
        resetUserDataToDefault,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
