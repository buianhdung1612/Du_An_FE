import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getVocabularyTopics, 
    createVocabularyTopic, 
    editVocabularyTopic, 
    deleteVocabularyTopic, 
    restoreVocabularyTopic 
} from '../../api/vocabulary-topic.api';

export const useVocabularyTopics = (params?: any) => {
    return useQuery({
        queryKey: ['vocabulary-topics', params],
        queryFn: () => getVocabularyTopics(params),
    });
};

export const useCreateVocabularyTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVocabularyTopic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vocabulary-topics'] });
        },
    });
};

export const useUpdateVocabularyTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => editVocabularyTopic(id, data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['vocabulary-topics'] });
            }
        },
    });
};

export const useDeleteVocabularyTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteVocabularyTopic(id, false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vocabulary-topics'] });
        },
    });
};

export const useRestoreVocabularyTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreVocabularyTopic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vocabulary-topics'] });
        },
    });
};

export const useForceDeleteVocabularyTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteVocabularyTopic(id, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vocabulary-topics'] });
        },
    });
};
