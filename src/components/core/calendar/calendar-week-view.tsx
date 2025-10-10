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
import { dayJsToISOString, getNearestMonday, initCalendarMap, isoToHHMM, leftBoundIndex, reId, toDayJs, uuid4 } from "@/lib/utils";
import { Task } from "@/model/task";
import { DndContext, DragOverEvent, DragOverlay } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";
import { DraggableTask } from "./draggable-task";
import { CalendarWeekViewDroppableCell, DroppableCell } from "./calendar-week-view-droppable-cell";
import { isNil } from "lodash";
import { WarningAlertDialog } from "../alert/alert";

export interface WeekViewCalendarProps {
    tasks?: Task[];
};

const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
); // 00 to 23

export const CalendarWeekView = ({ tasks, ...props }: WeekViewCalendarProps) => {
    const [currentView, setCurrentView] = useState("week");
    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];
    const CELL_HEIGHT = 4.6; // rem;

    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getNearestMonday());
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>(reId(tasks || []));
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [openSleepingTimeWarning, setOpenSleepingTimeWarning] = useState<boolean>(false);

    const topPosition = `calc(${(12.5 - 8) * CELL_HEIGHT}rem + 2.5rem)`; // + header height
    const sleepStartTime = "22:15";
    const sleepEndTime = "06:15";
    const sleepStartHour = Number(sleepStartTime.substring(0, 2));
    const sleepStartMinute = Number(sleepStartTime.substring(3, 5));
    const sleepEndHour = Number(sleepEndTime.substring(0, 2));
    const sleepEndMinute = Number(sleepEndTime.substring(3, 5));
    const startPositionInHours = sleepStartHour + (sleepStartMinute / 60);
    const endPositionInHours = sleepEndHour + (sleepEndMinute / 60);

    const onDragStart = (event: DragOverEvent) => {
        setActiveDragId(String(event.active.id));
        const task = updatedTasks.find(t => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const isCollidingWithSleepTime = (task: Task) => {
        const taskStartHHMM = isoToHHMM(task.startTime);
        const taskEndHHMM = isoToHHMM(task.endTime);
        const isSleepOvernight = sleepEndTime > "00:00" && "23:59" >= sleepStartTime;
        if (isSleepOvernight) {
            return sleepStartTime < taskEndHHMM && taskEndHHMM <= "23:59" || 
                    "00:00" <= taskEndHHMM && taskEndHHMM <= sleepEndTime ||
                sleepStartTime <= taskStartHHMM && taskStartHHMM <= "23:59" ||
                "00:00" <= taskStartHHMM && taskStartHHMM < sleepEndTime;
        } else {
            return !(taskStartHHMM >= sleepEndTime || taskEndHHMM <= sleepStartTime);
        }
    };

    const onDragEnd = (event: DragOverEvent) => {
        const droppedCellId = String(event.over?.id || null);
        if (!droppedCellId) {
            setActiveDragId(null);
            return;
        }
        const updatedTaskIndex = updatedTasks.findIndex(task => task.id === activeDragId);
        const oldTask = updatedTasks[updatedTaskIndex];
        const newUpdatedTasks = [...updatedTasks];
        const taskDuration = toDayJs(oldTask.endTime).diff(toDayJs(oldTask.startTime));
        if (!isNil(updatedTaskIndex)) {
            newUpdatedTasks[updatedTaskIndex] = {
                ...oldTask,
                id: droppedCellId,
                startTime: droppedCellId,
                endTime: dayJsToISOString(toDayJs(droppedCellId).add(taskDuration)),
            }
        }

        const sleepTimeCollision = (newUpdatedTasks.some(task => isCollidingWithSleepTime(task)));
        if (sleepTimeCollision) {
            setOpenSleepingTimeWarning(true);
            return;
        }

        setActiveTask(null);
        setUpdatedTasks(reId(newUpdatedTasks));
    };

    useEffect(() => {
        const newTasks = [...updatedTasks];
        const calendarMap = initCalendarMap(currentMondayTime, newTasks);
        const newTasksStyle: any = {};
        if (activeTask) {
            newTasksStyle[activeTask.id] = tasksStyle[activeTask.id];
        }
        let currentZIndex = 0;

        setCalendarMap(calendarMap);

        const visited: Record<string, boolean> = {};
        const getHeight = (timeKey: string, task: Task) => {
            const startTime = toDayJs(task.startTime);
            const endTime = toDayJs(task.endTime);
            const startDiff = startTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const endDiff = endTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const nextHour = toDayJs(timeKey).add(1, "hour");

            if (startTime <= nextHour && endTime <= nextHour && !visited[task.id]) {
                visited[task.id] = true;
                return (endTime.diff(startTime) / 60000 * (100 / 60)) / 100 * CELL_HEIGHT;
            }
            if (!visited[task.id]) {
                visited[task.id] = true;
                return (100 - startDiff) / 100 * CELL_HEIGHT;
            }
            if (startTime <= toDayJs(timeKey) && nextHour <= endTime) {
                return CELL_HEIGHT;
            }
            return endDiff / 100 * CELL_HEIGHT;
        };
        Object.keys(calendarMap).forEach(timeKey => {
            const tasksVal = calendarMap[timeKey];
            tasksVal.forEach((task: Task, count: number) => {
                let newStyle = newTasksStyle[task.id];
                const diff = toDayJs(task.startTime).diff(toDayJs(timeKey)) / 60000 * (100 / 60);

                newStyle = {
                    zIndex: !visited[task.id] ? ++currentZIndex : newStyle?.zIndex,
                    top: !visited[task.id] ? diff : newStyle?.top,    // %
                    left: count * 10,    // %
                    height: (newStyle?.height || 0) + getHeight(timeKey, task), // rem
                    width: Math.min(newStyle?.width || 85, 85 / tasksVal.length),   // %
                }

                newTasksStyle[task.id] = newStyle;
            });
        });

        // if (activeTask) {
        //     newTasksStyle[activeTask.id] = undefined;
        // }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks]);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-slate-50/50 p-0">
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
                <div className="relative flex pr-4">
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
                    {/* <div className="w-12" /> */}
                </div>
                <div className="relative h-[85vh] overflow-y-scroll overflow-x-hidden">
                    <DndContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        {/* --- Sleep Time Rectangles --- */}
                        {/* Morning Block (from midnight to wake-up time) */}
                        <div
                            className="absolute left-0 right-0 bg-slate-300 z-0"
                            style={{
                                top: 0,
                                height: `${endPositionInHours * CELL_HEIGHT}rem`,
                            }}
                        />
                        {/* Night Block (from bedtime to midnight) */}
                        <div
                            className="absolute left-0 right-0 bg-slate-300 z-0"
                            style={{
                                top: `${startPositionInHours * CELL_HEIGHT}rem`,
                                height: `${(24 - startPositionInHours) * CELL_HEIGHT}rem`,
                            }}
                        />
                        <Table className="w-full">
                            <TableBody>
                                {hours.map((hour) => (
                                    <TableRow key={hour} className="h-16">
                                        {/* Time Gutter Cell */}
                                        <TableCell className="align-top text-xs text-slate-500 -translate-y-2 translate-x-4 w-6 h-[4rem] border-r-2">
                                            {hour}
                                        </TableCell>

                                        {DAYS_OF_WEEK.map((_, index) => {
                                            const newTime = currentMondayTime.add(index, "day").hour(Number(hour));
                                            const id = dayJsToISOString(newTime);
                                            return (
                                                <CalendarWeekViewDroppableCell key={id + `-${uuid4()}`} id={id} wrapperClassName="w-16.5 h-[4.6rem] ">
                                                    {(calendarMap[id] || []).map((task: Task) => {
                                                        const timeKeys = Object.keys(calendarMap);
                                                        const timeLeftBoundIndex = leftBoundIndex(timeKeys, task.startTime);
                                                        if (timeLeftBoundIndex === null ||
                                                            !timeKeys[timeLeftBoundIndex].includes(id) ||
                                                            !tasksStyle[task.id]
                                                        ) {
                                                            return null;
                                                        }

                                                        return (
                                                            <DraggableTask
                                                                key={id + `-${uuid4()}`}
                                                                task={task}
                                                                wrapperClassName="truncate absolute rounded-lg border-black border-[0.5px] pl-2"
                                                                wrapperStyle={{
                                                                    ...tasksStyle[task.id],
                                                                    top: `${tasksStyle[task.id].top}%`,
                                                                    left: `${tasksStyle[task.id].left}%`,
                                                                    height: `${tasksStyle[task.id].height}rem`,
                                                                    width: `${tasksStyle[task.id].width}%`,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </CalendarWeekViewDroppableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <DragOverlay>
                            {activeTask ? (
                                <DraggableTask
                                    isOverlay={true}
                                    task={activeTask}
                                    wrapperClassName="truncate rounded-lg border-black border-[0.5px] pl-2"
                                    wrapperStyle={{
                                        ...tasksStyle[activeTask.id],
                                        top: `${tasksStyle[activeTask.id].top}%`,
                                        left: `${tasksStyle[activeTask.id].left}%`,
                                        height: `${tasksStyle[activeTask.id].height}rem`,
                                        width: `${tasksStyle[activeTask.id].width}%`,
                                    }}
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
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
                <WarningAlertDialog
                    open={openSleepingTimeWarning}
                    setOpen={setOpenSleepingTimeWarning}
                    warningMessage="Your picked time is conflict with the sleeping time!"
                    recommendActionMessage="Wake up sooner is a better solution!"
                />
            </CardContent>
        </Card>
    );
};