import { apiApp } from "@shared/api";
import Cookies from "js-cookie";

const BASE_URL = "/api/v1/admin/pet";

const withAuth = () => {
    const token = Cookies.get("tokenAdmin");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getPets = async (params?: any) => {
    const list = [
        { _id: "P1", name: "LuLu", type: "dog", breed: "Poodle", weight: 5, age: 3, gender: "male", ownerName: "Nguyễn Văn A", avatar: "" },
        { _id: "P2", name: "Mimi", type: "cat", breed: "Mèo Anh lông ngắn", weight: 3, age: 6, gender: "female", ownerName: "Trần Thị B", avatar: "" }
    ];
    return {
        success: true,
        data: {
            recordList: list,
            pagination: {
                totalRecords: list.length,
                totalPages: 1,
                currentPage: params?.page || 1,
                limit: params?.limit || 10
            }
        }
    };
};



export const getPetById = async (id: string) => {
    const response = await apiApp.get(`${BASE_URL}/${id}`, withAuth());
    return response.data;
};

export const createPet = async (data: any) => {
    const response = await apiApp.post(`${BASE_URL}/create`, data, withAuth());
    return response.data;
};

export const updatePet = async (id: string, data: any) => {
    const response = await apiApp.patch(`${BASE_URL}/${id}`, data, withAuth());
    return response.data;
};

export const deletePet = async (id: string) => {
    const response = await apiApp.delete(`${BASE_URL}/${id}`, withAuth());
    return response.data;
};

