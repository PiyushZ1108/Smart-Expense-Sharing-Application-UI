const API_BASE = 'http://localhost:3000';

export const api = {
  // Users
  getUsers: () => fetch(`${API_BASE}/users`).then(res => res.json()),
  createUser: (data) => fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Expenses
  getExpenses: () => fetch(`${API_BASE}/expenses`).then(res => res.json()),
  createExpense: (data) => fetch(`${API_BASE}/expenses/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteExpense: (id) => fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Balances
  getBalances: () => fetch(`${API_BASE}/expenses/balances`).then(res => res.json()),
  getSettlements: () => fetch(`${API_BASE}/expenses/settlements`).then(res => res.json()),
};
