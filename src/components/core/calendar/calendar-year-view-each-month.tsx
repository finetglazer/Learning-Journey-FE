"use client";

import { getTasksForDay, getTasksForDayInYearView } from "@/lib/utils";
import { Task } from "@/model/task";
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    startOfMonth,
    startOfWeek
} from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { DayCell } from "./calendar-year-view-each-day-in-month";

export interface MonthProps {
    year: number;
    monthIndex: number; // 0 for January, 1 for February, etc.
    selectedDay: Date;
    onDayClick: (day: Date) => void;
    allItems: Task[]; // Use allItems instead of dayTasks
    setEditingTask: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    selectedTaskId: number | string | null;
    setEditorPosition: Dispatch<SetStateAction<{
        x: number;
        y: number;
    }>>;
    setSelectedTaskId: Dispatch<SetStateAction<number | string | null>>;
    scrollContainerRef?: any;
}

export function Month({
    year,
    monthIndex,
    selectedDay,
    onDayClick,
    allItems,
    selectedTaskId,
    setEditingTask,
    setSelectedTaskId,
    setEditorPosition,
    scrollContainerRef,
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
                    const tasksForThisDay = getTasksForDayInYearView(allItems, day);
                    const isOpen = popoverState.open && isSameDay(day, popoverState.day!);

                    return (
                        <DayCell
                            key={day.toISOString()}
                            day={day}
                            scrollContainerRef={scrollContainerRef}
                            monthDate={monthDate}
                            selectedDay={selectedDay}
                            tasks={tasksForThisDay}
                            isOpen={isOpen}
                            onDayClick={onDayClick}
                            onOpenChange={(openState) => {
                                if (openState) {
                                    setPopoverState({ open: true, day, tasks: tasksForThisDay });
                                } else {
                                    setPopoverState({ open: false, day: null, tasks: [] });
                                }
                            }}
                            selectedTaskId={selectedTaskId}
                            setEditingTask={setEditingTask}
                            setSelectedTaskId={setSelectedTaskId}
                            setEditorPosition={setEditorPosition}
                            
                        />
                    );
                })}
            </div>
        </div>
    );
}