import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getCategoryMindMaps, 
    createCategoryMindMap, 
    editCategoryMindMap, 
    deleteCategoryMindMap, 
    restoreCategoryMindMap 
} from '../../api/category-mindmap.api';

export const useMindMapCategories = (params?: any) => {
    return useQuery({
        queryKey: ['mind-map-categories', params],
        queryFn: () => getCategoryMindMaps(params),
    });
};

export const useCreateMindMapCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategoryMindMap,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mind-map-categories'] });
        },
    });
};

export const useUpdateMindMapCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => editCategoryMindMap(id, data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['mind-map-categories'] });
            }
        },
    });
};

export const useDeleteMindMapCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategoryMindMap(id, false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mind-map-categories'] });
        },
    });
};

export const useRestoreMindMapCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreCategoryMindMap,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mind-map-categories'] });
        },
    });
};

export const useForceDeleteMindMapCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategoryMindMap(id, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mind-map-categories'] });
        },
    });
};
