// ── Categories ──────────────────────────────────────────────
const CATEGORIES = {
  food: { name: 'Food', icon: 'fa-utensils', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  transport: { name: 'Transport', icon: 'fa-car', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  shopping: { name: 'Shopping', icon: 'fa-bag-shopping', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  entertainment: { name: 'Fun', icon: 'fa-film', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  health: { name: 'Health', icon: 'fa-heart-pulse', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  bills: { name: 'Bills', icon: 'fa-file-invoice-dollar', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  education: { name: 'Education', icon: 'fa-graduation-cap', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
  salary: { name: 'Salary', icon: 'fa-briefcase', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  investment: { name: 'Invest', icon: 'fa-chart-line', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  other: { name: 'Other', icon: 'fa-ellipsis', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
};

const EXPENSE_CATS = ['food', 'transport', 'shopping', 'entertainment', 'health', 'bills', 'education', 'other'];
const INCOME_CATS = ['salary', 'investment', 'other'];

// ── State ────────────────────────────────────────────────────
let transactions = (() => {
  try { return JSON.parse(localStorage.getItem('mm_transactions') || '[]'); }
  catch { localStorage.removeItem('mm_transactions'); return []; }
})();
let budgets = (() => {
  try { return JSON.parse(localStorage.getItem('mm_budgets') || '{}'); }
  catch { localStorage.removeItem('mm_budgets'); return {}; }
})();
let currentFilter = 'all';
let searchQuery = '';
let selectedType = 'expense';
let selectedCat = 'food';
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
let currentCurrency = localStorage.getItem('mm_currency') || 'USD';
let dateRangeStart = '';
let dateRangeEnd = '';

let categoryChart, monthlyChart, comparisonChart;

// ── Persistence ──────────────────────────────────────────────
function saveTx() { localStorage.setItem('mm_transactions', JSON.stringify(transactions)); }
function saveBudg() { localStorage.setItem('mm_budgets', JSON.stringify(budgets)); }

// ── Currencies ────────────────────────────────────────────────
const CURRENCIES = {
  USD: { code: 'USD', locale: 'en-US', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', locale: 'de-DE', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', locale: 'en-GB', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', locale: 'ja-JP', symbol: '¥', name: 'Japanese Yen' },
  INR: { code: 'INR', locale: 'en-IN', symbol: '₹', name: 'Indian Rupee' },
  CAD: { code: 'CAD', locale: 'en-CA', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', locale: 'en-AU', symbol: 'A$', name: 'Australian Dollar' },
  CHF: { code: 'CHF', locale: 'de-CH', symbol: 'Fr', name: 'Swiss Franc' },
  CNY: { code: 'CNY', locale: 'zh-CN', symbol: '¥', name: 'Chinese Yuan' },
  BRL: { code: 'BRL', locale: 'pt-BR', symbol: 'R$', name: 'Brazilian Real' },
  MXN: { code: 'MXN', locale: 'es-MX', symbol: '$', name: 'Mexican Peso' },
  KRW: { code: 'KRW', locale: 'ko-KR', symbol: '₩', name: 'Korean Won' },
  SGD: { code: 'SGD', locale: 'en-SG', symbol: 'S$', name: 'Singapore Dollar' },
  AED: { code: 'AED', locale: 'ar-AE', symbol: 'د.إ', name: 'UAE Dirham' },
  SAR: { code: 'SAR', locale: 'ar-SA', symbol: '﷼', name: 'Saudi Riyal' },
  PKR: { code: 'PKR', locale: 'en-PK', symbol: '₨', name: 'Pakistani Rupee' },
  BDT: { code: 'BDT', locale: 'bn-BD', symbol: '৳', name: 'Bangladeshi Taka' },
};

// ── Helpers ──────────────────────────────────────────────────
function fmt(n) {
  const cur = CURRENCIES[currentCurrency] || CURRENCIES.USD;
  return new Intl.NumberFormat(cur.locale, { style: 'currency', currency: cur.code }).format(n);
}

function getCurrencySymbol() {
  return (CURRENCIES[currentCurrency] || CURRENCIES.USD).symbol;
}

function switchCurrency(code) {
  if (!CURRENCIES[code]) return;
  currentCurrency = code;
  localStorage.setItem('mm_currency', code);
  document.getElementById('amount-currency-symbol').textContent = getCurrencySymbol();
  renderSettings();
  rerenderActive();
  toast(`Currency changed to ${CURRENCIES[code].name}`);
}

function renderSettings() {
  const cur = currentCurrency;
  document.getElementById('settings-currency-grid').innerHTML = Object.values(CURRENCIES).map(c => `
    <button class="currency-option ${c.code === cur ? 'active' : ''}" onclick="switchCurrency('${c.code}')">
      <span class="currency-symbol">${c.symbol}</span>
      <span class="currency-code">${c.code}</span>
      <span class="currency-name">${c.name}</span>
    </button>
  `).join('');
}

function fmtDateLabel(dateStr) {
  const today = new Date().toISOString().split('T')[0];

  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yest = d.toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yest) return 'Yesterday';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function monthName(m, y) {
  return new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function getMonthTx() {
  return transactions.filter(t => {
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── CSV Export ───────────────────────────────────────────────
function exportCSV() {
  const list = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!list.length) { toast('No transactions to export', 'error'); return; }
  const headers = ['Date', 'Description', 'Type', 'Category', 'Amount'];
  const rows = list.map(t => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.type,
    CATEGORIES[t.category]?.name || t.category,
    t.type === 'expense' ? -t.amount : t.amount,
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `moneyflow-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`Exported ${list.length} transactions`);
}

// ── Date Range ────────────────────────────────────────────────
function applyDateRange() {
  dateRangeStart = document.getElementById('date-from').value;
  dateRangeEnd = document.getElementById('date-to').value;
  renderTransactions();
}

function clearDateRange() {
  dateRangeStart = '';
  dateRangeEnd = '';
  document.getElementById('date-from').value = '';
  document.getElementById('date-to').value = '';
  renderTransactions();
}

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

// ── Navigation ───────────────────────────────────────────────
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-view]').forEach(n => n.classList.remove('active'));

  document.getElementById('view-' + name)?.classList.add('active');
  document.querySelector(`.nav-item[data-view="${name}"]`)?.classList.add('active');

  const meta = {
    dashboard: ['Dashboard', "Here's your financial overview"],
    transactions: ['Transactions', 'All your transactions'],
    budget: ['Budget', 'Monthly spending limits'],
    reports: ['Reports', 'Insights and analytics'],
    settings: ['Settings', 'App preferences'],
  };
  const [title, sub] = meta[name] || [];
  document.getElementById('view-title').textContent = title || '';
  document.getElementById('view-subtitle').textContent = sub || '';

  if (name === 'dashboard') renderDashboard();
  if (name === 'transactions') renderTransactions();
  if (name === 'budget') renderBudget();
  if (name === 'reports') renderReports();
  if (name === 'settings') renderSettings();
}

// ── Dashboard ────────────────────────────────────────────────
function renderDashboard() {
  const mTx = getMonthTx();
  const allTx = transactions;

  const totalBal = allTx.reduce((a, t) => a + (t.type === 'income' ? t.amount : -t.amount), 0);
  const mIncome = mTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const mExpense = mTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const netSavings = mIncome - mExpense;

  document.getElementById('total-balance').textContent = fmt(totalBal);
  document.getElementById('monthly-income').textContent = fmt(mIncome);
  document.getElementById('monthly-expense').textContent = fmt(mExpense);

  const savEl = document.getElementById('net-savings');
  savEl.textContent = fmt(netSavings);
  savEl.className = 'card-amount ' + (netSavings >= 0 ? 'savings-amount' : 'expense-amount');

  // Recent transactions (latest 5 for the month)
  const recent = [...mTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const rl = document.getElementById('recent-list');
  rl.innerHTML = recent.length
    ? recent.map(t => txItemHTML(t, false)).join('')
    : '<li class="empty-state"><i class="fa-solid fa-receipt"></i><p>No transactions yet</p></li>';

  renderCategoryChart(mTx);
}

function txItemHTML(t, showDel = true) {
  const cat = CATEGORIES[t.category] || CATEGORIES.other;
  const signedAmount = t.type === 'income' ? t.amount : -t.amount;
  const shortDate = new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `
    <li class="transaction-item">
      <div class="tx-icon" style="background:${cat.bg};color:${cat.color}">
        <i class="fa-solid ${cat.icon}"></i>
      </div>
      <div class="tx-info">
        <div class="tx-desc">${escapeHtml(t.description)}</div>
        <div class="tx-category">${cat.name}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : ''}${fmt(signedAmount)}</div>
        <div class="tx-date-label">${shortDate}</div>
      </div>
      ${showDel ? `<button class="tx-delete" onclick="deleteTx('${t.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
    </li>`;
}

function renderCategoryChart(mTx) {
  const totals = {};
  mTx.filter(t => t.type === 'expense').forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const canvas = document.getElementById('category-chart');
  const ph = document.getElementById('chart-placeholder');
  const legend = document.getElementById('category-legend');

  if (!Object.keys(totals).length) {
    canvas.style.display = 'none';
    ph.style.display = 'flex';
    legend.innerHTML = '';
    if (categoryChart) { categoryChart.destroy(); categoryChart = null; }
    return;
  }

  canvas.style.display = 'block';
  ph.style.display = 'none';

  const labels = Object.keys(totals).map(k => CATEGORIES[k]?.name || k);
  const data = Object.values(totals);
  const colors = Object.keys(totals).map(k => CATEGORIES[k]?.color || '#94a3b8');

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
    options: {
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } },
      },
      responsive: true, maintainAspectRatio: false,
    },
  });

  legend.innerHTML = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([k, v]) => {
      const c = CATEGORIES[k] || CATEGORIES.other;
      return `<li class="legend-item">
        <div class="legend-dot" style="background:${c.color}"></div>
        <span class="legend-name">${c.name}</span>
        <span class="legend-amount">${fmt(v)}</span>
      </li>`;
    }).join('');
}

// ── Transactions View ─────────────────────────────────────────
function renderTransactions() {
  let list;
  if (dateRangeStart || dateRangeEnd) {
    list = transactions.filter(t => {
      if (dateRangeStart && t.date < dateRangeStart) return false;
      if (dateRangeEnd && t.date > dateRangeEnd) return false;
      return true;
    });
  } else {
    list = [...getMonthTx()];
  }

  if (currentFilter === 'income') list = list.filter(t => t.type === 'income');
  if (currentFilter === 'expense') list = list.filter(t => t.type === 'expense');
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(t =>
      t.description.toLowerCase().includes(q) ||
      (CATEGORIES[t.category]?.name || '').toLowerCase().includes(q)
    );
  }

  const container = document.getElementById('transactions-container');
  if (!list.length) {
    container.innerHTML = '<div class="empty-state large"><i class="fa-solid fa-receipt"></i><p>No transactions found</p></div>';
    return;
  }

  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  const groups = {};
  list.forEach(t => { (groups[t.date] = groups[t.date] || []).push(t); });

  container.innerHTML = Object.entries(groups).map(([date, txs]) => `
    <div class="date-group">
      <div class="date-group-label">${fmtDateLabel(date)}</div>
      <div class="date-group-panel">
        <ul class="transaction-list">${txs.map(t => txItemHTML(t, true)).join('')}</ul>
      </div>
    </div>`).join('');
}

function deleteTx(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  saveTx();
  renderDashboard();
  renderTransactions();
  toast('Transaction deleted');
}

// ── Budget View ───────────────────────────────────────────────
function renderBudget() {
  const mTx = getMonthTx();
  document.getElementById('budget-grid').innerHTML = EXPENSE_CATS.map(key => {
    const cat = CATEGORIES[key];
    const spent = mTx.filter(t => t.type === 'expense' && t.category === key).reduce((a, t) => a + t.amount, 0);
    const limit = budgets[key] || 0;
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const over = limit > 0 && spent > limit;
    const fillColor = over ? '#ef4444' : (pct > 75 ? '#f59e0b' : cat.color);
    const status = over ? '⚠ Over budget' : pct > 75 ? '⚡ Almost there' : limit > 0 ? 'On track' : 'No limit set';
    return `
      <div class="budget-card">
        <div class="budget-card-top">
          <div class="budget-cat-icon" style="background:${cat.bg};color:${cat.color}">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <div class="budget-info">
            <div class="budget-cat-name">${cat.name}</div>
            <div class="budget-amounts">${fmt(spent)}${limit > 0 ? ' / ' + fmt(limit) : ''}</div>
          </div>
          <button class="budget-set-btn" onclick="setBudget('${key}')">Set Limit</button>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${fillColor}"></div>
        </div>
        <div class="budget-footer">
          <span>${status}</span>
          <span>${limit > 0 ? Math.round(pct) + '%' : ''}</span>
        </div>
      </div>`;
  }).join('');
}

function setBudget(key) {
  const cat = CATEGORIES[key];
  const val = prompt(`Set monthly budget for ${cat.name} ($):\n(Leave empty or enter 0 to clear the budget limit)`, budgets[key] || '');
  if (val !== null) {
    if (val.trim() === '' || parseFloat(val) === 0) {
      delete budgets[key];
      saveBudg();
      renderBudget();
      toast(`Budget cleared for ${cat.name}`);
    } else {
      const n = parseFloat(val);
      if (!isNaN(n) && n > 0) {
        budgets[key] = n;
        saveBudg();
        renderBudget();
        toast(`Budget updated for ${cat.name}`);
      }
    }
  }
}

// ── Reports View ──────────────────────────────────────────────
function renderReports() {
  // Monthly bar chart (last 6 months)
  const months = [], incomes = [], expenses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - i, 1);
    const y = d.getFullYear(), m = d.getMonth();
    months.push(d.toLocaleDateString('en-US', { month: 'short' }));
    const mt = transactions.filter(t => {
      const td = new Date(t.date + 'T00:00:00');
      return td.getFullYear() === y && td.getMonth() === m;
    });
    incomes.push(mt.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0));
    expenses.push(mt.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0));
  }

  if (monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(document.getElementById('monthly-chart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: incomes, backgroundColor: 'rgba(16,185,129,0.75)', borderRadius: 6 },
        { label: 'Expenses', data: expenses, backgroundColor: 'rgba(244,63,94,0.75)', borderRadius: 6 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
        tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => '$' + v } },
      },
    },
  });

  // Comparison donut
  const mTx = getMonthTx();
  const mIncome = mTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const mExpense = mTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  if (comparisonChart) { comparisonChart.destroy(); comparisonChart = null; }

  const compCanvas = document.getElementById('comparison-chart');
  if (!mIncome && !mExpense) {
    compCanvas.style.display = 'none';
    let ph = document.getElementById('comparison-placeholder');
    if (!ph) {
      ph = document.createElement('div');
      ph.id = 'comparison-placeholder';
      ph.className = 'chart-placeholder';
      ph.innerHTML = '<i class="fa-solid fa-chart-pie"></i><p>No data for this month</p>';
      compCanvas.parentElement.appendChild(ph);
    }
    ph.style.display = 'flex';
  } else {
    const ph2 = document.getElementById('comparison-placeholder');
    if (ph2) ph2.style.display = 'none';
    compCanvas.style.display = 'block';
    comparisonChart = new Chart(compCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{ data: [mIncome, mExpense], backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(244,63,94,0.8)'], borderWidth: 0 }],
      },
      options: {
        cutout: '65%', responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
          tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } },
        },
      },
    });
  }
}

// ── Modal ─────────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');

function openModal() {
  overlay.classList.add('active');
  document.getElementById('modal-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-amount').value = '';
  document.getElementById('modal-desc').value = '';
  applyType(selectedType);
  setTimeout(() => document.getElementById('modal-amount').focus(), 120);
}

function closeModal() { overlay.classList.remove('active'); }

function applyType(type) {
  selectedType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.type-btn[data-type="${type}"]`).classList.add('active');

  document.querySelectorAll('.category-option').forEach(el => {
    const k = el.dataset.key;
    const visible = type === 'income' ? INCOME_CATS.includes(k) : EXPENSE_CATS.includes(k);
    el.style.display = visible ? '' : 'none';
  });

  const defaultCat = type === 'income' ? 'salary' : 'food';
  selectCat(defaultCat);
}

function selectCat(key) {
  selectedCat = key;
  document.querySelectorAll('.category-option').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.category-option[data-key="${key}"]`)?.classList.add('selected');
}

function buildCategoryGrid() {
  document.getElementById('category-grid').innerHTML = Object.entries(CATEGORIES).map(([k, c]) => `
    <div class="category-option" data-key="${k}"
         style="--sel-color:${c.color};--sel-bg:${c.bg}"
         onclick="selectCat('${k}')">
      <div class="cat-icon" style="background:${c.bg};color:${c.color}">
        <i class="fa-solid ${c.icon}"></i>
      </div>
      <span>${c.name}</span>
    </div>`).join('');
}

function submitTransaction() {
  let amount = parseFloat(document.getElementById('modal-amount').value);
  const desc = document.getElementById('modal-desc').value.trim();
  const date = document.getElementById('modal-date').value;

  if (!amount || amount <= 0) { toast('Enter a valid amount', 'error'); return; }
  if (amount > 999999999) { toast('Amount exceeds maximum allowed limit', 'error'); return; }
  amount = Math.round(amount * 100) / 100;

  if (!desc) { toast('Enter a description', 'error'); return; }
  if (desc.length > 80) { toast('Description must be 80 characters or less', 'error'); return; }
  if (!date) { toast('Select a date', 'error'); return; }

  transactions.unshift({ id: uid(), description: desc, amount, type: selectedType, category: selectedCat, date });
  saveTx();
  closeModal();
  toast('Transaction added!');
  renderDashboard();
  renderTransactions();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar nav
  document.querySelectorAll('.nav-item[data-view]').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); switchView(el.dataset.view); })
  );

  // "See all" link
  document.querySelector('.see-all')?.addEventListener('click', e => { e.preventDefault(); switchView('transactions'); });

  // Modal open/close
  document.getElementById('open-modal').addEventListener('click', openModal);
  document.getElementById('close-modal').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.getElementById('modal-submit').addEventListener('click', submitTransaction);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Type toggle
  document.querySelectorAll('.type-btn').forEach(b =>
    b.addEventListener('click', () => applyType(b.dataset.type))
  );

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab =>
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderTransactions();
    })
  );

  // Search
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear');

  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    searchClearBtn.style.display = searchQuery ? 'block' : 'none';
    renderTransactions();
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderTransactions();
  });

  // Month navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    document.getElementById('current-month').textContent = monthName(viewMonth, viewYear);
    rerenderActive();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    document.getElementById('current-month').textContent = monthName(viewMonth, viewYear);
    rerenderActive();
  });

  // Theme support
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');

  let currentTheme = localStorage.getItem('mm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('mm_theme', currentTheme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (currentTheme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }

  document.getElementById('amount-currency-symbol').textContent = getCurrencySymbol();
  buildCategoryGrid();
  document.getElementById('current-month').textContent = monthName(viewMonth, viewYear);
  switchView('dashboard');
});

function rerenderActive() {
  const active = document.querySelector('.view.active')?.id?.replace('view-', '');
  if (active === 'dashboard') renderDashboard();
  if (active === 'transactions') renderTransactions();
  if (active === 'budget') renderBudget();
  if (active === 'reports') renderReports();
  if (active === 'settings') renderSettings();
}
