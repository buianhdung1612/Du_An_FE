import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/finance.api";
import { toast } from "react-toastify";

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

    const remove = useMutation({
        mutationFn: api.deleteFinance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance"] });
            toast.success("Đã xóa giao dịch!");
        }
    });

    return { ...query, createFinance: create.mutate, deleteFinance: remove.mutate };
};

export const useFinanceStats = () => {
    return useQuery({ queryKey: ["finance-stats"], queryFn: api.getFinanceStats });
};

export const useSavingGoals = () => {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["saving-goals"], queryFn: api.getSavingGoals });

    const create = useMutation({
        mutationFn: api.createSavingGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
            toast.success("Đã tạo mục tiêu tiết kiệm mới!");
        }
    });

    return { ...query, createSavingGoal: create.mutate };
};
