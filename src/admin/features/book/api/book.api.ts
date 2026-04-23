import { apiApp } from "../../../shared/api/core";

export interface BookPractice {
    _id: string;
    title: string;
    frequency: "daily" | "weekly";
    importance: number;
    lastCompletedAt?: string;
    completedDates: string[];
}

export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    avatar: string;
    status: "reading" | "finished" | "archived";
    categoryId?: any;
    blogId?: any;
    mindMapId?: any;
    practices: BookPractice[];
    createdAt: string;
}

export const getBooks = async (params?: any) => {
    const res = await apiApp.get("/api/v1/admin/books", { params });
    return res.data;
};

export const getBookDetail = async (id: string) => {
    const res = await apiApp.get(`/api/v1/admin/books/detail/${id}`);
    return res.data;
};

export const createBook = async (data: Partial<Book>) => {
    const res = await apiApp.post("/api/v1/admin/books/create", data);
    return res.data;
};

export const editBook = async (id: string, data: Partial<Book>) => {
    const res = await apiApp.patch(`/api/v1/admin/books/edit/${id}`, data);
    return res.data;
};

export const deleteBook = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/books/delete/${id}`);
    return res.data;
};

export const logBookPractice = async (bookId: string, practiceId: string) => {
    const res = await apiApp.patch(`/api/v1/admin/books/log-practice/${bookId}/${practiceId}`);
    return res.data;
};
