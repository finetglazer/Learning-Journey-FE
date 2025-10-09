"use client";

import { cn } from "@/lib/utils";
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
} from "date-fns";

interface MonthProps {
    year: number;
    monthIndex: number; // 0 for January, 1 for February, etc.
}

export function Month({ year, monthIndex }: MonthProps) {
    const monthDate = new Date(year, monthIndex);

    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);
    const startDate = startOfWeek(firstDay);
    const endDate = endOfWeek(lastDay);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div>
            <h2 className="text-center font-semibold text-gray-800 mb-4">
                {format(monthDate, "MMMM")}
            </h2>
            <div className="grid grid-cols-7 gap-y-2 text-center place-items-center text-sm">
                {/* Day of the week headers */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="font-medium text-gray-500">{day}</div>
                ))}

                {/* Day numbers */}
                {days.map((day) => (
                    <div
                        key={day.toISOString()}
                        className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full",
                            {
                                "text-gray-400": !isSameMonth(day, monthDate),
                                "bg-blue-600 text-white": isToday(day),
                            }
                        )}
                    >
                        {format(day, "d")}
                    </div>
                ))}
            </div>
        </div>
    );
}