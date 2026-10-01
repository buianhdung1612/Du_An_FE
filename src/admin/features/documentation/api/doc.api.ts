import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';
import { ApiResponse } from '@shared/config/type';

const BASE_URL = '/api/v1/admin/docs';

const withAuth = () => {
    const token = Cookies.get("tokenAdmin");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// --- Categories ---
export const getCategories = async (): Promise<ApiResponse<any>> => {
    const response = await apiApp.get(`${BASE_URL}/categories`, withAuth());
    return response.data;
};

export const createCategory = async (data: any): Promise<any> => {
    const response = await apiApp.post(`${BASE_URL}/categories`, data, withAuth());
    return response.data;
};

export const updateCategory = async (id: string, data: any): Promise<any> => {
    const response = await apiApp.patch(`${BASE_URL}/categories/${id}`, data, withAuth());
    return response.data;
};

export const deleteCategory = async (id: string): Promise<any> => {
    const response = await apiApp.delete(`${BASE_URL}/categories/${id}`, withAuth());
    return response.data;
};

// --- Articles ---
export const getArticles = async (params?: any): Promise<ApiResponse<any>> => {
    const response = await apiApp.get(`${BASE_URL}/articles`, { params, ...withAuth() });
    return response.data;
};

export const getArticleById = async (id: string): Promise<any> => {
    const response = await apiApp.get(`${BASE_URL}/articles/${id}`, withAuth());
    return response.data;
};

export const createArticle = async (data: any): Promise<any> => {
    const response = await apiApp.post(`${BASE_URL}/articles`, data, withAuth());
    return response.data;
};

export const updateArticle = async (id: string, data: any): Promise<any> => {
    const response = await apiApp.patch(`${BASE_URL}/articles/${id}`, data, withAuth());
    return response.data;
};

export const deleteArticle = async (id: string): Promise<any> => {
    const response = await apiApp.delete(`${BASE_URL}/articles/${id}`, withAuth());
    return response.data;
};

export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};
