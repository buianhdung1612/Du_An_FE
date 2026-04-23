import { apiApp } from "../../../shared/api/core";

const prefix = "/api/v1/admin/productivity";

export const getActivePlan = async () => {
    const res = await apiApp.get(`${prefix}/plan`);
    return res.data;
};

export const createPlan = async (data: any) => {
    const res = await apiApp.post(`${prefix}/create`, data);
    return res.data;
};

export const updateExecution = async (data: { 
    planId: string, 
    weekIndex: number, 
    tacticId: string, 
    completedDate?: string, 
    isCompleted?: boolean 
}) => {
    const res = await apiApp.patch(`${prefix}/update-execution`, data);
    return res.data;
};

export const updatePlan = async (id: string, data: any) => {
    const res = await apiApp.patch(`${prefix}/edit/${id}`, data);
    return res.data;
};

export const updateWeeklyPlanning = async (data: {
    planId: string,
    weekIndex: number,
    weeklyNote?: string,
    dailyFocus?: any
}) => {
    const res = await apiApp.patch(`${prefix}/update-weekly-planning`, data);
    return res.data;
};

export const updateTimeBlocks = async (data: {
    planId: string,
    timeBlocks: any[]
}) => {
    const res = await apiApp.patch(`${prefix}/update-time-blocks`, data);
    return res.data;
};
