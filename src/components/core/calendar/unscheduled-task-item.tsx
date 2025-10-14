"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnscheduledTask } from "@/model/task";
import React, { useState, useEffect, useRef } from "react";
import { toDayJs } from "@/lib/utils";

interface UnscheduledTaskItemProps {
    task: UnscheduledTask;
    onRemove?: (taskId: string) => void;
    onTitleChange?: (taskId: string, newTitle: string) => void;
    draggable?: boolean;
}

export function UnscheduledTaskItem({ task, onRemove, onTitleChange, draggable = true }: UnscheduledTaskItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { type: 'unscheduled-task', task }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || "");
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the input when entering edit mode
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        onTitleChange?.(task.id, title);
        setIsEditing(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSave();
        } else if (event.key === 'Escape') {
            setTitle(task.title || "");
            setIsEditing(false);
        }
    };

    const style = { opacity: isDragging ? 0.5 : 1 };
    const bigTaskStartDate = task?.bigTaskStartTime ? toDayJs(task?.bigTaskStartTime).get("date").toString().padStart(2, "0") : null;
    const bigTaskEndDate = task?.bigTaskEndTime ? toDayJs(task?.bigTaskEndTime).get("date").toString().padStart(2, "0") : null;

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-2 rounded-md bg-white w-full">
            <div className="flex items-center gap-3">
                {draggable && (
                    <button {...listeners} {...attributes} className="cursor-grab text-gray-400">
                        <GripVertical size={18} />
                    </button>
                )}

                {isEditing ? (
                    <Input
                        ref={inputRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-7 ml-2 text-sm"
                    />
                ) : (
                    <span
                        onDoubleClick={() => setIsEditing(true)}
                        className="text-sm text-gray-600 ml-2 flex-grow"
                    >
                        {task?.title}
                    </span>
                )}

                {bigTaskStartDate && bigTaskEndDate && (
                    <span className="italic text-gray-600 text-[0.95rem]">({bigTaskStartDate}-{bigTaskEndDate})</span>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove?.(task.id)}
                className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
            >
                <MinusCircle size={18} />
            </Button>
        </div>
    );
}