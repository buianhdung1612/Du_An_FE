import { useState, useEffect, useCallback, ReactNode } from 'react';
import { SidebarContext } from './SidebarContext';

const MOBILE_BREAKPOINT = 768;

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
    const [isOpen, setIsOpen] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (mobile) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const openSidebar = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <SidebarContext.Provider value={{ isOpen, isMobile, toggleSidebar, openSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};
