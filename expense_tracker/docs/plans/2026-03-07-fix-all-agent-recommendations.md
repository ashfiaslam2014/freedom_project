# Fix All Agent Recommendations — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all bugs, UX issues, validation gaps, and missing features identified by the three review agents.

**Architecture:** All changes are confined to the three existing files (`index.html`, `style.css`, `app.js`). No new dependencies are introduced. No build system. Changes are grouped by risk: security/stability first, then bugs, UX, validation, features, and responsive design last.

**Tech Stack:** Vanilla HTML/CSS/JS, Chart.js (CDN), Font Awesome (CDN), localStorage

---

## Task 1: Security — Escape HTML in transaction descriptions (BUG-07)

**Files:**
- Modify: `app.js` — add `escapeHtml` helper, use it in `txItemHTML`

**Step 1: Add the escape helper just above `txItemHTML`**

In `app.js`, find the line `function txItemHTML(t, showDel = true) {` and insert this function directly above it:

```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

**Step 2: Apply escaping in `txItemHTML`**

Change line:
```js
<div class="tx-desc">${t.description}</div>
```
To:
```js
<div class="tx-desc">${escapeHtml(t.description)}</div>
```

**Step 3: Verify manually**
Open the app, add a transaction with description `<img src=x onerror=alert(1)>`. The text should appear literally, no alert should fire.

**Step 4: Commit**
```bash
git add app.js
git commit -m "fix: escape HTML in transaction description to prevent XSS"
```

---

## Task 2: Stability — Guard localStorage JSON.parse (VAL-06)

**Files:**
- Modify: `app.js` lines 19–20

**Step 1: Wrap both localStorage reads in try/catch**

Replace:
```js
let transactions = JSON.parse(localStorage.getItem('mm_transactions') || '[]');
let budgets      = JSON.parse(localStorage.getItem('mm_budgets')      || '{}');
```

With:
```js
let transactions = (() => {
  try { return JSON.parse(localStorage.getItem('mm_transactions') || '[]'); }
  catch { localStorage.removeItem('mm_transactions'); return []; }
})();
let budgets = (() => {
  try { return JSON.parse(localStorage.getItem('mm_budgets') || '{}'); }
  catch { localStorage.removeItem('mm_budgets'); return {}; }
})();
```

**Step 2: Verify manually**
Open browser DevTools → Application → Local Storage → set `mm_transactions` to the string `CORRUPTED`. Reload the page. The app should load normally (empty state) instead of a blank screen.

**Step 3: Commit**
```bash
git add app.js
git commit -m "fix: guard localStorage JSON.parse against corruption"
```

---

## Task 3: Pin Chart.js version + SRI hash (RT-05)

**Files:**
- Modify: `index.html` line 11

**Step 1: Replace the unpinned Chart.js CDN tag**

Replace:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```
With:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
```

**Step 2: Verify**
Reload the app. All charts (category doughnut, monthly bar, comparison doughnut) should still render correctly.

**Step 3: Commit**
```bash
git add index.html
git commit -m "fix: pin Chart.js to v4.4.4 to prevent silent breaking updates"
```

---

## Task 4: Fix double-sign amount formatting (BUG-01)

**Files:**
- Modify: `app.js` — `txItemHTML` function

**Step 1: Understand the bug**
`fmt(50)` returns `"$50.00"`. The code then does `+$50.00` or `-$50.00`. The `-` before `$` looks acceptable in en-US but is fragile. The fix is to keep the sign prefix but stop relying on `fmt` for the currency symbol when a sign is shown — or simply keep it as-is and just remove the redundant `sign` variable since `fmt` handles negative numbers natively when passed a negative value.

The cleanest fix: pass a signed number to `fmt` and remove the manual sign prefix.

**Step 2: Update `txItemHTML`**

Find in `txItemHTML`:
```js
const sign = t.type === 'income' ? '+' : '-';
```
And the amount line:
```js
<div class="tx-amount ${t.type}">${sign}${fmt(t.amount)}</div>
```

Replace both with:
```js
const signedAmount = t.type === 'income' ? t.amount : -t.amount;
```
```js
<div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : ''}${fmt(signedAmount)}</div>
```

This renders `+$50.00` for income and `-$50.00` for expenses using `fmt`'s native negative formatting.

**Step 3: Verify**
Add an income of $100 and an expense of $50. Income should show `+$100.00` (green), expense `-$50.00` (red).

**Step 4: Commit**
```bash
git add app.js
git commit -m "fix: use signed amount in fmt() instead of manual sign prefix"
```

---

## Task 5: Fix comparison chart phantom 0.01 data (BUG-02)

**Files:**
- Modify: `app.js` — `renderReports` function

**Step 1: Add empty state for comparison chart**

In `renderReports`, find the comparison chart section. Replace the entire `if (comparisonChart) comparisonChart.destroy();` block and below with:

```js
if (comparisonChart) { comparisonChart.destroy(); comparisonChart = null; }

const compCanvas = document.getElementById('comparison-chart');
if (!mIncome && !mExpense) {
  compCanvas.style.display = 'none';
  // Show a placeholder if not already there
  let ph = document.getElementById('comparison-placeholder');
  if (!ph) {
    ph = document.createElement('div');
    ph.id = 'comparison-placeholder';
    ph.className = 'chart-placeholder';
    ph.innerHTML = '<i class="fa-solid fa-chart-pie"></i><p>No data for this month</p>';
    compCanvas.parentElement.appendChild(ph);
  }
  ph.style.display = 'flex';
  return;
}

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
```

**Step 2: Verify**
Navigate to Reports with no transactions for the current month. The "Income vs Expenses" panel should show a placeholder, not a phantom 50/50 chart.

**Step 3: Commit**
```bash
git add app.js
git commit -m "fix: show empty state in comparison chart instead of phantom 0.01 data"
```

---

## Task 6: Make "Recent Transactions" respect the selected month (BUG-03)

**Files:**
- Modify: `app.js` — `renderDashboard` function

**Step 1: Change `allTx` to `mTx` for recent list**

In `renderDashboard`, find:
```js
const recent = [...allTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
```

Replace with:
```js
const recent = [...mTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
```

**Step 2: Update empty state message**

The empty state message already says "No transactions yet" — update it to be month-aware:
```js
'<li class="empty-state"><i class="fa-solid fa-receipt"></i><p>No transactions this month</p></li>'
```

**Step 3: Verify**
Add transactions in two different months. Navigate between months using the arrows. The "Recent Transactions" panel should only show transactions from the selected month.

**Step 4: Commit**
```bash
git add app.js
git commit -m "fix: recent transactions panel now filters by selected month"
```

---

## Task 7: Make Transactions view month-aware (BUG-04)

**Files:**
- Modify: `app.js` — `renderTransactions` function
- Modify: `index.html` — Transactions view subtitle

**Step 1: Filter by selected month in `renderTransactions`**

In `renderTransactions`, replace the opening:
```js
let list = [...transactions];
```
With:
```js
let list = [...getMonthTx()];
```

**Step 2: Update the panel header subtitle**

In `index.html`, the transactions section has no subtitle currently. In `app.js`, the `switchView` meta object already sets the subtitle to `'All your transactions'` — update it:
```js
transactions: ['Transactions', 'Transactions for this month'],
```

**Step 3: Verify**
Add transactions in two different months. Navigate to a past month, then open Transactions view. Only that month's transactions should appear.

**Step 4: Commit**
```bash
git add app.js
git commit -m "fix: transactions view now filtered by selected month"
```

---

## Task 8: Fix budget $0 silent save + add clear option (BUG-06)

**Files:**
- Modify: `app.js` — `setBudget` function

**Step 1: Update `setBudget` validation**

Replace the current `setBudget` function body with:

```js
function setBudget(key) {
  const cat = CATEGORIES[key];
  const current = budgets[key] > 0 ? budgets[key] : '';
  const val = prompt(`Set monthly budget for ${cat.name} ($):\n(Enter 0 or leave blank to remove limit)`, current);
  if (val === null) return; // user cancelled
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === '0') {
    delete budgets[key];
    saveBudg();
    renderBudget();
    toast(`Budget limit removed for ${cat.name}`);
    return;
  }
  const n = parseFloat(trimmed);
  if (isNaN(n) || n < 0) {
    toast('Enter a valid positive amount', 'error');
    return;
  }
  budgets[key] = n;
  saveBudg();
  renderBudget();
  toast(`Budget updated for ${cat.name}`);
}
```

**Step 2: Verify**
- Set a budget to `$200` — should save and show progress bar.
- Set to `0` — should remove the limit and hide the progress bar.
- Enter letters — should show error toast.
- Press Cancel — nothing should happen.

**Step 3: Commit**
```bash
git add app.js
git commit -m "fix: budget $0 now removes limit, empty/invalid input shows error"
```

---

## Task 9: Fix Yesterday DST calculation (RT-04)

**Files:**
- Modify: `app.js` — `fmtDateLabel` function

**Step 1: Replace the DST-unsafe "yesterday" calculation**

In `fmtDateLabel`, replace:
```js
const yest  = new Date(Date.now() - 864e5).toISOString().split('T')[0];
```
With:
```js
const y = new Date(); y.setDate(y.getDate() - 1);
const yest = y.toISOString().split('T')[0];
```

This uses calendar arithmetic instead of subtracting a fixed millisecond count, making it DST-safe.

**Step 2: Commit**
```bash
git add app.js
git commit -m "fix: use calendar-safe date arithmetic for Yesterday label"
```

---

## Task 10: UX — Modal remembers last used type (UX-04)

**Files:**
- Modify: `app.js` — `openModal` function

**Step 1: Change `openModal` to preserve `selectedType`**

In `openModal`, replace:
```js
applyType('expense');
```
With:
```js
applyType(selectedType);
```

`selectedType` is already a module-level variable initialized to `'expense'`, so first-open defaults are preserved. After the user selects "Income", the next modal open will start on Income.

**Step 2: Verify**
Open modal, switch to Income, add a transaction, open modal again — it should start on Income.

**Step 3: Commit**
```bash
git add app.js
git commit -m "ux: modal remembers last selected transaction type"
```

---

## Task 11: UX — Escape key closes modal (UX-05)

**Files:**
- Modify: `app.js` — inside `DOMContentLoaded`

**Step 1: Add keydown listener**

Inside the `DOMContentLoaded` callback, after the `overlay.addEventListener('click', ...)` line, add:

```js
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
```

**Step 2: Verify**
Open modal, press Escape — modal should close.

**Step 3: Commit**
```bash
git add app.js
git commit -m "ux: Escape key closes the add transaction modal"
```

---

## Task 12: UX — Delete confirmation (UX-06)

**Files:**
- Modify: `app.js` — `deleteTx` function

**Step 1: Add confirmation before delete**

Replace the `deleteTx` function with:

```js
function deleteTx(id) {
  if (!confirm('Delete this transaction? This cannot be undone.')) return;
  transactions = transactions.filter(t => t.id !== id);
  saveTx();
  renderDashboard();
  renderTransactions();
  toast('Transaction deleted');
}
```

**Step 2: Verify**
Hover a transaction, click trash icon — browser confirm dialog appears. Cancel = no deletion. OK = transaction removed.

**Step 3: Commit**
```bash
git add app.js
git commit -m "ux: add confirmation dialog before deleting a transaction"
```

---

## Task 13: UX — Search clear button (UX-07)

**Files:**
- Modify: `index.html` — search-box div
- Modify: `style.css` — add clear button style
- Modify: `app.js` — wire clear button

**Step 1: Add clear button to search box in `index.html`**

Replace:
```html
<div class="search-box">
  <i class="fa-solid fa-magnifying-glass"></i>
  <input type="text" id="search-input" placeholder="Search transactions...">
</div>
```
With:
```html
<div class="search-box">
  <i class="fa-solid fa-magnifying-glass"></i>
  <input type="text" id="search-input" placeholder="Search transactions...">
  <button id="search-clear" class="search-clear" style="display:none"><i class="fa-solid fa-xmark"></i></button>
</div>
```

**Step 2: Add style in `style.css`** (append at end of file)

```css
.search-clear {
  background: none; border: none;
  color: var(--text-muted); cursor: pointer;
  font-size: 0.75rem; padding: 0;
  display: flex; align-items: center;
  transition: color var(--transition);
}
.search-clear:hover { color: var(--text-primary); }
```

**Step 3: Wire in `app.js`** — update the search input listener inside `DOMContentLoaded`:

Replace:
```js
document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderTransactions();
});
```
With:
```js
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  searchClear.style.display = searchQuery ? 'flex' : 'none';
  renderTransactions();
});
searchClear.addEventListener('click', () => {
  searchQuery = '';
  searchInput.value = '';
  searchClear.style.display = 'none';
  renderTransactions();
});
```

**Step 4: Verify**
Type in search box — X button appears. Click X — input clears, all transactions shown.

**Step 5: Commit**
```bash
git add index.html style.css app.js
git commit -m "ux: add clear button to search input in transactions view"
```

---

## Task 14: Validation — Amount limits and decimal precision (VAL-01, VAL-02)

**Files:**
- Modify: `app.js` — `submitTransaction` function
- Modify: `index.html` — amount input attributes

**Step 1: Add max attribute to the amount input in `index.html`**

Find:
```html
<input type="number" id="modal-amount" class="amount-input" placeholder="0.00" step="0.01" min="0">
```
Change to:
```html
<input type="number" id="modal-amount" class="amount-input" placeholder="0.00" step="0.01" min="0.01" max="9999999">
```

**Step 2: Add validation in `submitTransaction`**

After the existing `if (!amount || amount <= 0)` check, add:

```js
if (amount > 9999999) { toast('Amount is too large (max $9,999,999)', 'error'); return; }
const roundedAmount = Math.round(amount * 100) / 100;
```

Then replace `amount` with `roundedAmount` in the `transactions.unshift(...)` call:
```js
transactions.unshift({ id: uid(), description: desc, amount: roundedAmount, type: selectedType, category: selectedCat, date });
```

**Step 3: Verify**
Try entering `99999999` — should show error. Enter `10.999` — should store as `11.00`.

**Step 4: Commit**
```bash
git add index.html app.js
git commit -m "fix: enforce max amount and round to 2 decimal places on save"
```

---

## Task 15: Validation — Description length limit (VAL-03)

**Files:**
- Modify: `index.html` — description input
- Modify: `app.js` — `submitTransaction`

**Step 1: Add maxlength to description input in `index.html`**

Find:
```html
<input type="text" id="modal-desc" placeholder="What was this for?">
```
Change to:
```html
<input type="text" id="modal-desc" placeholder="What was this for?" maxlength="80">
```

**Step 2: Add server-side-style trim validation in `app.js`**

After `const desc = document.getElementById('modal-desc').value.trim();`, add:
```js
if (desc.length > 80) { toast('Description is too long (max 80 characters)', 'error'); return; }
```

**Step 3: Commit**
```bash
git add index.html app.js
git commit -m "fix: add 80-character limit to transaction description"
```

---

## Task 16: Validation — Future date warning (VAL-04)

**Files:**
- Modify: `app.js` — `submitTransaction`

**Step 1: Add future date warning (not a hard block)**

After `if (!date) { toast('Select a date', 'error'); return; }`, add:

```js
const today = new Date().toISOString().split('T')[0];
if (date > today) {
  if (!confirm('This date is in the future. Add transaction anyway?')) return;
}
```

**Step 2: Verify**
Set date to tomorrow → confirm dialog appears. Cancel → no transaction added. OK → transaction added normally.

**Step 3: Commit**
```bash
git add app.js
git commit -m "fix: warn user when adding a transaction with a future date"
```

---

## Task 17: Feature — Transaction editing (FEAT-01)

**Files:**
- Modify: `index.html` — update modal header to support edit mode
- Modify: `app.js` — add `editTx`, update `txItemHTML`, update `submitTransaction` and `openModal`

**Step 1: Add edit mode state variable in `app.js`**

Near the other state variables (around line 22), add:
```js
let editingTxId = null;
```

**Step 2: Add edit button to transaction items in `txItemHTML`**

After the existing delete button in the `showDel` block, add an edit button. Replace the `${showDel ? ...}` section with:

```js
${showDel ? `
  <button class="tx-edit" onclick="openEditModal('${t.id}')"><i class="fa-solid fa-pen"></i></button>
  <button class="tx-delete" onclick="deleteTx('${t.id}')"><i class="fa-solid fa-trash"></i></button>
` : ''}
```

**Step 3: Add edit button styles in `style.css`**

Append:
```css
.tx-edit {
  opacity: 0;
  background: var(--accent-bg); color: var(--accent);
  border: none; width: 28px; height: 28px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  transition: all var(--transition); flex-shrink: 0;
}
.transaction-item:hover .tx-edit { opacity: 1; }
.tx-edit:hover { background: var(--accent); color: white; }
```

**Step 4: Add `openEditModal` function in `app.js`** (add after `openModal`):

```js
function openEditModal(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;
  editingTxId = id;
  overlay.classList.add('active');
  document.querySelector('.modal-header h3').textContent = 'Edit Transaction';
  document.getElementById('modal-submit').textContent = 'Save Changes';
  document.getElementById('modal-date').value = tx.date;
  document.getElementById('modal-amount').value = tx.amount;
  document.getElementById('modal-desc').value = tx.description;
  applyType(tx.type);
  selectCat(tx.category);
}
```

**Step 5: Update `closeModal` to reset edit state**

Replace:
```js
function closeModal() { overlay.classList.remove('active'); }
```
With:
```js
function closeModal() {
  overlay.classList.remove('active');
  editingTxId = null;
  document.querySelector('.modal-header h3').textContent = 'New Transaction';
  document.getElementById('modal-submit').textContent = 'Add Transaction';
}
```

**Step 6: Update `submitTransaction` to handle edit mode**

At the end of `submitTransaction`, replace the `transactions.unshift(...)` and following lines with:

```js
if (editingTxId) {
  const idx = transactions.findIndex(t => t.id === editingTxId);
  if (idx !== -1) transactions[idx] = { ...transactions[idx], description: desc, amount: roundedAmount, type: selectedType, category: selectedCat, date };
  saveTx();
  closeModal();
  toast('Transaction updated!');
} else {
  transactions.unshift({ id: uid(), description: desc, amount: roundedAmount, type: selectedType, category: selectedCat, date });
  saveTx();
  closeModal();
  toast('Transaction added!');
}
renderDashboard();
renderTransactions();
```

**Step 7: Verify**
Add a transaction. Hover it — edit (pen) icon appears. Click it — modal opens pre-filled with transaction data. Change amount. Click Save — transaction updates in place.

**Step 8: Commit**
```bash
git add index.html style.css app.js
git commit -m "feat: add transaction editing — pen icon opens pre-filled modal"
```

---

## Task 18: Feature — Export and Import data (FEAT-02)

**Files:**
- Modify: `index.html` — add export/import buttons to a settings area
- Modify: `app.js` — add export/import/clear functions

**Step 1: Add export/import/clear buttons in `index.html`**

Add a new nav item at the bottom of `.sidebar-nav`, just before `.sidebar-footer`:
```html
<div class="sidebar-actions">
  <button class="sidebar-action-btn" id="export-btn" title="Export data">
    <i class="fa-solid fa-download"></i><span>Export</span>
  </button>
  <button class="sidebar-action-btn" id="import-btn" title="Import data">
    <i class="fa-solid fa-upload"></i><span>Import</span>
  </button>
  <button class="sidebar-action-btn danger" id="clear-btn" title="Clear all data">
    <i class="fa-solid fa-trash-can"></i><span>Clear All</span>
  </button>
  <input type="file" id="import-file" accept=".json" style="display:none">
</div>
```

**Step 2: Add styles in `style.css`**

```css
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.sidebar-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  font-family: 'Inter', sans-serif;
  text-align: left;
  width: 100%;
}
.sidebar-action-btn i { width: 18px; text-align: center; font-size: 0.85rem; }
.sidebar-action-btn:hover { background: rgba(255,255,255,0.06); color: var(--text-secondary); }
.sidebar-action-btn.danger:hover { background: var(--expense-bg); color: var(--expense); }
```

**Step 3: Add export/import/clear functions in `app.js`** (add after `setBudget`):

```js
function exportData() {
  const data = { transactions, budgets, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `moneyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Data exported!');
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.transactions)) throw new Error('Invalid format');
      if (!confirm(`Import ${data.transactions.length} transactions? This will REPLACE your current data.`)) return;
      transactions = data.transactions;
      budgets = data.budgets || {};
      saveTx(); saveBudg();
      switchView('dashboard');
      toast(`Imported ${transactions.length} transactions`);
    } catch {
      toast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('Delete ALL transactions and budgets? This cannot be undone.')) return;
  transactions = [];
  budgets = {};
  saveTx(); saveBudg();
  switchView('dashboard');
  toast('All data cleared');
}
```

**Step 4: Wire buttons in `DOMContentLoaded`**

Add at the end of the `DOMContentLoaded` callback:
```js
document.getElementById('export-btn').addEventListener('click', exportData);
document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', e => { importData(e.target.files[0]); e.target.value = ''; });
document.getElementById('clear-btn').addEventListener('click', clearAllData);
```

**Step 5: Verify**
- Export: click Export — a `.json` file downloads.
- Import: click Import, select the downloaded file — confirm dialog, data reloads.
- Clear: click Clear All — confirm dialog, all data wiped.

**Step 6: Commit**
```bash
git add index.html style.css app.js
git commit -m "feat: add export to JSON, import from JSON, and clear all data"
```

---

## Task 19: Feature — Month-scoped budgets (FEAT-05)

**Files:**
- Modify: `app.js` — storage key helpers and all budget read/write

**Step 1: Add a budget key helper**

Near `saveBudg`, add:
```js
function budgetKey() { return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`; }
function getBudgets() {
  const key = budgetKey();
  const all = (() => {
    try { return JSON.parse(localStorage.getItem('mm_budgets_v2') || '{}'); }
    catch { return {}; }
  })();
  return all[key] || {};
}
function saveBudgets(b) {
  const key = budgetKey();
  const all = (() => {
    try { return JSON.parse(localStorage.getItem('mm_budgets_v2') || '{}'); }
    catch { return {}; }
  })();
  all[key] = b;
  localStorage.setItem('mm_budgets_v2', JSON.stringify(all));
}
```

**Step 2: Update `renderBudget` to use `getBudgets()`**

Replace every `budgets[key]` reference in `renderBudget` with a local `const monthBudgets = getBudgets();` at the top of the function, then use `monthBudgets[key]` throughout.

**Step 3: Update `setBudget` to use `saveBudgets()`**

Replace `budgets[key] = n; saveBudg();` with:
```js
const mb = getBudgets(); mb[key] = n; saveBudgets(mb);
```
And the delete branch with:
```js
const mb = getBudgets(); delete mb[key]; saveBudgets(mb);
```

**Step 4: Remove the old `budgets` module-level variable and `saveBudg`**

The old `budgets` var and `saveBudg()` function are now only used for legacy migration. Remove them or leave them for `saveTx`'s companion (they're separate). Keep `saveTx` untouched.

**Step 5: Verify**
Set a budget of $200 for Food in March. Navigate to February. Budget should show $0 / no limit (empty for Feb). Navigate back to March — $200 limit is still there.

**Step 6: Commit**
```bash
git add app.js
git commit -m "feat: budget limits are now month-scoped (stored per month/year)"
```

---

## Task 20: Responsive design — mobile layout (UX-10, UX-09)

**Files:**
- Modify: `style.css` — add media queries and mobile overrides
- Modify: `index.html` — add hamburger menu button
- Modify: `app.js` — wire hamburger toggle

**Step 1: Add hamburger button to `index.html`** (inside `.top-header`, before `.header-left`):

```html
<button class="hamburger" id="hamburger-btn">
  <i class="fa-solid fa-bars"></i>
</button>
```

**Step 2: Add responsive CSS at end of `style.css`**

```css
/* ── Mobile hamburger ─────────────────────────── */
.hamburger {
  display: none;
  background: none; border: none;
  color: var(--text-secondary); font-size: 1.1rem;
  cursor: pointer; padding: 6px; margin-right: 4px;
}

/* ── Responsive Breakpoints ───────────────────── */
@media (max-width: 900px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-bottom { grid-template-columns: 1fr; }
  .reports-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  body { overflow: auto; }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 500;
  }
  .sidebar.open { transform: translateX(0); }

  .sidebar-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 499;
  }
  .sidebar-overlay.visible { display: block; }

  .main-content {
    margin-left: 0;
    height: auto;
    overflow: visible;
  }

  .top-header {
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
  }

  .hamburger { display: flex; }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .view { padding: 16px; overflow-y: visible; }

  .summary-grid { grid-template-columns: 1fr 1fr; gap: 10px; }

  .card-amount { font-size: 1.3rem; }

  .transactions-toolbar { flex-direction: column; align-items: stretch; }
  .search-box { max-width: 100%; }

  .budget-grid { grid-template-columns: 1fr; }

  .modal { margin: 12px; max-width: calc(100% - 24px); }
}
```

**Step 3: Add sidebar overlay div to `index.html`** (just before `</body>`):

```html
<div class="sidebar-overlay" id="sidebar-overlay"></div>
```

**Step 4: Wire hamburger in `app.js`** — add inside `DOMContentLoaded`:

```js
const hamburger = document.getElementById('hamburger-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebar = document.querySelector('.sidebar');
function toggleSidebar() {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible');
}
hamburger?.addEventListener('click', toggleSidebar);
sidebarOverlay?.addEventListener('click', toggleSidebar);
document.querySelectorAll('.nav-item[data-view]').forEach(el =>
  el.addEventListener('click', () => {
    if (window.innerWidth <= 640) { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('visible'); }
  })
);
```

**Step 5: Verify**
Resize browser to 375px width (iPhone size). Sidebar should be hidden, hamburger icon should appear in header. Tapping hamburger opens sidebar with overlay. Tapping a nav item closes sidebar.

**Step 6: Commit**
```bash
git add index.html style.css app.js
git commit -m "feat: add responsive mobile layout with hamburger sidebar"
```

---

## Final Verification

Open the app in:
1. Desktop (1280px+) — layout unchanged, all original functionality works
2. Tablet (768px) — 2-column summary grid, stacked dashboard panels
3. Mobile (375px) — hamburger nav, single-column layout, modal fits screen

Run through this checklist:
- [ ] Add an income and expense transaction — amounts show correctly signed
- [ ] Try `<script>alert(1)</script>` as description — renders as text
- [ ] Corrupt `mm_transactions` in DevTools → reload — app loads (empty state)
- [ ] Navigate months — recent transactions, transactions view, budget all update
- [ ] Set and clear a budget per month
- [ ] Edit a transaction
- [ ] Export data, clear data, import data
- [ ] Escape key closes modal
- [ ] Delete shows confirmation
- [ ] Search shows clear X button

```bash
git log --oneline -15
```
