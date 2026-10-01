import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/lifestyle.api";
import { toast } from "react-toastify";

export const useWorkouts = () => {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["workouts"], queryFn: api.getWorkouts });

    const create = useMutation({
        mutationFn: api.createWorkout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workouts"] });
            toast.success("Đã ghi nhận buổi tập!");
        }
    });

    return { ...query, createWorkout: create.mutate };
};

export const useNutrition = (date?: string) => {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["nutrition", date], queryFn: () => api.getNutrition(date) });

    const save = useMutation({
        mutationFn: api.saveNutrition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["nutrition"] });
            toast.success("Đã cập nhật dinh dưỡng!");
        }
    });

    return { ...query, saveNutrition: save.mutate };
};

export const useFinance = () => {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["finance"], queryFn: api.getFinance });

    const create = useMutation({
        mutationFn: api.createFinance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance"] });
            toast.success("Đã thêm giao dịch!");
        }
    });

    return { ...query, createFinance: create.mutate };
};
