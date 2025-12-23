"use client";

import { Project } from "@/model/project-management";
import { createContext, useContext } from "react";

interface MainLayoutContextType {
    modalStates: boolean[];
    updateModalStates: (index: number, isOpen: boolean) => void;
    currentSelectedProject: Project | null;
    deleteProject: (projectId: number) => void;
}

export const MainLayoutContext = createContext<MainLayoutContextType>({
    modalStates: [false, false, false, false],
    updateModalStates: () => { },
    currentSelectedProject: null,
    deleteProject: () => { },
});

export const useMainLayout = () => useContext(MainLayoutContext);
