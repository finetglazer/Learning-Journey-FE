import KanbanBoard from "@/components/core/project-management/kanban-board";
import { PM_Task } from "@/model/project-management";

export interface TaskboardTabProps {
    tasks: PM_Task[];
};

export const TaskboardTab: React.FC<TaskboardTabProps> = ({tasks}) => {
    return (
        <KanbanBoard 
            tasks={tasks}
        />
    )
};