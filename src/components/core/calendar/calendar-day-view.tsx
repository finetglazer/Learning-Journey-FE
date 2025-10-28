"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UNSCHEDULED_ROUTINE_PREFIX, UNSCHEDULED_SUBTASK_PREFIX } from "@/const/consts";
import { dayJsToISOString, getBigTask, getDetails, getRoutineById, getTaskById, leftBoundIndex, toDayJs } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { ClipboardList } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { CalendarDayViewDroppableCell } from "./calendar-day-view-droppable-cell";
import { CollapsibleUnscheduledPanel } from "./collapsible-unscheduled-items-panel";
import { DraggableTask } from "./draggable-task";
import { UnscheduledRoutineItem } from "./unscheduled-routine-item";
import { UnscheduledTaskItem } from "./unscheduled-task-item";
import { toast } from "sonner";
import { isNil } from "lodash";
import dayjs from "dayjs";

export interface CalendarDayViewProps { };

export const CalendarDayView = () => {
    const {
        tasksStyle,
        calendarMap,
        currentView,
        setCurrentView,
        updatedTasks,
        setUpdatedTasks,
        activeTask,
        editorPosition,
        panelPosition,
        unscheduledMonthData,
        setUnscheduledMonthData,
        CELL_HEIGHT,
        hours,
        sleepStartTime,
        sleepEndTime,
        topPosition,
        startPositionInHours,
        endPositionInHours,
        sensors,
        handleCellClick,
        handleTaskDoubleClick,
        handleRemoveUnscheduledBigTask,
        handleRemoveUnscheduledSubTask,
        onRemoveDraggableTask,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        alertMessage,
        setAlertMessage,
        currentDate,
        onChangeUnscheduledTaskTitle,
        isOutBigTaskTimeRange,
        setPanelPosition,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    // For EDITING unscheduled and scheduled task
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
    // For EDITING unscheduled routine
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled task
    const [draggingUnscheduledTaskId, setDraggingUnscheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING scheduled task
    const [draggingScheduledTaskId, setDraggingScheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled routine
    const [draggingUnscheduledRoutineId, setDraggingUnscheduledRoutineId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled items panel
    const [isPanelDragging, setIsPanelDragging] = useState<boolean>(false);
    // For editing CREATED task and NEW task 
    const [editingTask, setEditingTask] = useState<Task | Omit<Task, "id"> | null>(null);

    const onDragStart = (event: DragStartEvent) => {
        if (event.active?.data?.current?.type === "unscheduled-task") {
            setDraggingUnscheduledTaskId(event.active.id);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
        }
        else if (event.active?.data?.current?.type === "unscheduled-routine") {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(event.active.id);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
        }
        else if (event.active?.id === "draggable-panel") {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(true);
        }
        else if ((event.active?.data?.current?.type || "").toLowerCase() === "task") {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(event.active.id);
            setIsPanelDragging(false);
        }
    };

    const getDraggingTask = () => {
        return getTaskById(unscheduledMonthData, draggingUnscheduledTaskId, []);
    };

    const getDraggingRoutine = () => {
        return getRoutineById(unscheduledMonthData, draggingUnscheduledRoutineId, []);
    };

    const updateBigTask = (monthData: UnscheduledMonthData[], bigTaskParams: { index: number, item: UnscheduledBigTask, monthDataIndex: number }) => {
        const updatedMonthData = [...monthData];
        (updatedMonthData[bigTaskParams.monthDataIndex]?.unscheduledBigTasks || [])[bigTaskParams.index] = bigTaskParams.item;
        setUnscheduledMonthData(updatedMonthData);
    };

    const handleRemoveUnscheduledTask = (unscheduledTaskId: number | string | null, bigTaskId: number) => {
        const bigTaskParams = getBigTask(unscheduledMonthData, bigTaskId);
        if (bigTaskParams?.index === -1) {
            return;
        }
        const updatedSuggestedSubtasks = [...bigTaskParams.item?.suggestedSubtasks];
        const subtaskIndex = updatedSuggestedSubtasks.findIndex(subtask => subtask?.id === unscheduledTaskId);
        if (subtaskIndex === -1) {
            return;
        }
        updatedSuggestedSubtasks.splice(subtaskIndex, 1);
        const updatedBigTask = {
            ...bigTaskParams.item,
            suggestedSubtasks: updatedSuggestedSubtasks,
        };
        bigTaskParams.item = updatedBigTask;
        updateBigTask(unscheduledMonthData, bigTaskParams);
    };

    const handleRemoveUnscheduledRoutine = (unscheduledRoutineId: number | string | null) => {
        let updatedMonthDataItem: any = undefined;
        unscheduledMonthData.forEach(monthDataItem => {
            if ((monthDataItem?.unscheduledRoutines || []).some(routine => routine?.id === unscheduledRoutineId) && !updatedMonthDataItem) {
                updatedMonthDataItem = monthDataItem;
            }
        });
        if (!updatedMonthDataItem) {
            return;
        }
        let unscheduledRoutineIndex = (updatedMonthDataItem?.unscheduledRoutines || []).findIndex((routine: any) => routine?.id === unscheduledRoutineId);
        if (unscheduledRoutineIndex === -1) {
            return;
        }
        const updatedUnscheduledRoutines = (updatedMonthDataItem?.unscheduledRoutines || []).splice(unscheduledRoutineIndex, 1);
        updatedMonthDataItem = {
            ...updatedMonthDataItem,
            unscheduledRoutines: updatedUnscheduledRoutines,
        };
        const updatedMonthDataItemIndex = unscheduledMonthData.findIndex(monthDataItem => monthDataItem?.month === updatedMonthDataItem?.month);
        if (updatedMonthDataItemIndex === -1) {
            return;
        }
        setUnscheduledMonthData([...unscheduledMonthData].splice(updatedMonthDataItemIndex, 1, updatedMonthDataItem));
    };

    const getNewCalendarItem = (itemId: number, isNew?: boolean) => {
        calendarRepository.getCalendarItem({ itemId: itemId })
            .subscribe({
                next: res => {
                    const success = res?.status;
                    const updatedCalendarItem: Task = res?.data;
                    if (success) {
                        const newCalendarItem = {
                            ...updatedCalendarItem,
                            startTime: (updatedCalendarItem?.timeSlot?.startTime as string).concat("Z"),
                            endTime: (updatedCalendarItem?.timeSlot?.endTime as string).concat("Z"),
                        };
                        setEditingTask(newCalendarItem);

                        const newUpdatedTasks = [...updatedTasks];
                        const itemType = (newCalendarItem?.type || "").toLowerCase();
                        // Push new item to updatedTasks when calendarItem is new
                        if (isNew) {
                            newUpdatedTasks.push(newCalendarItem);
                        }
                        // Update old item in updatedTasks if calendarItem is old
                        else {
                            const taskIndex = newUpdatedTasks.findIndex(task => task.id === newCalendarItem?.id);
                            newUpdatedTasks[taskIndex] = newCalendarItem;
                        }
                        setUpdatedTasks(newUpdatedTasks);
                        // Remove unscheduledTask (for both standalone task (0 effect) or unscheduled task)
                        if (!isNil(newCalendarItem?.parentBigTaskId) && itemType === "task") {
                            handleRemoveUnscheduledTask(newCalendarItem?.id, newCalendarItem?.parentBigTaskId);
                        }
                        // Remove unscheduledRoutine (for both standalone routine (0 effect) or unscheduled routine)
                        if (itemType === "routine") {
                            handleRemoveUnscheduledRoutine(newCalendarItem?.id);
                        }
                        // Set current selected task-event/routine
                        if (["task", "event"].includes(itemType)) {
                            setSelectedTaskId(newCalendarItem.id);
                        }
                        else if (itemType === "routine") {
                            setSelectedRoutineId(newCalendarItem.id);
                        }
                    }
                    else {
                        toast.error(res?.msg);
                    }
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);
                },
                error: err => {
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);
                }
            });
    };

    const onDeleteCalendarItem = (itemId: number) => {
        calendarRepository.deleteCalendarItem(itemId)
            .subscribe({
                next: res => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.msg);
                        setSelectedTaskId(null);
                        setSelectedRoutineId(null);
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg,
                            description: res?.data,
                        });
                    }
                },
                error: err => { },
            });
    };

    const handleReload = () => {
        calendarRepository.getScheduledItems({
            view: 'MONTH',
            date: currentDate.format('YYYY-MM-DD'),
            calendarId: 2,
        }).subscribe({
            next: res => {
                const newUpdatedTasks = (res?.data?.items || []).map((item: any) => {
                    const { createdAt, updatedAt, ...restItem } = item;
                    return {
                        ...restItem,
                        startTime: (restItem?.timeSlot?.startTime || "").concat("Z"),
                        endTime: (restItem?.timeSlot?.endTime || "").concat("Z"),
                        timeSlot: undefined,
                    };
                });
                setUpdatedTasks(newUpdatedTasks);
            },
            error: err => {
                console.log("Error occurs while fetching scheduled items", err);
            }
        });
    };

    const getDraggableTaskOverlay = () => {
        const draggingTask = updatedTasks.find(task => task.id === draggingScheduledTaskId);
        if (!draggingTask) {
            return <></>
        }
        return (
            <DraggableTask
                handleTaskDoubleClick={handleTaskDoubleClick}
                isOverlay={true}
                task={{ ...draggingTask, type: (draggingTask?.type || "").toLowerCase() }}
                scrollContainerRef={scrollContainerRef}
                wrapperClassName="truncate absolute rounded-lg border-black border-[0.5px] pl-2"
                wrapperStyle={{
                    ...tasksStyle[draggingTask.id],
                    top: `${tasksStyle[draggingTask.id].top}%`,
                    left: `${tasksStyle[draggingTask.id].left}%`,
                    height: `${tasksStyle[draggingTask.id].height}rem`,
                    width: `${tasksStyle[draggingTask.id].width}%`,
                }}
            />
        );
    };

    const onDragEnd = (event: DragEndEvent) => {
        const droppedCellId = String(event.over?.id || null);
        // For unscheduled tasks panel
        if (event.active.id === 'draggable-panel') {
            setPanelPosition(prev => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
            }));
            setIsPanelDragging(false);
            return;
        }
        // For unscheduled task
        if (!isNil(draggingUnscheduledTaskId)) {
            const unscheduledTask = getTaskById(unscheduledMonthData, draggingUnscheduledTaskId, []);
            if (!unscheduledTask) {
                return;
            }
            const cellId = String(event.over?.id);
            const newTask: Task = {
                ...unscheduledTask,
                id: unscheduledTask?.id as number,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledTask?.name || "",
                parentBigTaskId: unscheduledTask?.parentBigTaskId,
                type: "task",
                status: 'incomplete',
                completionPercentage: 0,
            };

            calendarRepository.updateCalendarItem(
                newTask.id as number,
                {
                    ...newTask,
                    type: (newTask?.type as string).toUpperCase(),
                    name: newTask?.name,
                    calendarId: 2,
                    timeSlot: {
                        startTime: newTask?.startTime,
                        endTime: newTask?.endTime,
                    },
                    taskDetails: {
                        estimatedHours: newTask?.estimatedHours,
                        parentBigTaskId: newTask?.parentBigTaskId,
                    },
                }).subscribe({
                    next: res => {
                        const itemId = res?.data;
                        const success = res?.status;
                        if (success) {
                            getNewCalendarItem(itemId, true);
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
                                description: res?.data,
                            });
                            setDraggingUnscheduledTaskId(null);
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledTaskId(null);
                    },
                });
            return;
        }
        // For unscheduled routine
        if (!isNil(draggingUnscheduledRoutineId)) {
            const unscheduledRoutine = getRoutineById(unscheduledMonthData, draggingUnscheduledRoutineId, []);
            if (!unscheduledRoutine) {
                return;
            }
            const cellId = String(event.over?.id);
            const newRoutine: Task = {
                ...unscheduledRoutine,
                id: unscheduledRoutine?.id as number,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledRoutine?.name || "",
                type: "routine",
                status: 'incomplete',
                pattern: {
                    daysOfWeek: ["MONDAY"]
                },
                exceptions: [],
            };

            calendarRepository.updateCalendarItem(
                newRoutine.id as number,
                {
                    ...newRoutine,
                    type: (newRoutine?.type as string).toUpperCase(),
                    name: newRoutine?.name,
                    calendarId: 2,
                    timeSlot: {
                        startTime: newRoutine?.startTime,
                        endTime: newRoutine?.endTime,
                    },
                    routineDetails: {
                        pattern: newRoutine.pattern,
                    },
                }).subscribe({
                    next: res => {
                        const itemId = res?.data;
                        const success = res?.status;
                        if (success) {
                            getNewCalendarItem(itemId, true);
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
                                description: res?.data,
                            });
                            setDraggingUnscheduledRoutineId(null);
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledRoutineId(null);
                    },
                });
            return;
        }
        if (!droppedCellId) {
            setDraggingUnscheduledRoutineId(null);
            setDraggingUnscheduledTaskId(null);
            setIsPanelDragging(false);
            setDraggingScheduledTaskId(null);
            return;
        }
        // For scheduled items
        const scheduledItem = updatedTasks.find(task => task.id === draggingScheduledTaskId);
        const newEndTime = toDayJs(droppedCellId).add(toDayJs(scheduledItem?.endTime).diff(toDayJs(scheduledItem?.startTime)));
        calendarRepository.updateCalendarItem(
            scheduledItem?.id as number,
            {
                ...scheduledItem,
                type: (scheduledItem?.type as string).toUpperCase(),
                name: scheduledItem?.name,
                calendarId: 2,
                timeSlot: {
                    startTime: droppedCellId,
                    endTime: dayJsToISOString(newEndTime),
                },
                ...getDetails(scheduledItem as Task),
            }).subscribe({
                next: res => {
                    const itemId = res?.data;
                    const success = res?.status;
                    if (success) {
                        getNewCalendarItem(itemId); 
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg,
                            description: res?.data,
                        });
                        setDraggingScheduledTaskId(null);
                    }
                },
                error: err => {
                    setDraggingScheduledTaskId(null);
                },
            });
    };

    useEffect(() => {
        // Get all scheduled items
        handleReload();
    }, [currentDate]);

    return (
        <Card className="w-full h-[100%] mx-auto rounded-xl shadow-lg bg-slate-50/50 p-0">
            {/* ====== Header (Same as before) ====== */}
            <CardHeader className="grid grid-cols-[auto_1fr] items-center p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Private calendar / <span className="text-slate-800">Day View</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                    <RoundedButton label="Today" id="calendar-today-btn" onClick={handleGoToToday} />
                    <DateRangeNavigator
                        dateRangeLabel={generateDateRangeLabel()}
                        onNextClick={onNextDateRangeNavigatorClick}
                        onPreviousClick={onPreviousDateRangeNavigatorClick}
                    />
                    <SegmentedControl
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                    <RoundedButton label="UTC" id="calendar-utc-btn" />
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
                                    const newTime = currentDate.startOf("date").add(index, "hour");
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
                                                <CalendarDayViewDroppableCell key={id} id={id} bordered={false}>
                                                    {(calendarMap[id] || []).map((task: Task) => {
                                                        return (
                                                            <DraggableTask
                                                                key={id}
                                                                handleTaskDoubleClick={handleTaskDoubleClick}
                                                                task={{ ...task, type: (task?.type || "").toLowerCase() }}
                                                                draggable={!((task?.type || "").toLowerCase() === "routine")}
                                                                scrollContainerRef={scrollContainerRef}
                                                                onRemove={() => onRemoveDraggableTask(task)}
                                                                wrapperClassName="truncate absolute rounded-lg pl-2"
                                                                wrapperStyle={{
                                                                    ...tasksStyle[task.id],
                                                                    top: `${tasksStyle[task.id].top}%`,
                                                                    left: `${tasksStyle[task.id].left}%`,
                                                                    height: `${tasksStyle[task.id].height}rem`,
                                                                    width: `${tasksStyle[task.id].width}%`,
                                                                }}
                                                                badgeWrapperClassName="-mt-2.5"
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
                        <CollapsibleUnscheduledPanel
                            unscheduledMonthData={unscheduledMonthData}
                            position={panelPosition}
                            handleRemoveUnscheduledBigTask={handleRemoveUnscheduledBigTask}
                            handleRemoveUnscheduledSubTask={handleRemoveUnscheduledSubTask}
                            onUnscheduledTaskTitleChange={onChangeUnscheduledTaskTitle}
                            setUnscheduledMonthData={setUnscheduledMonthData}
                            draggingUnscheduledTaskId={draggingUnscheduledTaskId}
                            draggingUnscheduledRoutineId={draggingUnscheduledRoutineId}
                            selectedTaskId={selectedTaskId}
                            selectedRoutineId={selectedRoutineId}
                        />
                        <DragOverlay>
                            {/* For scheduled items */}
                            {!isNil(draggingScheduledTaskId) ? (
                                getDraggableTaskOverlay()
                            ) : null}
                            {isPanelDragging && (
                                <div className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                        <ClipboardList className="h-8 w-8 text-black" />
                                    </div>
                                </div>
                            )}
                            {!isNil(draggingUnscheduledTaskId) && (
                                <UnscheduledTaskItem
                                    task={getDraggingTask() as UnscheduledTask}
                                />
                            )}
                            {!isNil(draggingUnscheduledRoutineId) && (
                                <UnscheduledRoutineItem
                                    routine={getDraggingRoutine() as UnscheduledRoutine}
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
                            task={{...editingTask, type: (editingTask?.type || "").toLowerCase()}}
                            updatedTasks={updatedTasks}
                            setUpdatedTasks={setUpdatedTasks}
                            setAlertMessage={setAlertMessage}
                            onClose={() => {
                                setEditingTask(null);
                                setSelectedTaskId(null);
                                setSelectedRoutineId(null);
                            }}
                            style={{ top: editorPosition.y, left: editorPosition.x }}
                            sleepStartTime={sleepStartTime}
                            sleepEndTime={sleepEndTime}
                            handleReload={handleReload}
                            onDelete={() => onDeleteCalendarItem(editingTask?.id)}
                            isOutBigTaskTimeRange={isOutBigTaskTimeRange}
                            setSelectedTaskId={setSelectedTaskId}
                            setSelectedRoutineId={setSelectedRoutineId}
                        />
                    )}
                </div>
                {alertMessage && (
                    <AlertModal
                        alertMessage={alertMessage}
                        onClose={() => setAlertMessage(null)}
                    />
                )}
            </CardContent>
        </Card>
    );
};