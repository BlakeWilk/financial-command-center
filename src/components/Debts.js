import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateId, calculateProgress } from '../utils/helpers';
import Header from './Header';

const debtTypes = [
  'Credit Card', 'Student Loan', 'Car Loan', 'Mortgage',
  'Personal Loan', 'Medical', 'Payday Loan', 'Other'
];

export default function Debts() {
  const { debts, setDebts } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'Credit Card', balance: 0, apr: 0,
    minPayment: 0, paid: 0,
  });
  const [payment, setPayment] = useState({ id: '', amount: '' });

  const addDebt = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setDebts(prev => [...prev, { ...form, id: generateId() }]);
    setForm({ name: '', type: 'Credit Card', balance: 0, apr: 0, minPayment: 0, paid: 0 });
    setShowForm(false);
  };

  const makePayment = () => {
    if (!payment.id || !payment.amount) return;
    const amt = parseFloat(payment.amount);
    setDebts(prev => prev.map(d =>
      d.id === payment.id
        ? { ...d, paid: (d.paid || 0) + amt, balance: Math.max(0, d.balance - amt) }
        : d
    ));
    setPayment({ id: '', amount: '' });
  };

  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalPaid = debts.reduce((s, d) => s + (d.paid || 0), 0);

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <div className="section-header">
          <h2>💳 Debts</h2>
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Debt'}
          </button>
        </div>

        {/* Summary */}
        <div className="card">
          <h3>Total Debt</h3>
          <span className="amount negative">{formatCurrency(totalBalance)}</span>
          <p>Total paid: {formatCurrency(totalPaid)}</p>
        </div>

        {/* Add Debt Form */}
        {showForm && (
          <form className="card form" onSubmit={addDebt}>
            <input
              placeholder="Debt name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              {debtTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="number" placeholder="Total balance" min="0"
              value={form.balance || ''}
              onChange={e => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })}
              required
            />
            <input
              type="number" placeholder="APR %" min="0" step="0.1"
              value={form.apr || ''}
              onChange={e => setForm({ ...form, apr: parseFloat(e.target.value) || 0 })}
            />
            <input
              type="number" placeholder="Minimum payment" min="0"
              value={form.minPayment || ''}
              onChange={e => setForm({ ...form, minPayment: parseFloat(e.target.value) || 0 })}
            />
            <button type="submit" className="btn primary">Add Debt</button>
          </form>
        )}

        {/* Debt List */}
        {debts.length === 0 ? (
          <div className="empty-state">
            <p>No debts added yet</p>
          </div>
        ) : (
          debts.map(debt => {
            const progress = calculateProgress(debt.paid || 0, (debt.paid || 0) + debt.balance);
            return (
              <div key={debt.id} className="card debt-item">
                <div className="debt-header">
                  <h3>{debt.name}</h3>
                  <span className="debt-type">{debt.type}</span>
                  <button className="btn small danger" onClick={() => deleteDebt(debt.id)}>✕</button>
                </div>
                <div className="debt-details">
                  <span>Balance: {formatCurrency(debt.balance)}</span>
                  {debt.apr > 0 && <span>APR: {debt.apr}%</span>}
                  <span>Min payment: {formatCurrency(debt.minPayment)}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="progress-text">{formatCurrency(debt.paid || 0)} paid ({progress}%)</p>

                {/* Quick Payment */}
                <div className="payment-row">
                  <input
                    type="number" placeholder="Payment amount"
                    value={payment.id === debt.id ? payment.amount : ''}
                    onChange={e => setPayment({ id: debt.id, amount: e.target.value })}
                  />
                  <button className="btn small" onClick={makePayment}>Pay</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}