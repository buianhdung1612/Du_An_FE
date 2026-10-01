import { apiApp } from "@shared/api";

const BASE_URL = "/api/v1/admin/tasks";

export const getTasks = async () => {
    const response = await apiApp.get(`${BASE_URL}`);
    return response.data;
};

export const createTask = async (data: any) => {
    const response = await apiApp.post(`${BASE_URL}/create`, data);
    return response.data;
};

export const editTask = async (id: string, data: any) => {
    const response = await apiApp.patch(`${BASE_URL}/edit/${id}`, data);
    return response.data;
};

export const deleteTask = async (id: string) => {
    const response = await apiApp.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
};
