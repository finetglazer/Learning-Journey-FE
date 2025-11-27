"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserTaskItem } from "@/model/project-management";
import { useDraggable } from "@dnd-kit/core";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface BufferListProjectTaskProps {
    task: UserTaskItem;
    hiddenTasks?: Record<number, boolean>;
    setHiddenTasks?: Dispatch<SetStateAction<Record<number, boolean>>>;
    showAllTasks?: boolean;
};

export const BufferListProjectTask = ({
    task,
    hiddenTasks,
    setHiddenTasks,
    showAllTasks,
}: BufferListProjectTaskProps) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.pmTaskId,
        data: { type: 'project-task', task }
    });

    const style = { opacity: isDragging ? 0.5 : 1 };

    const toggleTask = (taskId: number) => {
        setHiddenTasks?.(prev => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    return (
        <div
            key={task.pmTaskId}
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center relative justify-between py-2 rounded-md hover:bg-gray-50 transition-colors text-sm",
                // If hidden but showing all, maybe dim it?
                hiddenTasks?.[task.pmTaskId] && showAllTasks ? "opacity-50" : "opacity-100"
            )}
        >
            <div className="flex items-center gap-2">
                <button {...listeners} {...attributes} className="cursor-grab text-gray-400">
                    <GripVertical size={18} />
                </button>

                {/* Task Name & Date */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={cn(
                            "truncate font-medium block max-w-[90%] mt-1",
                            task.overdue ? "text-pink-500" : "text-gray-600"
                        )}>
                            {task.name.concat(task.deadline ? ` - ${task.deadline}` : "")}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                        <p>{task.name} - {task.deadline}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            {/* Visibility Toggle Button (Eye) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.pmTaskId);
                }}
                className="text-gray-400 hover:text-gray-700 focus:outline-none absolute right-0"
                title={hiddenTasks?.[task.pmTaskId] ? "Show task" : "Hide task"}
            >
                {hiddenTasks?.[task.pmTaskId] ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
};