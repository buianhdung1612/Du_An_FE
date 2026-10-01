import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as nutritionApi from "../api/nutrition.api";
import { toast } from "react-toastify";

export const useNutrition = (date: string) => {
    return useQuery({
        queryKey: ["nutrition", date],
        queryFn: () => nutritionApi.getNutritionByDate(date),
        enabled: !!date,
    });
};

export const useSaveNutrition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: nutritionApi.saveNutrition,
        onSuccess: (res) => {
            if (res.code === 200) {
                queryClient.invalidateQueries({ queryKey: ["nutrition"] });
                toast.success("Đã lưu kế hoạch dinh dưỡng!");
            }
        },
    });
};

export const useAnalyzeFood = () => {
    return useMutation({
        mutationFn: nutritionApi.analyzeFoodAI,
    });
};
