import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateId, calculateProgress } from '../utils/helpers';
import Header from './Header';

export default function Funding() {
  const { fundingGoals, setFundingGoals } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', target: 0, saved: 0, deadline: '',
  });
  const [contribution, setContribution] = useState({ id: '', amount: '' });

  const addGoal = (e) => {
    e.preventDefault();
    if (!form.name || form.target <= 0) return;
    setFundingGoals(prev => [...prev, { ...form, id: generateId() }]);
    setForm({ name: '', target: 0, saved: 0, deadline: '' });
    setShowForm(false);
  };

  const contribute = () => {
    if (!contribution.id || !contribution.amount) return;
    const amt = parseFloat(contribution.amount);
    setFundingGoals(prev => prev.map(g =>
      g.id === contribution.id
        ? { ...g, saved: Math.min(g.target, (g.saved || 0) + amt) }
        : g
    ));
    setContribution({ id: '', amount: '' });
  };

  const deleteGoal = (id) => {
    setFundingGoals(prev => prev.filter(g => g.id !== id));
  };

  const totalTarget = fundingGoals.reduce((s, g) => s + g.target, 0);
  const totalSaved = fundingGoals.reduce((s, g) => s + (g.saved || 0), 0);

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <div className="section-header">
          <h2>🏦 Funding Goals</h2>
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {/* Summary */}
        <div className="card">
          <h3>Total Progress</h3>
          <span className="amount positive">{formatCurrency(totalSaved)}</span>
          <p>of {formatCurrency(totalTarget)}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${calculateProgress(totalSaved, totalTarget)}%` }}
            />
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <form className="card form" onSubmit={addGoal}>
            <input
              placeholder="Goal name (e.g. Emergency Fund)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="number" placeholder="Target amount" min="0"
              value={form.target || ''}
              onChange={e => setForm({ ...form, target: parseFloat(e.target.value) || 0 })}
              required
            />
            <input
              type="number" placeholder="Already saved (optional)"
              value={form.saved || ''}
              onChange={e => setForm({ ...form, saved: parseFloat(e.target.value) || 0 })}
            />
            <input
              type="date" placeholder="Target date (optional)"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
            />
            <button type="submit" className="btn primary">Create Goal</button>
          </form>
        )}

        {/* Goals */}
        {fundingGoals.map(goal => {
          const progress = calculateProgress(goal.saved || 0, goal.target);
          return (
            <div key={goal.id} className="card goal-item">
              <div className="goal-header">
                <h4>{goal.name}</h4>
                <button className="btn small danger" onClick={() => deleteGoal(goal.id)}>✕</button>
              </div>
              <div className="goal-numbers">
                <span>{formatCurrency(goal.saved || 0)}</span>
                <span>of {formatCurrency(goal.target)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {goal.deadline && <p className="text-muted">By {goal.deadline}</p>}
              <div className="contribute-row">
                <input
                  type="number" placeholder="Add funds"
                  value={contribution.id === goal.id ? contribution.amount : ''}
                  onChange={e => setContribution({ id: goal.id, amount: e.target.value })}
                />
                <button className="btn small" onClick={contribute}>Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}