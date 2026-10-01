import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../api/calendar.api';

// Categories hooks
export const useCalendarCategories = () => {
    return useQuery({
        queryKey: ['calendar-categories'],
        queryFn: api.getCalendarCategories,
    });
};

export const useCreateCalendarCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createCalendarCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-categories'] });
        },
    });
};

export const useUpdateCalendarCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.updateCalendarCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-categories'] });
        },
    });
};

export const useDeleteCalendarCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteCalendarCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-categories'] });
        },
    });
};

// Events hooks
export const useCalendarEvents = () => {
    return useQuery({
        queryKey: ['calendar-events'],
        queryFn: api.getCalendarEvents,
    });
};

export const useCreateCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createCalendarEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
        },
    });
};

export const useUpdateCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.updateCalendarEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
        },
    });
};

export const useDeleteCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteCalendarEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
        },
    });
};
