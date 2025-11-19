import { AlertModal } from "@/components/core/alert-modal/alert-modal";
import InviteMembersModal from "@/components/core/project-management/invite-members-modal";
import { ProjectHeader } from "@/components/core/project-management/project-header";
import TeamMembersViewModal from "@/components/core/project-management/team-members-view-modal";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { Project, ProjectMembershipRole, TeamMember } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ListTab } from "./tabs/list-tab/list-tab";
import { TeamProjectContext, TeamProjectContextProps } from "./team-project-context";

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
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

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
            {tab === 'list' && (
                <ListTab />
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