import { ProjectHeader } from "@/components/core/project-management/project-header";
import { Project } from "@/model/project-management";

export interface TeamProjectPageProps {
    currentSelectedProject: Project | null;
};

export const TeamProjectPage = ({
    currentSelectedProject,
}: TeamProjectPageProps) => {
    return (
        <ProjectHeader />
    )
}