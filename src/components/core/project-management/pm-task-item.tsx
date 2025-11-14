import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { PM_Task, TaskPriority, TaskStatus } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { Circle, MoreHorizontal, ChevronDown, CheckCircle, RefreshCw } from 'lucide-react';
import React from 'react';

// --- STYLES BASED ON IMAGE ---

// Use existing priority styles, but map to text/icon
const priorityUi: Record<TaskPriority, { text: string, icon: React.ReactNode }> = {
    [TaskPriority.MINOR]: { text: 'text-gray-700', icon: <ChevronDown size={16} /> },
    [TaskPriority.MEDIUM]: { text: 'text-blue-700', icon: <ChevronDown size={16} /> },
    [TaskPriority.MAJOR]: { text: 'text-yellow-800', icon: <ChevronDown size={16} /> },
    [TaskPriority.CRITICAL]: { text: 'text-red-700', icon: <ChevronDown size={16} /> },
};

// Create new status styles
const statusUi: Record<TaskStatus, { text: string, icon: React.ReactNode, bg: string }> = {
    [TaskStatus.TO_DO]: {
        text: 'text-gray-700',
        icon: <Circle size={14} className="text-gray-400" />,
        bg: 'bg-gray-100'
    },
    [TaskStatus.IN_PROGRESS]: {
        text: 'text-blue-700',
        icon: <RefreshCw size={14} className="text-blue-500" />,
        bg: 'bg-blue-100'
    },
    [TaskStatus.IN_REVIEW]: {
        text: 'text-indigo-700',
        icon: <CheckCircle size={14} className="text-indigo-500" />,
        bg: 'bg-indigo-100'
    },
    [TaskStatus.DONE]: {
        text: 'text-green-700',
        icon: <CheckCircle size={14} className="text-green-500" />,
        bg: 'bg-green-100'
    },
};

export function PM_TaskItem({ task }: { task: PM_Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.taskId,
        data: {
            type: 'Task',
            parentId: task.phaseId,
        } as PM_DraggableItemData,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Get the UI details
    const taskStatus = statusUi[task.status] || statusUi[TaskStatus.TO_DO];
    const taskPriority = priorityUi[task.priority] || priorityUi[TaskPriority.MINOR];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                flex items-center justify-between
                py-2.5 px-4 ml-10 border-t border-gray-100
                cursor-grab active:cursor-grabbing
                group
            `}
        >
            {/* Left Side: Task Info */}
            <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                    <Circle size={18} />
                </button>
                <span className="text-sm font-medium text-gray-500">{task.key}</span>
                <span className="text-sm text-gray-900">{task.name}</span>
                <button className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-700">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Right Side: Metadata from image */}
            <div className="flex items-center gap-4">
                {/* Status Badge */}
                <button className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${taskStatus.bg} ${taskStatus.text}`}>
                    {taskStatus.icon}
                    <span className="capitalize">{task.status.replace('_', ' ').toLowerCase()}</span>
                </button>

                {/* Priority Badge */}
                <button className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${taskPriority.text}`}>
                    {taskPriority.icon}
                    <span className="capitalize">{task.priority.toLowerCase()}</span>
                </button>

                {/* Avatars from image */}
                <div className="flex items-center -space-x-2">
                    {/* Placeholder Avatars */}
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://placehold.co/24x24/E2E8F0/64748B?text=A" alt="Assignee 1" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://placehold.co/24x24/E0E7FF/4338CA?text=B" alt="Assignee 2" />
                </div>
            </div>
        </div>
    );
};