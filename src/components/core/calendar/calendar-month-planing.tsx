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
import { calendarRepository } from "@/repository/calendar-repository";
import { useContext, useEffect, useState } from "react";
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
import { isNil } from "lodash";

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
        alertMessage,
        editingTask,
        setEditingTask,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const categories = ["Event", "Routine", "Big Task"];
    const weeks = getWeeksInMonth(currentDate.get("month"));
    const MAX_VISIBLE_TASKS = 2;

    const [popoverState, setPopoverState] = useState<{
        open: boolean;
        id: string | null;
        tasks: (MonthPlanningBigTask | MonthPlanningEvent | string)[];
    }>({ open: false, id: null, tasks: [] });

    const [weekPopoverState, setWeekPopoverState] = useState<{
        open: boolean;
        id: string | null;
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

    const handleCellClick = (type: TaskType) => {
        let newItem =
            type === "event"
                ? new MonthPlanningEvent()
                : type === "routine"
                    ? "New routine"
                    : new MonthPlanningBigTask();
        setEditingItem(newItem);
    };

    const handleBigTaskClick = (e: React.MouseEvent<HTMLDivElement>, bigTask: MonthPlanningBigTask) => {
        // This function only works if it is big task
        if (!bigTask?.estimatedStartDate) {
            return;
        }
        const adjustedPosition = getEditorAdjustedPosition(e.clientX, e.clientY);
        setEditorPosition(adjustedPosition);
        calendarRepository
            .getBigTask({
                monthPlanId: localStorage.getItem("monthPlanId"),
                bigTaskId: bigTask?.id,
            })
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        setPopoverState({
                            open: true,
                            id: "big-task-popover",
                            tasks: (res?.data?.unscheduledTasks || []).map((unscheduledTask: any) => ({
                                ...unscheduledTask,
                                bigTaskId: bigTask?.id,
                            })),
                        });

                    } else {
                        setPopoverState({ open: false, id: null, tasks: [] });
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: () => setPopoverState({ open: false, id: null, tasks: [] }),
            });
    };

    const loadMonthPlanningItems = (monthPlanId?: number) => {
        calendarRepository.getMonthPlaningItems({ monthPlanId }).subscribe({
            next: (res) => {
                if (res?.status) {
                    const approvedRoutines = res?.data?.approvedRoutineNames || [];
                    const bigTasks = res?.data?.bigTasks || [];
                    const events = res?.data?.events || [];
                    setMonthPlanningEvents(events);
                    setMonthPlanningBigTasks(bigTasks);
                    setMonthPlanningRoutines(approvedRoutines);
                } else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: () => { },
        });
    };

    const getMonthPlanId = () => {
        const year = currentDate.year();
        const month = currentDate.month() + 1;

        calendarRepository.getMonthPlanIdByDate({ year, month }).subscribe({
            next: (res) => {
                const success = res?.status;
                const monthPlanId = res?.data;
                if (success && monthPlanId) {
                    localStorage.setItem("monthPlanId", monthPlanId);
                    loadMonthPlanningItems(monthPlanId);
                } else {
                    toast.error(res?.msg || res?.message);
                    localStorage.removeItem("monthPlanId");
                }
            },
            error: () => {
                localStorage.removeItem("monthPlanId");
            },
        });
    };

    const onDeleteItem = (itemId: string | number) => {
        if (typeof itemId === "string") {
            const updatedMonthPlanningRoutines = [...monthPlanningRoutines];
            const index = updatedMonthPlanningRoutines.findIndex((r) => r === itemId);
            const monthPlanId = localStorage.getItem("monthPlanId");
            updatedMonthPlanningRoutines.splice(index, 1);
            calendarRepository
                .updateMonthPlanRoutines(Number(monthPlanId), {
                    approvedRoutineNames: updatedMonthPlanningRoutines,
                })
                .subscribe({
                    next: (res) => {
                        if (res?.status) {
                            setEditingItem(null);
                            loadMonthPlanningItems(Number(monthPlanId));
                            toast.success(res?.msg || res?.message);
                        } else toast.error(res?.msg || res?.message);
                    },
                    error: () => { },
                });
            return;
        }

        calendarRepository.deleteCalendarItem(itemId as number).subscribe({
            next: (res) => {
                if (res?.status) {
                    const monthPlanId = localStorage.getItem("monthPlanId");
                    toast.success(res?.msg || res?.message);
                    setEditingItem(null);
                    loadMonthPlanningItems(Number(monthPlanId));
                } else toast.error(res?.msg || res?.message);
            },
            error: () => { },
        });
    };

    const handleDoubleClick = (
        event: React.MouseEvent<HTMLDivElement>,
        taskId?: number | string,
        task?: MonthPlanningBigTask | MonthPlanningEvent | string
    ) => {
        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY);
        setEditorPosition(adjustedPosition);

        if (typeof task === "object" && task !== null) {
            if (typeof taskId === "number" && (task as MonthPlanningEvent).specificDate) {
                calendarRepository.getCalendarItem({ itemId: taskId }).subscribe({
                    next: (res) => {
                        if (res?.status) {
                            setEditingTask({
                                ...res?.data,
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
                calendarRepository.getBigTask({
                    monthPlanId: localStorage.getItem("monthPlanId"),
                    bigTaskId: taskId,
                })
                    .subscribe({
                        next: res => {
                            const success = res?.status;
                            if (success) {
                                setEditingItem({
                                    ...res?.data?.bigTask,
                                });
                                setEditingTask(null);
                            }
                            else {
                                toast.error(res?.msg || res?.message);
                            }
                        },
                        error: err => { }
                    });
            }
            return;
        }
        else if (typeof task === 'string') {
            setEditingItem(task);
            setEditingTask(null);
        }
    };

    const updateRoutineList = (oldName: string, newName?: string) => {
        const newMonthPlanningRoutines = [...monthPlanningRoutines];
        const index = newMonthPlanningRoutines.findIndex(routine => routine === oldName);
        const isDelete = newName === "" || isNil(newName);
        if (index === -1 && !isDelete) {
            return;
        }
        if (isDelete) {
            newMonthPlanningRoutines.splice(index, 1);
        }
        else {
            newMonthPlanningRoutines[index] = newName;
        }
        const monthPlanId = localStorage.getItem("monthPlanId");
        calendarRepository.updateRoutineList({
            monthPlanId,
        }, {
            approvedRoutineNames: newMonthPlanningRoutines,
        }).subscribe({
            next: res => {
                const success = res?.status;
                if (success) {
                    toast.success(res?.msg || res?.message);
                    loadMonthPlanningItems(Number(monthPlanId));
                    setEditingItem(null);
                    setEditingTask(null);
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
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
        getMonthPlanId();
    }, [currentDate]);

    useEffect(() => {
        const newBigTaskStyles: Record<number, any> = {};
        weeks.forEach((week) => {
            monthPlanningBigTasks.forEach((bigTask) => {
                const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate);
                const weekStart = startDate.format("YYYY-MM-DD");
                const weekEnd = endDate.format("YYYY-MM-DD");
                const startTime = bigTask.estimatedStartDate;
                if (weekStart <= startTime && startTime <= weekEnd) {
                    const daysDiff = toDayJs(startTime).diff(startDate, "day");
                    const range = toDayJs(bigTask.estimatedEndDate).diff(startTime, "day");
                    newBigTaskStyles[bigTask.id as number] = {
                        left: (daysDiff / 6) * 100,
                        width: (range / 6) * 100,
                    };
                }
            });
        });
        setBigTaskStyles(newBigTaskStyles);
    }, [monthPlanningBigTasks]);

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
                    <SegmentedControl value={currentView} onValueChange={setCurrentView} />
                    <RoundedButton label="UTC" id="calendar-utc-btn" />
                </div>
            </CardHeader>

            <CardContent className="p-0 h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] font-medium text-gray-500">Mon–Sun</TableHead>
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
                                        const { startDate, endDate } = getWeekStartTimeEndTime(week, currentDate);
                                        const weekStart = startDate.format("YYYY-MM-DD");
                                        const weekEnd = endDate.format("YYYY-MM-DD");

                                        if (currentType === "event") {
                                            const taskTime = (task as MonthPlanningEvent).specificDate;
                                            return weekStart <= taskTime && taskTime <= weekEnd;
                                        } else if (currentType === "big-task") {
                                            const startTime = (task as MonthPlanningBigTask).estimatedStartDate;
                                            return weekStart <= startTime && startTime <= weekEnd;
                                        }
                                        return index === 0;
                                    });

                                    return (
                                        <TableCell
                                            key={`${category}-${week}`}
                                            className="relative align-top p-2 border-r-2 w-55"
                                            onClick={() => handleCellClick(getType(category))}
                                        >
                                            <div className="flex-1 overflow-y-auto space-y-1">
                                                {tasksForCell.slice(0, MAX_VISIBLE_TASKS).map((task, i) => (
                                                    <div key={i} onClick={(e) => e.stopPropagation()}>
                                                        <BaseTask
                                                            key={`month-planning-item-${i}`}
                                                            task={task}
                                                            taskType={currentType}
                                                            isEditing={!!editingItem && editingItem === task && typeof task === 'string'}    // For routine
                                                            updateRoutineList={updateRoutineList}
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
                                                            titleClassName="text-[0.8rem] w-[150px]"
                                                        />
                                                    </div>
                                                ))}

                                                {tasksForCell.length > MAX_VISIBLE_TASKS && (
                                                    <Popover
                                                        open={
                                                            weekPopoverState.open && weekPopoverState.id === week
                                                        }
                                                        onOpenChange={(isOpen) =>
                                                            setWeekPopoverState({
                                                                open: isOpen,
                                                                id: isOpen ? week : null,
                                                            })
                                                        }
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <div
                                                                className={cn(
                                                                    "rounded-lg z-[9] cursor-pointer bg-gray-200 text-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 font-medium",
                                                                    {
                                                                        "absolute bottom-1": [
                                                                            "routine",
                                                                            "big-task",
                                                                        ].includes(currentType),
                                                                    },
                                                                    {
                                                                        "w-[500%]": currentType === "routine",
                                                                    }
                                                                )}
                                                            >
                                                                {tasksForCell.length - MAX_VISIBLE_TASKS} more
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 z-[999]" side="bottom" align="start">
                                                            <DayTasksPopover
                                                                tasks={tasksForCell.slice(
                                                                    MAX_VISIBLE_TASKS,
                                                                    tasksForCell.length
                                                                )}
                                                                type="month-planning"
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

                        <Popover
                            open={popoverState.open && popoverState.id === "big-task-popover"}
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
                                    type="month-planning"
                                    selectedTaskId={selectedItemId}
                                    setSelectedTaskId={setSelectedItemId}
                                    setEditingMonthPlanItem={setEditingItem}
                                    setEditorPosition={setEditorPosition}
                                    editorOffset={{ x: 120, y: 0 }}
                                    onAddTaskClick={() => {
                                        setEditingItem(new UnscheduledTask);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {((editingItem && typeof editingItem !== "string") || editingTask) && (
                            <TaskEditor
                                key="month-planning-task-editor"
                                currentView="month-planning"
                                currentTaskType={
                                    editingTask?.startTime !== undefined ? "task" :
                                        (editingItem as any as MonthPlanningEvent)?.specificDate !== undefined
                                            ? "event"
                                            : "big-task"
                                }
                                task={(editingItem as any) || editingTask}
                                setAlertMessage={setAlertMessage}
                                onClose={() => {
                                    setEditingItem(null);
                                    setEditingTask(null);
                                }}
                                handleReload={() => loadMonthPlanningItems(Number(localStorage.getItem("monthPlanId")))}
                                style={{ top: editorPosition.y, left: editorPosition.x }}
                                onDelete={() => onDeleteItem((editingItem as any)?.id)}
                            />
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
