# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build system. Open `index.html` directly in a browser:

```bash
# Simple local server (Python)
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

Single-page vanilla JS app — no framework, no bundler, no dependencies to install.

**Three files:**
- `index.html` — Static shell with all four view sections (`#view-dashboard`, `#view-transactions`, `#view-budget`, `#view-reports`) always in the DOM; only one has `class="active"` at a time.
- `style.css` — Dark theme using CSS custom properties defined in `:root`. All colors reference CSS vars (`--income`, `--expense`, `--accent`, etc.).
- `app.js` — All application logic in one file.

**State management (app.js):**
- `transactions` and `budgets` are module-level arrays/objects, read from `localStorage` on load (`mm_transactions`, `mm_budgets` keys).
- `viewYear`/`viewMonth` control the active month for filtering.
- View switching calls `switchView(name)` which toggles `.active` CSS class and re-renders the target view.

**Key patterns:**
- Views are rendered by `renderDashboard()`, `renderTransactions()`, `renderBudget()`, `renderReports()` — these rebuild innerHTML from scratch on each call.
- Chart.js instances (`categoryChart`, `monthlyChart`, `comparisonChart`) are destroyed and recreated on each render to avoid canvas conflicts.
- `txItemHTML(t, showDel)` generates transaction list item HTML; delete button calls `deleteTx(id)` inline via `onclick`.
- Categories are defined in the `CATEGORIES` object; `EXPENSE_CATS` and `INCOME_CATS` arrays control which appear in the modal per transaction type.

**External CDN dependencies:**
- Chart.js (jsdelivr)
- Font Awesome 6.4.0 (cdnjs)
- Inter font (Google Fonts)
