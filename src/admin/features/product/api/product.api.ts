import { apiApp } from '@shared/api';
import Cookies from 'js-cookie';
import { ApiResponse } from '@shared/config/type';
import { prefixAdmin } from '@shared/constants/routes';
import { mockProducts } from '@shared/data/products';
import { mockCategories } from '@shared/data/categories';

const BASE_URL = `/api/v1/${prefixAdmin}/product`;

/** Header auth dùng chung */
const withAuth = () => {
    const token = Cookies.get("tokenAdmin");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getProducts = async (params?: any): Promise<ApiResponse<any>> => {
    return {
        success: true,
        data: {
            recordList: mockProducts,
            pagination: {
                totalRecords: mockProducts.length,
                totalPages: 1,
                currentPage: params?.page || 1,
                limit: params?.limit || 10
            },
            statusCounts: {
                all: mockProducts.length,
                active: mockProducts.filter(p => p.status === 'active').length,
                inactive: mockProducts.filter(p => p.status === 'inactive').length,
            }
        }
    } as any;
};

export const getCreateProductData = async (): Promise<ApiResponse<any>> => {
    return {
        success: true,
        data: {
            categoryList: mockCategories,
            attributeList: [
                { _id: "A1", name: "Khối lượng", type: "text", options: [{ label: "500g", value: "500g" }, { label: "1kg", value: "1kg" }] },
                { _id: "A2", name: "Hương vị", type: "text", options: [{ label: "Gà", value: "ga" }, { label: "Bò", value: "bo" }] }
            ],
        }
    } as any;
};

/** Tạo sản phẩm mới */
export const createProduct = async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiApp.post(`${BASE_URL}/create`, data, withAuth());
    return response.data;
};

/** Lấy chi tiết sản phẩm cho trang Edit */
export const getProductById = async (id: string | number): Promise<ApiResponse<any>> => {
    const product = mockProducts.find(p => p._id === id) || mockProducts[0];
    return {
        success: true,
        data: {
            productDetail: product,
            categoryList: mockCategories,
            attributeList: [
                { _id: "A1", name: "Khối lượng", type: "text", options: [{ label: "500g", value: "500g" }, { label: "1kg", value: "1kg" }] },
                { _id: "A2", name: "Hương vị", type: "text", options: [{ label: "Gà", value: "ga" }, { label: "Bò", value: "bo" }] }
            ]
        }
    } as any;
};

/** Cập nhật sản phẩm */
export const updateProduct = async (id: string | number, data: any): Promise<ApiResponse<any>> => {
    const response = await apiApp.patch(`${BASE_URL}/edit/${id}`, data, withAuth());
    return response.data;
};

/** Xóa sản phẩm */
export const deleteProduct = async (id: string | number): Promise<ApiResponse<any>> => {
    const response = await apiApp.patch(`${BASE_URL}/delete/${id}`, {}, withAuth());
    return response.data;
};

/** Khôi phục sản phẩm */
export const restoreProduct = async (id: string | number): Promise<ApiResponse<any>> => {
    const response = await apiApp.patch(`${BASE_URL}/restore/${id}`, {}, withAuth());
    return response.data;
};

/** Xóa vĩnh viễn sản phẩm */
export const forceDeleteProduct = async (id: string | number): Promise<ApiResponse<any>> => {
    const response = await apiApp.delete(`${BASE_URL}/force-delete/${id}`, withAuth());
    return response.data;
};

/** Lấy danh sách sản phẩm hết hạn */
export const getExpiredProducts = async (params?: any): Promise<ApiResponse<any>> => {
    return {
        success: true,
        data: {
            recordList: [],
            pagination: {
                totalRecords: 0,
                totalPages: 1,
                currentPage: params?.page || 1,
                limit: params?.limit || 10
            }
        }
    } as any;
};

/** Quét sản phẩm hết hạn thủ công */
export const scanExpiredProducts = async (): Promise<ApiResponse<any>> => {
    return {
        success: true,
        message: "Quét sản phẩm hết hạn thành công!"
    } as any;
};


