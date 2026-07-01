import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Setup() {
  const { setup, setSetup } = useApp();
  const [form, setForm] = useState({
    name: setup.name || '',
    monthlyIncome: setup.monthlyIncome || '',
    payday: setup.payday || '1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSetup({
      step: 1,
      completed: true,
      name: form.name,
      monthlyIncome: parseFloat(form.monthlyIncome) || 0,
      payday: form.payday,
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

          <label>
            Monthly Take-Home Income
            <input
              type="number"
              placeholder="e.g. 4000"
              min="0"
              value={form.monthlyIncome}
              onChange={e => setForm({ ...form, monthlyIncome: e.target.value })}
              required
            />
          </label>

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