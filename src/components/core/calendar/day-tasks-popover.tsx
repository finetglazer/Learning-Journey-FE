"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getEditorAdjustedPosition, uuid4 } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent, Task } from "@/model/task";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface DayTasksPopoverProps {
    tasks: (Task | MonthPlanningBigTask | MonthPlanningEvent | string)[];
    day?: Date;
    week?: string;
    type?: 'month-planning' | 'month-view';
    selectedTaskId?: number | string | null;
    setSelectedTaskId?: Dispatch<SetStateAction<number | string | null>>;
    setEditorPosition?: Dispatch<SetStateAction<any>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    setEditingMonthPlanItem?: Dispatch<SetStateAction<MonthPlanningBigTask | MonthPlanningEvent | string | null>>;
    editorOffset?: { x: number, y: number };
};

export function DayTasksPopover({
    day,
    tasks,
    type,
    week,
    selectedTaskId,
    setSelectedTaskId,
    setEditingTask,
    setEditorPosition,
    setEditingMonthPlanItem,
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
                    {tasks.map((task, index) => {
                        const isSelected = typeof selectedTaskId === "string" ? selectedTaskId === (task as string) : selectedTaskId === (task as any)?.id;

                        return (
                            <div
                                key={"day-tasks-popover-".concat(index.toString())}
                                className={cn(
                                    "flex items-center gap-3 rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100",
                                    { "bg-blue-200": isSelected }
                                )}
                                onClick={(e) => {
                                    const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, editorOffset?.x, editorOffset?.y)
                                    setSelectedTaskId?.(typeof task === "string" ? task : task?.id as number);
                                    setEditorPosition?.(editorPosition);
                                    typeof task === "string" || task instanceof MonthPlanningBigTask || task instanceof MonthPlanningEvent
                                        ? setEditingMonthPlanItem?.(task)
                                        : setEditingTask?.(task); 
                                }}
                            >
                                <div
                                    className={cn("h-4 w-1.5 rounded-full shrink-0", {
                                        "bg-blue-400": typeof task !== "string" && ((task as any)?.type || "").toLowerCase() === "event",
                                        "bg-[#68DE79]": typeof task === "string" || ((task as any)?.type || "").toLowerCase() === "routine",
                                        "bg-[#E62E7B]": typeof task !== "string" && (((task as any)?.type || "").toLowerCase() === "task" || ((task as any)?.type || "").toLowerCase() === "big-task"),
                                    })}
                                />
                                <span className="truncate">{typeof task === "string" ? task : task?.name}</span>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div >
    );
}