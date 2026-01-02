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
import {
    cn,
    dayJsToISOString,
    getEditorAdjustedPosition,
    getWeeksInMonth,
    getWeekStartTimeEndTime,
    toDayJs,
} from "@/lib/utils";
import {
    MonthPlanningBigTask,
    MonthPlanningEvent,
    UnscheduledTask
} from "@/model/task";
import { isNil } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { TaskType } from "../task-editor/task-type-dropdown";
import { BaseTask } from "../task/base-task";
import {
    CalendarContext,
    CalendarContextInterface,
} from "./calendar-context";
import { DayTasksPopover } from "./day-tasks-popover";
import { RoutineEditor } from "./routine-editor";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { useRouter } from "next/navigation";

export function CalendarMonthPlanning() {
    const {
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        currentDate,
        setAlertMessage,
        alertMessage,
        editingTask,
        setEditingTask,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const categories = ["Event", "Routine", "Big Task"];
    const weeks = getWeeksInMonth(currentDate.get("month"), currentDate.get("year"));
    const MAX_VISIBLE_TASKS = 2;

    const scrollContainerRef = useRef(null);
    const router = useRouter();

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        id: string | null;
        tasks: (MonthPlanningBigTask | MonthPlanningEvent | string)[];
        bigTaskId?: number;
        type?: string;
    }>({ open: false, id: null, tasks: [] });
    const [weekBigTaskPopoverState, setWeekBigTaskPopoverState] = useState<{
        open: boolean;
        id: string | null; // This will be the week string, e.g., "27 - 2"
    }>({ open: false, id: null });
    const [weekRoutinePopoverState, setWeekRoutinePopoverState] = useState<{
        open: boolean;
        id: string | null; // This will be the week string, e.g., "27 - 2"
    }>({ open: false, id: null });
    const [weekEventPopoverState, setWeekEventPopoverState] = useState<{
        open: boolean;
        id: string | null; // This will be the week string, e.g., "27 - 2"
    }>({ open: false, id: null });
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [editingItem, setEditingItem] = useState<
        MonthPlanningEvent | MonthPlanningBigTask | UnscheduledTask | string | null
    >(null);
    const [monthPlanningEvents, setMonthPlanningEvents] = useState<MonthPlanningEvent[]>([]);
    const [monthPlanningRoutines, setMonthPlanningRoutines] = useState<string[]>([]);
    const [monthPlanningBigTasks, setMonthPlanningBigTasks] = useState<MonthPlanningBigTask[]>([]);
    const [bigTaskStyles, setBigTaskStyles] = useState<Record<string, any>>({});
    const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
    // For discriminate edit and create routine case
    const [openRoutineEditor, setOpenRoutineEditor] = useState<boolean>(false);
    // Loading state for month planning
    const [isLoadingMonthPlanning, setIsLoadingMonthPlanning] = useState<boolean>(true);

    const getType = (category: string): TaskType => {
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
    };

    const {
        calendarRepository,
        calendarId,
    } = useContext<AppContextProps>(AppContext);

    const {
        setMonthPlanId,
        monthPlanId,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const isInitialMount = useRef(true);
    const justClosedRef = useRef(false);

    useEffect(() => {
        setCurrentView('month-planning');
        // Suppress the first run (the Strict Mode check)
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!calendarRepository) {
            return;
        }
        getMonthPlanId();
    }, [currentDate, calendarRepository]);

    const handleCellClick = (type: TaskType, e: React.MouseEvent<HTMLTableDataCellElement>, scrollContainerRef?: any, week?: string, weekIndex?: number) => {
        if (justClosedRef.current) return;

        let defaultDate = toDayJs();
        if (week) {
            const { startDate } = getWeekStartTimeEndTime(week, currentDate, weekIndex);

            // If the current date is within the selected week, use the current date.
            // But strict requirement: use startDate unless today falls in range.
            const today = toDayJs();
            // We use the start of the week logic for defaults
            defaultDate = startDate.startOf('day');
        }

        const newItem =
            type === "event"
                ? {
                    ...new MonthPlanningEvent,
                    // Add startTime & endTime for task editor
                    specificDate: dayJsToISOString(defaultDate), // Set specificDate for MonthPlanningEvent
                    startTime: dayJsToISOString(defaultDate),
                    endTime: dayJsToISOString(defaultDate.add(1, 'hour')), // Default duration 1 hour
                }
                : type === "routine"
                    ? ""        // Set "" to call updateRoutineList("", <new name>) with create case
                    : {
                        ...new MonthPlanningBigTask,
                        // Add startTime & endTime for task editor
                        startTime: dayJsToISOString(defaultDate),
                        endTime: dayJsToISOString(defaultDate.add(7, 'day')), // BigTask default 1 week
                    };
        setEditingItem(newItem);
        setEditorPosition(getEditorAdjustedPosition(e.clientX, e.clientY, scrollContainerRef.current));
        if (type === "routine") {
            setOpenRoutineEditor(true);
        }
    };

    const handleBigTaskClick = (e: React.MouseEvent<HTMLDivElement>, bigTask: MonthPlanningBigTask, scrollContainerRef?: any) => {
        // This function only works if it is big task
        if (!bigTask?.estimatedStartDate) {
            return;
        }
        // If TaskEditor is openning, close it
        if (editingItem || editingTask) {
            setEditingItem(null);
            setEditingTask(null);
        }
        const adjustedPosition = getEditorAdjustedPosition(e.clientX, e.clientY, scrollContainerRef.current);
        setEditorPosition(adjustedPosition);
        calendarRepository?.getBigTask({
            monthPlanId: monthPlanId || 0,
            bigTaskId: bigTask?.id,
        })
            .subscribe({
                next: (res: any) => {
                    if (res?.status) {
                        setPopoverState({
                            open: true,
                            id: "big-task-popover",
                            tasks: (res?.data?.unscheduledTasks || []).map((unscheduledTask: any) => ({
                                ...unscheduledTask,
                                type: "task",
                                bigTaskId: bigTask?.id,
                            })),
                            bigTaskId: bigTask?.id,
                            type: "unscheduled-task",
                        });

                    } else {
                        setPopoverState({ open: false, id: null, tasks: [], bigTaskId: undefined });
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: () => setPopoverState({ open: false, id: null, tasks: [] }),
            });
    };

    const loadMonthPlanningItems = (monthPlanId?: number) => {
        setIsLoadingMonthPlanning(true);
        calendarRepository?.getMonthPlaningItems({ monthPlanId }).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    const approvedRoutines = res?.data?.approvedRoutineNames || [];
                    const bigTasks = res?.data?.bigTasks || [];
                    const events = res?.data?.events || [];
                    setMonthPlanningEvents(events.map((event: any) => ({ ...event, type: "event" })));
                    setMonthPlanningBigTasks(bigTasks.map((bigTask: any) => ({ ...bigTask, type: "big-task" })));
                    setMonthPlanningRoutines(approvedRoutines);
                } else {
                    toast.error(res?.msg || res?.message);
                }
                setIsLoadingMonthPlanning(false);
            },
            error: () => { setIsLoadingMonthPlanning(false); },
        });
    };

    const getMonthPlanId = () => {
        const year = currentDate.year();
        const month = currentDate.month() + 1;

        const subscription = calendarRepository?.getMonthPlanIdByDate({ year, month }).subscribe({
            next: (res: any) => {
                const success = res?.status;
                const monthPlanId = res?.data;
                if (success && monthPlanId) {
                    setMonthPlanId(monthPlanId);
                    loadMonthPlanningItems(monthPlanId);
                } else {
                    // If monthPlanId not found, create new monthPlanId
                    calendarRepository?.createMonthPlan({
                        year: currentDate.get("year"),
                        month: currentDate.get("month") + 1,
                    }).subscribe({
                        next: (res: any) => {
                            if (res.status) {
                                setMonthPlanId(res?.data?.monthPlanId);
                                loadMonthPlanningItems(res?.data?.monthPlanId);
                            }
                            else {
                                toast.error(res?.message || res?.msg);
                            }
                        },
                        error: (err: any) => {
                            const errors = err?.response?.data?.data;
                            const message = err?.response?.data?.msg || err?.response?.data?.message;
                            setAlertMessage({
                                type: "warning",
                                title: message,
                                description: errors,
                            });
                        }
                    });
                }
            },
            error: () => { },
        });

        return () => {
            subscription?.unsubscribe();
        };
    };

    const onDeleteItem = (item: MonthPlanningBigTask | MonthPlanningEvent | UnscheduledTask | string) => {
        // For unscheduled routine
        if (typeof item === "string") {
            const updatedMonthPlanningRoutines = [...monthPlanningRoutines];
            const index = updatedMonthPlanningRoutines.findIndex((r) => r === item);
            updatedMonthPlanningRoutines.splice(index, 1);
            calendarRepository?.updateMonthPlanRoutines(monthPlanId || 0, {
                approvedRoutineNames: updatedMonthPlanningRoutines,
            })
                .subscribe({
                    next: (res: any) => {
                        if (res?.status) {
                            setEditingItem(null);
                            setEditingTask(null);
                            loadMonthPlanningItems(monthPlanId || 0);
                            toast.success(res?.msg || res?.message);
                        }
                        else {
                            toast.error(res?.msg || res?.message);
                        }
                    },
                    error: () => { },
                });
            return;
        }
        // For big task
        else if ((item as MonthPlanningBigTask)?.estimatedStartDate) {
            calendarRepository?.deleteBigTask({
                monthPlanId: monthPlanId || 0,
                bigTaskId: item?.id,
            }).subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.message || res?.msg);
                        setEditingItem(null);
                        setEditingTask(null);
                        loadMonthPlanningItems(monthPlanId || 0);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: (err: any) => { },
            });
            return;
        }

        // For event & unscheduled task
        calendarRepository?.deleteCalendarItem(item?.id as number).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    toast.success(res?.msg || res?.message);
                    setEditingItem(null);
                    loadMonthPlanningItems(monthPlanId || 0);
                } else toast.error(res?.msg || res?.message);
            },
            error: () => { },
        });
    };

    const handleDoubleClick = (
        event: React.MouseEvent<HTMLDivElement>,
        taskId?: number | string,
        task?: MonthPlanningBigTask | MonthPlanningEvent | string,
        scrollContainerRef?: any,
    ) => {
        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY + 200, scrollContainerRef.current);
        setEditorPosition(adjustedPosition);

        if (typeof task === "object" && task !== null) {
            if (typeof taskId === "number" && (task as MonthPlanningEvent).specificDate) {
                calendarRepository?.getCalendarItem({ itemId: taskId }).subscribe({
                    next: (res: any) => {
                        if (res?.status) {
                            setEditingTask({
                                ...res?.data,
                                type: "event",
                                startTime: `${res?.data?.timeSlot?.startTime}Z`,
                                endTime: `${res?.data?.timeSlot?.endTime}Z`,
                            });
                            setEditingItem(null);
                        } else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                        }
                    },
                    error: () => { },
                });
                return;
            }
            else if (typeof taskId === "number" && (task as MonthPlanningBigTask).estimatedStartDate) {
                calendarRepository?.getBigTask({
                    monthPlanId: monthPlanId || 0,
                    bigTaskId: taskId,
                })
                    .subscribe({
                        next: (res: any) => {
                            const success = res?.status;
                            if (success) {
                                setEditingItem({
                                    ...res?.data?.bigTask,
                                    type: "big-task",
                                    // Add startTime & endTime for task editor
                                    startTime: dayJsToISOString(toDayJs(res?.data?.bigTask?.estimatedStartDate, 0)),
                                    endTime: dayJsToISOString(toDayJs(res?.data?.bigTask?.estimatedEndDate, 0)),
                                });
                                setEditingTask(null);
                            }
                            else {
                                toast.error(res?.msg || res?.message);
                            }
                        },
                        error: (err: any) => { }
                    });
            }
            return;
        }
        else if (typeof task === 'string') {
            setEditingItem(task);
            setEditingTask(null);
        }
    };

    const updateRoutineList = (oldName?: string, newName?: string) => {
        const newMonthPlanningRoutines = [...monthPlanningRoutines];
        const index = newMonthPlanningRoutines.findIndex(routine => routine === oldName);
        const isDelete = !isNil(oldName) && oldName !== "" && (newName === "" || isNil(newName));
        const isCreate = (oldName === "" || isNil(oldName)) && newName !== "" && !isNil(newName);
        if (index === -1 && !isDelete && !isCreate) {
            return;
        }
        if (isDelete) {
            newMonthPlanningRoutines.splice(index, 1);
        }
        else if (isCreate) {
            newMonthPlanningRoutines.push(newName);
        }
        else {
            newMonthPlanningRoutines[index] = newName as string;
        }
        calendarRepository?.updateRoutineList({
            monthPlanId: monthPlanId || 0,
        }, {
            approvedRoutineNames: newMonthPlanningRoutines,
        }).subscribe({
            next: (res: any) => {
                const success = res?.status;
                if (success) {
                    toast.success(res?.msg || res?.message);
                    loadMonthPlanningItems(monthPlanId || 0);
                    setEditingItem(null);
                    setEditingTask(null);
                    setOpenRoutineEditor(false);
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: (err: any) => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    };



    useEffect(() => {
        const newBigTaskStyles: Record<number, any> = {};
        weeks.forEach((week, index) => {
            monthPlanningBigTasks.forEach((bigTask) => {
                const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate, index);
                const weekStart = startDate.format("YYYY-MM-DD");
                const weekEnd = endDate.format("YYYY-MM-DD");
                const startTime = bigTask.estimatedStartDate;
                if (weekStart <= startTime && startTime <= weekEnd && !newBigTaskStyles[bigTask.id as number]) {
                    const daysDiff = toDayJs(startTime, 0).diff(startDate, "day");
                    const range = toDayJs(bigTask.estimatedEndDate, 0).diff(toDayJs(startTime, 0), "day");
                    newBigTaskStyles[bigTask.id as number] = {
                        left: (daysDiff / 7) * 100,
                        width: (range / 7) * 100,
                    };
                }
            });
        });
        setBigTaskStyles(newBigTaskStyles);
    }, [monthPlanningBigTasks]);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-white p-0">
            <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center p-4 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Private calendar / <span className="text-slate-800">Month planning</span>
                </div>
                {/* Centered Controls */}
                <div className="flex items-center justify-center gap-4">
                    <RoundedButton label="Today" id="calendar-today-btn" onClick={handleGoToToday} />
                    <DateRangeNavigator
                        dateRangeLabel={generateDateRangeLabel()}
                        onNextClick={() => {
                            setMonthPlanningBigTasks([]);
                            setMonthPlanningEvents([]);
                            setMonthPlanningRoutines([]);
                            onNextDateRangeNavigatorClick();
                        }}
                        onPreviousClick={onPreviousDateRangeNavigatorClick}
                        isNextDisabled={currentDate.add(1, 'month').diff(toDayJs(), "month") >= 6}
                        isPreviousDisabled={currentDate.subtract(1, "month").diff(toDayJs(), "month") < 0}
                    />
                </div>
            </CardHeader>

            <CardContent className="p-0 h-full">
                <div ref={scrollContainerRef} className="relative overflow-x-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] font-medium text-gray-500">Mon-Sun</TableHead>
                                {weeks.map((week) => (
                                    <TableHead key={week} className="text-center font-medium text-gray-500">
                                        {week}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="relative">
                            {/* ====== SKELETON LOADING - Edit values here to adjust sizes ====== */}
                            {isLoadingMonthPlanning && (
                                <>
                                    {/* Event Row Skeletons */}
                                    <TableRow className="h-[28vh]">
                                        <TableCell className="font-semibold text-gray-700 align-top pt-4 w-15 border-r-2">Event</TableCell>
                                        {weeks.map((_, i) => (
                                            <TableCell key={`skel-event-${i}`} className="relative align-top p-2 border-r-2">
                                                <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px', marginBottom: '8px' }} />
                                                <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px' }} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Routine Row Skeleton */}
                                    <TableRow className="h-[28vh]">
                                        <TableCell className="font-semibold text-gray-700 align-top pt-4 w-15 border-r-2">Routine</TableCell>
                                        <TableCell colSpan={weeks.length} className="relative align-top p-2">
                                            <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px', width: '100%', marginBottom: '16px' }} />
                                            <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px', width: '80%' }} />
                                        </TableCell>
                                    </TableRow>
                                    {/* Big Task Row Skeleton */}
                                    <TableRow className="h-[28vh]">
                                        <TableCell className="font-semibold text-gray-700 align-top pt-4 w-15 border-r-2">Big Task</TableCell>
                                        <TableCell colSpan={weeks.length} className="relative align-top p-2">
                                            <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px', width: '60%', marginBottom: '16px' }} />
                                            <div className="animate-pulse rounded-lg bg-gray-200" style={{ height: '50px', width: '45%', marginLeft: '30%' }} />
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                            {/* ====== END SKELETON ====== */}
                            {!isLoadingMonthPlanning && categories.map((category) => {
                                const bigTaskVisited: Record<number, boolean> = {};
                                const bigTaskRendered: Record<number, boolean> = {};
                                let currentBigTaskIndex = -1;

                                return (
                                    <TableRow key={category} className="h-[28vh]">
                                        <TableCell className="font-semibold text-gray-700 align-top pt-4 w-15 border-r-2">
                                            {category}
                                        </TableCell>
                                        {weeks.map((week, index) => {
                                            const currentType = getType(category);
                                            const monthPlanningItems =
                                                currentType === "event"
                                                    ? monthPlanningEvents
                                                    : currentType === "routine"
                                                        ? monthPlanningRoutines
                                                        : monthPlanningBigTasks;
                                            const tasksForCell = monthPlanningItems.filter((task) => {
                                                const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate, index);
                                                const weekStart = startDate.format("YYYY-MM-DD");
                                                const weekEnd = endDate.format("YYYY-MM-DD");

                                                if (currentType === "event") {
                                                    const taskTime = (task as MonthPlanningEvent).specificDate;
                                                    return weekStart <= taskTime && taskTime <= weekEnd;
                                                } else if (currentType === "big-task") {
                                                    let visited = false;
                                                    const startTime = (task as MonthPlanningBigTask).estimatedStartDate;
                                                    const satisfied = weekStart <= startTime && startTime <= weekEnd;
                                                    if (satisfied) {
                                                        visited = bigTaskVisited[(task as MonthPlanningBigTask).id as number];
                                                        bigTaskVisited[(task as MonthPlanningBigTask).id as number] = true;
                                                    }

                                                    return satisfied && !visited;
                                                }
                                                return index === 0;
                                            });

                                            return (
                                                <TableCell
                                                    key={`${category}-${week}`}
                                                    className="relative align-top p-2 border-r-2 w-55"
                                                    onClick={(e) => { handleCellClick(getType(category), e, scrollContainerRef, week, index) }}
                                                >
                                                    <div className="flex-1 overflow-y-auto space-y-1">
                                                        {(currentType === "big-task" ? tasksForCell : tasksForCell.slice(0, MAX_VISIBLE_TASKS)).map((task, i) => {
                                                            if (currentType === "big-task") {
                                                                ++currentBigTaskIndex;

                                                                if (currentBigTaskIndex + 1 > MAX_VISIBLE_TASKS) {
                                                                    return <></>
                                                                }
                                                                else {
                                                                    bigTaskRendered[(task as MonthPlanningBigTask).id as number] = true;
                                                                }
                                                            }
                                                            return (
                                                                <div key={i} onClick={(e) => e.stopPropagation()}>
                                                                    <BaseTask
                                                                        key={`month-planning-item-${i}`}
                                                                        task={task}
                                                                        scrollContainerRef={scrollContainerRef}
                                                                        taskType={currentType}
                                                                        isEditing={!!editingItem && editingItem === task && typeof task === 'string'}    // For routine
                                                                        updateRoutineList={updateRoutineList}
                                                                        setOpenRoutineEditor={setOpenRoutineEditor}
                                                                        handleCancelEdit={() => {
                                                                            setEditingItem(null);
                                                                            setEditingTask(null);
                                                                        }}
                                                                        handleDoubleClick={handleDoubleClick as any}
                                                                        handleCellClick={handleBigTaskClick as any}
                                                                        calendarType="month-planning"
                                                                        wrapperClassName={cn("h-[50px] mb-5 mt-4 z-[9]")}
                                                                        wrapperStyle={{
                                                                            ...(currentType === "routine" && {
                                                                                width: `${weeks.length * 100}%`,
                                                                                position: "absolute",
                                                                                top: `${i * 40}%`,
                                                                            }),
                                                                            ...(currentType === "big-task" && {
                                                                                position: "absolute",
                                                                                top: `${currentBigTaskIndex * 40}%`,
                                                                                left: `${bigTaskStyles[
                                                                                    (task as MonthPlanningBigTask).id as number
                                                                                ]?.left || 0
                                                                                    }%`,
                                                                                width: `${bigTaskStyles[
                                                                                    (task as MonthPlanningBigTask).id as number
                                                                                ]?.width || 0
                                                                                    }%`,
                                                                            }),
                                                                        }}
                                                                        badgeWrapperClassName="mr-3"
                                                                    />
                                                                </div>
                                                            )
                                                        })}

                                                        {(tasksForCell.length > MAX_VISIBLE_TASKS || (currentType === "big-task" && monthPlanningBigTasks.length > MAX_VISIBLE_TASKS && !index)) && (
                                                            <Popover
                                                                open={currentType === 'event' ? weekEventPopoverState.open : currentType === 'big-task' ? weekBigTaskPopoverState.open : weekRoutinePopoverState.open}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <div
                                                                        data-popover-trigger="true" // For cell click check
                                                                        className={cn(
                                                                            "rounded-lg z-[9] cursor-pointer bg-gray-200 text-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 font-medium",
                                                                            {
                                                                                "absolute bottom-1 left-1 w-[95%]": [
                                                                                    "routine",
                                                                                    "big-task",
                                                                                ].includes(currentType),
                                                                            },
                                                                            {
                                                                                "w-[500%]": ["routine", "big-task"].includes(currentType),
                                                                            },
                                                                            {
                                                                                "w-[0%]": currentType === "big-task" && index > 0
                                                                            }
                                                                        )}
                                                                        onClick={(e) => {
                                                                            // Turn off TaskEditor
                                                                            e.stopPropagation();

                                                                            switch (currentType) {
                                                                                case 'event':
                                                                                    setWeekEventPopoverState({
                                                                                        open: !weekEventPopoverState.open,
                                                                                        id: weekEventPopoverState.open ? null : week,
                                                                                    });
                                                                                    break;
                                                                                case 'big-task':
                                                                                    setWeekBigTaskPopoverState({
                                                                                        open: !weekBigTaskPopoverState.open,
                                                                                        id: weekBigTaskPopoverState.open ? null : week,
                                                                                    });
                                                                                    break;
                                                                                case 'routine':
                                                                                    setWeekRoutinePopoverState({
                                                                                        open: !weekRoutinePopoverState.open,
                                                                                        id: weekRoutinePopoverState.open ? null : week,
                                                                                    });
                                                                                    break;
                                                                            }
                                                                            setEditingItem(null);
                                                                            setEditingTask(null);
                                                                        }}
                                                                    >
                                                                        {(currentType !== "big-task" ? tasksForCell.length : monthPlanningBigTasks.length) - MAX_VISIBLE_TASKS} more
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 z-[999]" side="bottom" align="start">
                                                                    <DayTasksPopover
                                                                        tasks={currentType !== "big-task" ? tasksForCell.slice(
                                                                            MAX_VISIBLE_TASKS,
                                                                            tasksForCell.length
                                                                        ) : (() => {
                                                                            const t = [...monthPlanningBigTasks];
                                                                            return t.filter(bigTask => !bigTaskRendered[bigTask.id as number]);
                                                                        })()}
                                                                        scrollContainerRef={scrollContainerRef}
                                                                        setPopoverState={currentType === 'event' ? setWeekEventPopoverState : currentType === 'big-task' ? setWeekBigTaskPopoverState : setWeekRoutinePopoverState}
                                                                        currentTaskType={currentType}
                                                                        type="month-planning"
                                                                        setOpenRoutineEditor={setOpenRoutineEditor}
                                                                        handleBigTaskClick={handleBigTaskClick as any}
                                                                        selectedTaskId={selectedItemId}
                                                                        setSelectedTaskId={setSelectedItemId}
                                                                        setEditingMonthPlanItem={setEditingItem}
                                                                        setEditorPosition={setEditorPosition}
                                                                        editorOffset={{ x: 120, y: 0 }}
                                                                        onTaskClick={() => {
                                                                            // Close this popover when a task inside is clicked
                                                                            currentType === 'event' ? setWeekEventPopoverState({ open: false, id: null })
                                                                                : currentType === 'big-task' ? setWeekBigTaskPopoverState({ open: false, id: null })
                                                                                    : setWeekRoutinePopoverState({ open: false, id: null });
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    {alertMessage && (
                        <AlertModal
                            alertMessage={alertMessage}
                            onClose={() => setAlertMessage(null)}
                        />
                    )}
                    {/* --- FIX: This Popover is ONLY for the "big-task-popover" showing unscheduled tasks --- */}
                    <Popover
                        open={popoverState.open && popoverState.id === "big-task-popover"
                            && !editingItem && !editingTask
                        }
                        onOpenChange={(isOpen) => {
                            if (!isOpen)
                                setPopoverState({ open: false, id: null, tasks: [] });
                        }}
                    >
                        <PopoverTrigger asChild>
                            <div
                                className="absolute"
                                style={{
                                    top: editorPosition.y,
                                    left: editorPosition.x,
                                    width: 1,
                                    height: 1,
                                }}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[999]" side="bottom" align="start">
                            <DayTasksPopover
                                tasks={popoverState.tasks}
                                currentTaskType={popoverState.type}
                                type="month-planning"
                                scrollContainerRef={scrollContainerRef}
                                setPopoverState={(popoverState) => setPopoverState(popoverState)}
                                selectedTaskId={selectedItemId}
                                setOpenRoutineEditor={setOpenRoutineEditor}
                                setSelectedTaskId={setSelectedItemId}
                                setEditingMonthPlanItem={setEditingItem}
                                setEditorPosition={setEditorPosition}
                                handleBigTaskClick={handleBigTaskClick as any} // Pass through
                                editorOffset={{ x: 0, y: 0 }} // Offset from the invisible trigger
                                onAddTaskClick={() => {
                                    setEditingItem({
                                        ...new UnscheduledTask(),
                                        type: "task",
                                        startTime: dayJsToISOString(toDayJs()),
                                        endTime: dayJsToISOString(toDayJs()),
                                        parentBigTaskId: popoverState?.bigTaskId,
                                    });
                                    // Close this popover when opening editor
                                    setPopoverState({ open: false, id: null, tasks: [] });
                                    // Also set editor position for the new task
                                }}
                                onTaskClick={() => {
                                    // Close this popover when a task inside is clicked
                                    setPopoverState({ open: false, id: null, tasks: [] });
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    {openRoutineEditor && (
                        <RoutineEditor
                            editingItem={editingItem as string}
                            setOpenRoutineEditor={setOpenRoutineEditor}
                            updateRoutineList={updateRoutineList}
                            onClose={() => {
                                justClosedRef.current = true;
                                setTimeout(() => { justClosedRef.current = false }, 200);

                                setOpenRoutineEditor(false);
                                setEditingItem(null);
                            }}
                        />
                    )}

                    <TaskEditor
                        key="month-planning-task-editor"
                        open={(!!editingItem && typeof editingItem !== "string") || !!editingTask}
                        currentView="month-planning"
                        currentTaskType={(editingTask || editingItem as any)?.type}
                        task={(editingItem as any) || editingTask}
                        setAlertMessage={setAlertMessage}
                        onClose={() => {
                            justClosedRef.current = true;
                            setTimeout(() => { justClosedRef.current = false }, 200);

                            setEditingItem(null);
                            setEditingTask(null);
                        }}
                        handleReload={() => loadMonthPlanningItems(monthPlanId || 0)}
                        style={{ top: editorPosition.y, left: editorPosition.x }}
                        onDelete={() => onDeleteItem((editingTask || editingItem as any))}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
