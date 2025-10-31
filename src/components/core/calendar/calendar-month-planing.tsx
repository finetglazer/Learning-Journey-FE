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
import { cn, getWeeksInMonth, getWeekStartTimeEndTime, toDayJs } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskType } from "../task-editor/task-type-dropdown";
import { BaseTask } from "../task/base-task";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { DayTasksPopover } from "./day-tasks-popover";

export function CalendarMonthPlanning() {
    const {
        currentView,
        setUpdatedTasks,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        currentDate,
        setAlertMessage,
        alertMessage,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const categories = ['Event', 'Routine', 'Big Task'];
    const weeks = getWeeksInMonth(currentDate.get("month"));

    const MAX_VISIBLE_TASKS = 5;

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        id: string | null;
        tasks: (MonthPlanningBigTask | MonthPlanningEvent | string)[];
    }>({ open: false, id: null, tasks: [] });

    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [editingItem, setEditingItem] = useState<MonthPlanningEvent | MonthPlanningBigTask | string | null>(null);
    const [monthPlanningEvents, setMonthPlanningEvents] = useState<MonthPlanningEvent[]>([]);
    const [monthPlanningRoutines, setMonthPlanningRoutines] = useState<string[]>([]);
    const [monthPlanningBigTasks, setMonthPlanningBigTasks] = useState<MonthPlanningBigTask[]>([]);
    const [bigTaskStyles, setBigTaskStyles] = useState<Record<string, any>>({});
    const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
    
    const getType = (category: string) => {
        switch (category) {
            case "Event":
                return "event";
            case "Routine":
                return "routine";
            case "Big Task":
                return "big-task";
            default:
                return "big-task";
        }
    }

    const handleCellClick = (type: TaskType) => {
        // There are 3 cases: for event, for big task, and for unscheduled routine
        let newItem = type === "event" ? new MonthPlanningEvent : (type === "routine" ? "New routine" : new MonthPlanningBigTask);
        setEditingItem(newItem);
    };

// TODO: How to get monthPlanId for my loadMonthPlanningItems() below
// TODO: Can I add subtasks to big tasks
    const loadMonthPlanningItems = () => {
        calendarRepository.getMonthPlaningItems({monthPlanId: 7})
        .subscribe({
            next: res => {
                const success = res?.status;
                if (success) {
                    const approvedRoutines = res?.data?.approvedRoutineNames || [];
                    const bigTasks = res?.data?.bigTasks || [];
                    const events = res?.data?.events || [];
                    setMonthPlanningEvents(events);
                    setMonthPlanningBigTasks(bigTasks);
                    setMonthPlanningRoutines(approvedRoutines);
                }
                else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: err => { }
        });
    };

    useEffect(() => {
        loadMonthPlanningItems();
    }, [currentDate]);

    useEffect(() => {
        const newBigTaskStyles: Record<number, any> = {};
        weeks.forEach(week => {
            monthPlanningBigTasks.forEach(bigTask => {
                const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate);
                const weekStartTime = startDate.format('YYYY-MM-DD');
                const weekEndTime = endDate.format('YYYY-MM-DD');
                const bigTaskStartTime = bigTask.estimatedStartDate;
                if (weekStartTime <= bigTaskStartTime && bigTaskStartTime <= weekEndTime) {
                    const daysDiff = toDayJs(bigTaskStartTime).diff(startDate, "day");
                    const range = toDayJs(bigTask.estimatedEndDate).diff(bigTaskStartTime, "day");
                    newBigTaskStyles[bigTask?.id as number] = {
                        left: (daysDiff / 6) * 100,      // %
                        width: (range / 6) * 100,       // %
                    }
                }
            });
        });

        setBigTaskStyles(newBigTaskStyles);
    }, [monthPlanningBigTasks]);
console.log(bigTaskStyles)
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
                                {weeks.map((week, index) => {
                                    const currentType = getType(category);
                                    const monthPlanningItems = currentType === "event" ? monthPlanningEvents : (currentType === "routine" ? monthPlanningRoutines : monthPlanningBigTasks);
                                    // Filter tasks for this specific cell (for events only)
                                    const tasksForCell = monthPlanningItems.filter(task => {
                                        const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate);
                                        const weekStartTime = startDate.format('YYYY-MM-DD'); // "2025-10-31"
                                        const weekEndTime = endDate.format('YYYY-MM-DD');   // "2025-11-07"
                                        if (currentType === "event") {
                                            const taskTime = (task as MonthPlanningEvent).specificDate
                                            return weekStartTime <= taskTime && taskTime <= weekEndTime;
                                        }
                                        else if (currentType === "big-task") {
                                            const startTime = (task as MonthPlanningBigTask).estimatedStartDate;
                                            return weekStartTime <= startTime && startTime <= weekEndTime;
                                        }
                                        return index === 0; // Routines should be rendered from the first week
                                    });

                                    return (
                                        <TableCell
                                            key={`${category}-${week}`}
                                            className="relative align-top p-2 border-r-2 w-55"
                                            onClick={() => handleCellClick(getType(category))}
                                        >
                                            <div className="flex-1 overflow-y-auto space-y-1">
                                                {tasksForCell.slice(0, MAX_VISIBLE_TASKS).map((task, index) => (
                                                    <BaseTask
                                                        key={"month-planning-item-".concat(index.toString()).toString()}
                                                        task={task}
                                                        taskType={currentType}
                                                        handleDoubleClick={() => {
                                                            setEditingItem(task);
                                                        }}
                                                        calendarType="month-planning"
                                                        wrapperClassName={cn("h-[30px] mb-2 mt-1",)}
                                                        wrapperStyle={{
                                                            ...(currentType === "routine" && {
                                                                width: `${weeks.length * 100}%`,
                                                                position: "absolute",
                                                            }),
                                                            ...(currentType === "big-task" && {
                                                                position: "absolute",
                                                                left: `${bigTaskStyles[(task as MonthPlanningBigTask)?.id as number]?.left || 0
                                                                    }%`,
                                                                width: `${bigTaskStyles[(task as MonthPlanningBigTask)?.id as number]?.width || 0
                                                                    }%`,
                                                            }),
                                                        }}
                                                        titleClassName="text-[0.8rem]"
                                                    />
                                                ))}

                                                {tasksForCell.length > MAX_VISIBLE_TASKS && (
                                                    <Popover
                                                        open={popoverState.open}
                                                        onOpenChange={(isOpen) => {
                                                            if (isOpen) {
                                                                setPopoverState({ open: true, id: week, tasks: tasksForCell });
                                                            } else {
                                                                setPopoverState({ open: false, id: week, tasks: [] });
                                                            }
                                                        }}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            {tasksForCell.length > MAX_VISIBLE_TASKS && (
                                                                <div className="rounded-lg bg-gray-200 text-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 font-medium cursor-pointer">
                                                                    {tasksForCell.length - MAX_VISIBLE_TASKS} more
                                                                </div>
                                                            )}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" side="bottom" align="start">
                                                            <DayTasksPopover
                                                                tasks={tasksForCell.slice(MAX_VISIBLE_TASKS, tasksForCell.length)}
                                                                selectedTaskId={selectedItemId}
                                                                setSelectedTaskId={setSelectedItemId}
                                                                setEditingMonthPlanItem={setEditingItem}
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
                        {/* {editingItem && (
                            <TaskEditor
                                key={"month-planning-task-editor"}
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
                        )} */}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}