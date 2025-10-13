"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnscheduledTask } from "@/model/task";

interface UnscheduledTaskItemProps {
    task: UnscheduledTask;
    onRemove?: (taskId: string) => void;
    draggable?: boolean;
}

export function UnscheduledTaskItem({ task, onRemove, draggable = true }: UnscheduledTaskItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { type: 'unscheduled-task', task }
    });

    const style = {
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-2 rounded-md bg-white">
            <div className="flex items-center">
                {draggable && (
                    <button {...listeners} {...attributes} className="cursor-grab text-gray-400">
                        <GripVertical size={18} />
                    </button>
                )}
                <span className="text-sm text-gray-600 ml-2">{task?.title}</span>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove?.(task.id)}
                className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer"
            >
                <MinusCircle size={18} />
            </Button>
        </div>
    );
}