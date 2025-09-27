"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface SettingLayoutContextProps {
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
};

export const SettingLayoutContext = createContext<SettingLayoutContextProps>({
    title: "",
    setTitle: () => {},
});

export const useSettingLayoutHook = (): SettingLayoutContextProps => {
    const [title, setTitle] = useState<string>("");
    
    return {
        title,
        setTitle,
    };
};