import { PM_Task, TaskStatus } from "@/model/project-management";

export type PM_DraggableItemData = {
    type: 'Deliverable' | 'Phase' | 'Task';
    parentId?: string;
};

export interface KanbanColumnType {
    id: TaskStatus;
    title: string;
    tasks: PM_Task[];
}

export type KanbanColumnsType = Record<TaskStatus, KanbanColumnType>;