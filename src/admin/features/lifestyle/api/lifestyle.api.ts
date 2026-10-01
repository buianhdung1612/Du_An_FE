import { apiApp } from "@shared/api";

const PREFIX = "/admin";

export const getWorkouts = () => apiApp.get(`${PREFIX}/workouts`);
export const createWorkout = (data: any) => apiApp.post(`${PREFIX}/workouts/create`, data);
export const editWorkout = (id: string, data: any) => apiApp.patch(`${PREFIX}/workouts/edit/${id}`, data);
export const deleteWorkout = (id: string) => apiApp.delete(`${PREFIX}/workouts/delete/${id}`);

export const getNutrition = (date?: string) => apiApp.get(`${PREFIX}/nutrition`, { params: { date } });
export const saveNutrition = (data: any) => apiApp.post(`${PREFIX}/nutrition/save`, data);

export const getFinance = () => apiApp.get(`${PREFIX}/finance`);
export const createFinance = (data: any) => apiApp.post(`${PREFIX}/finance/create`, data);
export const deleteFinance = (id: string) => apiApp.delete(`${PREFIX}/finance/delete/${id}`);
