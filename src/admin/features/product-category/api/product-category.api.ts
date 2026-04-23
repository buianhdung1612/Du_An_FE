import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';
import { CategoryNode } from '@shared/components/ui/CategoryTreeSelect';
import { ApiResponse } from '@shared/config/type';

const BASE_URL = '/api/v1/admin/product/category';

/** Header auth dùng chung cho product-categories */
const withAuth = () => {
    const token = Cookies.get("tokenAdmin");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getCategories = async (params?: any): Promise<ApiResponse<any>> => {
    const response = await apiApp.get(`${BASE_URL}/list`, {
        params,
        ...withAuth()
    });
    return response.data;
};


export const getNestedCategories = async (): Promise<ApiResponse<CategoryNode[]>> => {
    const response = await apiApp.get(`${BASE_URL}/nested`, withAuth());
    return response.data;
};


/** Tạo danh mục */
export const createCategory = async (data: any): Promise<any> => {
    const response = await apiApp.post(`${BASE_URL}/create`, data, withAuth());
    return response.data;
};

/** Chi tiết */
export const getCategoryById = async (id: string | number): Promise<any> => {
    const response = await apiApp.get(`${BASE_URL}/detail/${id}`, withAuth());
    return response.data;
};


/** Cập nhật danh mục */
export const updateCategory = async (id: string | number, data: any): Promise<any> => {
    const response = await apiApp.patch(`${BASE_URL}/edit/${id}`, data, withAuth());
    return response.data;
};

/** Xóa */
export const deleteCategory = async (id: string | number): Promise<any> => {
    const response = await apiApp.patch(`${BASE_URL}/delete/${id}`, {}, withAuth());
    return response.data;
};

/** Khôi phục */
export const restoreCategory = async (id: string | number): Promise<any> => {
    const response = await apiApp.patch(`${BASE_URL}/restore/${id}`, {}, withAuth());
    return response.data;
};

/** Xóa vĩnh viễn */
export const forceDeleteCategory = async (id: string | number): Promise<any> => {
    const response = await apiApp.delete(`${BASE_URL}/force-delete/${id}`, withAuth());
    return response.data;
};

// --- Helper functions ---

/** Generate slug từ name */
export const generateSlug = (name: string): string => {
    return name
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
