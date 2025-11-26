import KanbanBoard from "@/components/core/project-management/kanban-board";

export interface TaskboardTabProps {
};

export const TaskboardTab: React.FC<TaskboardTabProps> = () => {
    return (
        <KanbanBoard />
    )
};