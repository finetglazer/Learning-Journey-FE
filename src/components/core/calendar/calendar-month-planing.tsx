"use client";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { dayJsToISOString, getWeeksInMonth } from "@/lib/utils";
import { Task } from "@/model/task";
import { useContext, useState } from "react";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { BaseTask } from "../task/base-task";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { DayTasksPopover } from "./day-tasks-popover";
import { AlertModal } from "../alert-modal/alert-modal";

export function CalendarMonthPlanning() {
    const {
        currentView,
        updatedTasks,
        setUpdatedTasks,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        handleTaskDoubleClick,
        currentDate,
        editingTask,
        setEditingTask,
        setAlertMessage,
        sleepStartTime,
        sleepEndTime,
        isOutBigTaskTimeRange,
        onRemoveDraggableTask,
        alertMessage,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const categories = ['Event', 'Routine', 'Task'];
    const weeks = getWeeksInMonth(currentDate.get("month"));

    const MAX_VISIBLE_TASKS = 5;

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        id: string | null;
        tasks: Task[];
    }>({ open: false, id: null, tasks: [] });

    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });

    return (
        <Card className="w-full h-[100vh] mx-auto rounded-xl shadow-lg bg-white p-0">
            <CardHeader className="grid grid-cols-[auto_1fr] items-center p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Calendar / <span className="text-slate-800">Month Planning</span>
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

            {/* ====== Planning Grid ====== */}
            <CardContent className="p-0 h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] font-medium text-gray-500">
                                Mon-Sun
                            </TableHead>
                            {weeks.map((week) => (
                                <TableHead key={week} className="text-center font-medium text-gray-500">
                                    {week}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category} className="h-[28vh]">
                                {/* Row Header Cell */}
                                <TableCell className="font-semibold text-gray-700 align-top pt-4 w-15 border-r-2">
                                    {category}
                                </TableCell>

                                {/* Empty Cells for Tasks */}
                                {weeks.map((week) => {
                                    // Filter tasks for this specific cell
                                    const tasksForCell = updatedTasks.filter(task => {
                                        const taskType = task.type === 'big-task' ? 'task' : task.type;
                                        const taskTime = task.startTime;
                                        const weekStartDate = Number(week.split("-")[0]);
                                        const weekEndDate = Number(week.split("-")[1]);
                                        const weekStartTime = dayJsToISOString(currentDate.date(weekStartDate).startOf('day'));
                                        const weekEndTime = dayJsToISOString(currentDate.date(weekEndDate).endOf('day'));
                                        return taskType === category.toLowerCase() && weekStartTime <= taskTime && taskTime <= weekEndTime;
                                    });

                                    return (
                                        <TableCell key={`${category}-${week}`} className="align-top p-2 border-r-2 w-55">
                                            <div className="flex-1 overflow-y-auto space-y-1">
                                                {tasksForCell.slice(0, MAX_VISIBLE_TASKS).map(task => (
                                                    <BaseTask
                                                        key={task.id}
                                                        task={task}
                                                        handleDoubleClick={handleTaskDoubleClick}
                                                        calendarType="month-planning"
                                                        wrapperClassName="h-[30px] mb-2 mt-1"
                                                        titleClassName="text-[0.8rem]"
                                                    />
                                                ))}

                                                {tasksForCell.length > MAX_VISIBLE_TASKS && (
                                                    <Popover
                                                        open={popoverState.open && popoverState.id === `${category}-${week}`}
                                                        onOpenChange={(isOpen) => {
                                                            if (isOpen) {
                                                                setPopoverState({ open: true, id: `${category}-${week}`, tasks: tasksForCell });
                                                            } else {
                                                                setPopoverState({ open: false, id: null, tasks: [] });
                                                            }
                                                        }}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <div className="rounded-lg bg-gray-200 text-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 font-medium cursor-pointer">
                                                                {tasksForCell.length - MAX_VISIBLE_TASKS} more
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" side="bottom" align="start">
                                                            <DayTasksPopover
                                                                week={week}
                                                                type="month-planning"
                                                                tasks={tasksForCell.slice(MAX_VISIBLE_TASKS, tasksForCell.length)}
                                                                selectedTaskId={selectedTaskId}
                                                                setSelectedTaskId={setSelectedTaskId}
                                                                setEditorPosition={setEditorPosition}
                                                                editorOffset={{ x: 120, y: 0 }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                        {alertMessage && (
                            <AlertModal
                                alertMessage={alertMessage}
                                onClose={() => setAlertMessage(null)}
                            />
                        )}
                        {(editingTask || selectedTaskId) && (
                            <TaskEditor
                                key={editingTask?.id || selectedTaskId}
                                task={editingTask || updatedTasks.find(task => task.id === selectedTaskId) || new Task}
                                updatedTasks={updatedTasks}
                                setUpdatedTasks={setUpdatedTasks}
                                setAlertMessage={setAlertMessage}
                                onClose={() => {
                                    editingTask ? setEditingTask(null)
                                        : (selectedTaskId ? setSelectedTaskId("") : {})
                                }}
                                style={{ top: editorPosition.y, left: editorPosition.x }}
                                sleepStartTime={sleepStartTime}
                                sleepEndTime={sleepEndTime}
                                onDelete={() => onRemoveDraggableTask(editingTask || updatedTasks.find(task => task.id === selectedTaskId) || new Task)}
                                isOutBigTaskTimeRange={isOutBigTaskTimeRange}
                            />
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}