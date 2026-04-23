import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';

const BASE_URL = '/api/v1/admin/daily-summaries';

const withAuth = () => {
    const token = Cookies.get("tokenAdmin");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getTodayContent = async (date: string) => {
    const response = await apiApp.get(`${BASE_URL}/today-content`, {
        params: { date },
        ...withAuth()
    });
    return response.data;
};

export const getSummaryByDate = async (date: string) => {
    const response = await apiApp.get(`${BASE_URL}/getByDate`, {
        params: { date },
        ...withAuth()
    });
    return response.data;
};

export const upsertSummary = async (data: any) => {
    const response = await apiApp.post(`${BASE_URL}/upsert`, data, withAuth());
    return response.data;
};
