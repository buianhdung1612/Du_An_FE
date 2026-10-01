import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiApp } from '@shared/api';
import { toast } from 'react-toastify';

export const useMuscleGroups = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['muscleGroups'],
        queryFn: async () => {
            const res = await apiApp.get('/api/v1/admin/muscle-groups');
            return res.data;
        }
    });

    const createGroup = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiApp.post(`/api/v1/admin/muscle-groups/create`, data);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['muscleGroups'] }); toast.success('Tạo thành công'); }
    });

    const editGroup = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const res = await apiApp.patch(`/api/v1/admin/muscle-groups/edit/${id}`, data);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['muscleGroups'] }); toast.success('Cập nhật thành công'); }
    });

    const deleteGroup = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiApp.delete(`/api/v1/admin/muscle-groups/delete/${id}`);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['muscleGroups'] }); toast.success('Xóa thành công'); }
    });

    return { ...query, createGroup: createGroup.mutate, editGroup: editGroup.mutate, deleteGroup: deleteGroup.mutate };
};

export const useExercises = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const res = await apiApp.get(`/api/v1/admin/exercises`);
            return res.data;
        }
    });

    const createExercise = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiApp.post(`/api/v1/admin/exercises/create`, data);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exercises'] }); toast.success('Tạo thành công'); }
    });

    const editExercise = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const res = await apiApp.patch(`/api/v1/admin/exercises/edit/${id}`, data);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exercises'] }); toast.success('Cập nhật thành công'); }
    });

    const deleteExercise = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiApp.delete(`/api/v1/admin/exercises/delete/${id}`);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exercises'] }); toast.success('Xóa thành công'); }
    });

    return { ...query, createExercise: createExercise.mutate, editExercise: editExercise.mutate, deleteExercise: deleteExercise.mutate };
};

export const useWorkouts = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['workouts'],
        queryFn: async () => {
            const res = await apiApp.get(`/api/v1/admin/workouts`);
            return res.data;
        }
    });

    const createWorkout = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiApp.post(`/api/v1/admin/workouts/create`, data);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['workouts'] }); toast.success('Đã lưu buổi tập'); }
    });

    const deleteWorkout = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiApp.delete(`/api/v1/admin/workouts/delete/${id}`);
            return res.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['workouts'] }); toast.success('Đã xóa buổi tập'); }
    });

    return { ...query, createWorkout: createWorkout.mutate, deleteWorkout: deleteWorkout.mutate };
};
