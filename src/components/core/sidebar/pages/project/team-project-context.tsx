"use client";

import { AppContext, AppContextProps } from "@/hooks/app-context";
import { FileNode, PM_Deliverable, Project, ProjectDependency, ProjectMembershipRole, ProjectTimelineStructure, ReorderType, TeamMember, TimelineItem } from "@/model/project-management"; // Added PM_Phase, PM_Task for type clarity
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";

export enum TeamProjectTab {
    SUMMARY = "summary",
    LIST = "list",
    TASK_BOARD = "task_board",
    TIMELINE = "timeline",
    SHARED_SOURCE = "shared_source",
    RISK_REGISTER = "risk_register",
};

export interface TeamProjectContextProps {
    tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    isNavigatingFromTaskBoard: boolean,
    setIsNavigatingFromTaskBoard: Dispatch<SetStateAction<boolean>>;
    isReordering: boolean;
    setIsReordering: Dispatch<SetStateAction<boolean>>;
    selectedProject: Project | null;
    setSelectedProject: Dispatch<SetStateAction<Project | null>>;
    overallLoading: boolean;
    setOverallLoading: Dispatch<SetStateAction<boolean>>;

    getFiles: (search?: string) => (() => void) | undefined;
    files: FileNode[];
    setFiles: Dispatch<SetStateAction<FileNode[]>>;
    getTeamMembers: () => void;
    members: TeamMember[];
    setMembers: Dispatch<SetStateAction<TeamMember[]>>;
    currentMember: TeamMember | null;
    setCurrentMember: Dispatch<SetStateAction<TeamMember | null>>;

    deliverables: PM_Deliverable[];
    setDeliverables: Dispatch<SetStateAction<PM_Deliverable[]>>;

    getProjectStructure: () => () => void; // Function that returns a cleanup function
    getItemDependencies: (item: TimelineItem) => () => void;
    timelineData: ProjectTimelineStructure | null;
    setTimelineData: Dispatch<SetStateAction<ProjectTimelineStructure | null>>;
    dependencies: ProjectDependency[];
    setDependencies: Dispatch<SetStateAction<ProjectDependency[]>>;
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
    overallLoading: false,
    setOverallLoading: () => { },
    getFiles: () => () => { },
    files: [],
    setFiles: () => { },
    members: [],
    setMembers: () => { },
    currentMember: null,
    setCurrentMember: () => { },
    deliverables: [],
    timelineData: null,
    dependencies: [],
    getItemDependencies: () => () => { },
    setDependencies: () => { },
    setDeliverables: () => { },
    setTimelineData: () => { },
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
    const [timelineData, setTimelineData] = useState<ProjectTimelineStructure | null>(null);
    const [dependencies, setDependencies] = useState<ProjectDependency[]>([]);
    const [isNavigatingFromTaskBoard, setIsNavigatingFromTaskBoard] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
    const [deliverables, setDeliverables] = useState<PM_Deliverable[]>([]);
    const [isReordering, setIsReordering] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [scrollToItem, setScrollToItem] = useState<string>("");
    const [overallLoading, setOverallLoading] = useState<boolean>(false);
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
        new Set([])
    );
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
        new Set([])
    );
    const {
        email,
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const getProjectStructure = useCallback((searchWithParam?: boolean, searchParam?: string) => {
        if (!projectRepository || !currentSelectedProject) return () => { };
        const subscription = projectRepository.getProjectStructure({
            projectId: currentSelectedProject?.id,
            search: searchWithParam ? searchParam || "" : search || "",
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
    }, [currentSelectedProject, setIsReordering, search, setExpandedDeliverables, setExpandedPhases, projectRepository]);

    const getTeamMembers = useCallback(() => {
        if (!projectRepository || !currentSelectedProject) return;
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
    }, [currentSelectedProject, setMembers, setCurrentMember, email, projectRepository]);

    const getItemDependencies = useCallback((item: TimelineItem) => {
        if (!projectRepository || !currentSelectedProject) return () => { };
        const subscription = projectRepository.getDependencies({
            projectId: currentSelectedProject?.id as number,
            itemId: item.id,
            itemType: item.type,
        })
            .subscribe({
                next: res => {
                    if (res?.status) {
                        setDependencies(res?.data?.dependencies || []);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: err => { },
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [
        currentSelectedProject,
        projectRepository,
    ]);

    const getFiles = useCallback((search?: string) => {
        if (!projectRepository || !currentSelectedProject) {
            return;
        }
        const DEFAULT_FILE: FileNode = {
            nodeId: -1,
            projectId: 1,
            parentNodeId: null,
            name: "Shared posts from the community",
            type: 'SHARED_FOLDER',
            extension: null,
            sizeBytes: null,
            storageReference: null,
            createdByUserId: -1,
            createdAt: '2025-12-01T00:00:00Z',
            updatedAt: '2025-12-01T00:00:00Z',
        };
        const subscription = projectRepository.getFiles({
            projectId: currentSelectedProject?.id,
            // search: search || "",
        })
            .subscribe({
                next: res => {
                    if (res?.status) {
                        const updatedFiles = [
                            DEFAULT_FILE,
                            ...res?.data || [],
                        ];
                        setFiles(updatedFiles);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                        setFiles([DEFAULT_FILE]);
                    }
                },
                error: err => {
                    setFiles([DEFAULT_FILE]);
                },
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [
        currentSelectedProject,
        projectRepository
    ]);

    const handleReorderList = useCallback((orderedIds: number[], parentId: number, type: ReorderType) => {
        if (!projectRepository) return;
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
    }, [selectedProject, setIsReordering, projectRepository, getProjectStructure]);

    const isInitialMount = useRef(true);

    // --- State Reset and Data Fetch on Project Change ---
    useEffect(() => {
        // 1. Set the newly selected project
        setSelectedProject(currentSelectedProject);
        setMembers([]);
        // Suppress the first run (the Strict Mode check)
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (currentSelectedProject) {
            getTeamMembers();
            getProjectStructure();
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
        if (tab !== TeamProjectTab.LIST && search) {
            setSearch("");
            getProjectStructure(true, "");
        }
    }, [tab]);

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
        files,
        setFiles,
        getFiles,
        getTeamMembers,
        getItemDependencies,
        dependencies,
        setDependencies,
        timelineData,
        setTimelineData,
        members,
        setMembers,
        overallLoading,
        setOverallLoading,
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