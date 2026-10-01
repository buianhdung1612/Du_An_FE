import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { SideBar } from "../components/layouts/sidebar/SideBar";
import { Header } from "../components/layouts/Header";
import { adminTheme } from "../config/theme";
import '../styles/index.css';
import { useSidebar } from "../context/sidebar/useSidebar";
import { SidebarProvider } from "../context/sidebar/SidebarProvider";
import { useGetMe } from "../../features/authen/pages/hooks/use-get-me";

import { SocketProvider } from "../context/SocketProvider";
import { OverrunAlerter } from "../components/OverrunAlerter";
import { AuthGuard } from "../components/auth/AuthGuard";
import { VocabularyPromptModal } from "../../features/vocabulary/components/VocabularyPromptModal";
import { GlobalAddVocabulary } from "../../features/vocabulary/components/GlobalAddVocabulary";

import { Suspense } from "react";
import LoadingScreen from "../components/ui/LoadingScreen";

const LayoutAdminContent = () => {
    useGetMe();
    const location = useLocation();
    const { isOpen, isMobile } = useSidebar();

    const isFullWidthPage = location.pathname.startsWith("/admin");

    // Mobile: không có padding-left, desktop: padding-left theo sidebar
    const contentPaddingLeft = isMobile
        ? 'pl-0'
        : isOpen ? 'pl-[300px]' : 'pl-[88px]';

    return (
        <div className="flex">
            <VocabularyPromptModal />
            <GlobalAddVocabulary />
            <OverrunAlerter />
            <ToastContainer />
            <SideBar />

            <div className={`flex-1 transition-[padding-left] duration-[120ms] ease-linear ${contentPaddingLeft}`}>
                <ThemeProvider theme={adminTheme}>
                    <Header />
                    <main
                        className={
                            isFullWidthPage
                                ? `max-w-[1536px] mx-auto pt-[8px] pb-[64px] px-[16px] md:px-[calc(5*var(--spacing))]`
                                : `w-full max-w-[1200px] mx-auto pt-[8px] pb-[64px] px-[16px] md:px-[40px]`
                        }
                    >
                        <Suspense fallback={<LoadingScreen />}>
                            <Outlet />
                        </Suspense>
                    </main>
                </ThemeProvider>
            </div>

        </div>
    );
};

export const LayoutAdmin = () => {
    return (
        <SocketProvider>
            <SidebarProvider>
                <AuthGuard>
                    <LayoutAdminContent />
                </AuthGuard>
            </SidebarProvider>
        </SocketProvider>
    );
};
