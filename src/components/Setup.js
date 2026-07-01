import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Setup() {
  const { setup, setSetup } = useApp();
  const [form, setForm] = useState({
    name: setup.name || '',
    monthlyIncome: setup.monthlyIncome || '',
    payday: setup.payday || '1',
    payFrequency: setup.payFrequency || 'monthly',
  });

  const frequencyMultiplier = {
    weekly: 4.33,
    'bi-weekly': 2.17,
    monthly: 1,
  };

  const calculatedMonthly = form.monthlyIncome
    ? parseFloat(form.monthlyIncome) * frequencyMultiplier[form.payFrequency]
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSetup({
      step: 1,
      completed: true,
      name: form.name,
      monthlyIncome: calculatedMonthly,
      payday: form.payday,
      payFrequency: form.payFrequency,
    });
  };

  return (
    <div className="setup-page">
      <div className="setup-card card">
        <h1>🏛️ Financial Command Center</h1>
        <h2>Initial Setup</h2>
        <p>Tell us a bit about yourself to get started.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Your Name
            <input
              placeholder="e.g. Blake"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          {/* ─── Pay Frequency Toggle ─────────────────────────── */}
          <label>Pay Frequency</label>
          <div className="toggle-group">
            {['weekly', 'bi-weekly', 'monthly'].map(freq => (
              <button
                key={freq}
                type="button"
                className={`toggle-btn ${form.payFrequency === freq ? 'active' : ''}`}
                onClick={() => setForm({ ...form, payFrequency: freq })}
              >
                {freq === 'bi-weekly' ? 'Bi-Weekly' : freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>

          {/* ─── Dynamic Income Label ─────────────────────────── */}
          <label>
            {form.payFrequency === 'weekly'
              ? 'Weekly Take-Home Income'
              : form.payFrequency === 'bi-weekly'
              ? 'Bi-Weekly Take-Home Income'
              : 'Monthly Take-Home Income'}
            <input
              type="number"
              placeholder="e.g. 4000"
              min="0"
              step="0.01"
              value={form.monthlyIncome}
              onChange={e => setForm({ ...form, monthlyIncome: e.target.value })}
              required
            />
          </label>

          {/* ─── Show monthly equivalent ─────────────────────── */}
          {form.monthlyIncome && form.payFrequency !== 'monthly' && (
            <p className="monthly-equivalent">
              ≈ ${calculatedMonthly.toFixed(2)} / month
            </p>
          )}

          <label>
            Payday (day of month)
            <select
              value={form.payday}
              onChange={e => setForm({ ...form, payday: e.target.value })}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn primary large">
            Start Your Journey
          </button>
        </form>
      </div>
    </div>
  );
}
