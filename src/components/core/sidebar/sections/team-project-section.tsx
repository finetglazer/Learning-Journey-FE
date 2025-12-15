import { Project } from "@/model/project-management";
import { Dispatch, SetStateAction, useEffect } from "react";
import CreateProjectModal from "../../project-management/create-project-modal";
import { AlertModal } from "../../alert-modal/alert-modal";

export interface TeamProjectSectionProps {
    teamProjects: Project[];
    setTeamProjects: Dispatch<SetStateAction<Project[]>>;
    getTeamProjects: () => void;
    modalStates: boolean[];
    updateModalStates: (index: number, isOpen: boolean) => void;
    currentSelectedProject: null | Project;
    deleteProject: (projectId: number) => void;
};

export const TeamProjectSection = ({
    teamProjects,
    setTeamProjects,
    getTeamProjects,
    modalStates,
    updateModalStates,
    currentSelectedProject,
    deleteProject,
}: TeamProjectSectionProps) => {
    useEffect(() => {
        getTeamProjects();
    }, []);

    return (
        <>
            {/* Create Project Modal */}
            {modalStates[0] && (
                <CreateProjectModal
                    onClose={() => {
                        updateModalStates(0, false);
                    }}
                    handleReload={getTeamProjects}
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
        </>
    )
}
