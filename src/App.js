import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Challenge from './components/Challenge';
import Debts from './components/Debts';
import Bills from './components/Bills';
import Budget from './components/Budget';
import Funding from './components/Funding';
import Notes from './components/Notes';
import Setup from './components/Setup';
import './App.css';

function AppContent() {
  const { tab, setup } = useApp();

  if (!setup.completed) {
    return <Setup />;
  }

  switch (tab) {
    case 'dashboard': return <Dashboard />;
    case 'challenge': return <Challenge />;
    case 'debts':     return <Debts />;
    case 'bills':     return <Bills />;
    case 'budget':    return <Budget />;
    case 'funding':   return <Funding />;
    case 'notes':     return <Notes />;
    default:          return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <AppContent />
      </div>
    </AppProvider>
  );
}