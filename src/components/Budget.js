import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateId } from '../utils/helpers';
import Header from './Header';

const categoryNames = [
  'Housing', 'Food', 'Transport', 'Utilities', 'Insurance',
  'Healthcare', 'Entertainment', 'Shopping', 'Savings', 'Debt',
  'Education', 'Personal', 'Gifts', 'Other',
];

export default function Budget() {
  const { budgetCategories, setBudgetCategories } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: 'Food', budgeted: 0, spent: 0 });

  const addCategory = (e) => {
    e.preventDefault();
    if (form.budgeted <= 0) return;
    setBudgetCategories(prev => [...prev, { ...form, id: generateId() }]);
    setForm({ name: 'Food', budgeted: 0, spent: 0 });
    setShowForm(false);
  };

  const addSpending = (id, amount) => {
    setBudgetCategories(prev => prev.map(c =>
      c.id === id ? { ...c, spent: (c.spent || 0) + amount } : c
    ));
  };

  const deleteCategory = (id) => {
    setBudgetCategories(prev => prev.filter(c => c.id !== id));
  };

  const totalBudgeted = budgetCategories.reduce((s, c) => s + c.budgeted, 0);
  const totalSpent = budgetCategories.reduce((s, c) => s + (c.spent || 0), 0);

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <div className="section-header">
          <h2>💰 Budget</h2>
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {/* Summary */}
        <div className="card">
          <h3>Budget Overview</h3>
          <div className="budget-summary">
            <div>
              <span>Budgeted</span>
              <span className="amount">{formatCurrency(totalBudgeted)}</span>
            </div>
            <div>
              <span>Spent</span>
              <span className="amount negative">{formatCurrency(totalSpent)}</span>
            </div>
            <div>
              <span>Remaining</span>
              <span className={`amount ${totalBudgeted - totalSpent >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(totalBudgeted - totalSpent)}
              </span>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <form className="card form" onSubmit={addCategory}>
            <select
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            >
              {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number" placeholder="Monthly budget" min="0"
              value={form.budgeted || ''}
              onChange={e => setForm({ ...form, budgeted: parseFloat(e.target.value) || 0 })}
              required
            />
            <button type="submit" className="btn primary">Add Category</button>
          </form>
        )}

        {/* Categories */}
        {budgetCategories.map(cat => {
          const spent = cat.spent || 0;
          const remaining = cat.budgeted - spent;
          const pct = cat.budgeted > 0 ? Math.min(100, (spent / cat.budgeted) * 100) : 0;
          const overBudget = spent > cat.budgeted;

          return (
            <div key={cat.id} className={`card budget-item ${overBudget ? 'over' : ''}`}>
              <div className="budget-header">
                <h4>{cat.name}</h4>
                <button className="btn small danger" onClick={() => deleteCategory(cat.id)}>✕</button>
              </div>
              <div className="budget-numbers">
                <span>{formatCurrency(spent)} spent</span>
                <span>of {formatCurrency(cat.budgeted)}</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${overBudget ? 'danger' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className={overBudget ? 'text-danger' : 'text-muted'}>
                {overBudget ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} remaining`}
              </p>
              <div className="spend-row">
                <input
                  type="number" placeholder="Quick spend"
                  id={`spend-${cat.id}`}
                />
                <button
                  className="btn small"
                  onClick={() => {
                    const input = document.getElementById(`spend-${cat.id}`);
                    const amt = parseFloat(input.value);
                    if (amt > 0) {
                      addSpending(cat.id, amt);
                      input.value = '';
                    }
                  }}
                >
                  Log
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}