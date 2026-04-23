import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getCategoryBooks, 
    createCategoryBook, 
    editCategoryBook, 
    deleteCategoryBook, 
    restoreCategoryBook 
} from '../../api/category-book.api';

export const useBookCategories = (params?: any) => {
    return useQuery({
        queryKey: ['book-categories', params],
        queryFn: () => getCategoryBooks(params),
    });
};

export const useCreateBookCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategoryBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book-categories'] });
        },
    });
};

export const useUpdateBookCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => editCategoryBook(id, data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['book-categories'] });
            }
        },
    });
};

export const useDeleteBookCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategoryBook(id, false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book-categories'] });
        },
    });
};

export const useRestoreBookCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreCategoryBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book-categories'] });
        },
    });
};

export const useForceDeleteBookCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategoryBook(id, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book-categories'] });
        },
    });
};
