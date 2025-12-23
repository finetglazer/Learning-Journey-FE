"use client";

import { TeamProjectPage } from "@/components/core/sidebar/pages/project/team-project";
import { TeamProjectContext, TeamProjectTab } from "@/components/core/sidebar/pages/project/team-project-context";
import { MainLayoutContext } from "@/components/layout/main-layout-context";
import { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Map URL tab param to TeamProjectTab enum
const tabParamMap: Record<string, TeamProjectTab> = {
    summary: TeamProjectTab.SUMMARY,
    list: TeamProjectTab.LIST,
    board: TeamProjectTab.TASK_BOARD,
    timeline: TeamProjectTab.TIMELINE,
    files: TeamProjectTab.SHARED_SOURCE,
    risk: TeamProjectTab.RISK_REGISTER,
};

export default function ProjectDetailPage() {
    const searchParams = useSearchParams();
    const urlTab = searchParams.get("tab");
    const urlTaskId = searchParams.get("taskId");

    const { modalStates, updateModalStates, currentSelectedProject, deleteProject } = useContext(MainLayoutContext);

    // TeamProjectContext is provided by MainLayout
    const teamProjectHooks = useContext(TeamProjectContext);

    // Sync URL tab param
    useEffect(() => {
        if (urlTab && tabParamMap[urlTab]) {
            teamProjectHooks.setTab(tabParamMap[urlTab]);
        }
    }, [urlTab, teamProjectHooks]);

    // Handle task deep-linking
    useEffect(() => {
        if (urlTaskId && currentSelectedProject && teamProjectHooks.deliverables.length > 0) {
            teamProjectHooks.setTab(TeamProjectTab.LIST);

            for (const deliverable of teamProjectHooks.deliverables) {
                for (const phase of deliverable.phases || []) {
                    const task = (phase.tasks || []).find((t: any) => t.taskId === Number(urlTaskId));
                    if (task) {
                        teamProjectHooks.setExpandedDeliverables(prev => new Set(prev).add(deliverable.deliverableIdStr));
                        teamProjectHooks.setExpandedPhases(prev => new Set(prev).add(phase.phaseIdStr));
                        teamProjectHooks.setScrollToItem(task.taskIdStr);
                        return;
                    }
                }
            }
        }
    }, [urlTaskId, currentSelectedProject, teamProjectHooks.deliverables]);

    if (!currentSelectedProject) return null;

    return (
        <TeamProjectPage
            modalStates={modalStates}
            updateModalStates={updateModalStates}
            currentSelectedProject={currentSelectedProject}
            deleteProject={deleteProject}
        />
    );
}
