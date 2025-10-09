"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday, // Import isToday
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import React, { useState } from "react";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";

export function CalendarMonthView() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentView, setCurrentView] = useState("month"); // Set default to 'month'

    // Date calculation logic (same as before)
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];

    // --- ENHANCEMENTS START HERE ---

    // Handlers for month navigation
    const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleGoToToday = () => setCurrentMonth(new Date());

    return (
        <Card className="w-full h-[100vh] mx-auto rounded-xl shadow-lg bg-white p-0 flex flex-col">
            {/* ====== Header Controls (Now Dynamic) ====== */}
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <Button variant="outline" onClick={handleGoToToday}>Today</Button>
                <div className="flex items-center gap-4">
                    <DateRangeNavigator
                        dateRangeLabel={format(currentMonth, "MMMM yyyy")}
                        onPreviousClick={handlePreviousMonth}
                        onNextClick={handleNextMonth}
                    />
                    <SegmentedControl
                        options={viewOptions}
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                    <Button variant="outline">UTC</Button>
                </div>
            </CardHeader>

            {/* ====== Calendar Grid (With Today's Date Highlighted) ====== */}
            <CardContent className="p-0 flex-1">
                <div className="grid grid-cols-7 border-t border-l h-full">
                    {/* --- Day of the week headers --- */}
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-center font-medium text-gray-500 py-2 border-r border-b">
                            {day}
                        </div>
                    ))}

                    {/* --- Day cells --- */}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-2 border-r border-b flex flex-col",
                                { "bg-gray-50 text-gray-400": !isSameMonth(day, currentMonth) }
                            )}
                        >
                            <span className={cn(
                                "self-end text-sm font-medium h-6 w-6 flex items-center justify-center",
                                // Highlight today's date
                                { "bg-blue-600 text-white rounded-full": isToday(day) }
                            )}>
                                {format(day, "d")}
                            </span>
                            <div className="flex-1 overflow-y-auto">
                                {/* Task components would be rendered here */}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}