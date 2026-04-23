import { create } from 'zustand';

interface ProductivityState {
    activePlan: any | null;
    setActivePlan: (plan: any) => void;
    currentWeekIndex: number;
    setCurrentWeekIndex: (index: number) => void;
}

export const useProductivityStore = create<ProductivityState>((set) => ({
    activePlan: null,
    setActivePlan: (plan) => set({ activePlan: plan }),
    currentWeekIndex: 1, // Default to week 1
    setCurrentWeekIndex: (index) => set({ currentWeekIndex: index }),
}));
