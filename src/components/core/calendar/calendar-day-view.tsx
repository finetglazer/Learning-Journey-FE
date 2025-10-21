"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UNSCHEDULED_SUBTASK_PREFIX } from "@/const/consts";
import { dayJsToISOString, leftBoundIndex, uuid4 } from "@/lib/utils";
import { Task, UnscheduledTask } from "@/model/task";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { ClipboardList } from "lucide-react";
import { useContext, useRef } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { CalendarDayViewDroppableCell } from "./calendar-day-view-droppable-cell";
import { CollapsibleUnscheduledPanel } from "./collapsible-unscheduled-items-panel";
import { DraggableTask } from "./draggable-task";
import { UnscheduledTaskItem } from "./unscheduled-task-item";

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
        editingTask,
        setEditingTask,
        editorPosition,
        panelPosition,
        unscheduledMonthData,
        activeUnscheduledTask,
        CELL_HEIGHT,
        hours,
        sleepStartTime,
        sleepEndTime,
        topPosition,
        startPositionInHours,
        endPositionInHours,
        sensors,
        onDragStart,
        onDragEnd,
        handleCellClick,
        handleTaskDoubleClick,
        handleRemoveUnscheduledBigTask,
        handleRemoveUnscheduledSubTask,
        onRemoveDraggableTask,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        activeDragId,
        alertMessage,
        setAlertMessage,
        currentDate,
        onChangeUnscheduledTaskTitle,
        isOutBigTaskTimeRange,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
                                                                key={id}
                                                                handleTaskDoubleClick={handleTaskDoubleClick}
                                                                task={task}
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
                        />
                        <DragOverlay>
                            {activeTask ? (
                                <DraggableTask
                                    handleTaskDoubleClick={handleTaskDoubleClick}
                                    isOverlay={true}
                                    task={activeTask}
                                    scrollContainerRef={scrollContainerRef}
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
                            {activeDragId === 'draggable-panel' && (
                                <div className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                        <ClipboardList className="h-8 w-8 text-black" />
                                    </div>
                                </div>
                            )}
                            {activeDragId?.includes(UNSCHEDULED_SUBTASK_PREFIX) && (
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
                            setAlertMessage={setAlertMessage}
                            onClose={() => setEditingTask(null)}
                            style={{ top: editorPosition.y, left: editorPosition.x }}
                            sleepStartTime={sleepStartTime}
                            sleepEndTime={sleepEndTime}
                            onDelete={() => onRemoveDraggableTask(editingTask)}
                            isOutBigTaskTimeRange={isOutBigTaskTimeRange}
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