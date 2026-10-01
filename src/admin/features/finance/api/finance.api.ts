import { apiApp } from "../../../shared/api/core";

const PREFIX = "/api/v1/admin/finance";

// --- Categories ---
export const getCategories = () => apiApp.get(`${PREFIX}/categories`);
export const createCategory = (data: any) => apiApp.post(`${PREFIX}/categories/create`, data);

// --- Transactions ---
export const getTransactions = (params?: any) => apiApp.get(`${PREFIX}/transactions`, { params });
export const createTransaction = (data: any) => apiApp.post(`${PREFIX}/transactions/create`, data);
export const editTransaction = (id: string, data: any) => apiApp.patch(`${PREFIX}/transactions/edit/${id}`, data);
export const deleteTransaction = (id: string) => apiApp.delete(`${PREFIX}/transactions/delete/${id}`);

// --- Budgets ---
export const getBudgets = (params?: { period?: string }) => apiApp.get(`${PREFIX}/budgets`, { params });
export const upsertBudget = (data: { categoryId: string, period: string, amount: number }) =>
    apiApp.post(`${PREFIX}/budgets/upsert`, data);

// --- Saving Goals ---
export const getSavingGoals = () => apiApp.get(`${PREFIX}/saving-goals`);
export const createSavingGoal = (data: any) => apiApp.post(`${PREFIX}/saving-goals/create`, data);
export const addFundsToGoal = (id: string, amount: number) =>
    apiApp.patch(`${PREFIX}/saving-goals/add-funds/${id}`, { amount });

// --- Statistics & Reports ---
export const getFinancialSummary = (params: { month: number, year: number }) =>
    apiApp.get(`${PREFIX}/stats/summary`, { params });
export const getBreakdownStats = (params?: { startDate?: string, endDate?: string }) =>
    apiApp.get(`${PREFIX}/stats/breakdown`, { params });
export const getTrendStats = () => apiApp.get(`${PREFIX}/stats/trends`);
