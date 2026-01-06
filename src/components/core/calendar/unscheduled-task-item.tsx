"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, toDayJs } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledTask } from "@/model/task";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, MinusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface UnscheduledTaskItemProps {
    task?: UnscheduledTask;
    bigTask?: UnscheduledBigTask;
    onRemove?: (taskId: string) => void;
    onTitleChange?: (taskId: string, newTitle: string) => void;
    draggable?: boolean;
}

export function UnscheduledTaskItem({ task, bigTask, onRemove, onTitleChange, draggable = true }: UnscheduledTaskItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task?.id ?? bigTask?.bigTaskId ?? '',
        data: { type: 'unscheduled-task', task }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task?.name || bigTask?.name || "");
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the input when entering edit mode
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (task?.id) {
            onTitleChange?.(String(task.id), title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSave();
        } else if (event.key === 'Escape') {
            setTitle(task?.name || bigTask?.name || "");
            setIsEditing(false);
        }
    };

    const style = { opacity: isDragging ? 0.7 : 1 };
    const bigTaskStartDate = bigTask?.estimatedStartDate ? toDayJs(bigTask?.estimatedStartDate).get("date").toString().padStart(2, "0") : null;
    const bigTaskEndDate = bigTask?.estimatedEndDate ? toDayJs(bigTask?.estimatedEndDate).get("date").toString().padStart(2, "0") : null;

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
                        className="text-sm text-black ml-2 flex-grow"
                    >
                        {task?.name || bigTask?.bigTaskName}
                    </span>
                )}

                {bigTaskStartDate && bigTaskEndDate && (
                    <>
                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-[#E62E7B] text-white text-sm sm:text-base font-bold")}>
                            {toDayJs(bigTask?.estimatedStartDate, 0).get("date").toString().padStart(2)}
                        </div>
                        <span>-</span>
                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-[#E62E7B] text-white text-sm sm:text-base font-bold")}>
                            {toDayJs(bigTask?.estimatedEndDate, 0).get("date").toString().padStart(2)}
                        </div>
                    </>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => task?.id && onRemove?.(String(task.id))}
                className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
            >
                {task && (
                    <MinusCircle size={18} />
                )}
            </Button>
        </div>
    );
}