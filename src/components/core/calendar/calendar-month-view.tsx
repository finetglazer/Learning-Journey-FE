"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DAYS_OF_WEEK } from "@/const/consts";
import { cn, getTasksForDay } from "@/lib/utils";
import { Task } from "@/model/task";
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { useContext, useState } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { BaseTask } from "../task/base-task";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { DayTasksPopover } from "./day-tasks-popover";

export function CalendarMonthView() {
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

    const currentMonthDate = currentDate.toDate();

    const firstDayOfMonth = startOfMonth(currentMonthDate);
    const lastDayOfMonth = endOfMonth(currentMonthDate);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const MAX_VISIBLE_TASKS = 2;

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        day: Date | null;
        tasks: Task[];
    }>({ open: false, day: null, tasks: [] });

    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });

    return (
        <Card className="w-full h-[100vh] mx-auto rounded-xl shadow-lg bg-white p-0 flex flex-col">
            <CardHeader className="grid grid-cols-[auto_1fr] items-center p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Private calendar / <span className="text-slate-800">Month View</span>
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

            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                {/* --- Day of the week headers --- */}
                <div className="grid grid-cols-7 border-t border-l">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="text-center font-semibold text-gray-500 py-2 border-r">
                            {day}
                        </div>
                    ))}
                </div>

                {/* --- Day cells --- */}
                <div className="grid grid-cols-7 grid-rows-6 border-l flex-1 relative">
                    {days.map((day, index) => {
                        const tasks = getTasksForDay(updatedTasks, day);
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "p-2 border-r border-b flex flex-col h-[175px]",
                                    { "bg-gray-50 text-gray-400": !isSameMonth(day, currentMonthDate) }
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-medium h-8 w-8 flex items-center justify-center text-[1.2rem]",
                                    { "bg-blue-600 text-white rounded-full": isToday(day) }
                                )}>
                                    {format(day, "d")}
                                </span>
                                <div className="flex-1 overflow-y-auto mt-2">
                                    {tasks.slice(0, MAX_VISIBLE_TASKS).map(task => (
                                        <BaseTask
                                            key={task.id}
                                            task={task}
                                            handleDoubleClick={handleTaskDoubleClick}
                                            calendarType="month-view"
                                            wrapperClassName="h-[30px] mb-2 mt-1"
                                            titleClassName="text-[0.8rem]"
                                        />
                                    ))}
                                </div>
                                <Popover
                                    open={popoverState.open && isSameDay(day, popoverState.day!)}
                                    onOpenChange={(isOpen) => {
                                        if (isOpen) {
                                            setPopoverState({ open: true, day, tasks: tasks });
                                        } else {
                                            setPopoverState({ open: false, day: null, tasks: [] });
                                        }
                                    }}
                                >
                                    <PopoverTrigger asChild>
                                        {tasks.length > MAX_VISIBLE_TASKS && (
                                            <div className="rounded-lg bg-gray-200 text-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 font-medium cursor-pointer">
                                                {tasks.length - MAX_VISIBLE_TASKS} more
                                            </div>
                                        )}
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" side="bottom" align="start">
                                        <DayTasksPopover
                                            day={day}
                                            tasks={tasks.slice(MAX_VISIBLE_TASKS, tasks.length)}
                                            selectedTaskId={selectedTaskId}
                                            setSelectedTaskId={setSelectedTaskId}
                                            setEditorPosition={setEditorPosition}
                                            editorOffset={{ x: 120, y: 0 }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )
                    })}
                </div>
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
            </CardContent>
        </Card>
    );
};