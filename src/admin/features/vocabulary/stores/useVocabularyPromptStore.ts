import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VocabularyPromptState {
    isPromptOpen: boolean;
    lastPromptTime: number | null;
    openPrompt: () => void;
    closePrompt: () => void;
    recordPromptTime: () => void;
}

export const useVocabularyPromptStore = create<VocabularyPromptState>()(
    persist(
        (set) => ({
            isPromptOpen: false,
            lastPromptTime: null,
            openPrompt: () => set({ isPromptOpen: true }),
            closePrompt: () => set({ isPromptOpen: false }),
            recordPromptTime: () => set({ lastPromptTime: Date.now() }),
        }),
        {
            name: 'vocabulary-prompt-storage',
        }
    )
);
