import axios from "axios";
import { prefixAdmin } from "../../../shared/constants/routes";

const API_URL = `/${prefixAdmin}/notes`;

export interface INote {
    _id: string;
    title: string;
    topic: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export const getNotes = async (params: any = {}) => {
    const res = await axios.get(API_URL, { params });
    return res.data;
};

export const getNoteDetail = async (id: string) => {
    const res = await axios.get(`${API_URL}/detail/${id}`);
    return res.data;
};

export const createNote = async (data: Partial<INote>) => {
    const res = await axios.post(`${API_URL}/create`, data);
    return res.data;
};

export const updateNote = async (id: string, data: Partial<INote>) => {
    const res = await axios.patch(`${API_URL}/edit/${id}`, data);
    return res.data;
};

export const deleteNote = async (id: string) => {
    const res = await axios.delete(`${API_URL}/delete/${id}`);
    return res.data;
};
