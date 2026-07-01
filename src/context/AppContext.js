import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

const initialSetup = {
  step: 1,
  completed: false,
  name: '',
  monthlyIncome: 0,
  payday: '',
  payFrequency: 'monthly',
};

const initialChallenge = {
  active: false,
  level: 1,
  xp: 0,
  streak: 0,
  challenges: [],
  completedChallenges: [],
};

export function AppProvider({ children }) {
  // ─── Core data ──────────────────────────────────────────────
  const [setup, setSetup] = useLocalStorage('fcc_setup', initialSetup);
  const [transactions, setTransactions] = useLocalStorage('fcc_transactions', []);
  const [debts, setDebts] = useLocalStorage('fcc_debts', []);
  const [bills, setBills] = useLocalStorage('fcc_bills', []);
  const [budgetCategories, setBudgetCategories] = useLocalStorage('fcc_budget', []);
  const [fundingGoals, setFundingGoals] = useLocalStorage('fcc_funding', []);
  const [notes, setNotes] = useLocalStorage('fcc_notes', []);
  const [challenge, setChallenge] = useLocalStorage('fcc_challenge', initialChallenge);
  const [tab, setTab] = useLocalStorage('fcc_tab', 'dashboard');

  // ─── Derived values ─────────────────────────────────────────
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalPaid = debts.reduce((sum, d) => sum + (d.paid || 0), 0);
  const totalBillsDue = bills
    .filter(b => !b.paid)
    .reduce((sum, b) => sum + b.amount, 0);
  const totalBudgeted = budgetCategories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalFunding = fundingGoals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = fundingGoals.reduce((sum, g) => sum + (g.saved || 0), 0);

  const value = {
    // State
    setup, setSetup,
    transactions, setTransactions,
    debts, setDebts,
    bills, setBills,
    budgetCategories, setBudgetCategories,
    fundingGoals, setFundingGoals,
    notes, setNotes,
    challenge, setChallenge,
    tab, setTab,
    // Derived
    totalDebt, totalPaid, totalBillsDue,
    totalBudgeted, totalSpent, totalFunding, totalSaved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
