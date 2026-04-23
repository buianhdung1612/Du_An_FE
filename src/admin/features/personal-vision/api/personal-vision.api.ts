import { apiApp } from "@shared/api";

export const getPersonalVisions = async () => {
    const res = await apiApp.get("/api/v1/admin/personal-vision");
    return res.data;
};

export const createPersonalVision = async (data: { title: string; content: string }) => {
    const res = await apiApp.post("/api/v1/admin/personal-vision/create", data);
    return res.data;
};

export const deletePersonalVision = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/personal-vision/delete/${id}`);
    return res.data;
};
export const editPersonalVision = async (id: string, data: { title: string; content: string }) => {
    const res = await apiApp.patch(`/api/v1/admin/personal-vision/edit/${id}`, data);
    return res.data;
};
