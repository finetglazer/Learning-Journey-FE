"use client";

import { Project } from "@/model/project-management";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export enum TeamProjectTab {
    SUMMARY = "summary",
    LIST = "list",
    TASK_BOARD = "task-board",
    TIMELINE = "timeline",
    SHARED_FILE = "shared-file",
    RISK_REGISTER = "risk-register",
};

export interface TeamProjectContextProps {
    tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    selectedProject: Project | null;
    setSelectedProject: Dispatch<SetStateAction<Project | null>>;
};

export const TeamProjectContext = createContext<TeamProjectContextProps>({
    tab: TeamProjectTab.SUMMARY,
    setTab: () => { },
    selectedProject: null,
    setSelectedProject: () => { },
});

export const useTeamProjectHooks = (): TeamProjectContextProps => {
    const [tab, setTab] = useState<string>(TeamProjectTab.SUMMARY);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return {
        tab,
        setTab,
        selectedProject,
        setSelectedProject,
    };
};