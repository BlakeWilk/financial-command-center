import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateId, today, calculateLevel, xpForLevel } from '../utils/helpers';
import Header from './Header';

const challengeIdeas = [
  { title: 'No-Spend Day', desc: 'Don\'t spend any money today', xp: 50 },
  { title: 'Cook at Home', desc: 'Prepare all meals at home', xp: 30 },
  { title: 'Cancel Subscription', desc: 'Cancel one subscription you don\'t use', xp: 40 },
  { title: 'Round Up', desc: 'Round up a purchase and save the change', xp: 20 },
  { title: 'Review Bills', desc: 'Review all bills for savings opportunities', xp: 35 },
  { title: 'Decline a Want', desc: 'Say no to one impulse purchase', xp: 25 },
  { title: 'Transfer to Savings', desc: 'Move money to savings, any amount', xp: 45 },
  { title: 'Debt Payment', desc: 'Make an extra debt payment', xp: 60 },
  { title: 'Track Everything', desc: 'Log every penny you spend today', xp: 55 },
  { title: 'Budget Check', desc: 'Review and adjust your budget', xp: 30 },
];

export default function Challenge() {
  const { challenge, setChallenge } = useApp();
  const [activeChallenge, setActiveChallenge] = useState(null);

  const { level, currentLevelXp, xpNeeded } = calculateLevel(challenge.xp);
  const progress = Math.min(100, (currentLevelXp / xpNeeded) * 100);

  // Generate daily challenges
  const todayStr = today();
  const dailyChallenges = challenge.challenges.filter(c => c.date === todayStr);

  const startNewChallenge = () => {
    const pick = challengeIdeas[Math.floor(Math.random() * challengeIdeas.length)];
    const newChallenge = {
      id: generateId(),
      date: todayStr,
      ...pick,
      completed: false,
    };
    setChallenge(prev => ({
      ...prev,
      challenges: [...prev.challenges, newChallenge],
    }));
    setActiveChallenge(newChallenge.id);
  };

  const completeChallenge = (id) => {
    const chal = challenge.challenges.find(c => c.id === id);
    if (!chal || chal.completed) return;

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    setChallenge(prev => ({
      ...prev,
      xp: prev.xp + chal.xp,
      streak: prev.streak + 1,
      challenges: prev.challenges.map(c =>
        c.id === id ? { ...c, completed: true } : c
      ),
      completedChallenges: [
        ...prev.completedChallenges,
        { ...chal, completedAt: now.toISOString() },
      ],
    }));
  };

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h2>🎯 Debt Payoff Challenge</h2>

        {/* Level & XP */}
        <div className="card">
          <h3>Level {level}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>{currentLevelXp} / {xpNeeded} XP to next level</p>
          <p>🔥 {challenge.streak} day streak</p>
        </div>

        {/* Today's Challenges */}
        <div className="card">
          <h3>Today's Challenges</h3>
          {dailyChallenges.length === 0 ? (
            <div className="empty-state">
              <p>No challenges yet today</p>
              <button className="btn primary" onClick={startNewChallenge}>
                Draw a Challenge
              </button>
            </div>
          ) : (
            <ul className="challenge-list">
              {dailyChallenges.map(c => (
                <li key={c.id} className={c.completed ? 'completed' : ''}>
                  <div className="challenge-info">
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                    <span className="xp-badge">+{c.xp} XP</span>
                  </div>
                  {!c.completed && (
                    <button className="btn small" onClick={() => completeChallenge(c.id)}>
                      Complete
                    </button>
                  )}
                  {c.completed && <span className="checkmark">✅</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}