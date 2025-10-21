"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getEditorAdjustedPosition, uuid4 } from "@/lib/utils";
import { Task } from "@/model/task";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface DayTasksPopoverProps {
    tasks: Task[];
    day?: Date;
    week?: string;
    type?: 'month-planning' | 'month-view';
    selectedTaskId?: string;
    setSelectedTaskId?: Dispatch<SetStateAction<string>>;
    setEditorPosition?: Dispatch<SetStateAction<any>>;
    editorOffset?: { x: number, y: number };
};

export function DayTasksPopover({
    day,
    tasks,
    type,
    week,
    selectedTaskId,
    setSelectedTaskId,
    setEditorPosition,
    editorOffset,
}: DayTasksPopoverProps) {
    return (
        <div className="w-64 rounded-lg border bg-white p-2 shadow-lg font-sans">
            {/* Header with Day and Date */}
            <div className="mb-2 border-b pb-2 text-center text-sm font-bold text-gray-700">
                {(type === 'month-view' || !type) && day ? format(day, "EEE d").toUpperCase() : (week || "")}
            </div>

            {/* Scrollable List of Tasks */}
            <ScrollArea className="h-72">
                <div className="space-y-1 p-1">
                    {tasks.map((task) => {
                        const isEvent = task.type === 'event';
                        const isSelected = selectedTaskId === task.id;

                        return (
                            <div
                                key={task.id}
                                className={cn(
                                    "flex items-center gap-3 rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100",
                                    { "bg-blue-200": isSelected }
                                )}
                                onClick={(e) => {
                                    const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, editorOffset?.x, editorOffset?.y)
                                    setSelectedTaskId?.(task.id);
                                    setEditorPosition?.(editorPosition);
                                }}
                            >
                                <div
                                    className={cn("h-4 w-1.5 rounded-full shrink-0", {
                                        "bg-blue-400": isEvent,
                                        "bg-[#E62E7B]": !isEvent,
                                    })}
                                />
                                <span className="truncate">{task?.title}</span>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div >
    );
}