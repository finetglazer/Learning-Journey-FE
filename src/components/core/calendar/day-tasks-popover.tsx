"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, dayJsToISOString, getEditorAdjustedPosition, toDayJs } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent, Task, UnscheduledTask } from "@/model/task";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface DayTasksPopoverProps {
    tasks: (Task | MonthPlanningBigTask | MonthPlanningEvent | string)[];
    day?: Date;
    week?: string;
    currentTaskType?: string;
    type?: 'month-planning' | 'month-view';
    handleBigTaskClick?: (e: React.MouseEvent<HTMLDivElement>, bigTask: MonthPlanningBigTask) => void;
    selectedTaskId?: number | string | null;
    setOpenRoutineEditor?: Dispatch<SetStateAction<boolean>>;
    setSelectedTaskId?: Dispatch<SetStateAction<number | string | null>>;
    setEditorPosition?: Dispatch<SetStateAction<any>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    setEditingMonthPlanItem?: Dispatch<SetStateAction<MonthPlanningBigTask | MonthPlanningEvent | UnscheduledTask | string | null>>;
    editorOffset?: { x: number, y: number };
    onAddTaskClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onTaskClick?: () => void;
};

export function DayTasksPopover({
    day,
    tasks,
    currentTaskType,
    type,
    week,
    handleBigTaskClick,
    selectedTaskId,
    setOpenRoutineEditor,
    setSelectedTaskId,
    setEditingTask,
    setEditorPosition,
    setEditingMonthPlanItem,
    editorOffset,
    onTaskClick,
    onAddTaskClick,
}: DayTasksPopoverProps) {
    const [bigTaskMenuOpen, setBigTaskMenuOpen] = useState<number | string | null>(null);

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
                        const taskId = typeof task === "string" ? task : task?.id as (number | string);
                        const isSelected = selectedTaskId === taskId;
                        const isMenuOpen = bigTaskMenuOpen === taskId;

                        return (
                            <div
                                key={"day-tasks-popover-".concat(index.toString())}
                                className={cn(
                                    "rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100",
                                    { "bg-blue-200": isSelected && !isMenuOpen }, // Only highlight if menu isn't open
                                    isMenuOpen ? "flex flex-col" : "flex items-center gap-3" // Adjust layout for menu
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isBigTask(task)) {
                                        // It's a big task, toggle its menu
                                        setBigTaskMenuOpen(isMenuOpen ? null : taskId);
                                        // Also set it as selected
                                        setSelectedTaskId?.(taskId);
                                    } else {
                                        // It's not a big task, close any open menu
                                        setBigTaskMenuOpen(null);
                                        onTaskClick?.();

                                        // --- Standard click logic for other items ---
                                        const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, editorOffset?.x, editorOffset?.y)
                                        setSelectedTaskId?.(taskId);
                                        setEditorPosition?.(editorPosition);

                                        if (typeof task === "string" || isEvent(task)) {
                                            // With event, add startTime & endTime for TaskEditor
                                            if (isEvent(task)) {
                                                setEditingMonthPlanItem?.({
                                                    ...task,
                                                    startTime: `${task?.specificDate}T${task?.startTime}.000Z`,
                                                    endTime: `${task?.specificDate}T${task?.endTime}.000Z`,
                                                });
                                                return;
                                            }
                                            setEditingMonthPlanItem?.(task);
                                            if (typeof task === "string") {
                                                setOpenRoutineEditor?.(true);
                                            }
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
                                        // --- End standard click logic ---
                                    }
                                }}
                            >
                                {/* Task/Item row (visible when menu is closed) */}
                                {(!isBigTask(task) || !isMenuOpen) && (
                                    <>
                                        <div
                                            className={cn("h-4 w-1.5 rounded-full bg-[#E62E7B] shrink-0", {
                                                "bg-blue-400": isEvent(task),
                                                "bg-[#68DE79]": typeof task === "string" || ((task as any)?.type || "").toLowerCase() === "routine",
                                                "bg-[#E62E7B]": isBigTask(task) || ((task as any)?.type || "").toLowerCase() === "task",
                                            })}
                                        />
                                        <span className="truncate">{typeof task === "string" ? task : task?.name}</span>
                                    </>
                                )}

                                {isBigTask(task) && isMenuOpen && (
                                    <div className="flex flex-col w-full gap-0.5 pt-1">
                                        {/* Original Title (non-clickable) */}
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="h-4 w-1.5 rounded-full bg-[#E62E7B] shrink-0" />
                                            <span className="truncate font-semibold">{task?.name}</span>
                                        </div>
                                        {/* Menu Options */}
                                        <div
                                            className="w-full cursor-pointer text-left p-1.5 rounded hover:bg-gray-200 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent onClick
                                                onTaskClick?.();
                                                // 1. "Edit big task"
                                                setEditingMonthPlanItem?.({
                                                    ...task,
                                                    // Add startTime & endTime for Task editor
                                                    startTime: dayJsToISOString(toDayJs(task?.estimatedStartDate)),
                                                    endTime: dayJsToISOString(toDayJs(task?.estimatedEndDate)),
                                                });
                                                setEditingTask?.(null);
                                                setBigTaskMenuOpen(null); // Close menu
                                                const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, editorOffset?.x, editorOffset?.y)
                                                setEditorPosition?.(editorPosition);
                                            }}
                                        >
                                            Edit big task
                                        </div>
                                        <div
                                            className="w-full cursor-pointer text-left p-1.5 rounded hover:bg-gray-200 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent onClick
                                                // 2. "Show unscheduled tasks"
                                                handleBigTaskClick?.(e, task as MonthPlanningBigTask);
                                                setEditingTask?.(null);
                                                setBigTaskMenuOpen(null); // Close menu
                                            }}
                                        >
                                            Show unscheduled tasks
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
            {type === 'month-planning' && currentTaskType === 'big-task' && (
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

