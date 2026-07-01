import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateId } from '../utils/helpers';
import Header from './Header';

export default function Bills() {
  const { bills, setBills } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', amount: 0, dueDate: '', category: 'Utilities', recurring: false,
  });

  const addBill = (e) => {
    e.preventDefault();
    if (!form.name || !form.dueDate) return;
    setBills(prev => [...prev, { ...form, id: generateId(), paid: false }]);
    setForm({ name: '', amount: 0, dueDate: '', category: 'Utilities', recurring: false });
    setShowForm(false);
  };

  const togglePaid = (id) => {
    setBills(prev => prev.map(b =>
      b.id === id ? { ...b, paid: !b.paid } : b
    ));
  };

  const deleteBill = (id) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  // Sort by due date
  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const unpaidBills = sortedBills.filter(b => !b.paid);
  const paidBills = sortedBills.filter(b => b.paid);
  const totalUnpaid = unpaidBills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <div className="section-header">
          <h2>📋 Bills</h2>
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Bill'}
          </button>
        </div>

        {/* Summary */}
        <div className="card">
          <h3>Unpaid Bills</h3>
          <span className="amount negative">{formatCurrency(totalUnpaid)}</span>
          <p>{unpaidBills.length} bills due</p>
        </div>

        {/* Add Bill Form */}
        {showForm && (
          <form className="card form" onSubmit={addBill}>
            <input
              placeholder="Bill name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="number" placeholder="Amount" min="0"
              value={form.amount || ''}
              onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              required
            />
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="Utilities">Utilities</option>
              <option value="Rent/Mortgage">Rent/Mortgage</option>
              <option value="Insurance">Insurance</option>
              <option value="Subscription">Subscription</option>
              <option value="Loan">Loan</option>
              <option value="Other">Other</option>
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.recurring}
                onChange={e => setForm({ ...form, recurring: e.target.checked })}
              />
              Recurring monthly
            </label>
            <button type="submit" className="btn primary">Add Bill</button>
          </form>
        )}

        {/* Unpaid Bills */}
        <h3>Unpaid ({unpaidBills.length})</h3>
        {unpaidBills.map(bill => (
          <div key={bill.id} className="card bill-item">
            <div className="bill-header">
              <h4>{bill.name}</h4>
              <span className="bill-amount">{formatCurrency(bill.amount)}</span>
            </div>
            <div className="bill-details">
              <span>Due: {bill.dueDate}</span>
              <span className="bill-category">{bill.category}</span>
            </div>
            <div className="bill-actions">
              <button className="btn small" onClick={() => togglePaid(bill.id)}>
                Mark Paid
              </button>
              <button className="btn small danger" onClick={() => deleteBill(bill.id)}>
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* Paid Bills */}
        {paidBills.length > 0 && (
          <>
            <h3>Paid ({paidBills.length})</h3>
            {paidBills.map(bill => (
              <div key={bill.id} className="card bill-item paid">
                <div className="bill-header">
                  <h4>{bill.name}</h4>
                  <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                </div>
                <div className="bill-actions">
                  <button className="btn small" onClick={() => togglePaid(bill.id)}>
                    Undo
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}