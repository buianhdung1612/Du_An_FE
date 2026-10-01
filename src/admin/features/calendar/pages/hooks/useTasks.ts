import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, editTask, deleteTask } from "../../api/task.api";
import { toast } from "react-toastify";

export const useTasks = () => {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks
    });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: (data: any) => {
            if (data.code === 200) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            } else {
                toast.error(data.message);
            }
        }
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => editTask(id, data),
        onSuccess: (data: any) => {
            if (data.code === 200) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                // Also invalidate calendar events just in case
                queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
            } else {
                toast.error(data.message);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data: any) => {
            if (data.code === 200) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            } else {
                toast.error(data.message);
            }
        }
    });

    return {
        tasks: tasksQuery.data?.tasks || [],
        isLoading: tasksQuery.isLoading,
        createTask: createMutation.mutateAsync,
        editTask: editMutation.mutateAsync,
        deleteTask: deleteMutation.mutateAsync
    };
};
