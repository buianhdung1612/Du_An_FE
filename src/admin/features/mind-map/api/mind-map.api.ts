import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';

const BASE_URL = '/api/v1/admin/mind-maps';

const withAuth = () => {
    const token = Cookies.get("tokenAdmin");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getMindMaps = async (params?: any) => {
    const response = await apiApp.get(`${BASE_URL}`, {
        ...withAuth(),
        params
    });
    return response.data;
};

export const getMindMapById = async (id: string) => {
    const response = await apiApp.get(`${BASE_URL}/detail/${id}`, withAuth());
    return response.data;
};

export const createMindMap = async (data: any) => {
    const response = await apiApp.post(`${BASE_URL}/create`, data, withAuth());
    return response.data;
};

export const updateMindMap = async (id: string, data: any) => {
    const response = await apiApp.patch(`${BASE_URL}/edit/${id}`, data, withAuth());
    return response.data;
};
