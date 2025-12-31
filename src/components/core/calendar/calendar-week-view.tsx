"use client"

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
import { dayJsToISOString, toDayJs } from "@/lib/utils";
import { Task, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { isNil } from "lodash";
import { ClipboardList, Clock, Users } from "lucide-react";
import { useContext, useRef } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { CalendarWeekViewDroppableCell } from "./calendar-week-view-droppable-cell";
import { CollapsibleUnscheduledPanel } from "./collapsible-unscheduled-items-panel";
import { DraggableTask } from "./draggable-task";
import { UnscheduledRoutineItem } from "./unscheduled-routine-item";
import { UnscheduledTaskItem } from "./unscheduled-task-item";
import React from "react";
import { CollapsibleUnscheduledBufferListPanel } from "./collapsible-unscheduled-buffer-list-panel";
import { useRouter } from "next/navigation";

export interface WeekViewCalendarProps {
    tasks?: Task[];
};

export const CalendarWeekView = ({ tasks, ...props }: WeekViewCalendarProps) => {
    const {
        tasksStyle,
        calendarMap,
        unscheduledMonthData,
        currentView,
        setCurrentView,
        editorPosition,
        panelPosition,
        CELL_HEIGHT,
        hours,
        topPosition,
        startPositionInHours,
        sensors,
        handleRemoveUnscheduledBigTask,
        handleRemoveUnscheduledSubTask,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        alertMessage,
        currentMondayTime,
        setAlertMessage,
        onChangeUnscheduledTaskTitle,
        handleReload,
        handleTaskDoubleClick,
        selectedTaskId,
        setSelectedTaskId,
        selectedRoutineId,
        setSelectedRoutineId,
        draggingUnscheduledTaskId,
        draggingScheduledTaskId,
        draggingUnscheduledRoutineId,
        isPanelDragging,
        editingTask,
        setEditingTask,
        getDraggingRoutine,
        getDraggingTask,
        getDraggableTaskOverlay,
        onDeleteCalendarItem,
        setUnscheduledMonthData,
        onDragStart,
        onDragEnd,
        handleCellClick,
        getSleepBlocks,
        isPanelBufferListDragging,
        handleTaskEditorClose,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    return (
        <>
            <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-slate-50/50 p-0 gap-0">
                {/* ====== Header (Same as before) ====== */}
                <CardHeader ref={headerRef} className="grid grid-cols-[auto_1fr_auto] items-center p-4 border-b-0 border-gray-200 bg-white rounded-t-xl">
                    <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                        Private calendar / <span className="text-slate-800">Week View</span>
                    </div>
                    {/* Centered Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <RoundedButton label="Today" id="calendar-today-btn" onClick={handleGoToToday} />
                        <DateRangeNavigator
                            dateRangeLabel={generateDateRangeLabel()}
                            onNextClick={onNextDateRangeNavigatorClick}
                            onPreviousClick={onPreviousDateRangeNavigatorClick}
                        />
                    </div>
                    {/* Right-aligned Controls */}
                    <div className="flex items-center justify-end">
                        <SegmentedControl
                            value={currentView}
                            onValueChange={(value) => {
                                setCurrentView(value);
                            }}
                        />
                    </div>
                </CardHeader>

                {/* ====== Calendar Table ====== */}
                <CardContent className="p-0 h-full">
                    {/* Scroll container */}
                    <div className="relative flex pr-4 bg-white">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10">
                                <TableRow>
                                    <TableHead className="min-w-6 max-w-6 text-left border-b border-gray-200 bg-white">
                                        <Clock className="w-4 h-4 mx-auto text-slate-400" />
                                    </TableHead>
                                    {DAYS_OF_WEEK.map((day, index) => {
                                        const currentRenderDay = currentMondayTime.add(index, "day").get("date");
                                        const content = day.concat(" ").concat(currentRenderDay.toString().padStart(2, "0"));
                                        return (
                                            <TableHead
                                                key={content}
                                                className="text-center font-medium text-slate-600 max-w-16.5 min-w-16.5 p-2 border-b border-gray-200 bg-white"
                                            >
                                                <span>{content}</span>
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                                <TableRow>
                                    <TableHead className="min-w-6 max-w-6 text-left align-top pt-1">
                                    </TableHead>
                                    {DAYS_OF_WEEK.map((day, index) => {
                                        const currentRenderDay = currentMondayTime.add(index, "day").get("day");
                                        const currentRenderMonth = currentMondayTime.add(index, "day").get("month");

                                        return (
                                            <TableCell
                                                key={`all-day-${index}`}
                                                className="text-left max-w-16.5 min-w-16.5 p-1 align-top border-b border-gray-200"
                                                style={{ minHeight: "2.5rem" }}
                                            >
                                                <div>
                                                    {Object.keys(calendarMap).map((id: string) => {
                                                        return (calendarMap[id] || []).map((task: Task, index: number) => {
                                                            const currentCalendarMapDay = toDayJs(id, 0).get("day");
                                                            const currentCalendarMapMonth = toDayJs(id, 0).get("month");

                                                            if (task?.type !== "memorable_event" || (currentRenderDay !== currentCalendarMapDay || currentRenderMonth !== currentCalendarMapMonth)) {
                                                                return <React.Fragment key={`${id}-${index}`}></React.Fragment>
                                                            }
                                                            return (
                                                                <DraggableTask
                                                                    key={`${id}-${index}`}
                                                                    task={{ ...task, type: (task?.type || "").toLowerCase() }}
                                                                    draggable={false}
                                                                    wrapperClassName="truncate rounded-lg pl-2 mt-1 mb-1"
                                                                />
                                                            );
                                                        })
                                                    })}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHeader>
                        </Table>
                        {/* <div className="w-12" /> */}
                    </div>
                    <div className="relative h-[85vh] overflow-y-scroll overflow-x-hidden" ref={scrollContainerRef}>
                        <DndContext
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            sensors={sensors}
                        >
                            {/* --- START: New Dynamic Sleep Time Rectangles --- */}
                            {getSleepBlocks().map((block, index) => (
                                <div
                                    key={`sleep-block-${index}`}
                                    className="absolute left-0 right-0 bg-slate-300 z-0"
                                    style={{
                                        top: block.top,
                                        height: block.height,
                                    }}
                                />
                            ))}
                            {/* --- END: New Dynamic Sleep Time Rectangles --- */}
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
                                                        key={id}
                                                        id={id}
                                                        wrapperClassName="w-16.5 h-[4.6rem]"
                                                        onClick={(e) => handleCellClick(e, id, scrollContainerRef)}
                                                    >
                                                        {(calendarMap[id] || []).map((task: Task, index: number) => {
                                                            if (task?.type === "memorable_event") {
                                                                return <></>
                                                            }
                                                            // Only override startTime/endTime for ROUTINES (for split series support)
                                                            // Tasks and Events should keep their original API times
                                                            const isRoutine = (task?.type || "").toLowerCase() === "routine";
                                                            let taskStartTime = task.startTime;
                                                            let taskEndTime = task.endTime;

                                                            if (isRoutine) {
                                                                const duration = (toDayJs(task.endTime || "").diff(toDayJs(task.startTime || "")));
                                                                taskStartTime = id; // Use occurrence date from map key
                                                                taskEndTime = dayJsToISOString(toDayJs(id).add(duration, 'millisecond'));
                                                            }

                                                            return (
                                                                <DraggableTask
                                                                    key={task.id?.toString() || `${id}-${index}`}
                                                                    handleTaskDoubleClick={handleTaskDoubleClick}
                                                                    task={{ ...task, type: (task?.type || "").toLowerCase(), startTime: taskStartTime, endTime: taskEndTime }}
                                                                    draggable={!((task?.type || "").toLowerCase() === "routine")}
                                                                    wrapperClassName="truncate absolute rounded-lg pl-2"
                                                                    wrapperStyle={{
                                                                        ...tasksStyle[task.id as number],
                                                                        top: `${tasksStyle[task.id as number].top}%`,
                                                                        left: `${tasksStyle[task.id as number].left}%`,
                                                                        height: `${tasksStyle[task.id as number].height}rem`,
                                                                        width: `${tasksStyle[task.id as number].width}%`,
                                                                    }}
                                                                    scrollContainerRef={scrollContainerRef}
                                                                    badgeWrapperClassName="-mt-2.5"
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
                                unscheduledMonthData={unscheduledMonthData}
                                position={panelPosition}
                                headerRef={headerRef}
                                handleRemoveUnscheduledSubTask={handleRemoveUnscheduledSubTask as any}
                                onUnscheduledTaskTitleChange={onChangeUnscheduledTaskTitle}
                                setUnscheduledMonthData={setUnscheduledMonthData}
                                draggingUnscheduledTaskId={draggingUnscheduledTaskId}
                                draggingUnscheduledRoutineId={draggingUnscheduledRoutineId}
                                selectedTaskId={selectedTaskId}
                                selectedRoutineId={selectedRoutineId}
                            />

                            <CollapsibleUnscheduledBufferListPanel
                                headerRef={headerRef}
                            />

                            {/* @ts-ignore */}
                            <DragOverlay>
                                <>{/* For scheduled items */}
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
                                    {isPanelBufferListDragging && (
                                        <div className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                                <Users className="h-8 w-8 text-black" />
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
                                    )}</>
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
                        {editingTask ? (
                            <TaskEditor
                                key={editingTask?.id || "none"}
                                task={{ ...editingTask, type: (editingTask?.type || "").toLowerCase() }}
                                setAlertMessage={setAlertMessage}
                                onClose={() => {
                                    handleTaskEditorClose();

                                    setEditingTask(null);
                                    setSelectedTaskId(null);
                                }}
                                open={!!editingTask}
                                style={{ top: editorPosition.y, left: editorPosition.x }}
                                handleReload={handleReload}
                                onDelete={() => onDeleteCalendarItem(editingTask?.id)}
                                setSelectedTaskId={setSelectedTaskId}
                                setSelectedRoutineId={setSelectedRoutineId}
                                setEditingTask={setEditingTask}
                            />
                        ) : null}
                    </div>
                    {alertMessage && (
                        <AlertModal
                            alertMessage={alertMessage}
                            onClose={() => setAlertMessage(null)}
                        />
                    )}
                </CardContent>
            </Card>
        </>
    );
};