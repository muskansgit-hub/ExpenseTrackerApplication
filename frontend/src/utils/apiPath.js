const BASE_URL = 'http://localhost:5000/api';

export const API_PATHS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  GET_USER: `${BASE_URL}/auth/user`,

  // Income
  ADD_INCOME: `${BASE_URL}/income/add`,
  GET_INCOMES: `${BASE_URL}/income/all`,
  DELETE_INCOME: (id) => `${BASE_URL}/income/${id}`,
  DOWNLOAD_INCOME: `${BASE_URL}/income/download`,

  // Expense
  ADD_EXPENSE: `${BASE_URL}/expense/add`,
  GET_EXPENSES: `${BASE_URL}/expense/all`,
  DELETE_EXPENSE: (id) => `${BASE_URL}/expense/${id}`,
  DOWNLOAD_EXPENSE: `${BASE_URL}/expense/download`,

  // Dashboard
  GET_DASHBOARD_STATS: `${BASE_URL}/dashboard/stats`,
};