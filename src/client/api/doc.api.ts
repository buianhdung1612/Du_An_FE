import { apiApp } from '@shared/api';

const BASE_URL = '/api/v1/docs';

export const getCategories = async () => {
    const response = await apiApp.get(`${BASE_URL}/categories`);
    return response.data;
};

export const getArticlesByCategory = async (categorySlug: string) => {
    const response = await apiApp.get(`${BASE_URL}/categories/${categorySlug}`);
    return response.data;
};

export const getArticleDetail = async (articleSlug: string) => {
    const response = await apiApp.get(`${BASE_URL}/articles/${articleSlug}`);
    return response.data;
};
