"use client";

import { AppContext, AppContextProps } from "@/hooks/app-context";
import { Project, ProjectMembershipRole, TeamMember } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
    getTeamMembers: () => void;
    members: TeamMember[];
    setMembers: Dispatch<SetStateAction<TeamMember[]>>;
    currentMember: TeamMember | null;
    setCurrentMember: Dispatch<SetStateAction<TeamMember | null>>;
};

export const TeamProjectContext = createContext<TeamProjectContextProps>({
    tab: TeamProjectTab.SUMMARY,
    setTab: () => { },
    selectedProject: null,
    setSelectedProject: () => { },
    getTeamMembers: () => { },
    members: [],
    setMembers: () => { },
    currentMember: null,
    setCurrentMember: () => { },
});

export const useTeamProjectHooks = (currentSelectedProject: Project | null): TeamProjectContextProps => {
    const [tab, setTab] = useState<string>(TeamProjectTab.SUMMARY);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
    const {
        email,
    } = useContext<AppContextProps>(AppContext);

    const getTeamMembers = () => {
        projectRepository.getTeamMembers({
            projectId: currentSelectedProject?.id
        }).subscribe({
            next: res => {
                if (res?.status) {
                    const membersList = res?.data?.members || [];
                    const sortedMembers = membersList.sort((a: TeamMember, b: TeamMember) =>
                        (b.role === ProjectMembershipRole.OWNER ? 1 : 0) - (a.role === ProjectMembershipRole.OWNER ? 1 : 0)
                    );

                    setMembers(sortedMembers);
                    setCurrentMember(sortedMembers.find((member: TeamMember) => member.email === email));
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    };

    useEffect(() => {
        getTeamMembers();
        setSelectedProject(currentSelectedProject);
    }, [currentSelectedProject]);

    return {
        tab,
        setTab,
        selectedProject,
        setSelectedProject,
        getTeamMembers,
        members,
        setMembers,
        currentMember,
        setCurrentMember,
    };
};