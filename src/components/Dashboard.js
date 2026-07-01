import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateProgress, getBillsDueSoon } from '../utils/helpers';
import Header from './Header';

export default function Dashboard() {
  const {
    setup, debts, bills, budgetCategories,
    fundingGoals, totalDebt, totalPaid, totalBillsDue,
  } = useApp();

  const monthlyIncome = setup.monthlyIncome || 0;
  const totalSavings = fundingGoals.reduce((s, g) => s + (g.saved || 0), 0);
  const netWorth = totalSavings - totalDebt;
  const debtProgress = calculateProgress(totalPaid, totalPaid + totalDebt);
  const billsDueSoon = getBillsDueSoon(bills);
  const totalBudgetSpent = budgetCategories.reduce((s, c) => s + (c.spent || 0), 0);

  const budgetHealth = monthlyIncome > 0
    ? Math.round((1 - totalBudgetSpent / monthlyIncome) * 100)
    : 0;

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h2>Dashboard</h2>
        <p className="greeting">Welcome back, {setup.name || 'Commander'}</p>

        {/* Net Worth Card */}
        <div className="card net-worth">
          <h3>Net Worth</h3>
          <span className={`amount ${netWorth >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netWorth)}
          </span>
        </div>

        {/* Debt Progress */}
        <div className="card">
          <h3>Debt Payoff</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${debtProgress}%` }} />
          </div>
          <p>{formatCurrency(totalPaid)} paid of {formatCurrency(totalPaid + totalDebt)}</p>
        </div>

        {/* Budget Health */}
        <div className="card">
          <h3>Budget Health</h3>
          <p>{budgetHealth}% of income remaining this month</p>
        </div>

        {/* Upcoming Bills */}
        <div className="card">
          <h3>Bills Due This Week</h3>
          {billsDueSoon.length === 0 ? (
            <p className="text-muted">None due soon</p>
          ) : (
            <ul className="bill-list">
              {billsDueSoon.map(b => (
                <li key={b.id}>
                  <span>{b.name}</span>
                  <span>{formatCurrency(b.amount)}</span>
                  <span className="due-date">Due {b.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}