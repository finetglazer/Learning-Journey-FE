import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { dayJsToISOString } from "@/lib/utils";
import { Task, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { isNil } from "lodash";
import { ClipboardList, Users } from "lucide-react";
import { useContext, useRef } from "react";
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
import { CollapsibleUnscheduledBufferListPanel } from "./collapsible-unscheduled-buffer-list-panel";
import { BufferListProjectTask } from "./buffer-list-project-task";
import { useRouter } from "next/navigation";
export const CalendarDayView = () => {
    const {
        tasksStyle,
        calendarMap,
        currentView,
        setCurrentView,
        editorPosition,
        panelPosition,
        unscheduledMonthData,
        setUnscheduledMonthData,
        hours,
        topPosition,
        sensors,
        handleDeleteUnscheduledTask,
        handleDeleteUnscheduledRoutine,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        alertMessage,
        setAlertMessage,
        currentDate,
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
        getDraggableTaskOverlay,
        getDraggingRoutine,
        getDraggingTask,
        onDeleteCalendarItem,
        onDragStart,
        onDragEnd,
        getSleepBlocks,
        handleCellClick,
        isPanelBufferListDragging,
        draggingProjectTaskId,
        getDraggingProjectTask,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    return (
        <Card className="w-full h-[100%] mx-auto rounded-xl shadow-lg bg-slate-50/50 p-0">
            {/* ====== Header (Same as before) ====== */}
            <CardHeader ref={headerRef} className="grid grid-cols-[auto_1fr_auto] items-center p-4 border-gray-200 border-b-0 bg-white rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Private calendar / <span className="text-slate-800">Day View</span>
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
                <div className="-mt-6">
                    {Object.keys(calendarMap).map((id: string) => {
                        return (calendarMap[id] || []).filter(task => task?.type === "memorable_event").map((task: Task, index: number) => {
                            return (
                                <DraggableTask
                                    key={task.id?.toString() || "draggable-task-".concat(index.toString())} // Use task.id for a stable key
                                    task={{ ...task, type: (task?.type || "").toLowerCase() }}
                                    draggable={false}
                                    wrapperClassName="truncate rounded-lg pl-2 mt-1 mb-1"
                                />
                            );
                        })
                    })}
                </div>
                {/* Scroll container */}
                <div ref={scrollContainerRef} className="relative h-[85vh] overflow-y-scroll overflow-x-hidden">
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
                                                onClick={(e) => handleCellClick(e, id, scrollContainerRef)}
                                                className="w-14/15 cursor-pointer"
                                            >
                                                <CalendarDayViewDroppableCell key={id} id={id} bordered={false}>
                                                    {(calendarMap[id] || []).filter(task => task?.type !== "memorable_event").map((task: Task, index: number) => {
                                                        return (
                                                            <DraggableTask
                                                                key={task.id?.toString() || "draggable-task-".concat(index.toString())} // Use task.id for a stable key
                                                                handleTaskDoubleClick={handleTaskDoubleClick}
                                                                task={{ ...task, type: (task?.type || "").toLowerCase() }}
                                                                draggable={!((task?.type || "").toLowerCase() === "routine")}
                                                                wrapperClassName="truncate absolute rounded-lg pl-2"
                                                                wrapperStyle={{
                                                                    ...tasksStyle[task.id as number],
                                                                    top: `${tasksStyle[task.id as number].top}%`,
                                                                    left: `${tasksStyle[task.id as number].left}%`,
                                                                    height: `${tasksStyle[task.id as number].height}rem`,
                                                                    width: `${tasksStyle[task.id as number].width}%`,
                                                                }}
                                                                badgeWrapperClassName="-mt-2.5"
                                                                scrollContainerRef={scrollContainerRef}
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
                            headerRef={headerRef}
                            handleRemoveUnscheduledRoutine={handleDeleteUnscheduledRoutine}
                            handleRemoveUnscheduledSubTask={handleDeleteUnscheduledTask}
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
                                    <PanelDragOverlay
                                        type={"unscheduled-task-panel"}
                                    />
                                )}
                                {isPanelBufferListDragging && (
                                    <PanelDragOverlay
                                        type="buffer-list-panel"
                                    />
                                )}
                                {!isNil(draggingProjectTaskId) && (
                                    <BufferListProjectTask
                                        task={getDraggingProjectTask()}
                                    />
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
                    <TaskEditor
                        key={editingTask?.id || "none"}
                        open={!!editingTask}
                        task={{ ...editingTask, type: (editingTask?.type || "").toLowerCase() }}
                        setAlertMessage={setAlertMessage}
                        onClose={() => {
                            setEditingTask(null);
                            setSelectedTaskId(null);
                        }}
                        style={{ top: editorPosition.y, left: editorPosition.x }}
                        handleReload={handleReload}
                        onDelete={() => onDeleteCalendarItem(editingTask?.id)}
                        setSelectedTaskId={setSelectedTaskId}
                        setSelectedRoutineId={setSelectedRoutineId}
                        setEditingTask={setEditingTask} />
                </div>

            </CardContent>
        </Card>
    );
};

const PanelDragOverlay = (
    { type }: { type: "buffer-list-panel" | "unscheduled-task-panel" },
) => {
    // 1. Root styles: ONLY opacity. No transform or transition.
    const rootStyle: React.CSSProperties = {
        opacity: 0.9,
    };

    // 2. Inner styles: Your scale and transition.
    const innerStyle: React.CSSProperties = {
        transform: "scale(1.05)",
        transition: "transform 0.1s ease",
    };

    return (
        // Root element: dnd-kit will apply its 'translate' here
        <div style={rootStyle}>
            {/* Inner element: Applies your custom scale/transition */}
            <div
                style={innerStyle}
                className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg cursor-grabbing"
            >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                    {type === 'unscheduled-task-panel' && <ClipboardList className="h-8 w-8 text-black" />}
                    {type === 'buffer-list-panel' && <Users className="h-8 w-8 text-black" />}
                </div>
            </div>
        </div>
    );
};