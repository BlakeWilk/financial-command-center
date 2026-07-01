// ─── Format currency ────────────────────────────────────────────
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── Generate unique ID ─────────────────────────────────────────
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

// ─── Today's date as YYYY-MM-DD ─────────────────────────────────
export const today = () => {
  return new Date().toISOString().split('T')[0];
};

// ─── Get month name ─────────────────────────────────────────────
export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

// ─── Calculate debt payoff progress ─────────────────────────────
export const calculateProgress = (paid, total) => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((paid / total) * 100));
};

// ─── Group bills by due date proximity ──────────────────────────
export const getBillsDueSoon = (bills) => {
  const now = new Date();
  const in7Days = new Date(now);
  in7Days.setDate(in7Days.getDate() + 7);
  return bills.filter(bill => {
    const due = new Date(bill.dueDate);
    return due >= now && due <= in7Days;
  });
};

// ─── XP / Level system ──────────────────────────────────────────
export const xpForLevel = (level) => level * 100;

export const calculateLevel = (xp) => {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return { level, currentLevelXp: xp, xpNeeded: xpForLevel(level) };
};