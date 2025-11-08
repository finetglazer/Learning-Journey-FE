"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/model/task";
import {
    format,
    isSameDay,
    isSameMonth,
    isToday
} from "date-fns";
import { Dispatch, SetStateAction } from "react";
import { DayTasksPopover } from "./day-tasks-popover";


export interface DayCellProps {
    day: Date;
    monthDate: Date;
    selectedDay: Date;
    tasks: Task[];
    isOpen: boolean;
    onDayClick: (day: Date) => void;
    onOpenChange: (isOpen: boolean) => void;
    setEditingTask: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    selectedTaskId: number | string | null;
    setEditorPosition: Dispatch<SetStateAction<{ x: number; y: number; }>>;
    setSelectedTaskId: Dispatch<SetStateAction<number | string | null>>;
};

export const DayCell = ({
    day,
    monthDate,
    selectedDay,
    tasks,
    isOpen,
    onDayClick,
    onOpenChange,
    ...popoverProps // Passes down setEditingTask, selectedTaskId, etc.
}: DayCellProps) => {

    const hasTasks = tasks.length > 0;

    // This is the visual representation of the day cell
    const dayCell = (
        <div
            onClick={() => onDayClick(day)}
            className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full cursor-pointer relative",
                {
                    "hover:bg-gray-100":
                        isSameMonth(day, monthDate) &&
                        !isToday(day) &&
                        !isSameDay(day, selectedDay),
                    "bg-gray-800 text-white":
                        isSameMonth(day, monthDate) &&
                        isSameDay(day, selectedDay) &&
                        !isToday(day),
                    "bg-blue-600 text-white":
                        isSameMonth(day, monthDate) && isToday(day),
                    "ring-2 ring-gray-800":
                        isSameMonth(day, monthDate) &&
                        isToday(day) &&
                        isSameDay(day, selectedDay),
                    "text-gray-400": !isSameMonth(day, monthDate)
                }
            )}
        >
            {format(day, "d")}

            {/* Visual dot indicator for tasks */}
            {hasTasks && isSameMonth(day, monthDate) && (
                <div
                    className={cn(
                        "absolute bottom-0.5 w-1.25 h-1.25 rounded-full",
                        isSameDay(day, selectedDay) || isToday(day)
                            ? "bg-white"
                            : "bg-orange-600"
                    )}
                ></div>
            )}
        </div>
    );

    // Only wrap in Popover if the day has tasks and is in the current month
    if (hasTasks && isSameMonth(day, monthDate)) {
        return (
            <Popover
                open={isOpen}
                onOpenChange={onOpenChange}
            >
                <PopoverTrigger asChild>
                    {dayCell}
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" side="bottom" align="start">
                    <DayTasksPopover
                        day={day}
                        tasks={tasks} // Pass the tasks for this day
                        onTaskClick={() => onOpenChange(false)} // Close popover on task click
                        {...popoverProps} // Pass down selectedTaskId, setEditingTask, etc.
                        editorOffset={{ x: 120, y: 0 }}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    // If no tasks, just render the plain day cell
    return dayCell;
};
