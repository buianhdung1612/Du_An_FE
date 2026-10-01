import { z } from "zod";

export const sentenceSchema = z.object({
    text: z.string().optional().or(z.literal("")),
    translation: z.string().optional().or(z.literal("")),
});

export const exampleSchema = z.object({
    title: z.string().optional().or(z.literal("")),
    sentences: z.array(sentenceSchema).optional().default([{ text: "", translation: "" }]),
});

export const wordFamilySchema = z.object({
    word: z.string(),
    ipa: z.string().optional().or(z.literal("")),
    partOfSpeech: z.string().optional().or(z.literal("")),
    definition: z.string(),
    examples: z.array(exampleSchema).optional(),
    synonyms: z.array(z.string()).optional(),
    shouldStudy: z.boolean().default(true),
    _expanded: z.boolean().optional(),
});

export const vocabularySchema = z.object({
    word: z.string().min(1, "Vui lòng nhập từ vựng"),
    rootWord: z.string().optional(),
    topicId: z.string().optional().or(z.literal("")),
    partOfSpeech: z.string().optional(),
    category: z.string().default("word"),
    ipa: z.string().optional(),
    audio: z.string().optional(),
    definition: z.string().min(1, "Vui lòng nhập nghĩa"),
    examples: z.array(exampleSchema).default([{ title: "", sentences: [{ text: "", translation: "" }] }]),
    imageUrl: z.string().optional(),
    wordFamily: z.array(wordFamilySchema).default([]),
    relatedWords: z.array(wordFamilySchema).default([]),
    synonyms: z.array(z.string()).default([]),
    groupedWords: z.array(z.object({
        word: z.string().min(1, "Word required"),
        ipa: z.string().optional(),
        definition: z.string().min(1, "Definition required"),
        note: z.string().optional(),
        imageUrl: z.string().optional()
    })).optional().default([]),
    note: z.string().optional(),
});

export type VocabularyFormData = z.infer<typeof vocabularySchema>;
