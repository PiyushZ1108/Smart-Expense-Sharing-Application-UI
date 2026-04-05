import axios from 'axios';

// Base URL for the backend API. You can set REACT_APP_API_BASE in a .env file.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Create an Axios instance with the base URL.
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Users
  getUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data),

  // Expenses
  getExpenses: () => apiClient.get('/expenses/all'),
  createExpense: (data) => apiClient.post('/expenses/create', data),
  deleteExpense: (id) => apiClient.delete(`/expenses/${id}`),

  // Balances
  getBalances: () => apiClient.get('/expenses/balances'),
  getSettlements: () => apiClient.get('/expenses/settlements'),
};

