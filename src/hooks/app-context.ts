"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface SleepHour {
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
}

export interface AppContextProps {
    loadingPage: boolean;
    setLoadingPage: Dispatch<SetStateAction<boolean>>;
    sleepHours: SleepHour[];
    setSleepHours: Dispatch<SetStateAction<SleepHour[]>>;
};

export const AppContext = createContext<AppContextProps>({
    loadingPage: false,
    setLoadingPage: () => {},
    sleepHours: [],
    setSleepHours: () => {},
});

export const useAppHooks = (): AppContextProps => {
    const [loadingPage, setLoadingPage] = useState<boolean>(false);
    const [sleepHours, setSleepHours] = useState<SleepHour[]>([]);
    return {
        loadingPage,
        setLoadingPage,
        sleepHours,
        setSleepHours,
    };
};