"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getEditorAdjustedPosition } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent, Task, UnscheduledTask } from "@/model/task";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
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
    setEditingMonthPlanItem?: Dispatch<SetStateAction<MonthPlanningBigTask | MonthPlanningEvent | UnscheduledTask | string | null>>;
    editorOffset?: { x: number, y: number };
    onAddTaskClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
    onAddTaskClick,
}: DayTasksPopoverProps) {

    /**
     * Checks if the task is a MonthPlanningBigTask by checking for a unique property.
     */
    const isBigTask = (task: any): task is MonthPlanningBigTask => {
        return typeof task === "object" && task !== null && (task as MonthPlanningBigTask).estimatedStartDate !== undefined;
    }

    /**
     * Checks if the task is a MonthPlanningEvent by checking for a unique property.
     */
    const isEvent = (task: any): task is MonthPlanningEvent => {
        return typeof task === "object" && task !== null && (task as MonthPlanningEvent).specificDate !== undefined;
    }

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

                                    if (typeof task === "string" || isBigTask(task) || isEvent(task)) {
                                        setEditingMonthPlanItem?.(task);
                                        setEditingTask?.(null);
                                    }
                                    else if (type === 'month-planning') {
                                        setEditingMonthPlanItem?.(task as UnscheduledTask);
                                        setEditingTask?.(null);
                                    }
                                    else {
                                        setEditingTask?.(task as Task);
                                        setEditingMonthPlanItem?.(null);
                                    }
                                }}
                            >
                                <div
                                    className={cn("h-4 w-1.5 rounded-full bg-[#E62E7B] shrink-0", {
                                        "bg-blue-400": isEvent(task),
                                        "bg-[#68DE79]": typeof task === "string" || ((task as any)?.type || "").toLowerCase() === "routine",
                                        "bg-[#E62E7B]": isBigTask(task) || ((task as any)?.type || "").toLowerCase() === "task",
                                    })}
                                />
                                <span className="truncate">{typeof task === "string" ? task : task?.name}</span>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
            {type === 'month-planning' && (
                <div
                    className="flex items-center gap-2 p-2 mt-1 border-t border-gray-100 text-sm text-gray-500 cursor-pointer rounded-md hover:bg-gray-100"
                    onClick={onAddTaskClick}
                >
                    <PlusCircle className="h-4 w-4 text-gray-400" />
                    <span>Add new task</span>
                </div>
            )}
        </div >
    );
}

