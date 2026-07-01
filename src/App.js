import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('monthlyIncome');
    return saved ? JSON.parse(saved) : 0;
  });
  const [payFrequency, setPayFrequency] = useState(() => {
    const saved = localStorage.getItem('payFrequency');
    return saved ? saved : 'monthly';
  });
  const [incomeInput, setIncomeInput] = useState('');
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { name: 'Housing', percent: 30 },
      { name: 'Transportation', percent: 12 },
      { name: 'Food', percent: 10 },
      { name: 'Savings', percent: 15 },
      { name: 'Utilities', percent: 8 },
      { name: 'Insurance', percent: 7 },
      { name: 'Healthcare', percent: 5 },
      { name: 'Education', percent: 5 },
      { name: 'Entertainment', percent: 5 },
      { name: 'Miscellaneous', percent: 3 },
    ];
  });
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [
      { ticker: 'VOO', shares: 10, price: 0 },
      { ticker: 'AAPL', shares: 5, price: 0 },
    ];
  });
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('monthlyIncome'));
  const [news, setNews] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});

  // Pay frequency multiplier
  const frequencyMultiplier = {
    weekly: 4.33,
    'bi-weekly': 2.17,
    monthly: 1,
  };

  const calculatedMonthly = incomeInput
    ? parseFloat(incomeInput) * frequencyMultiplier[payFrequency]
    : monthlyIncome;

  useEffect(() => {
    localStorage.setItem('monthlyIncome', JSON.stringify(monthlyIncome));
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('payFrequency', JSON.stringify(payFrequency));
  }, [payFrequency]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    const fetchStocks = async () => {
      const symbols = ['SPY', 'QQQ', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'VOO', 'VTI', 'BND'];
      try {
        const data = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cvq1d1pr01qhdm8en6r0cvq1d1pr01qhdm8en6rg`
            );
            const result = await response.json();
            return { symbol, price: result.c || 0, change: result.dp || 0 };
          })
        );
        setStocks(data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPortfolioPrices = async () => {
      const updated = { ...currentPrices };
      for (const holding of portfolio) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.ticker}&token=cvq1d1pr01qhdm8en6r0cvq1d1pr01qhdm8en6rg`
          );
          const data = await response.json();
          updated[holding.ticker] = data.c || 0;
        } catch (error) {
          console.error(`Error fetching ${holding.ticker}:`, error);
        }
      }
      setCurrentPrices(updated);
    };
    fetchPortfolioPrices();
    const interval = setInterval(fetchPortfolioPrices, 60000);
    return () => clearInterval(interval);
  }, [portfolio]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=cvq1d1pr01qhdm8en6r0cvq1d1pr01qhdm8en6rg`
        );
        const data = await response.json();
        setNews(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const monthly = incomeInput
      ? parseFloat(incomeInput) * frequencyMultiplier[payFrequency]
      : 0;
    setMonthlyIncome(monthly);
    setShowWelcome(false);
  };

  const handleResetIncome = () => {
    setMonthlyIncome(0);
    setIncomeInput('');
    setShowWelcome(true);
    localStorage.removeItem('monthlyIncome');
    localStorage.removeItem('payFrequency');
  };

  const updateExpense = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    if (field === 'percent') {
      updated[index].percent = Math.min(100, Math.max(0, parseFloat(value) || 0));
    }
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { name: 'New', percent: 0 }]);
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const addToPortfolio = () => {
    setPortfolio([...portfolio, { ticker: '', shares: 0, price: 0 }]);
  };

  const updatePortfolio = (index, field, value) => {
    const updated = [...portfolio];
    updated[index][field] = value;
    setPortfolio(updated);
  };

  const removeFromPortfolio = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const totalPercent = expenses.reduce((sum, e) => sum + e.percent, 0);
  const remainingPercent = Math.max(0, 100 - totalPercent);
  const remainingAmount = (remainingPercent / 100) * monthlyIncome;

  if (showWelcome) {
    return (
      <div className="app">
        <header className="header">
          <h1>Financial Command Center</h1>
        </header>
        <div className="welcome-screen">
          <h2>Welcome!</h2>
          <p>Enter your income to get started.</p>
          <form onSubmit={handleIncomeSubmit}>
            {/* Pay Frequency Toggle */}
            <div className="pay-frequency-toggle">
              <label>Pay Frequency:</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${payFrequency === 'weekly' ? 'active' : ''}`}
                  onClick={() => setPayFrequency('weekly')}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${payFrequency === 'bi-weekly' ? 'active' : ''}`}
                  onClick={() => setPayFrequency('bi-weekly')}
                >
                  Bi-Weekly
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${payFrequency === 'monthly' ? 'active' : ''}`}
                  onClick={() => setPayFrequency('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Income Input */}
            <div className="input-group">
              <label htmlFor="income-input">
                {payFrequency === 'weekly'
                  ? 'Weekly Take-Home Pay:'
                  : payFrequency === 'bi-weekly'
                  ? 'Bi-Weekly Take-Home Pay:'
                  : 'Monthly Take-Home Pay:'}
              </label>
              <div className="input-row">
                <span className="dollar-sign">$</span>
                <input
                  id="income-input"
                  type="number"
                  step="0.01"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                />
              </div>
            </div>

            {/* Shows the calculated monthly equivalent */}
            {incomeInput && payFrequency !== 'monthly' && (
              <p className="monthly-equivalent">
                ≈ ${(parseFloat(incomeInput) * frequencyMultiplier[payFrequency]).toFixed(2)} / month
              </p>
            )}

            <button type="submit" className="submit-btn">
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ====== MAIN DASHBOARD ======
  return (
    <div className="app">
      <header className="header">
        <h1>Financial Command Center</h1>
        <button className="reset-btn" onClick={handleResetIncome}>Reset Income</button>
      </header>

      {/* Income Overview */}
      <section className="card income-summary">
        <h2>Monthly Income</h2>
        <p className="amount">${monthlyIncome.toFixed(2)}</p>
      </section>

      {/* Stock Ticker */}
      <section className="card stock-ticker">
        <h2>Market Overview</h2>
        <div className="ticker-grid">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="ticker-item">
              <span className="ticker-symbol">{stock.symbol}</span>
              <span className="ticker-price">${stock.price.toFixed(2)}</span>
              <span className={`ticker-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Budget Breakdown */}
      <section className="card budget-section">
        <h2>Budget Breakdown</h2>
        <div className="progress-bar">
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="progress-segment"
              style={{ width: `${expense.percent}%`, backgroundColor: getColor(index) }}
              title={`${expense.name}: ${expense.percent}%`}
            />
          ))}
          {remainingPercent > 0 && (
            <div
              className="progress-segment remaining"
              style={{ width: `${remainingPercent}%` }}
              title={`Remaining: ${remainingPercent.toFixed(1)}%`}
            />
          )}
        </div>
        <p className="remaining-text">
          {remainingPercent > 0
            ? `$${remainingAmount.toFixed(2)} (${remainingPercent.toFixed(1)}%) remaining`
            : totalPercent >= 100
            ? '⚠️ Budget fully allocated!'
            : ''}
        </p>

        <div className="expense-list">
          {expenses.map((expense, index) => (
            <div key={index} className="expense-item">
              <input
                type="text"
                value={expense.name}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                className="expense-name"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={expense.percent}
                onChange={(e) => updateExpense(index, 'percent', e.target.value)}
                className="expense-percent"
              />
              <span className="expense-amount">
                ${((expense.percent / 100) * monthlyIncome).toFixed(2)}
              </span>
              <button className="remove-btn" onClick={() => removeExpense(index)}>✕</button>
            </div>
          ))}
          <button className="add-btn" onClick={addExpense}>+ Add Category</button>
        </div>
      </section>

      {/* Portfolio */}
      <section className="card portfolio-section">
        <h2>Portfolio</h2>
        <div className="portfolio-list">
          {portfolio.map((holding, index) => {
            const price = currentPrices[holding.ticker] || 0;
            const value = holding.shares ? holding.shares * price : 0;
            return (
              <div key={index} className="portfolio-item">
                <input
                  type="text"
                  value={holding.ticker}
                  onChange={(e) => updatePortfolio(index, 'ticker', e.target.value.toUpperCase())}
                  placeholder="TICKER"
                  className="portfolio-ticker"
                />
                <input
                  type="number"
                  min="0"
                  value={holding.shares}
                  onChange={(e) => updatePortfolio(index, 'shares', parseFloat(e.target.value) || 0)}
                  placeholder="Shares"
                  className="portfolio-shares"
                />
                <span className="portfolio-price">${price.toFixed(2)}</span>
                <span className="portfolio-value">${value.toFixed(2)}</span>
                <button className="remove-btn" onClick={() => removeFromPortfolio(index)}>✕</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={addToPortfolio}>+ Add Holding</button>
        </div>
        {portfolio.length > 0 && (
          <p className="portfolio-total">
            Total Value: $
            {portfolio
              .reduce((sum, h) => sum + (h.shares || 0) * (currentPrices[h.ticker] || 0), 0)
              .toFixed(2)}
          </p>
        )}
      </section>

      {/* News */}
      <section className="card news-section">
        <h2>Financial News</h2>
        <div className="news-list">
          {news.map((article, index) => (
            <div key={index} className="news-item">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3>{article.headline}</h3>
                <p>{article.summary}</p>
                <span className="news-source">{article.source}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Made with ❤️ from iPhone</p>
      </footer>
    </div>
  );
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
const getColor = (index) => colors[index % colors.length];

export default App;
