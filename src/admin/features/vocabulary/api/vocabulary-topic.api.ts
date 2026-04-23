import { apiApp } from "../../../shared/api/core";

export interface VocabularyTopic {
    _id: string;
    title: string;
    description: string;
    color: string;
    createdAt: string;
}

export const getVocabularyTopics = async (params: any = {}) => {
    const res = await apiApp.get("/api/v1/admin/vocabulary-topic", { params });
    return res.data;
};

export const createVocabularyTopic = async (data: Partial<VocabularyTopic>) => {
    const res = await apiApp.post("/api/v1/admin/vocabulary-topic/create", data);
    return res.data;
};

export const editVocabularyTopic = async (id: string, data: Partial<VocabularyTopic>) => {
    const res = await apiApp.patch(`/api/v1/admin/vocabulary-topic/edit/${id}`, data);
    return res.data;
};

export const deleteVocabularyTopic = async (id: string, isForce: boolean = false) => {
    const url = isForce 
        ? `/api/v1/admin/vocabulary-topic/force-delete/${id}`
        : `/api/v1/admin/vocabulary-topic/delete/${id}`;
    
    if (isForce) {
        const res = await apiApp.delete(url);
        return res.data;
    } else {
        const res = await apiApp.patch(url);
        return res.data;
    }
};

export const restoreVocabularyTopic = async (id: string) => {
    const res = await apiApp.patch(`/api/v1/admin/vocabulary-topic/restore/${id}`);
    return res.data;
};
