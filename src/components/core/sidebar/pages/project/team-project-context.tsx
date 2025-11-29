"use client";

import { AppContext, AppContextProps } from "@/hooks/app-context";
import { PM_Deliverable, Project, ProjectMembershipRole, ReorderType, TeamMember } from "@/model/project-management"; // Added PM_Phase, PM_Task for type clarity
import { projectRepository } from "@/repository/project-repository";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";

export enum TeamProjectTab {
    SUMMARY = "summary",
    LIST = "list",
    TASK_BOARD = "task_board",
    TIMELINE = "timeline",
    SHARED_FILE = "shared_file",
    RISK_REGISTER = "risk_register",
};

export interface TeamProjectContextProps {
    tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    isNavigatingFromTaskBoard: boolean,
    setIsNavigatingFromTaskBoard: Dispatch<SetStateAction<boolean>>,
    isReordering: boolean;
    setIsReordering: Dispatch<SetStateAction<boolean>>;
    selectedProject: Project | null;
    setSelectedProject: Dispatch<SetStateAction<Project | null>>;

    getTeamMembers: () => void;
    members: TeamMember[];
    setMembers: Dispatch<SetStateAction<TeamMember[]>>;
    currentMember: TeamMember | null;
    setCurrentMember: Dispatch<SetStateAction<TeamMember | null>>;

    deliverables: PM_Deliverable[];
    setDeliverables: Dispatch<SetStateAction<PM_Deliverable[]>>;

    getProjectStructure: () => () => void; // Function that returns a cleanup function
    handleReorderList: (orderedIds: number[], parentId: number, type: ReorderType) => void;

    expandedDeliverables: Set<string>;
    search: string;
    setExpandedDeliverables: Dispatch<SetStateAction<Set<string>>>;
    expandedPhases: Set<string>;
    setExpandedPhases: Dispatch<SetStateAction<Set<string>>>;
    setSearch: Dispatch<SetStateAction<string>>;
    scrollToItem: string;
    setScrollToItem: Dispatch<SetStateAction<string>>;
};

export const TeamProjectContext = createContext<TeamProjectContextProps>({
    tab: TeamProjectTab.SUMMARY,
    setTab: () => { },
    isNavigatingFromTaskBoard: false,
    setIsNavigatingFromTaskBoard: () => { },
    isReordering: false,
    setIsReordering: () => { },
    selectedProject: null,
    setSelectedProject: () => { },
    getTeamMembers: () => { },
    members: [],
    setMembers: () => { },
    currentMember: null,
    setCurrentMember: () => { },
    deliverables: [],
    setDeliverables: () => { },
    getProjectStructure: () => () => { },
    handleReorderList: () => { },
    expandedDeliverables: new Set(),
    expandedPhases: new Set(),
    setExpandedDeliverables: () => { },
    setExpandedPhases: () => { },
    search: "",
    setSearch: () => { },
    scrollToItem: "",
    setScrollToItem: () => { },
});

export const useTeamProjectHooks = (currentSelectedProject: Project | null): TeamProjectContextProps => {
    const [tab, setTab] = useState<string>(TeamProjectTab.SUMMARY);
    const [isNavigatingFromTaskBoard, setIsNavigatingFromTaskBoard] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
    const [deliverables, setDeliverables] = useState<PM_Deliverable[]>([]);
    const [isReordering, setIsReordering] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [scrollToItem, setScrollToItem] = useState<string>("");
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
        new Set([])
    );
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
        new Set([])
    );
    const {
        email,
    } = useContext<AppContextProps>(AppContext);

    const getProjectStructure = useCallback(() => {
        const subscription = projectRepository.getProjectStructure({
            projectId: selectedProject?.id,
            search: search || "",
        }).subscribe({
            next: res => {
                if (res?.status) {
                    const projectDeliverables = res?.data?.data || [];
                    // --- AUTO-EXPANSION LOGIC START ---
                    const isSearching = search && search.trim() !== "";
                    const newExpandedDeliverables = new Set<string>();
                    const newExpandedPhases = new Set<string>();
                    // --- AUTO-EXPANSION LOGIC END ---
                    const updatedProjectDeliverables = projectDeliverables.map((deliverable: any) => {
                        const deliverableIdStr = `del-${deliverable.id}`;

                        // --- AUTO-EXPANSION LOGIC START ---
                        // 1. Check if the DELIVERABLE itself contains a keyword match (deep or shallow)
                        if (isSearching && deliverable.hasChildContainKeyword) {
                            newExpandedDeliverables.add(deliverableIdStr);
                        }
                        // --- AUTO-EXPANSION LOGIC END ---

                        const updatedProjectPhases = (deliverable.phases || []).map((phase: any) => {
                            const phaseIdStr = `phase-${phase.id}`;

                            // --- AUTO-EXPANSION LOGIC START ---
                            // 2. Check if the PHASE itself contains a keyword match (deep or shallow)
                            if (isSearching && phase.hasChildContainKeyword) {
                                newExpandedPhases.add(phaseIdStr);
                            }
                            // --- AUTO-EXPANSION LOGIC END ---

                            const tasks = (phase.tasks || []).map((task: any) => {
                                const taskIdStr = `task-${task.id}`;
                                return {
                                    ...task, taskId: task.id, taskIdStr, phaseId: phase.id, phaseIdStr,
                                    status: task.status.toUpperCase().split(/\s+/).join("_"),
                                    priority: task.priority.toUpperCase(),
                                };
                            });
                            return {
                                ...phase, tasks, phaseId: phase.id, phaseIdStr, deliverableId: deliverable.id, deliverableIdStr,
                            };
                        });
                        return { ...deliverable, phases: updatedProjectPhases, deliverableId: deliverable.id, deliverableIdStr };
                    });

                    setExpandedDeliverables(prevExpanded => {
                        if (isSearching) {
                            return newExpandedDeliverables;
                        }
                        return prevExpanded;
                    });

                    setExpandedPhases(prevExpanded => {
                        if (isSearching) {
                            return newExpandedPhases;
                        }
                        return prevExpanded;
                    });
                    setDeliverables(updatedProjectDeliverables);

                    // --- AUTO-EXPANSION LOGIC END ---
                } else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedProject, setIsReordering, search, setExpandedDeliverables, setExpandedPhases]);

    const getTeamMembers = useCallback(() => {
        const subscription = projectRepository.getTeamMembers({
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
                } else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [currentSelectedProject, setMembers, setCurrentMember, email]);

    const handleReorderList = useCallback((orderedIds: number[], parentId: number, type: ReorderType) => {
        setIsReordering(true);
        const subscription = projectRepository.reorderList({
            projectId: currentSelectedProject?.id,
        }, {
            type,
            parentId,
            orderedIds,
        })
            .pipe(finalize(() => setIsReordering(false)))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        getProjectStructure();
                    }
                    else {
                        toast.error(res?.msg || res?.message)
                        getProjectStructure();
                    }
                },
                error: err => {
                    getProjectStructure();
                },
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedProject, setIsReordering]);

    // --- State Reset and Data Fetch on Project Change ---
    useEffect(() => {
        // 1. Set the newly selected project
        setSelectedProject(currentSelectedProject);
        setMembers([]);
        if (currentSelectedProject) {
            // 2. Fetch team members for the new project
            getTeamMembers();
        }

        // 3. 🎯 Reset ALL states related to the previous project structure
        // This ensures a clean slate when switching projects or initializing.
        setDeliverables([]);
        setSearch("");
        setScrollToItem("");
        setExpandedDeliverables(new Set());
        setExpandedPhases(new Set());
        setIsReordering(false);
        // Note: The main project structure will be fetched by the dependency chain
        // (useEffect watching `selectedProject` calls `debouncedGetProjectStructure`).

    }, [currentSelectedProject]);

    useEffect(() => {
        if (!currentSelectedProject) {
            return;
        }
        getTeamMembers();
    }, [currentSelectedProject]);

    return {
        tab,
        setTab,
        search,
        setSearch,
        isReordering,
        isNavigatingFromTaskBoard,
        setIsNavigatingFromTaskBoard,
        setIsReordering,
        selectedProject,
        setSelectedProject,
        getTeamMembers,
        members,
        setMembers,
        currentMember,
        setCurrentMember,
        deliverables,
        setDeliverables,
        getProjectStructure,
        handleReorderList,
        expandedDeliverables,
        expandedPhases,
        setExpandedDeliverables,
        setExpandedPhases,
        scrollToItem,
        setScrollToItem,
    };
};