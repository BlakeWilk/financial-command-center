import React from 'react';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'dashboard', label: '📊', name: 'Dashboard' },
  { id: 'challenge', label: '🎯', name: 'Challenge' },
  { id: 'debts',     label: '💳', name: 'Debts' },
  { id: 'bills',     label: '📋', name: 'Bills' },
  { id: 'budget',    label: '💰', name: 'Budget' },
  { id: 'funding',   label: '🏦', name: 'Funding' },
  { id: 'notes',     label: '📝', name: 'Notes' },
];

export default function Header() {
  const { tab, setTab } = useApp();

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="app-title">FCC</h1>
        <span className="app-subtitle">Financial Command Center</span>
      </div>
      <nav className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-label={t.name}
          >
            <span className="tab-icon">{t.label}</span>
            <span className="tab-label">{t.name}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}