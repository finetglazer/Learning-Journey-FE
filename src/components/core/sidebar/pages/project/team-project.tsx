import { AlertModal } from "@/components/core/alert-modal/alert-modal";
import InviteMembersModal from "@/components/core/project-management/invite-members-modal";
import { ProjectHeader } from "@/components/core/project-management/project-header";
import TeamMembersViewModal from "@/components/core/project-management/team-members-view-modal";
import { PM_Task, Project } from "@/model/project-management";
import { useContext, useMemo } from "react";
import { ListTab } from "./tabs/list-tab/list-tab";
import { TaskboardTab } from "./tabs/task-board-tab/task-board-tab";
import { TeamProjectContext, TeamProjectContextProps, TeamProjectTab } from "./team-project-context";

export interface TeamProjectPageProps {
    currentSelectedProject: Project | null;
    modalStates: boolean[];
    updateModalStates: (index: number, isOpen: boolean) => void;
    deleteProject: (projectId: number) => void;
};

export const TeamProjectPage = ({
    currentSelectedProject,
    modalStates,
    updateModalStates,
    deleteProject,
}: TeamProjectPageProps) => {
    const {
        tab,
        getTeamMembers,
        members,
        currentMember,
        deliverables,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const allTasks = useMemo(() => {
        let t: PM_Task[] = [];
        deliverables.forEach(deliverable => {
            deliverable.phases.forEach(phase => {
                phase.tasks.forEach(task => {
                    t.push(task);
                })
            })
        });
        return t;
    }, [deliverables]);

    return (
        <div className="relative w-full pl-2 pr-2">
            <ProjectHeader
                role={currentMember?.role}
                members={members}
                modalStates={modalStates}
                updateModalStates={updateModalStates}
                currentSelectedProject={currentSelectedProject}
            />

            {/* List tab */}
            {tab === TeamProjectTab.LIST && (
                <ListTab />
            )}

            {tab === TeamProjectTab.TASK_BOARD && (
                <TaskboardTab 
                    tasks={allTasks}
                />
            )}

            {/* Invite Members Modal */}
            {modalStates[1] && (
                <InviteMembersModal
                    teamMembers={members}
                    currentSelectedProject={currentSelectedProject}
                    getTeamMembers={getTeamMembers}
                    onClose={() => {
                        updateModalStates(1, false);
                    }}
                />
            )}

            {/* Team Members View Modal */}
            {modalStates[2] && (
                <TeamMembersViewModal
                    members={members}
                    onClose={() => {
                        updateModalStates(2, false);
                    }}
                />
            )}

            {/* Confirm Delete Project Modal */}
            {modalStates[3] && (
                <AlertModal
                    alertMessage={{
                        type: "warning",
                        title: "Confirm to delete project " + currentSelectedProject?.name,
                        description: "This action is permanent and cannot be undone. All project data, including tasks, files, and member access, will be deleted forever.",
                        proceedAnyway: () => {
                            if (currentSelectedProject) {
                                deleteProject(currentSelectedProject?.id);
                            }
                        },
                    }}
                    onClose={() => {
                        updateModalStates(3, false);
                    }}
                />
            )}
        </div>
    )
}