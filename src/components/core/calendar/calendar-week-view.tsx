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
import { dayJsToISOString, getNearestMonday, initCalendarMap, isCollidingWithSleepTime, isoToHHMM, leftBoundIndex, reId, toDayJs, uuid4 } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledTask } from "@/model/task";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { ClipboardList, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl, SegmentedControlOption } from "../segmented-control/segmented-control";
import { DraggableTask } from "./draggable-task";
import { CalendarWeekViewDroppableCell } from "./calendar-week-view-droppable-cell";
import { isNil } from "lodash";
import { WarningAlertDialog } from "../alert/alert";
import { TaskEditor } from "../task-editor/task-editor";
import { UnscheduledTaskItem } from "./unscheduled-task-item";
import { CollapsibleUnscheduledPanel } from "./collapsible-unscheduled-items-panel";

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
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeUnscheduledTask, setActiveUnscheduledTask] = useState<UnscheduledTask | undefined>(undefined);
    const initUnscheduledBigTasks: UnscheduledBigTask[] = [
        {
            id: "unscheduled-big-task-1",
            title: "Unscheduled big task 1",
            subtasks: [
                { id: "unscheduled-task-1-1", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 1" },
                { id: "unscheduled-task-1-2", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 2" },
                { id: "unscheduled-task-1-3", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 3" },
            ],
        },
        {
            id: "unscheduled-big-task-2",
            title: "Unscheduled big task 2",
            subtasks: [
                { id: "unscheduled-task-2-1", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 1" },
                { id: "unscheduled-task-2-2", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 2" },
                { id: "unscheduled-task-2-3", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 3" },
            ],
        },
        {
            id: "unscheduled-big-task-3",
            title: "Unscheduled big task 3",
            subtasks: [
                { id: "unscheduled-task-3-1", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 1" },
                { id: "unscheduled-task-3-2", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 2" },
                { id: "unscheduled-task-3-3", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 3" },
            ],
        },
    ];
    const [unscheduledBigTasks, setUnscheduledBigTasks] = useState(initUnscheduledBigTasks);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );
    const topPosition = `calc(${(12.5 - 8) * CELL_HEIGHT}rem + 2.5rem)`; // + header height
    const sleepStartTime = "22:15";
    const sleepEndTime = "06:15";
    const sleepStartHour = Number(sleepStartTime.substring(0, 2));
    const sleepStartMinute = Number(sleepStartTime.substring(3, 5));
    const sleepEndHour = Number(sleepEndTime.substring(0, 2));
    const sleepEndMinute = Number(sleepEndTime.substring(3, 5));
    const startPositionInHours = sleepStartHour + (sleepStartMinute / 60);
    const endPositionInHours = sleepEndHour + (sleepEndMinute / 60);

    const handleRemoveUnscheduledBigTask = (bigTaskId: string) => {
        const newUnscheduledBigTasks = (unscheduledBigTasks || []).filter(
            task => task.id !== bigTaskId
        );
        setUnscheduledBigTasks?.(newUnscheduledBigTasks);
    };

    const handleRemoveUnscheduledSubTask = (bigTaskId: string, subTaskId: string) => {
        const bigTask: UnscheduledBigTask | undefined = ((unscheduledBigTasks || []).find(bigTask => bigTask.id === bigTaskId));
        if (!bigTask) {
            return;
        }
        const newSubtasks = (bigTask?.subtasks || []).filter(
            subtask => subtask.id !== subTaskId
        );

        const newUnscheduledBigTasks = [...(unscheduledBigTasks || [])];
        const bigTaskIndex = newUnscheduledBigTasks.findIndex(unscheduledBigTask => unscheduledBigTask.id === bigTask.id);
        if (bigTaskIndex !== -1) {
            if (!newSubtasks.length) {
                handleRemoveUnscheduledBigTask(bigTask.id);
                return;
            }
            newUnscheduledBigTasks[bigTaskIndex] = {
                ...newUnscheduledBigTasks[bigTaskIndex],
                subtasks: [...newSubtasks]
            }
        }

        setUnscheduledBigTasks?.(newUnscheduledBigTasks);
    };

    const onDragStart = (event: DragStartEvent) => {
        setActiveDragId(String(event.active.id));
        if (event.active.id.toString().includes('unscheduled-task')) {
            setActiveUnscheduledTask(event.active?.data?.current?.task);
            return;
        }
        const task: Task | undefined = updatedTasks.find(t => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const getUnscheduledSubTask = (subtaskId: string) => {
        const unscheduledBigTask = unscheduledBigTasks.find(bigTask =>
            (bigTask?.subtasks || []).some(subtask => subtask.id === subtaskId)
        );
        if (!unscheduledBigTask) {
            return null;
        }
        return (unscheduledBigTask?.subtasks || []).find(subtask => subtask.id === subtaskId);
    };

    const onDragEnd = (event: DragEndEvent) => {
        const droppedCellId = String(event.over?.id || null);
        // For unscheduled tasks panel
        if (event.active.id === 'draggable-panel') {
            setPanelPosition(prev => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
            }));
            return;
        }
        // For unscheduled task item
        if (event.active.id.toString().includes('unscheduled-task')) {
            setActiveUnscheduledTask(undefined);
            if (!event.over?.id) {
                return;
            }
            const subtask = getUnscheduledSubTask(String(event.active.id));
            if (!subtask) {
                return;
            }
            const cellId = String(event.over?.id);
            const newTask = {
                id: cellId,
                pastId: subtask.id,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(5, "minute")),
                parentBigTaskId: subtask?.parentBigTaskId,
                type: "task",
                title: subtask?.title || "",
            } as Task;
            if (isCollidingWithSleepTime(newTask, sleepStartTime, sleepEndTime)) {
                setOpenSleepingTimeWarning(true);
                return;
            }

            setUpdatedTasks(reId([...updatedTasks, newTask]));
            setEditingTask(newTask);

            handleRemoveUnscheduledSubTask(subtask?.parentBigTaskId || "", subtask.id);
            return;
        }
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

    const onRemoveDraggableTask = (task: Task) => {
        if (task?.parentBigTaskId) {
            const unscheduledBigTask = unscheduledBigTasks.find(bigTask => bigTask.id === task?.parentBigTaskId);
            // Unscheduled big task had been removed
            if (!unscheduledBigTask) {
                const ind = (unscheduledBigTasks.length + 1).toString();
                const newUnscheduledBigTasks = [...unscheduledBigTasks, {
                    id: "unscheduled-big-task-".concat(ind),
                    title: "New unscheduled big task ".concat(ind),
                    subtasks: [{
                        ...task,
                        id: "unscheduled-task-".concat(ind).concat("-1"),
                        pastId: "unscheduled-task-".concat(ind).concat("-1"),
                        parentBigTaskId: "unscheduled-big-task-".concat(ind),
                        title: task?.title,
                    }],
                }];
                setUnscheduledBigTasks(newUnscheduledBigTasks);
            }
            else {
                const newUnscheduledBigTask = {
                    ...unscheduledBigTask,
                    subtasks: [...(unscheduledBigTask?.subtasks || []), {
                        ...task,
                        id: task?.pastId,
                        title: task?.title,
                    }]
                };
                const bigTaskIndex = unscheduledBigTasks.findIndex(bigTask => bigTask.id === unscheduledBigTask.id);
                if (bigTaskIndex !== -1) {
                    const newUnscheduledBigTasks = [...unscheduledBigTasks];
                    newUnscheduledBigTasks[bigTaskIndex] = newUnscheduledBigTask;
                    setUnscheduledBigTasks(newUnscheduledBigTasks);
                }
            }
        }

        setUpdatedTasks(reId([...updatedTasks.filter(updatedTask => updatedTask.id !== task.id)]));
        setEditingTask(null);
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }

        const container = scrollContainerRef.current;
        if (!container) return;

        const adjustedPosition = getAdjustedPosition(event.clientX, event.clientY);

        setEditorPosition(adjustedPosition);
        const newTask = {
            id: cellId,
            startTime: cellId,
            endTime: dayJsToISOString(toDayJs(cellId).add(5, "minute")),
            type: "task",
            title: "",
        } as Task;

        if (isCollidingWithSleepTime(newTask, sleepStartTime, sleepEndTime)) {
            return;
        }
        setEditorPosition(adjustedPosition);
        setEditingTask(newTask);
    };

    const getAdjustedPosition = (x: number, y: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const EDITOR_WIDTH = 380;
        const EDITOR_HEIGHT = 550;
        const SCREEN_PADDING = 0;

        let adjustedX = x;
        let adjustedY = y;

        // Adjust X if it's too far to the right
        if (x + EDITOR_WIDTH + SCREEN_PADDING > viewportWidth) {
            adjustedX = viewportWidth - EDITOR_WIDTH - SCREEN_PADDING;
        }

        // Adjust Y if it's too far down
        if (y + EDITOR_HEIGHT + SCREEN_PADDING > viewportHeight) {
            adjustedY = viewportHeight - EDITOR_HEIGHT - SCREEN_PADDING;
        }

        // Ensure it's not off-screen to the top or left
        if (adjustedX < SCREEN_PADDING) {
            adjustedX = SCREEN_PADDING;
        }
        if (adjustedY < SCREEN_PADDING) {
            adjustedY = SCREEN_PADDING;
        }

        return { x: adjustedX, y: adjustedY };
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, task: Task) => {
        // if ((event.target as HTMLElement).closest('.cursor-grab')) {
        //     return;
        // }

        const container = scrollContainerRef.current;
        if (!container) return;

        const adjustedPosition = getAdjustedPosition(event.clientX, event.clientY);

        setEditorPosition(adjustedPosition);

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
            toDayJs(a.startTime).diff(toDayJs(b.startTime))
        );

        for (const task of sortedTasks) {
            const overlappingTasks = sortedTasks.filter(otherTask =>
                toDayJs(task.startTime).isBefore(toDayJs(otherTask.endTime)) &&
                toDayJs(otherTask.startTime).isBefore(toDayJs(task.endTime))
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
        <>
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
                    <div ref={scrollContainerRef} className="relative flex pr-4">
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
                            sensors={sensors}
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
                                                    <CalendarWeekViewDroppableCell
                                                        key={id + `-${uuid4()}`}
                                                        id={id}
                                                        wrapperClassName="w-16.5 h-[4.6rem]"
                                                        onClick={(e) => handleCellClick(e, id)}
                                                    >
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
                                                                    setEditingTask={handleTaskDoubleClick}
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
                            <CollapsibleUnscheduledPanel
                                unscheduledBigTasks={unscheduledBigTasks}
                                handleRemoveUnscheduledBigTask={handleRemoveUnscheduledBigTask}
                                handleRemoveUnscheduledSubTask={handleRemoveUnscheduledSubTask}
                                position={panelPosition}
                            />
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
                                        setEditingTask={handleTaskDoubleClick}
                                    />
                                ) : null}
                                {activeDragId === 'draggable-panel' && (
                                    <div className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg">
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                            <ClipboardList className="h-8 w-8 text-black" />
                                        </div>
                                    </div>
                                )}
                                {activeDragId?.includes('unscheduled-task') && (
                                    <UnscheduledTaskItem
                                        task={activeUnscheduledTask as UnscheduledTask}
                                    />
                                )}
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
                                onDelete={() => onRemoveDraggableTask(editingTask)}
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
        </>
    );
};