import { apiApp } from "@shared/api";

export interface WritingItem {
    _id?: string;
    title: string;
    prompt: string;
    promptVi?: string;
    myWriting: string;
    sampleWriting?: string;
    feedback?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getWritings = async () => {
    const res = await apiApp.get("/api/v1/admin/writing");
    return res.data;
};

export const getWritingDetail = async (id: string) => {
    const res = await apiApp.get(`/api/v1/admin/writing/detail/${id}`);
    return res.data;
};

export const createWriting = async (data: WritingItem) => {
    const res = await apiApp.post("/api/v1/admin/writing/create", data);
    return res.data;
};

export const editWriting = async (id: string, data: Partial<WritingItem>) => {
    const res = await apiApp.patch(`/api/v1/admin/writing/edit/${id}`, data);
    return res.data;
};

export const deleteWriting = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/writing/delete/${id}`);
    return res.data;
};

export const generateWritingFeedback = async (prompt: string, myWriting: string) => {
    const res = await apiApp.post("/api/v1/admin/writing/generate-feedback", { prompt, myWriting });
    return res.data;
};
