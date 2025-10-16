"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, dayJsToISOString } from "@/lib/utils";
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
import { useContext, useMemo, useState } from "react";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { DAYS_OF_WEEK } from "@/const/consts";
import { Task } from "@/model/task";
import dayjs from "dayjs";
import { BaseTask } from "../task/base-task";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayTasksPopover } from "./day-tasks-popover";
import { TaskEditor } from "../task-editor/task-editor";

export function CalendarMonthView() {
    const {
        currentView,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        currentDate,
        setAlertMessage,
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

    const tasks = useMemo(() => {
        const taskArray: Task[] = [];
        const today = dayjs();
        const startOfWeek = today.startOf('week');
        for (let i = 0; i < 15; i++) {
            const taskDay = startOfWeek.add(1, 'day');
            const startTime = dayJsToISOString(taskDay.hour(i <= 2 ? 9 : 7).minute(i).second(0));
            const endTime = dayJsToISOString(taskDay.hour(i <= 2 ? 17 : 12).minute(30).second(0));

            taskArray.push({
                id: startTime,
                startTime,
                endTime,
                type: i % 2 === 0 ? "event" : "task",
                title: "Task 1",
                description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
            });
        }
        return taskArray;
    }, []);

    const [initTasks, setInitTasks] = useState<Task[]>(tasks);
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

            <CardContent className="p-0 flex-1">
                <div className="grid grid-cols-7 border-t border-l h-full relative">
                    {/* --- Day of the week headers --- */}
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="text-center font-semibold text-gray-500 py-2 border-r">
                            {day}
                        </div>
                    ))}

                    {/* --- Day cells --- */}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-2 border-r border-b flex flex-col",
                                { "bg-gray-50 text-gray-400": !isSameMonth(day, currentMonthDate) }
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium h-8 w-8 flex items-center justify-center text-[1.2rem]",
                                { "bg-blue-600 text-white rounded-full": isToday(day) }
                            )}>
                                {format(day, "d")}
                            </span>
                            <div className="flex-1 overflow-y-auto">
                                {tasks.slice(0, MAX_VISIBLE_TASKS).map(task => (
                                    <BaseTask
                                        key={task.id}
                                        task={task}
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
                                        tasks={tasks}
                                        selectedTaskId={selectedTaskId}
                                        setSelectedTaskId={setSelectedTaskId}
                                        setEditorPosition={setEditorPosition}
                                        editorOffset={{x: 120, y: 0}}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    ))}
                    {selectedTaskId && (
                        <TaskEditor
                            key={selectedTaskId}
                            task={new Task}
                            updatedTasks={initTasks}
                            setUpdatedTasks={setInitTasks}
                            setAlertMessage={setAlertMessage}
                            onClose={() => setSelectedTaskId("")}
                            style={{ top: editorPosition.y, left: editorPosition.x }}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};