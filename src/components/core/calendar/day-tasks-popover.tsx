"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, dayJsToISOString, getEditorAdjustedPosition, toDayJs } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent, Task, UnscheduledTask } from "@/model/task";
import { format } from "date-fns";
import { PlusCircle, Users, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface DayTasksPopoverProps {
    tasks: (Task | MonthPlanningBigTask | MonthPlanningEvent | string)[];
    day?: Date;
    week?: string;
    currentTaskType?: string;
    type?: 'month-planning' | 'month-view';
    handleBigTaskClick?: (e: React.MouseEvent<HTMLDivElement>, bigTask: MonthPlanningBigTask, scrollContainerRef?: any) => void;
    selectedTaskId?: number | string | null;
    setOpenRoutineEditor?: Dispatch<SetStateAction<boolean>>;
    setSelectedTaskId?: Dispatch<SetStateAction<number | string | null>>;
    setEditorPosition?: Dispatch<SetStateAction<any>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    setEditingMonthPlanItem?: Dispatch<SetStateAction<MonthPlanningBigTask | MonthPlanningEvent | UnscheduledTask | string | null>>;
    editorOffset?: { x: number, y: number };
    onAddTaskClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onTaskClick?: () => void;
    setPopoverState?: (prev: any) => void;
    scrollContainerRef?: any;
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
    scrollContainerRef,
    onTaskClick,
    onAddTaskClick,
    setPopoverState,
}: DayTasksPopoverProps) {
    const [bigTaskMenuOpen, setBigTaskMenuOpen] = useState<number | string | null>(null);

    /** Check if task is a MonthPlanningBigTask */
    const isBigTask = (task: any): task is MonthPlanningBigTask => {
        return typeof task === "object" && task !== null && (task as MonthPlanningBigTask).estimatedStartDate !== undefined;
    }

    /** Check if task is a MonthPlanningEvent */
    const isEvent = (task: any): task is MonthPlanningEvent => {
        return typeof task === "object" && task !== null && (task as MonthPlanningEvent).specificDate !== undefined;
    }

    return (
        <div className="w-64 rounded-lg border bg-white p-2 shadow-lg font-sans">
            <div className="flex items-center justify-between pb-2 text-sm font-bold text-gray-700">
                <span className="flex-1 text-center">
                    {(type === 'month-view' || !type) && day ? format(day, "EEE d").toUpperCase() : (week || "")}
                </span>
                {setPopoverState && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setPopoverState((prev: any) => {
                                return {
                                    ...prev,
                                    open: false,
                                    id: null,
                                    tasks: [],
                                    bigTaskId: null,
                                    type: null,
                                };
                            });
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-700 hover:bg-transparent bg-transparent transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
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
                                    { "bg-blue-200": isSelected && !isMenuOpen },
                                    isMenuOpen ? "flex flex-col" : "flex items-center gap-3"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (((task as any)?.type || "").toLowerCase() === "memorable_event") {
                                        return;
                                    }
                                    if (isBigTask(task)) {
                                        // Toggle big task menu
                                        setBigTaskMenuOpen(isMenuOpen ? null : taskId);
                                        setSelectedTaskId?.(taskId);
                                    } else {
                                        setBigTaskMenuOpen(null);
                                        onTaskClick?.();

                                        const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, scrollContainerRef.current);
                                        setSelectedTaskId?.(taskId);
                                        setEditorPosition?.(editorPosition);

                                        if (typeof task === "string" || isEvent(task)) {
                                            if (isEvent(task)) {
                                                setEditingMonthPlanItem?.({
                                                    ...task,
                                                    startTime: `${task?.specificDate}T${task?.startTime}.000Z`,
                                                    endTime: `${task?.specificDate}T${task?.endTime}.000Z`,
                                                });
                                                return;
                                            }

                                            setEditingMonthPlanItem?.(task);
                                            if (typeof task === "string") setOpenRoutineEditor?.(true);
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
                                    }
                                }}
                            >
                                {/* Task/Item row (visible when menu is closed) */}
                                {(!isBigTask(task) || !isMenuOpen) && (
                                    <>
                                        <div
                                            className={cn("h-4 w-1.5 rounded-full shrink-0", {
                                                "bg-[#91EEFF]": ((task as any)?.type || "").toLowerCase() === "memorable_event",
                                                "bg-blue-400": isEvent(task) || ((task as any)?.type || "").toLowerCase() === "event",
                                                "bg-[#68DE79]": typeof task === "string" || ((task as any)?.type || "").toLowerCase() === "routine",
                                                "bg-[#E62E7B]": isBigTask(task) || ((task as any)?.type || "").toLowerCase() === "task" || ((task as any)?.type || "").toLowerCase() === "project_work",
                                            })}
                                        />
                                        <span className="truncate">{typeof task === "string" ? task : task?.name}</span>
                                        {((task as any)?.type || "").toLowerCase() === "project_work" && (
                                            <Users
                                                size={16}
                                            />
                                        )}
                                    </>
                                )}

                                {/* Big Task Menu */}
                                {isBigTask(task) && isMenuOpen && (
                                    <div className="flex flex-col w-full gap-0.5 pt-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="h-4 w-1.5 rounded-full bg-[#E62E7B] shrink-0" />
                                            <span className="truncate font-semibold">{task?.name}</span>
                                        </div>
                                        <div
                                            className="w-full cursor-pointer text-left p-1.5 rounded hover:bg-gray-200 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTaskClick?.();
                                                setEditingMonthPlanItem?.({
                                                    ...task,
                                                    startTime: dayJsToISOString(toDayJs(task?.estimatedStartDate)),
                                                    endTime: dayJsToISOString(toDayJs(task?.estimatedEndDate)),
                                                });
                                                setEditingTask?.(null);
                                                setBigTaskMenuOpen(null);
                                                const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, scrollContainerRef.current);
                                                setEditorPosition?.(editorPosition);
                                            }}
                                        >
                                            Edit big task
                                        </div>
                                        <div
                                            className="w-full cursor-pointer text-left p-1.5 rounded hover:bg-gray-200 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBigTaskClick?.(e, task as MonthPlanningBigTask, scrollContainerRef);
                                                setEditingTask?.(null);
                                                setBigTaskMenuOpen(null);
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

            {/* Add new task button (month-planning + unscheduled-task type) */}
            {(type === 'month-planning' && currentTaskType === 'unscheduled-task') && (
                <div
                    className="flex items-center gap-2 p-2 mt-1 border-t border-gray-100 text-sm text-gray-500 cursor-pointer rounded-md hover:bg-gray-100"
                    onClick={onAddTaskClick}
                >
                    <PlusCircle className="h-4 w-4 text-gray-400" />
                    <span>Add new task</span>
                </div>
            )}
        </div>
    );
}
