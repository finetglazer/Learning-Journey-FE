"use client";

import { ActiveRiskSummary, DeliverableProgress, ProjectTimelineType, TaskStats, TeammateWorkload } from "@/model/project-management";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { isNil } from "lodash";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { ActiveRisksList } from "./active-list-risk";
import { DeliverableProgressChart } from "./deliverable-progress-chart";
import { OverallStatusChart } from "./overall-status-chart";
import { ProjectTimeline } from "./project-timeline";
import { TaskMetricsDashboard } from "./task-metrics-dashboard";
import { TeammateWorkloadChart } from "./teammate-workload-chart";

export interface SummaryTabProps {

};

export const SummaryTab = ({ }: SummaryTabProps) => {
    const [summaryData, setSummaryData] = useState<{
        taskStats: TaskStats | null,
        projectTimeline: ProjectTimelineType | null,
        activeRiskSummary: ActiveRiskSummary | null,
        deliverableProgresses: DeliverableProgress[],
        teammateWorkloads: TeammateWorkload[]
    }>({
        taskStats: null,
        projectTimeline: null,
        activeRiskSummary: null,
        deliverableProgresses: [],
        teammateWorkloads: []
    });

    const {
        selectedProject,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        if (!selectedProject || !projectRepository) return;

        const sub = projectRepository.getProjectDashboardSummary({
            projectId: selectedProject.id
        }).subscribe({
            next: (res) => {
                if (res?.status) { // derived from map(res => res?.data) in repo
                    setSummaryData({
                        taskStats: {
                            by_status: res?.data?.taskStats?.by_status,
                            by_deadline: res?.data?.taskStats?.by_deadline
                        },
                        projectTimeline: res?.data?.timeline,
                        activeRiskSummary: res?.data?.riskSummary,
                        deliverableProgresses: res?.data?.deliverableProgress || [],
                        teammateWorkloads: res?.data?.teammateWorkload || []
                    });
                }
            },
            error: (err) => {
                console.error("Failed to fetch dashboard summary", err);
                toast.error("Failed to load dashboard summary");
            }
        });

        return () => sub.unsubscribe();
    }, [selectedProject, projectRepository]);

    // Destructure for render
    const { taskStats, projectTimeline, activeRiskSummary, deliverableProgresses, teammateWorkloads } = summaryData;

    return (
        <div className="mt-5">
            <TaskMetricsDashboard
                tasksCompleted={!isNil(taskStats?.by_deadline.completed) ? taskStats?.by_deadline.completed : "---"}
                tasksDueSoon={!isNil(taskStats?.by_deadline.dueSoon) ? taskStats?.by_deadline.dueSoon : "---"}
                tasksOverdue={!isNil(taskStats?.by_deadline.overdue) ? taskStats?.by_deadline.overdue : "---"}
                unassignedTasks={!isNil(taskStats?.by_deadline.unassigned) ? taskStats?.by_deadline.unassigned : "---"}
            />

            <ProjectTimeline
                data={projectTimeline}
            />

            <div className="grid grid-cols-[48%_51%] items-center gap-4 mt-7">
                <OverallStatusChart
                    todo={!isNil(taskStats?.by_status.toDo) ? taskStats.by_status.toDo : "---"}
                    inReview={!isNil(taskStats?.by_status.inReview) ? taskStats.by_status.inReview : "---"}
                    inProgress={!isNil(taskStats?.by_status.inProgress) ? taskStats.by_status.inProgress : "---"}
                    done={!isNil(taskStats?.by_status.done) ? taskStats.by_status.done : "---"}
                />

                <ActiveRisksList
                    data={activeRiskSummary}
                />
            </div>

            <div className="grid grid-cols-[48%_51%] items-center gap-4 mt-7 mb-10">
                <DeliverableProgressChart
                    data={deliverableProgresses}
                />

                <TeammateWorkloadChart
                    data={teammateWorkloads}
                />
            </div>
        </div>
    );
};