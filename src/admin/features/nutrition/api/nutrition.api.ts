import { apiApp } from "@shared/api";

export const getNutritionByDate = async (date: string) => {
    const response = await apiApp.get(`/admin/nutrition?date=${date}`);
    return response.data;
};

export const saveNutrition = async (data: any) => {
    const response = await apiApp.post(`/admin/nutrition/save`, data);
    return response.data;
};

export const analyzeFoodAI = async (content: string) => {
    const response = await apiApp.post(`/admin/ai`, {
        content,
        action: 'nutrition_assistant'
    });
    return response.data;
};
