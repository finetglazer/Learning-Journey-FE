"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getEditorAdjustedPosition } from "@/lib/utils";
import { PlusCircle, X, Calendar, ClipboardList } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface ScheduledTask {
    id: number;
    name: string;
    note?: string;
    startTime: string;
    endTime: string;
    type?: string;
    bigTaskId?: number;
}

export interface UnscheduledTask {
    id: number;
    name: string;
    note?: string;
    type?: string;
    bigTaskId?: number;
}

interface BigTaskSubtasksPopoverProps {
    bigTaskName?: string;
    bigTaskId?: number;
    scheduledTasks: ScheduledTask[];
    unscheduledTasks: UnscheduledTask[];
    selectedTaskId?: number | string | null;
    setSelectedTaskId?: Dispatch<SetStateAction<number | string | null>>;
    setEditingMonthPlanItem?: Dispatch<SetStateAction<any>>;
    setEditorPosition?: Dispatch<SetStateAction<any>>;
    scrollContainerRef?: any;
    onClose?: () => void;
    onQuickAddTask?: (taskName: string) => void;
    onTaskClick?: () => void;
}

export function BigTaskSubtasksPopover({
    bigTaskName,
    bigTaskId,
    scheduledTasks,
    unscheduledTasks,
    selectedTaskId,
    setSelectedTaskId,
    setEditingMonthPlanItem,
    setEditorPosition,
    scrollContainerRef,
    onClose,
    onQuickAddTask,
    onTaskClick,
}: BigTaskSubtasksPopoverProps) {
    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch {
            return '';
        }
    };

    const formatDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    };

    const handleTaskClick = (e: React.MouseEvent, task: ScheduledTask | UnscheduledTask, isScheduled: boolean) => {
        e.stopPropagation();
        onTaskClick?.();

        const editorPosition = getEditorAdjustedPosition(e.clientX, e.clientY, scrollContainerRef?.current);
        setSelectedTaskId?.(task.id);
        setEditorPosition?.(editorPosition);
        setEditingMonthPlanItem?.({
            ...task,
            type: "task",
            bigTaskId: bigTaskId,
        });
    };

    return (
        <div className="w-80 rounded-lg border bg-white shadow-lg font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-1.5 rounded-full bg-[#E62E7B]" />
                    <span className="font-semibold text-gray-700 truncate max-w-[220px]">
                        {bigTaskName || "Big Task"}
                    </span>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="h-7 w-7 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="p-2">
                {/* Scheduled Tasks Section */}
                <div className="mb-3">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Scheduled ({scheduledTasks.length})</span>
                    </div>
                    <ScrollArea className={cn("max-h-32", { "h-32": scheduledTasks.length > 3 })}>
                        <div className="space-y-1 pr-2">
                            {scheduledTasks.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-gray-400 italic">
                                    No scheduled tasks
                                </div>
                            ) : (
                                scheduledTasks.map((task) => (
                                    <div
                                        key={`scheduled-${task.id}`}
                                        className={cn(
                                            "rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-blue-50 flex items-center gap-2",
                                            { "bg-blue-100": selectedTaskId === task.id }
                                        )}
                                        onClick={(e) => handleTaskClick(e, task, true)}
                                    >
                                        <div className="h-3 w-1 rounded-full bg-blue-400 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="truncate block">{task.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(task.startTime)} · {formatTime(task.startTime)} - {formatTime(task.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Unscheduled Tasks Section */}
                <div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Unscheduled ({unscheduledTasks.length})</span>
                    </div>
                    <ScrollArea className={cn("max-h-32", { "h-32": unscheduledTasks.length > 3 })}>
                        <div className="space-y-1 pr-2">
                            {unscheduledTasks.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-gray-400 italic">
                                    No unscheduled tasks
                                </div>
                            ) : (
                                unscheduledTasks.map((task) => (
                                    <div
                                        key={`unscheduled-${task.id}`}
                                        className={cn(
                                            "rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100 flex items-center gap-2",
                                            { "bg-blue-100": selectedTaskId === task.id }
                                        )}
                                        onClick={(e) => handleTaskClick(e, task, false)}
                                    >
                                        <div className="h-3 w-1 rounded-full bg-[#E62E7B] shrink-0" />
                                        <span className="truncate">{task.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Quick add input */}
            {onQuickAddTask && (
                <div className="flex items-center gap-2 p-2 border-t border-gray-100">
                    <PlusCircle className="h-4 w-4 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Add new task..."
                        className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent focus:ring-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const inputValue = (e.target as HTMLInputElement).value.trim();
                                if (inputValue) {
                                    onQuickAddTask(inputValue);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
