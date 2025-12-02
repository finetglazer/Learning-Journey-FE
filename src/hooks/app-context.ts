"use client";

import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export interface SleepHour {
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
}

export interface AppContextProps {
    loadingPage: boolean;
    setLoadingPage: Dispatch<SetStateAction<boolean>>;
    sleepHours: SleepHour[];
    setSleepHours: Dispatch<SetStateAction<SleepHour[]>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    darkBg: boolean;
    setDarkBg: Dispatch<SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextProps>({
    loadingPage: false,
    setLoadingPage: () => { },
    sleepHours: [],
    setSleepHours: () => { },
    email: "",
    setEmail: () => { },
    darkBg: false,
    setDarkBg: () => { },
});

export const useAppHooks = (): AppContextProps => {
    const [loadingPage, setLoadingPage] = useState<boolean>(false);
    const [sleepHours, setSleepHours] = useState<SleepHour[]>([]);
    const [email, setEmail] = useState<string>("");
    const [darkBg, setDarkBg] = useState<boolean>(false);

    useEffect(() => {
        setEmail(localStorage.getItem("email") || "");
    }, []);

    return {
        loadingPage,
        setLoadingPage,
        sleepHours,
        setSleepHours,
        email,
        setEmail,
        darkBg,
        setDarkBg,
    };
};