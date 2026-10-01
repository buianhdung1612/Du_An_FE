import { apiApp } from "@shared/api";

const API_PATH = "/api/v1/admin/notes";

export interface INote {
    _id: string;
    title: string;
    topic: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export const getNotes = async (params: any = {}) => {
    const res = await apiApp.get(API_PATH, { params });
    return res.data;
};

export const getNoteDetail = async (id: string) => {
    const res = await apiApp.get(`${API_PATH}/detail/${id}`);
    return res.data;
};

export const createNote = async (data: Partial<INote>) => {
    const res = await apiApp.post(`${API_PATH}/create`, data);
    return res.data;
};

export const updateNote = async (id: string, data: Partial<INote>) => {
    const res = await apiApp.patch(`${API_PATH}/edit/${id}`, data);
    return res.data;
};

export const deleteNote = async (id: string) => {
    const res = await apiApp.delete(`${API_PATH}/delete/${id}`);
    return res.data;
};
