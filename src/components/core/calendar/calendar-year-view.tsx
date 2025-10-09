"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";
import { Month } from "./calendar-year-view-each-month"; 

export function CalendarYearView() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentView, setCurrentView] = useState("year"); 

    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];

    const handleGoToToday = () => setCurrentYear(new Date().getFullYear());
    const handlePreviousYear = () => setCurrentYear(currentYear - 1);
    const handleNextYear = () => setCurrentYear(currentYear + 1);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-white p-0">
            {/* ====== Header Controls ====== */}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <Button variant="outline" onClick={handleGoToToday}>Today</Button>
                <div className="flex items-center gap-4">
                    <DateRangeNavigator
                        dateRangeLabel={currentYear.toString()}
                        onPreviousClick={handlePreviousYear}
                        onNextClick={handleNextYear}
                    />
                    <SegmentedControl
                        options={viewOptions}
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                    <Button variant="outline">UTC</Button>
                </div>
            </CardHeader>

            {/* ====== 12-Month Grid ====== */}
            <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Month key={index} year={currentYear} monthIndex={index} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}