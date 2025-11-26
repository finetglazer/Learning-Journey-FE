"use client";

import { ActiveRiskSummary, DeliverableProgress, ProjectTimelineType, TaskStats, TeammateWorkload } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { isNil } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
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
    const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
    const [projectTimeline, setProjectTimeline] = useState<ProjectTimelineType | null>(null);
    const [activeRiskSummary, setActiveRiskSummary] = useState<ActiveRiskSummary | null>(null);
    const [deliverableProgresses, setDeliverableProgresses] = useState<DeliverableProgress[]>([]);
    const [teammateWorkloads, setTeammateWorkloads] = useState<TeammateWorkload[]>([]);

    const {
        selectedProject,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const getTaskStats = useCallback(() => {
        projectRepository.getTaskStats({
            projectId: selectedProject?.id as number,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    setTaskStats({
                        byStatus: res?.data?.by_status,
                        byDeadline: res?.data?.by_deadline,
                    });
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [
        selectedProject,
    ]);

    const getProjectTimeline = useCallback(() => {
        projectRepository.getProjectTimeline({
            projectId: selectedProject?.id as number,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    setProjectTimeline(res?.data);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [
        selectedProject,
    ]);

    const getActiveRiskSummary = useCallback(() => {
        projectRepository.getActiveRisks({
            projectId: selectedProject?.id as number,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    setActiveRiskSummary(res?.data);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [
        selectedProject,
    ]);

    const getDeliverableProgress = useCallback(() => {
        projectRepository.getDeliverableProgress({
            projectId: selectedProject?.id as number,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    setDeliverableProgresses(res?.data?.progress || []);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [
        selectedProject,
    ]);

    const getTeammateWorkload = useCallback(() => {
        projectRepository.getTeammateWorkload({
            projectId: selectedProject?.id as number,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    setTeammateWorkloads(res?.data?.workload || []);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [
        selectedProject,
    ]);

    // Get metrics
    useEffect(() => {
        if (!selectedProject) {
            return;
        }
        getTaskStats();
        getProjectTimeline();
        getActiveRiskSummary();
        getDeliverableProgress();
        getTeammateWorkload();
    }, [selectedProject]);

    return (
        <div className="mt-5">
            <TaskMetricsDashboard
                tasksCompleted={!isNil(taskStats?.byDeadline.completed) ? taskStats?.byDeadline.completed : "---"}
                tasksDueSoon={!isNil(taskStats?.byDeadline.dueSoon) ? taskStats?.byDeadline.dueSoon : "---"}
                tasksOverdue={!isNil(taskStats?.byDeadline.overdue) ? taskStats?.byDeadline.overdue : "---"}
                unassignedTasks={!isNil(taskStats?.byDeadline.unassigned) ? taskStats?.byDeadline.unassigned : "---"}
            />

            <ProjectTimeline
                data={projectTimeline}
            />

            <div className="grid grid-cols-[48%_51%] items-center gap-4 mt-7">
                <OverallStatusChart
                    todo={!isNil(taskStats?.byStatus.toDo) ? taskStats.byStatus.toDo : "---"}
                    inReview={!isNil(taskStats?.byStatus.inReview) ? taskStats.byStatus.inReview : "---"}
                    inProgress={!isNil(taskStats?.byStatus.inProgress) ? taskStats.byStatus.inProgress : "---"}
                    done={!isNil(taskStats?.byStatus.done) ? taskStats.byStatus.done : "---"}
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