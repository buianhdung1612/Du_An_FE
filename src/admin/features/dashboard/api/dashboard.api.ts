import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';

const BASE_URL = '/api/v1/admin/dashboard';

const withAuth = () => {
    const token = Cookies.get("tokenAdmin");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

import { mockEcommerceStats, mockAnalyticsStats, mockSystemStats } from '@shared/data/dashboard';


export const getEcommerceStats = async () => {
    return {
        success: true,
        data: mockEcommerceStats
    };
};

export const getAnalyticsStats = async () => {
    return {
        success: true,
        data: mockAnalyticsStats
    };
};

export const getSystemStats = async () => {
    return {
        success: true,
        data: mockSystemStats
    };
};


export const getStaffingStatus = async (date?: string) => {
    const response = await apiApp.get(`${BASE_URL}/staffing-status`, {
        ...withAuth(),
        params: { date }
    });
    return response.data;
};

export const getDetailedServiceStats = async (startDate?: string, endDate?: string) => {
    const response = await apiApp.get(`${BASE_URL}/detailed-service-stats`, {
        ...withAuth(),
        params: { startDate, endDate }
    });
    return response.data;
};

export const getDetailedOrderStats = async (startDate?: string, endDate?: string) => {
    const response = await apiApp.get(`${BASE_URL}/detailed-order-stats`, {
        ...withAuth(),
        params: { startDate, endDate }
    });
    return response.data;
};

export const getDetailedBoardingStats = async () => {
    const response = await apiApp.get(`${BASE_URL}/detailed-boarding-stats`, withAuth());
    return response.data;
};

export const getDetailedStaffStats = async (startDate?: string, endDate?: string) => {
    const response = await apiApp.get(`${BASE_URL}/detailed-staff-stats`, {
        ...withAuth(),
        params: { startDate, endDate }
    });
    return response.data;
};



