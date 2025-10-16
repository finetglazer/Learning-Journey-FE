"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useContext, useMemo, useState } from "react";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { RoundedButton } from "../button/rounded-button";
import { dayJsToISOString, getWeeksInMonth, isoStringToDate, toDayJs } from "@/lib/utils";
import { Task } from "@/model/task";
import dayjs from "dayjs";
import { BaseTask } from "../task/base-task";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayTasksPopover } from "./day-tasks-popover";
import { TaskEditor } from "../task-editor/task-editor";

export function CalendarMonthPlanning() {
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

    const categories = ['Event', 'Routine', 'Task'];
    const weeks = getWeeksInMonth(currentDate.get("month"));

    const MAX_VISIBLE_TASKS = 5;

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        id: string | null;
        tasks: Task[];
    }>({ open: false, id: null, tasks: [] });

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
                type: i % 2 === 0 ? "event" : "big-task",
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
                                    const tasksForCell = tasks.filter(task => {
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
                                                                tasks={tasksForCell}
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
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}