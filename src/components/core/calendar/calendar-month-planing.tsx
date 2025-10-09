"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";

export function MonthPlanningCalendar() {
    const categories = ["Event", "Routine", "Task"];
    const dateRanges = ["1-7", "8-14", "15-21", "22-28"];
    const [currentView, setCurrentView] = useState("week");
    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];

    return (
        <Card className="w-full h-[100vh] mx-auto rounded-xl shadow-lg bg-white p-0">
            {/* ====== Header Controls ====== */}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <Button variant="outline">Today</Button>
                <div className="flex items-center gap-4">
                    <TableHead colSpan={dateRanges.length} className="text-center">
                        <DateRangeNavigator
                            dateRangeLabel="September 2025"
                            onPreviousClick={() => console.log("Previous month clicked")}
                            onNextClick={() => console.log("Next month clicked")}
                        />
                    </TableHead>
                    <SegmentedControl
                        options={viewOptions}
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                    <Button variant="outline">UTC</Button>
                </div>
            </CardHeader>

            {/* ====== Planning Grid ====== */}
            <CardContent className="p-0 h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] font-medium text-gray-500">
                                Mon-Sun
                            </TableHead>
                            {dateRanges.map((range) => (
                                <TableHead key={range} className="text-center font-medium text-gray-500">
                                    {range}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category} className="h-[28vh]">
                                {/* Row Header Cell */}
                                <TableCell className="font-semibold text-gray-700 align-top pt-4">
                                    {category}
                                </TableCell>

                                {/* Empty Cells for Tasks */}
                                {dateRanges.map((range) => (
                                    <TableCell
                                        key={`${category}-${range}`}
                                        className="h-48 align-top p-2"
                                    >
                                        {/* This is where task components would be rendered */}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}