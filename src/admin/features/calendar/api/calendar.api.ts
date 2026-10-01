import { apiApp } from "@shared/api";

export const getCalendarCategories = async () => {
    const res = await apiApp.get("/api/v1/admin/category-calendar");
    return res.data;
};

export const createCalendarCategory = async (data: any) => {
    const res = await apiApp.post("/api/v1/admin/category-calendar/create", data);
    return res.data;
};

export const updateCalendarCategory = async (id: string, data: any) => {
    const res = await apiApp.patch(`/api/v1/admin/category-calendar/edit/${id}`, data);
    return res.data;
};

export const deleteCalendarCategory = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/category-calendar/delete/${id}`);
    return res.data;
};

export const getCalendarEvents = async () => {
    const res = await apiApp.get("/api/v1/admin/calendar-events");
    return res.data;
};

export const createCalendarEvent = async (data: any) => {
    const res = await apiApp.post("/api/v1/admin/calendar-events/create", data);
    return res.data;
};

export const updateCalendarEvent = async (id: string, data: any) => {
    const res = await apiApp.patch(`/api/v1/admin/calendar-events/edit/${id}`, data);
    return res.data;
};

export const deleteCalendarEvent = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/calendar-events/delete/${id}`);
    return res.data;
};
