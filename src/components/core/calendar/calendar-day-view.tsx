"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { dayJsToISOString, getNearestMonday, initCalendarMap, isCollidingWithSleepTime, isoToHHMM, leftBoundIndex, reId, toDayJs, uuid4 } from "@/lib/utils";
import { Task } from "@/model/task";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
import { useEffect, useRef, useState } from "react";
import { WarningAlertDialog } from "../alert/alert";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarDayViewDroppableCell } from "./calendar-day-view-droppable-cell";
import { DraggableTask } from "./draggable-task";

export interface CalendarDayViewProps {
    tasks?: Task[];
};

export const CalendarDayView = ({ tasks }: CalendarDayViewProps) => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getNearestMonday());
    const [currentView, setCurrentView] = useState("week");
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>(reId(tasks || []));
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [openSleepingTimeWarning, setOpenSleepingTimeWarning] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const viewOptions: SegmentedControlOption[] = [
        { label: "Year", value: "year" },
        { label: "Month", value: "month" },
        { label: "Week", value: "week" },
        { label: "Day", value: "day" },
    ];

    const CELL_HEIGHT = 4.57; // rem;
    const now = dayjs();
    const hoursNow = now.hour();
    const minutesNow = now.minute();
    const topPosition = `calc(${(hoursNow + minutesNow / 60) * CELL_HEIGHT}rem - 0.25rem)`; // offset for dot size
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    ); // 00 to 23

    const sleepStartTime = "22:15";
    const sleepEndTime = "06:15";
    const sleepStartHour = Number(sleepStartTime.substring(0, 2));
    const sleepStartMinute = Number(sleepStartTime.substring(3, 5));
    const sleepEndHour = Number(sleepEndTime.substring(0, 2));
    const sleepEndMinute = Number(sleepEndTime.substring(3, 5));
    const startPositionInHours = sleepStartHour + (sleepStartMinute / 60);
    const endPositionInHours = sleepEndHour + (sleepEndMinute / 60);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        setActiveDragId(String(event.active.id));
        const task = updatedTasks.find(t => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        const droppedCellId = String(event.over?.id || null);
        if (!droppedCellId) {
            setActiveDragId(null);
            setActiveTask(null);
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
            };
        }

        const sleepTimeCollision = (newUpdatedTasks.some(task => isCollidingWithSleepTime(task, sleepStartTime, sleepEndTime)));
        if (sleepTimeCollision) {
            setOpenSleepingTimeWarning(true);
            return;
        }

        setActiveTask(null);
        setUpdatedTasks(reId(newUpdatedTasks));
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }

        const container = scrollContainerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const y = event.clientY - containerRect.top + container.scrollTop;
        const x = event.clientX - containerRect.left;
        const newTask = {
            id: uuid4(),
            type: "task",
            startTime: cellId,
            endTime: cellId,
            title: "",
        } as Task;

        if (isCollidingWithSleepTime(newTask, sleepStartTime, sleepEndTime)) {
            return;
        }
        
        setEditorPosition({ x, y });
    
        setEditingTask(newTask);
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, task: Task) => {
        // if ((event.target as HTMLElement).closest('.cursor-grab')) {
        //     return;
        // }

        const container = scrollContainerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const y = event.clientY - containerRect.top + container.scrollTop;
        const x = event.clientX - containerRect.left;

        setEditorPosition({ x, y });

        setEditingTask(task);
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
                    width: Math.min(newStyle?.width || 90, 90 / tasksVal.length),   // %
                }

                newTasksStyle[task.id] = newStyle;
            });
        });

        const sortedTasks = [...updatedTasks].sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
        );

        for (const task of sortedTasks) {
            const overlappingTasks = sortedTasks.filter(otherTask =>
                dayjs(task.startTime).isBefore(dayjs(otherTask.endTime)) &&
                dayjs(otherTask.startTime).isBefore(dayjs(task.endTime))
            );

            const width = 90 / overlappingTasks.length;
            overlappingTasks.sort((a, b) => a.id.localeCompare(b.id));
            const columnIndex = overlappingTasks.findIndex(t => t.id === task.id);
            const left = columnIndex * width;

            newTasksStyle[task.id] = {
                ...newTasksStyle[task.id],
                width,
                left,
            };
        }

        // if (activeTask) {
        //     newTasksStyle[activeTask.id] = undefined;
        // }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks]);

    return (
        <Card className="w-full h-[100%] mx-auto rounded-xl shadow-lg bg-slate-50/50 p-0">
            {/* ====== Header (Same as before) ====== */}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600">
                    Private calendar / <span className="text-slate-800">Day View</span>
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
                <div ref={scrollContainerRef} className="relative h-[85vh] overflow-y-scroll overflow-x-hidden">
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
                    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                        <Table className="w-full table-fixed">
                            <TableBody>
                                {hours.map((hour, index) => {
                                    const newTime = currentMondayTime.add(index, "hour");
                                    const id = dayJsToISOString(newTime);
                                    return (
                                        <TableRow key={hour} className="h-16">
                                            <TableCell className="w-1/15 align-top text-xs text-slate-500 -translate-y-2 translate-x-4 border-r-2">
                                                {hour}
                                            </TableCell>
                                            <TableCell
                                                onClick={(e) => handleCellClick(e, id)}
                                                className="w-14/15 cursor-pointer"
                                            >
                                                <CalendarDayViewDroppableCell key={id + `-${uuid4()}`} id={id} bordered={false}>
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
                                                                setEditingTask={handleTaskDoubleClick}
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
                                                </CalendarDayViewDroppableCell>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <DragOverlay>
                            {activeTask ? (
                                <DraggableTask
                                    setEditingTask={handleTaskDoubleClick}
                                    isOverlay={true}
                                    task={activeTask}
                                    wrapperClassName="truncate absolute rounded-lg border-black border-[0.5px] pl-2"
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
                    {editingTask && (
                        <TaskEditor
                            key={editingTask.id}
                            task={editingTask}
                            updatedTasks={updatedTasks}
                            setUpdatedTasks={setUpdatedTasks}
                            setOpenSleepingTimeWarning={setOpenSleepingTimeWarning}
                            onClose={() => setEditingTask(null)}
                            style={{ top: editorPosition.y, left: editorPosition.x }}
                            sleepStartTime={sleepStartTime}
                            sleepEndTime={sleepEndTime}
                        />
                    )}
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