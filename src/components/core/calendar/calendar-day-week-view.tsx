"use clien"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DAYS_OF_WEEK } from "@/const/consts";
import { dayJsToISOString, getNearestMonday, initCalendarMap, reId, toDayJs } from "@/lib/utils";
import { Task } from "@/model/task";
import { Dayjs } from "dayjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";

export interface DayWeekViewCalendarProps {
    tasks?: Task[];
};

const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
); // 00 to 23

export const DayWeekViewCalendar = ({ tasks, ...props }: DayWeekViewCalendarProps) => {
    const [currentView, setCurrentView] = useState("week");
    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];

    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getNearestMonday());
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>([]);
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});

    // Calculate position for the current time indicator
    // This is based on the height of each table row (h-16 = 4rem)
    const topPosition = `calc(${(12.5 - 8) * 4}rem + 2.5rem)`; // (12:30 - 8:00) * 4rem/hour + header height

    useEffect(() => {
        const newTasks = reId(tasks || []);
        const calendarMap = initCalendarMap(currentMondayTime, newTasks);
        const newTasksStyle = {...tasksStyle};
        let currentZIndex = 0;

        setCalendarMap(calendarMap);

        const visited: Record<string, boolean> = {};
        const getHeight = (timeKey: string, task: Task) => {
            const startTime = toDayJs(task.startTime);
            const endTime = toDayJs(task.endTime);
            const startDiff = startTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const endDiff = endTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const nextHour = startTime.add(1, "hour");

            if (startTime <= nextHour && endTime <= nextHour) {
                visited[task.id] = true;
                return (endTime.diff(startTime) / 60000 * (100 / 60));
            }
            if (!visited[task.id]) {
                visited[task.id] = true;
                return 100 - startDiff;
            }
            if (startTime <= toDayJs(timeKey) && nextHour <= endTime) {
                return 100;
            }
            return endDiff;
        };
        Object.keys(calendarMap).forEach(timeKey => {
            const tasksVal = calendarMap[timeKey];
            tasksVal.forEach((task: Task, count: number) => {
                let newStyle = newTasksStyle[task.id];
                const diff = toDayJs(task.startTime).diff(toDayJs(timeKey)) / 6000 * 1.5;

                newStyle = {
                    zIndex: !visited[task.id] ? ++currentZIndex : newStyle?.zIndex,
                    top: !visited[task.id] ? diff * 1.5 : newStyle?.top,    // %
                    left: count * 10,    // %
                    height: (newStyle?.height || 0) + getHeight(timeKey, task), // %
                    width: Math.min(newStyle?.width || 85, 85 / tasksVal.length),   // %
                }
                newTasksStyle[task.id] = newStyle;
            });
        });
        setTasksStyle(newTasksStyle);
        
    }, [currentMondayTime]);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-slate-50/50">
            {/* ====== Header (Same as before) ====== */}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600">
                    Private calendar / <span className="text-slate-800">Week View</span>
                </div>
                <div className="flex items-center gap-4">
                    <RoundedButton label="Today" id="1" />
                    <DateRangeNavigator
                        dateRangeLabel="May 21 – 26, 2045"
                        onNextClick={() => { }}
                        onPreviousClick={() => { }}
                    />
                    <SegmentedControl
                        options={viewOptions}
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                    <RoundedButton label="UTC" id="2" />
                </div>
            </CardHeader>

            {/* ====== Calendar Table ====== */}
            <CardContent className="p-0 h-full">
                {/* Scroll container */}
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead className="min-w-6 max-w-6 text-left">
                                <Clock className="w-4 h-4 mx-auto text-slate-400" />
                            </TableHead>
                            {DAYS_OF_WEEK.map((day) => (
                                <TableHead
                                    key={day}
                                    className="text-center font-medium text-slate-600 max-w-16.5 min-w-16.5 p-0"
                                >
                                    {day}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                </Table>
                <div className="relative h-[85vh] overflow-y-scroll">
                    <Table className="w-full">
                        <TableBody>
                            {hours.map((hour) => (
                                <TableRow key={hour} className="h-16">
                                    {/* Time Gutter Cell */}
                                    <TableCell className="align-top text-xs text-slate-500 -translate-y-2 translate-x-4 min-w-6 max-w-6 border-r-2">
                                        {hour}
                                    </TableCell>

                                    {DAYS_OF_WEEK.map((_, index) => {
                                        const newTime = currentMondayTime.add(index, "day").hour(Number(hour));
                                        const id = dayJsToISOString(newTime);
                                        return (
                                            <TableCell key={id} id={id} className="relative border-r-2 min-w-16.5 max-w-16.5">
                                                {(calendarMap[id] || []).map((task: Task, ind) => {
                                                    if (!task.id.includes(id)) {
                                                        return null;
                                                    }
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            style={{
                                                                ...tasksStyle[task.id],
                                                                top: `${tasksStyle[task.id].top}%`,
                                                                left: `${tasksStyle[task.id].left}%`,
                                                                height: `${tasksStyle[task.id].height}%`,
                                                                width: `${tasksStyle[task.id].width}%`,
                                                                backgroundColor: ind % 2 === 0 ? "blue" : "orange",
                                                                position: "absolute",
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Current Time Indicator */}
                    <div
                        className="absolute left-3 right-0 flex items-center z-20"
                        style={{ top: topPosition }}
                    >
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full -ml-[5px]"></div>
                        <div className="w-full h-0.5 bg-orange-500"></div>
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full -mr-[5px]"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};