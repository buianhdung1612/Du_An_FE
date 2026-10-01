import { apiApp } from "@shared/api";

export interface Vocabulary {
    _id: string;
    word: string;
    ipa: string;
    audio?: string;
    definition: string;
    category: "word" | "phrasal_verb" | "collocation" | "phrase";
    partOfSpeech: string;
    examples: {
        title: string;
        sentences: { text: string; translation: string }[]
    }[];
    imageUrl?: string;
    wordFamily?: {
        word: string; partOfSpeech: string; definition: string; ipa: string; note: string;
        examples: { title: string; sentences: { text: string; translation: string }[] }[];
        synonyms: string[]; shouldStudy: boolean
    }[];
    relatedWords?: {
        word: string; partOfSpeech: string; definition: string; ipa: string; note: string;
        examples: { title: string; sentences: { text: string; translation: string }[] }[];
        synonyms: string[]; shouldStudy: boolean
    }[];
    synonyms: string[];
    note?: string;
    level: number;
    nextReview: string;
    interval: number;
    easeFactor: number;
    repetitionCount: number;
    createdAt: string;
}

export const getVocabularies = async (topicId?: string, date?: string, rootWord?: string) => {
    const res = await apiApp.get("/api/v1/admin/vocabulary", {
        params: { topicId, date, rootWord }
    });
    return res.data;
};

export const createVocabulary = async (data: any) => {
    const res = await apiApp.post("/api/v1/admin/vocabulary/create", data);
    return res.data;
};

export const editVocabulary = async (id: string, data: any) => {
    const res = await apiApp.patch(`/api/v1/admin/vocabulary/edit/${id}`, data);
    return res.data;
};

export const deleteVocabulary = async (id: string) => {
    const res = await apiApp.delete(`/api/v1/admin/vocabulary/delete/${id}`);
    return res.data;
};

export const generateVocabAI = async (word: string, category: string, topicId?: string, onlyIpa?: boolean) => {
    const res = await apiApp.post("/api/v1/admin/vocabulary/generate-ai", { word, category, topicId, onlyIpa });
    return res.data;
};

export const createVocabBulkAI = async (words: string[], topicId?: string) => {
    const res = await apiApp.post("/api/v1/admin/vocabulary/generate-bulk", { words, topicId });
    return res.data;
};

export const generateNoteAI = async (word: string, prompt: string) => {
    const res = await apiApp.post("/api/v1/admin/vocabulary/generate-note-ai", { word, prompt });
    return res.data;
};

export const reviewVocab = async (id: string, quality: number) => {
    const res = await apiApp.post(`/api/v1/admin/vocabulary/review/${id}`, { quality });
    return res.data;
};

export const getPhrasalVerbGroups = async () => {
    const res = await apiApp.get("/api/v1/admin/vocabulary/phrasal-verb-groups");
    return res.data;
};

export const getVocabularyStatistics = async () => {
    const res = await apiApp.get("/api/v1/admin/vocabulary/statistics");
    return res.data;
};
