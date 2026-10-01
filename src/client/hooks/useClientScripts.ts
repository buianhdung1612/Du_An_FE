import { useEffect, useState } from 'react';

export function useClientScripts() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const cssFiles = [
            'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700;1,900&display=swap',
            '/client-assets/css/vendor/grid.min.css',
            '/client-assets/css/vendor/elegant-icons.css',
            '/client-assets/css/style.css',
            '/client-assets/css/widgets.css',
            '/client-assets/css/responsive.css'
        ];

        const linkElements: HTMLLinkElement[] = [];
        let loadedCount = 0;

        const checkLoaded = () => {
            loadedCount++;
            if (loadedCount === cssFiles.length) {
                setIsLoaded(true);
            }
        };

        cssFiles.forEach(url => {
            if (!document.querySelector(`link[href="${url}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = checkLoaded;
                link.onerror = checkLoaded; // prevent infinite hang
                document.head.appendChild(link);
                linkElements.push(link);
            } else {
                checkLoaded();
            }
        });

        if (cssFiles.length === 0) setIsLoaded(true);

        return () => {
            linkElements.forEach(link => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            });
            setIsLoaded(false);
        };
    }, []);

    return isLoaded;
}
