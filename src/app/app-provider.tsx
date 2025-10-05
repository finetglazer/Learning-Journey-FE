"use client";

import LoadingPage from "@/components/core/loading-page/loading-page";
import { AppContext, useAppHooks } from "@/hooks/app-context";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
    const appHooks = useAppHooks();
    const { loadingPage, setLoadingPage } = appHooks;
    const pathname = usePathname();

    useEffect(() => {
        if (loadingPage) {
            setLoadingPage(false);
        }
    }, [pathname]);

    const loadingPageTitle = "Brewing Your Page... ☕";
    const loadingPageDescription = "Just a moment! We're pouring the coffee and fluffing the pixels to make everything perfect for you";

    return (
        <AppContext.Provider value={appHooks}>
            {loadingPage ? <LoadingPage title={loadingPageTitle} description={loadingPageDescription} /> : children}
        </AppContext.Provider>
    );
}