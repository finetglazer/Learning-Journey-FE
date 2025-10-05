"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface AppContextProps {
    loadingPage: boolean;
    setLoadingPage: Dispatch<SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextProps>({
    loadingPage: false,
    setLoadingPage: () => {},
});

export const useAppHooks = (): AppContextProps => {
    const [loadingPage, setLoadingPage] = useState<boolean>(false);

    return {
        loadingPage,
        setLoadingPage,
    };
};