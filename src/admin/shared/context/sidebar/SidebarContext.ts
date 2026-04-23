import { createContext } from 'react';

export interface SidebarContextType {
    isOpen: boolean;
    isMobile: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
    undefined
);
