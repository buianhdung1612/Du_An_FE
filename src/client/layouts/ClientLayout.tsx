import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainSearch from '../components/MainSearch';
import { useClientScripts } from '../hooks/useClientScripts';

export default function ClientLayout() {
    const isLoaded = useClientScripts();
    const [showScroll, setShowScroll] = useState(false);
    const [scrollWidth, setScrollWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) setShowScroll(true);
            else setShowScroll(false);

            // Scroll progress calculation
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const percent = (window.scrollY / (docHeight - winHeight)) * 100;
            setScrollWidth(percent);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isLoaded) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="home-page-2">
            <div className="scroll-progress bg-grey-900" style={{ width: `${scrollWidth}%` }}></div>

            <Header />
            <MainSearch />

            {/* The child pages (like Home, About, Post) will render here */}
            <div className="min-h-screen">
                <Outlet />
            </div>

            <Footer />
            <div className="dark-mark"></div>

            {/* Native React Scroll To Top (Original UI) */}
            <a
                id="scrollUp"
                href="#top"
                style={{ position: 'fixed', zIndex: 2147483647, display: showScroll ? 'block' : 'none' }}
                onClick={(e) => { e.preventDefault(); scrollToTop(); }}
            >
                <i className="elegant-icon arrow_up"></i>
            </a>
        </div>
    );
}
