"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getTasksForDay } from "@/lib/utils";
import { Task } from "@/model/task";
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { DayTasksPopover } from "./day-tasks-popover";

interface MonthProps {
    year: number;
    monthIndex: number; // 0 for January, 1 for February, etc.
    selectedDay: Date;
    onDayClick: (day: Date) => void;
    dayTasks: Task[];
    setEditingTask: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    selectedTaskId: number | string | null;
    setEditorPosition: Dispatch<SetStateAction<{
        x: number;
        y: number;
    }>>;
    setSelectedTaskId: Dispatch<SetStateAction<number | string | null>>;
}

export function Month({
    year,
    monthIndex,
    selectedDay,
    onDayClick,
    dayTasks,
    selectedTaskId,
    setEditingTask,
    setSelectedTaskId,
    setEditorPosition,
}: MonthProps) {
    const monthDate = new Date(year, monthIndex);

    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);
    const startDate = startOfWeek(firstDay);
    const endDate = endOfWeek(lastDay);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        day: Date | null;
        tasks: Task[];
    }>({ open: false, day: null, tasks: [] });
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div>
            <h2 className="text-center font-semibold text-gray-800 mb-4">
                {format(monthDate, "MMMM")}
            </h2>
            <div className="grid grid-cols-7 gap-y-2 text-center place-items-center text-sm">
                {daysOfWeek.map((day, index) => (
                    <div key={day + "-" + index} className="font-medium text-gray-500">{day}</div>
                ))}

                {/* --- Day numbers --- */}
                {days.map((day) => {
                    return (
                        // 2. Each day is wrapped in its own Popover
                        <Popover
                            key={day.toISOString()}
                            open={popoverState.open && isSameDay(day, popoverState.day!)}
                            onOpenChange={(isOpen) => {
                                if (isOpen) {
                                    setPopoverState({ open: true, day, tasks: dayTasks });
                                } else {
                                    setPopoverState({ open: false, day: null, tasks: [] });
                                }
                            }}
                        >
                            {/* 4. The day cell is the trigger */}
                            <PopoverTrigger asChild>
                                <div
                                    onClick={() => onDayClick(day)}
                                    className={cn(
                                        "flex items-center justify-center h-8 w-8 rounded-full cursor-pointer relative", // Added 'relative'
                                        {
                                            // Default hover for in-month, non-special days
                                            "hover:bg-gray-100":
                                                isSameMonth(day, monthDate) &&
                                                !isToday(day) &&
                                                !isSameDay(day, selectedDay),

                                            // Selected day (but not today)
                                            "bg-gray-800 text-white":
                                                isSameMonth(day, monthDate) &&
                                                isSameDay(day, selectedDay) &&
                                                !isToday(day),

                                            // Today
                                            "bg-blue-600 text-white":
                                                isSameMonth(day, monthDate) && isToday(day),

                                            // Ring for Today + Selected
                                            "ring-2 ring-gray-800":
                                                isSameMonth(day, monthDate) &&
                                                isToday(day) &&
                                                isSameDay(day, selectedDay),

                                            // --- Rule for OUT-OF-MONTH days ---
                                            "text-gray-400": !isSameMonth(day, monthDate)
                                        }
                                    )}
                                >
                                    {format(day, "d")}

                                    {/* 5. Add a visual dot indicator for tasks
                                    {hasTasks && (
                                        <div
                                            className={cn(
                                                "absolute bottom-0.5 w-1.25 h-1.25 rounded-full",
                                                // Change dot color to be visible on dark/blue backgrounds
                                                isSameDay(day, selectedDay) || isToday(day)
                                                    ? "bg-white"
                                                    : "bg-orange-600"
                                            )}
                                        ></div>
                                    )} */}
                                </div>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" side="bottom" align="start">
                                <DayTasksPopover
                                    day={day}
                                    tasks={dayTasks}
                                    selectedTaskId={selectedTaskId}
                                    setEditingTask={setEditingTask}
                                    setSelectedTaskId={setSelectedTaskId}
                                    setEditorPosition={setEditorPosition}
                                    editorOffset={{ x: 120, y: 0 }}
                                />
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </div>
        </div>
    );
}