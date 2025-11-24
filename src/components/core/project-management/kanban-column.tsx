import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumnType } from './type';
import TaskCard from './kanban-task-card';
import { TaskStatus } from '@/model/project-management';

export interface KanbanColumnProps {
    column: KanbanColumnType;
}

const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TO_DO:
            return 'bg-yellow-200 text-[#FFCB33] font-bold';
        case TaskStatus.IN_PROGRESS:
            return 'bg-pink-200 text-[#E62E7B]';
        case TaskStatus.IN_REVIEW:
            return 'bg-purple-200 text-[#9333EA]';
        case TaskStatus.DONE:
            return 'bg-green-100 text-[#91FFA2]';
        default:
            return 'bg-gray-300 text-gray-800';
    }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            tasks: column.tasks,
        },
    });

    const droppableStyle = {
        backgroundColor: isOver ? 'rgb(239 246 255)' : 'rgb(243 244 246)',
    };

    const badgeClass = getStatusBadgeStyle(column.id);
    const taskCount = column.tasks.length;

    return (
        <div
            ref={setNodeRef}
            style={droppableStyle}
            className="flex flex-col p-3 rounded-lg min-h-80 transition-colors"
        >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 uppercase text-sm">
                    {column.title}{' '}
                    <span
                        className={`
                            ${badgeClass}
                            text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center 
                            min-w-[20px] justify-center
                        `}
                    >
                        {taskCount}
                    </span>
                </h3>
            </div>

            {/* Task List */}
            <div className="flex flex-col">
                {column.tasks.map((task) => (
                    <TaskCard
                        key={task.taskIdStr}
                        task={task}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanColumn;