import { dayJsToISOString, getBigTask, getDetails, getEditorAdjustedPosition, getMondayOfThisWeek, getMonthName, getPercentageHeight, getRoutineById, getTaskById, initCalendarMap, reId, timeToFractionalHours, toDayJs, uuid4 } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertMessage } from "../alert-modal/alert-modal";
import { DraggableTask } from "./draggable-task";
import { AppContext, AppContextProps } from "@/hooks/app-context";

export interface CalendarContextProps {
    initTasks?: Task[];
};

export interface CalendarContextInterface {
    currentDate: Dayjs;
    setCurrentDate: Dispatch<SetStateAction<Dayjs>>;
    tasksStyle: Record<string, any>;
    calendarMap: Record<string, any[]>;
    currentView: string;
    setCurrentView: Dispatch<SetStateAction<string>>;
    updatedTasks: Task[];
    setUpdatedTasks: Dispatch<SetStateAction<Task[]>>;
    activeTask: Task | null;
    editorPosition: { x: number; y: number; };
    setEditorPosition: Dispatch<SetStateAction<{ x: number, y: number }>>;
    panelPosition: { x: number; y: number; };
    unscheduledMonthData: UnscheduledMonthData[];
    setUnscheduledMonthData: Dispatch<SetStateAction<UnscheduledMonthData[]>>;
    activeUnscheduledTask?: UnscheduledTask;
    activeUnscheduledRoutine?: UnscheduledRoutine;
    CELL_HEIGHT: number;
    hours: string[];
    startPositionInHours: number;
    endPositionInHours: number;
    sleepStartTime: string;
    sleepEndTime: string;
    topPosition: string;
    sensors: ReturnType<typeof useSensors>;
    handleTaskDoubleClick: (event: React.MouseEvent<HTMLDivElement>, taskId: number, _task?: any, scrollContainerRef?: any) => void;
    handleRemoveUnscheduledBigTask: (unscheduledBigTask: UnscheduledBigTask) => void;
    handleRemoveUnscheduledSubTask: (unscheduledSubtask: UnscheduledTask) => void;
    handleDeleteUnscheduledTask: (unscheduledTaskId: string | number | null, bigTaskId: number) => void;
    handleDeleteUnscheduledRoutine: (unscheduledRoutineId: string | number | null) => void;
    onRemoveDraggableTask: (task: Task) => void;
    currentMondayTime: Dayjs;
    setCurrentMondayTime: Dispatch<SetStateAction<Dayjs>>;
    activeDragId: string | null;
    setActiveDragId: Dispatch<SetStateAction<string | null>>;
    generateDateRangeLabel: () => string;
    onPreviousDateRangeNavigatorClick: () => void;
    onNextDateRangeNavigatorClick: () => void;
    handleGoToToday: () => void;
    alertMessage: AlertMessage | null;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    onChangeUnscheduledTaskTitle: (taskId: string, newTitle: string) => void;
    isOutBigTaskTimeRange: (task: Task) => boolean | "" | undefined;
    setPanelPosition: Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    }>>;
    getSleepBlocks: () => {
        top: string;
        height: string;
    }[];
    handleReload: () => void;
    // For EDITING unscheduled and scheduled task
    selectedTaskId: string | number | null;
    setSelectedTaskId: Dispatch<SetStateAction<string | number | null>>;

    // For EDITING unscheduled and scheduled routine
    selectedRoutineId: string | number | null;
    setSelectedRoutineId: Dispatch<SetStateAction<string | number | null>>;

    // For DRAGGING unscheduled task
    draggingUnscheduledTaskId: string | number | null;
    setDraggingUnscheduledTaskId: Dispatch<SetStateAction<string | number | null>>;

    // For DRAGGING scheduled task
    draggingScheduledTaskId: string | number | null;
    setDraggingScheduledTaskId: Dispatch<SetStateAction<string | number | null>>;

    // For DRAGGING unscheduled routine
    draggingUnscheduledRoutineId: string | number | null;
    setDraggingUnscheduledRoutineId: Dispatch<SetStateAction<string | number | null>>;

    // For DRAGGING unscheduled items panel
    isPanelDragging: boolean;
    setIsPanelDragging: Dispatch<SetStateAction<boolean>>;

    // For editing CREATED task and NEW task 
    editingTask: Task | Partial<Task> | null;
    setEditingTask: Dispatch<SetStateAction<Task | Partial<Task> | null>>;

    getDraggingRoutine: () => any;
    getDraggingTask: () => any;
    getDraggableTaskOverlay: () => any;
    onDeleteCalendarItem: (itemId?: number | string | null) => void;

    onDragStart: (event: DragStartEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    handleCellClick: (event: React.MouseEvent<HTMLTableCellElement>, cellId: string, scrollContainerRef?: any) => void;
    getNewCalendarItem: (itemId: number, isNew?: boolean) => void;
    handleRemoveUnscheduledTask: (unscheduledTaskId: number | string | null, bigTaskId: number) => void;
    handleRemoveUnscheduledRoutine: (unscheduledRoutineId: number | string | null) => void;
    updateBigTask: (monthData: UnscheduledMonthData[], bigTaskParams: { index: number; item: UnscheduledBigTask; monthDataIndex: number; }) => void;
};

export const CalendarContext = createContext<CalendarContextInterface>({
    currentDate: dayjs(),
    setCurrentDate: () => { },
    tasksStyle: {},
    calendarMap: {},
    currentView: "week",
    setCurrentView: () => { },
    updatedTasks: [],
    setUpdatedTasks: () => { },
    activeTask: null,
    editorPosition: { x: 0, y: 0 },
    setEditorPosition: () => { },
    panelPosition: { x: 0, y: 0 },
    unscheduledMonthData: [],
    setUnscheduledMonthData: () => { },
    activeUnscheduledTask: undefined,
    activeUnscheduledRoutine: undefined,
    CELL_HEIGHT: 4.6,
    hours: [],
    sleepStartTime: "22:00",
    sleepEndTime: "06:00",
    topPosition: "0",
    startPositionInHours: 0,
    endPositionInHours: 0,
    sensors: null as any,
    handleTaskDoubleClick: () => { },
    handleRemoveUnscheduledBigTask: () => { },
    handleRemoveUnscheduledSubTask: () => { },
    handleDeleteUnscheduledTask: () => { },
    handleDeleteUnscheduledRoutine: () => { },
    onRemoveDraggableTask: () => { },
    currentMondayTime: dayjs(),
    setCurrentMondayTime: () => { },
    activeDragId: "",
    setActiveDragId: () => { },
    alertMessage: null,
    setAlertMessage: () => { },
    generateDateRangeLabel: () => "",
    onPreviousDateRangeNavigatorClick: () => { },
    onNextDateRangeNavigatorClick: () => { },
    handleGoToToday: () => { },
    onChangeUnscheduledTaskTitle: () => { },
    isOutBigTaskTimeRange: () => false,
    setPanelPosition: () => { },

    handleReload: () => { },
    // Editing state
    selectedTaskId: null,
    setSelectedTaskId: () => { },
    selectedRoutineId: null,
    setSelectedRoutineId: () => { },

    // Dragging state for items
    draggingUnscheduledTaskId: null,
    setDraggingUnscheduledTaskId: () => { },
    draggingScheduledTaskId: null,
    setDraggingScheduledTaskId: () => { },
    draggingUnscheduledRoutineId: null,
    setDraggingUnscheduledRoutineId: () => { },

    // Dragging state for the panel
    isPanelDragging: false,
    setIsPanelDragging: () => { },

    // Editor state for new/created tasks
    editingTask: null,
    setEditingTask: () => { },
    getDraggingRoutine: () => { },
    getDraggingTask: () => { },
    getDraggableTaskOverlay: () => { },
    onDeleteCalendarItem: () => { },

    onDragStart: () => { },
    onDragEnd: () => { },
    handleCellClick: () => { },
    getNewCalendarItem: () => { },
    handleRemoveUnscheduledTask: () => { },
    handleRemoveUnscheduledRoutine: () => { },
    updateBigTask: () => { },
    getSleepBlocks: () => [],
});

export const useCalendarHooks = ({
    initTasks,
}: CalendarContextProps) => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs().date(8).month(10));
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getMondayOfThisWeek());
    const [currentView, setCurrentView] = useState<string>("day");
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>(reId(initTasks || []));
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const [unscheduledMonthData, setUnscheduledMonthData] = useState<UnscheduledMonthData[]>([]);

    const CELL_HEIGHT = 4.57; // rem;
    const now = dayjs();
    const hoursNow = now.hour();
    const minutesNow = now.minute();
    const topPosition = `calc(${(hoursNow + minutesNow / 60) * CELL_HEIGHT}rem - 0.25rem)`; // offset for dot size
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    ); // 00 to 23

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const generateDateRangeLabel = (): string => {
        switch (currentView) {
            case 'day':
                return currentDate.format('DD/MM/YYYY');

            case 'week':
                const weekStart = currentDate.startOf('week').add(1, 'day');
                const weekEnd = currentDate.endOf('week').add(1, 'day');
                // Format: <Month> <start date>-<end date>, <year>
                return `${weekStart.format('MMMM D')} - ${weekEnd.format('D, YYYY')}`;

            case 'month-view':
                return currentDate.format('MMMM YYYY');

            case 'month-planning':
                return getMonthName(currentDate.get("month"));

            case 'year':
                return currentDate.format('YYYY');

            default:
                return "";
        }
    };

    const onNextDateRangeNavigatorClick = () => {
        switch (currentView) {
            case 'day':
                setCurrentDate(currentDate.add(1, 'day'));
                break;
            case 'week':
                setCurrentDate(currentDate.add(1, 'week'));
                break;
            case 'month-view':
            case 'month-planning':
                const nextMonth = currentDate.add(1, 'month');
                // Max for 6 months
                if (nextMonth.diff(toDayJs(), "month") >= 6) {
                    break;
                }
                setCurrentDate(nextMonth);
                break;
            case 'year':
                setCurrentDate(currentDate.add(1, 'year'));
                break;
        }
    };

    const onPreviousDateRangeNavigatorClick = () => {
        switch (currentView) {
            case 'day':
                setCurrentDate(currentDate.subtract(1, 'day'));
                break;
            case 'week':
                setCurrentDate(currentDate.subtract(1, 'week'));
                break;
            case 'month-view':
            case 'month-planning':
                // Disable when navigating to previous month comparing to current month
                if (currentView === 'month-planning') {
                    const previousMonth = currentDate.subtract(1, "month");
                    if (previousMonth.diff(toDayJs(), "month") < 0) {
                        break;
                    }
                }
                setCurrentDate(currentDate.subtract(1, 'month'));
                break;
            case 'year':
                setCurrentDate(currentDate.subtract(1, 'year'));
                break;
        }
    };

    const handleGoToToday = () => {
        setCurrentDate(toDayJs());
    };

    const onRemoveDraggableTask = (task: Task) => {
        setUpdatedTasks(reId([...updatedTasks.filter(updatedTask => updatedTask.id !== task.id)]));
        setEditingTask(null);
    };

    useEffect(() => {
        const newTasks = [...updatedTasks];
        const updatedCalendarMap = initCalendarMap(newTasks);
        const newTasksStyle: Record<string, any> = {};
        let currentZIndex = 0;

        setCalendarMap(updatedCalendarMap);

        const visited: Record<string, boolean> = {};
        Object.keys(updatedCalendarMap).forEach(timeKey => {
            const tasksVal = updatedCalendarMap[timeKey];
            tasksVal.forEach((task: Task, count: number) => {
                let newStyle = newTasksStyle[task?.id as number];
                const startTimeObj = toDayJs(task.startTime);
                const timeKeyObj = toDayJs(timeKey);

                const timeKeyOnSameDay = timeKeyObj
                    .year(startTimeObj.year())
                    .month(startTimeObj.month())
                    .date(startTimeObj.date());

                const diffInMinutes = startTimeObj.diff(timeKeyOnSameDay, "minute");

                const diff = (diffInMinutes / 60) * 100;

                newStyle = {
                    zIndex: !visited[task?.id as number] ? ++currentZIndex : newStyle?.zIndex,
                    top: Math.max((!visited[task?.id as number] ? diff : newStyle?.top) - 20, 0),    // %
                    left: count * 10,    // %
                    height: getPercentageHeight(task) * CELL_HEIGHT, // rem
                    width: Math.min(newStyle?.width || 90, 90 / tasksVal.length),   // %
                }

                newTasksStyle[task?.id as number] = newStyle;
            });
        });

        const sortedTasks = [...updatedTasks].sort((a, b) =>
            toDayJs(a.startTime).diff(toDayJs(b.startTime))
        );

        for (const task of sortedTasks) {
            const overlappingTasks = sortedTasks.filter(otherTask =>
                toDayJs(task.startTime).isBefore(toDayJs(otherTask.endTime)) &&
                toDayJs(otherTask.startTime).isBefore(toDayJs(task.endTime))
            );
            const width = 90 / overlappingTasks.length;
            overlappingTasks.sort((a, b) => String(a.id).localeCompare(String(b.id)));
            const columnIndex = overlappingTasks.findIndex(t => t.id === task.id);
            const left = columnIndex * width;

            newTasksStyle[task?.id as number] = {
                ...newTasksStyle[task?.id as number],
                width,
                left,
            };
        }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks]);

    useEffect(() => {
        if (currentView !== 'month-planning') {
            handleReload();
        }

        setCurrentMondayTime(getMondayOfThisWeek(currentDate));
        setSelectedTaskId(null);
        setSelectedRoutineId(null);
        setEditingTask(null);
        setDraggingScheduledTaskId(null);
        setDraggingUnscheduledRoutineId(null);
        setDraggingUnscheduledRoutineId(null);
    }, [
        currentView,
        currentDate,
    ]);
    // console.log("updatedTasks", updatedTasks);
    // console.log("calendarMap", calendarMap)
    // console.log("tasksStyle", tasksStyle);

    const getRequestView = () => {
        switch (currentView.toLowerCase()) {
            case "day":
                return "DAY";
            case "week":
                return "WEEK";
            case "month-view":
            case "month-planning":
                return "MONTH";
            case "year":
                return "YEAR";
        }
    };

    // For EDITING unscheduled and scheduled task
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
    // For EDITING unscheduled and scdeduled routine
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled task
    const [draggingUnscheduledTaskId, setDraggingUnscheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING scheduled task
    const [draggingScheduledTaskId, setDraggingScheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled routine
    const [draggingUnscheduledRoutineId, setDraggingUnscheduledRoutineId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled items panel
    const [isPanelDragging, setIsPanelDragging] = useState<boolean>(false);
    // For editing CREATED task and NEW task 
    const [editingTask, setEditingTask] = useState<Task | Partial<Task> | null>(null);
    const {
        sleepHours, // Using the new sleepHours array: {startTime: "HH:mm", endTime: "HH:mm"}[]
    } = useContext<AppContextProps>(AppContext);

    const handleReload = () => {
        calendarRepository.getScheduledItems({
            view: getRequestView(),
            date: currentDate.format('YYYY-MM-DD'),
            calendarId: Number(localStorage.getItem("calendarId")),
        }).subscribe({
            next: res => {
                const newUpdatedTasks = (res?.data?.items || []).map((item: any) => {
                    const { createdAt, updatedAt, ...restItem } = item;
                    return {
                        ...restItem,
                        status: (restItem?.status || "").toLowerCase(),
                        type: (restItem?.type || "").toLowerCase(),
                        startTime: (restItem?.timeSlot?.startTime || "").concat("Z"),
                        endTime: (restItem?.timeSlot?.endTime || "").concat("Z"),
                        timeSlot: undefined,
                    };
                });
                setUpdatedTasks([...newUpdatedTasks]);
            },
            error: err => {
                console.log("Error occurs while fetching scheduled items", err);
            }
        });
    };

    /**
     * Generates an array of sleep block style objects (top, height)
     * from the sleepHours array. Handles overnight periods.
     */
    const getSleepBlocks = () => {
        const blocks: { top: string, height: string }[] = [];
        if (!sleepHours) return blocks;

        sleepHours.forEach((period, index) => {
            const start = timeToFractionalHours(period.startTime);
            const end = timeToFractionalHours(period.endTime);

            if (start > end) {
                // Overnight sleep
                // Block 1: From start time to midnight
                blocks.push({
                    top: `${start * CELL_HEIGHT}rem`,
                    height: `${(24 - start) * CELL_HEIGHT}rem`,
                });
                // Block 2: From midnight to end time
                blocks.push({
                    top: `0rem`,
                    height: `${end * CELL_HEIGHT}rem`,
                });
            } else {
                // Daytime sleep/nap
                blocks.push({
                    top: `${start * CELL_HEIGHT}rem`,
                    height: `${(end - start) * CELL_HEIGHT}rem`,
                });
            }
        });

        return blocks;
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, taskId: number, _task?: any, scrollContainerRef?: any) => {
        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY, scrollContainerRef?.current);
        setEditorPosition(adjustedPosition);

        // Call get calendar item detail API
        calendarRepository.getCalendarItem({ itemId: taskId })
            .subscribe({
                next: res => {
                    const success = res?.status;
                    if (success) {
                        setSelectedTaskId(taskId);
                        setEditingTask({
                            ...res?.data,
                            startTime: (res?.data?.timeSlot?.startTime as string).concat("Z"),
                            endTime: (res?.data?.timeSlot?.endTime as string).concat("Z"),
                        });
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                    }
                },
                error: err => { }
            });
    };

    const getDraggableTaskOverlay = () => {
        const draggingTask = updatedTasks.find(task => task.id === draggingScheduledTaskId);
        if (!draggingTask) {
            return <></>
        }
        return (
            <DraggableTask
                handleTaskDoubleClick={handleTaskDoubleClick}
                isOverlay={true}
                task={{ ...draggingTask, type: (draggingTask?.type || "").toLowerCase() }}
                wrapperClassName="truncate absolute rounded-lg border-black border-[0.5px] pl-2"
                wrapperStyle={{
                    ...tasksStyle[draggingTask.id as number],
                    top: `${tasksStyle[draggingTask.id as number].top}%`,
                    left: `${tasksStyle[draggingTask.id as number].left}%`,
                    height: `${tasksStyle[draggingTask.id as number].height}rem`,
                    width: `${tasksStyle[draggingTask.id as number].width}%`,
                }}
            />
        );
    };

    const getDraggingTask = () => {
        return getTaskById(unscheduledMonthData, draggingUnscheduledTaskId, []);
    };

    const getDraggingRoutine = () => {
        return getRoutineById(unscheduledMonthData, draggingUnscheduledRoutineId, []);
    };

    const onDeleteCalendarItem = (itemId?: number | string | null, wouldGetUnscheduledItems?: boolean) => {
        // itemId could only be number
        calendarRepository.deleteCalendarItem(itemId as number)
            .subscribe({
                next: res => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.msg || res?.message);
                        setSelectedTaskId(null);
                        setSelectedRoutineId(null);
                        setEditingTask(null);
                        handleReload();
                        if (wouldGetUnscheduledItems) {
                            getUnscheduledItems();
                        }
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                        if (wouldGetUnscheduledItems) {
                            getUnscheduledItems();
                        }
                    }
                },
                error: err => {
                    if (wouldGetUnscheduledItems) {
                        getUnscheduledItems();
                    }
                },
            });
    };

    const onDragStart = (event: DragStartEvent) => {
        if (event.active?.data?.current?.type === "unscheduled-task") {
            setDraggingUnscheduledTaskId(event.active.id);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
        }
        else if (event.active?.data?.current?.type === "unscheduled-routine") {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(event.active.id);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
        }
        else if (event.active?.id === "draggable-panel") {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(true);
        }
        else if (["task", "event"].includes((event.active?.data?.current?.type || "").toLowerCase())) {
            setDraggingUnscheduledTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(event.active.id);
            setIsPanelDragging(false);
        }
    };

    const updateBigTask = (monthData: UnscheduledMonthData[], bigTaskParams: { index: number, item: UnscheduledBigTask, monthDataIndex: number }) => {
        const updatedMonthData = [...monthData];
        (updatedMonthData[bigTaskParams.monthDataIndex]?.unscheduledBigTasks || [])[bigTaskParams.index] = bigTaskParams.item;
        setUnscheduledMonthData(updatedMonthData);
    };

    const handleRemoveUnscheduledTask = (unscheduledTaskId: number | string | null, bigTaskId: number) => {
        const bigTaskParams = getBigTask(unscheduledMonthData, bigTaskId);
        if (bigTaskParams?.index === -1) {
            return;
        }
        const updatedSuggestedSubtasks = [...bigTaskParams.item?.suggestedSubtasks];
        const subtaskIndex = updatedSuggestedSubtasks.findIndex(subtask => subtask?.id === unscheduledTaskId);
        if (subtaskIndex === -1) {
            return;
        }
        updatedSuggestedSubtasks.splice(subtaskIndex, 1);
        const updatedBigTask = {
            ...bigTaskParams.item,
            suggestedSubtasks: updatedSuggestedSubtasks,
        };
        bigTaskParams.item = updatedBigTask;
        updateBigTask(unscheduledMonthData, bigTaskParams);
    };

    const updateRoutineList = (monthPlanId: number, newRoutineList: string[], wouldGetUnscheduledItems?: boolean) => {
        calendarRepository.updateRoutineList({
            monthPlanId,
        }, {
            approvedRoutineNames: newRoutineList,
        }).subscribe({
            next: res => {
                const success = res?.status;
                if (success) {
                    toast.success(res?.msg || res?.message);
                    handleReload();
                    if (wouldGetUnscheduledItems) {
                        getUnscheduledItems();
                    }
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                    handleReload();
                    if (wouldGetUnscheduledItems) {
                        getUnscheduledItems();
                    }
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
                handleReload();
                if (wouldGetUnscheduledItems) {
                    getUnscheduledItems();
                }
            },
        });
    };

    const handleRemoveUnscheduledRoutine = (unscheduledRoutineId: number | string | null) => {
        let updatedMonthDataItem: any = undefined;
        unscheduledMonthData.forEach(monthDataItem => {
            if ((monthDataItem?.unscheduledRoutines || []).some(routine => routine?.id === unscheduledRoutineId) && !updatedMonthDataItem) {
                updatedMonthDataItem = monthDataItem;
            }
        });
        if (!updatedMonthDataItem) {
            return undefined;
        }
        let unscheduledRoutineIndex = (updatedMonthDataItem?.unscheduledRoutines || []).findIndex((routine: any) => routine?.id === unscheduledRoutineId);
        if (unscheduledRoutineIndex === -1) {
            return undefined;
        }
        (updatedMonthDataItem?.unscheduledRoutines || []).splice(unscheduledRoutineIndex, 1);
        const updatedMonthDataItemIndex = unscheduledMonthData.findIndex(monthDataItem => monthDataItem?.month === updatedMonthDataItem?.month);
        if (updatedMonthDataItemIndex === -1) {
            return undefined;
        }
        setUnscheduledMonthData([...unscheduledMonthData].splice(updatedMonthDataItemIndex, 1, updatedMonthDataItem));
        // Return monthPlanId, new routine list for using by other functions
        return { 
            monthPlanId: unscheduledMonthData[updatedMonthDataItemIndex]?.monthPlanId,
            newRoutineList: (updatedMonthDataItem?.unscheduledRoutines || []).map((routine: any) => routine?.name)
        };
    };

    const handleDeleteUnscheduledTask = (unscheduledTaskId: string | number | null, bigTaskId: number) => {
        handleRemoveUnscheduledTask(unscheduledTaskId, bigTaskId);
        onDeleteCalendarItem(unscheduledTaskId, true);
    };

    const handleDeleteUnscheduledRoutine = (unscheduledRoutineId: number | string | null) => {
        const res = handleRemoveUnscheduledRoutine(unscheduledRoutineId);
        if (!res) {
            return;
        }
        const {monthPlanId, newRoutineList} = res;
        updateRoutineList(monthPlanId as number, newRoutineList, true);
    };

    const getNewCalendarItem = (itemId: number, isNew?: boolean) => {
        calendarRepository.getCalendarItem({ itemId: itemId })
            .subscribe({
                next: res => {
                    const success = res?.status;
                    const updatedCalendarItem: Task = res?.data;
                    if (success) {
                        const newCalendarItem = {
                            ...updatedCalendarItem,
                            startTime: (updatedCalendarItem?.timeSlot?.startTime as string).concat("Z"),
                            endTime: (updatedCalendarItem?.timeSlot?.endTime as string).concat("Z"),
                        };
                        setEditingTask(newCalendarItem);

                        const newUpdatedTasks = [...updatedTasks];
                        const itemType = (newCalendarItem?.type || "").toLowerCase();
                        // Push new item to updatedTasks when calendarItem is new
                        if (isNew) {
                            newUpdatedTasks.push(newCalendarItem);
                        }
                        // Update old item in updatedTasks if calendarItem is old
                        else {
                            const taskIndex = newUpdatedTasks.findIndex(task => task.id === newCalendarItem?.id);
                            newUpdatedTasks[taskIndex] = newCalendarItem;
                        }
                        setUpdatedTasks(newUpdatedTasks);
                        // Remove unscheduledTask (for both standalone task (0 effect) or unscheduled task)
                        if (!isNil(newCalendarItem?.parentBigTaskId) && itemType === "task") {
                            handleRemoveUnscheduledTask(newCalendarItem?.id, newCalendarItem?.parentBigTaskId);
                        }
                        // Remove unscheduledRoutine (for both standalone routine (0 effect) or unscheduled routine)
                        if (itemType === "routine") {
                            handleRemoveUnscheduledRoutine(newCalendarItem?.id);
                        }
                        // Set current selected task-event/routine
                        if (["task", "event"].includes(itemType)) {
                            setSelectedTaskId(newCalendarItem.id);
                        }
                        else if (itemType === "routine") {
                            setSelectedRoutineId(newCalendarItem.id);
                        }
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                        handleReload();
                    }
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);
                },
                error: err => {
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);

                    handleReload();
                }
            });
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string, scrollContainerRef?: any) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }
        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY, scrollContainerRef?.current);

        setEditorPosition(adjustedPosition);
        // New task would NOT have Id and would not be pushed to updatedTasks
        const newTask = {
            startTime: cellId,
            endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute").second(0).millisecond(0)),
            type: "task",
            name: "",
            completionPercentage: 0,
        } as Task;

        setEditorPosition(adjustedPosition);
        setEditingTask(newTask);
    };

    const getUnscheduledItems = () => {
        calendarRepository.getUnscheduledItems()
            .subscribe({
                next: res => {
                    const updatedUnscheduledMonthData: UnscheduledMonthData[] = (res?.data?.data?.monthGroups || []).map((monthGroup: any) => ({
                        ...monthGroup,
                        unscheduledBigTasks: (monthGroup?.unscheduledTasks || []).map((unscheduledTask: UnscheduledBigTask) => ({
                            ...unscheduledTask,
                            suggestedSubtasks: (unscheduledTask?.suggestedSubtasks || []).map((subtask: UnscheduledTask) => ({
                                ...subtask,
                                type: 'unscheduled-task',
                                parentBigTaskId: unscheduledTask.bigTaskId,
                            }))
                        })),
                        unscheduledRoutines: (monthGroup?.unscheduledRoutines || []).map((unscheduledRoutine: UnscheduledRoutine) => ({
                            ...unscheduledRoutine,
                            type: 'unscheduled-routine',
                            id: unscheduledRoutine?.id || uuid4(),
                        })),
                        unscheduledTasks: undefined,    // Replaced by unscheduledBigTasks
                    }));

                    setUnscheduledMonthData?.(updatedUnscheduledMonthData);
                },
                error: err => {
                    console.log("Error occurs while fetching unscheduled items", err);
                }
            });
    }

    const onDragEnd = (event: DragEndEvent) => {
        const droppedCellId = String(event.over?.id || null);
        // For unscheduled tasks panel
        if (event.active.id === 'draggable-panel') {
            setPanelPosition(prev => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
            }));
            setIsPanelDragging(false);
            return;
        }
        // For unscheduled task
        if (!isNil(draggingUnscheduledTaskId)) {
            const unscheduledTask = getTaskById(unscheduledMonthData, draggingUnscheduledTaskId, []);
            if (!unscheduledTask) {
                return;
            }
            const cellId = String(event.over?.id);
            const newTask: Task = {
                ...unscheduledTask,
                id: draggingUnscheduledTaskId,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledTask?.name || "",
                parentBigTaskId: unscheduledTask?.parentBigTaskId,
                type: "task",
                status: 'incomplete',
                completionPercentage: 0,
            };
            // Temporarily update updatedTasks
            setUpdatedTasks([...updatedTasks, newTask]);
            // Temporarily remove unscheduled task
            handleRemoveUnscheduledTask(draggingUnscheduledTaskId, unscheduledTask?.parentBigTaskId as number);

            calendarRepository.updateCalendarItem(
                draggingUnscheduledTaskId as number,
                {
                    ...newTask,
                    type: (newTask?.type as string).toUpperCase(),
                    name: newTask?.name,
                    calendarId: Number(localStorage.getItem("calendarId")),
                    monthPlanId: Number(localStorage.getItem("monthPlanId")),
                    timeSlot: {
                        startTime: newTask?.startTime,
                        endTime: newTask?.endTime,
                    },
                    taskDetails: {
                        estimatedHours: newTask?.estimatedHours,
                        parentBigTaskId: newTask?.parentBigTaskId,
                    },
                }).subscribe({
                    next: res => {
                        const itemId = res?.data;
                        const success = res?.status;
                        if (success) {
                            getNewCalendarItem(itemId, true);
                            getUnscheduledItems();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
                                description: res?.data,
                            });
                            setDraggingUnscheduledTaskId(null);
                            handleReload();
                            getUnscheduledItems();
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledTaskId(null);
                        handleReload();
                        getUnscheduledItems();
                    },
                });
            return;
        }
        // For unscheduled routine
        if (!isNil(draggingUnscheduledRoutineId)) {
            const unscheduledRoutine = getRoutineById(unscheduledMonthData, draggingUnscheduledRoutineId, []);
            if (!unscheduledRoutine) {
                return;
            }
            const cellId = String(event.over?.id);
            const newRoutine: Task = {
                ...unscheduledRoutine,
                id: unscheduledRoutine?.id as number,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledRoutine?.name || "",
                type: "routine",
                status: 'incomplete',
                pattern: {
                    daysOfWeek: ["MONDAY"]
                },
                exceptions: [],
            };

            // Temporarily update updatedTasks
            setUpdatedTasks([...updatedTasks, newRoutine]);
            // Temporarily remove unscheduled task
            handleRemoveUnscheduledRoutine(draggingUnscheduledRoutineId);

            calendarRepository.createCalendarItem(
                {
                    ...newRoutine,
                    type: (newRoutine?.type as string).toUpperCase(),
                    name: newRoutine?.name,
                    calendarId: Number(localStorage.getItem("calendarId")),
                    monthPlanId: Number(localStorage.getItem("monthPlanId")),
                    timeSlot: {
                        startTime: newRoutine?.startTime,
                        endTime: newRoutine?.endTime,
                    },
                    routineDetails: {
                        pattern: newRoutine.pattern,
                    },
                }).subscribe({
                    next: res => {
                        const itemId = res?.data?.itemId;
                        const success = res?.status;
                        if (success) {
                            getNewCalendarItem(itemId, true);
                            getUnscheduledItems();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                            setDraggingUnscheduledRoutineId(null);
                            handleReload();
                            getUnscheduledItems();
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledRoutineId(null);
                        handleReload();
                        getUnscheduledItems();
                    },
                });
            return;
        }
        if (!droppedCellId) {
            setDraggingUnscheduledRoutineId(null);
            setDraggingUnscheduledTaskId(null);
            setIsPanelDragging(false);
            setDraggingScheduledTaskId(null);
            return;
        }
        // For scheduled items
        const scheduledItem = updatedTasks.find(task => task.id === draggingScheduledTaskId);
        const newEndTime = toDayJs(droppedCellId).add(toDayJs(scheduledItem?.endTime).diff(toDayJs(scheduledItem?.startTime)));
        // Temporarily update updatedTasks
        const newUpdatedTasks = [...updatedTasks];
        const removeIndex = updatedTasks.findIndex(task => task.id === (scheduledItem as Task).id);
        if (removeIndex !== -1) {
            newUpdatedTasks.splice(removeIndex, 1);
        }
        setUpdatedTasks([...newUpdatedTasks, {
            ...scheduledItem,
            startTime: droppedCellId,
            endTime: dayJsToISOString(newEndTime),
        } as Task]);
        calendarRepository.updateCalendarItem(
            scheduledItem?.id as number,
            {
                ...scheduledItem,
                type: (scheduledItem?.type as string).toUpperCase(),
                name: scheduledItem?.name,
                calendarId: Number(localStorage.getItem("calendarId")),
                timeSlot: {
                    startTime: droppedCellId,
                    endTime: dayJsToISOString(newEndTime),
                },
                ...getDetails(scheduledItem as Task),
            }).subscribe({
                next: res => {
                    const itemId = res?.data;
                    const success = res?.status;
                    if (success) {
                        getNewCalendarItem(itemId);
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg,
                            description: res?.data,
                        });
                        setDraggingScheduledTaskId(null);
                        handleReload();
                    }
                },
                error: err => {
                    setDraggingScheduledTaskId(null);
                    handleReload();
                },
            });
    };

    return {
        currentDate,
        setCurrentDate,
        tasksStyle,
        calendarMap,
        topPosition,
        currentView,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        updatedTasks,
        setUpdatedTasks,
        editorPosition,
        setEditorPosition,
        panelPosition,
        unscheduledMonthData,
        setUnscheduledMonthData,
        CELL_HEIGHT,
        hours,
        sensors,
        onRemoveDraggableTask,
        currentMondayTime,
        setCurrentMondayTime,
        activeDragId,
        setActiveDragId,
        handleGoToToday,
        alertMessage,
        setAlertMessage,
        setPanelPosition,
        getSleepBlocks,
        handleReload,
        handleTaskDoubleClick,
        selectedTaskId,
        setSelectedTaskId,
        selectedRoutineId,
        setSelectedRoutineId,
        draggingUnscheduledTaskId,
        setDraggingUnscheduledTaskId,
        draggingScheduledTaskId,
        setDraggingScheduledTaskId,
        draggingUnscheduledRoutineId,
        setDraggingUnscheduledRoutineId,
        isPanelDragging,
        setIsPanelDragging,
        editingTask,
        setEditingTask,
        getDraggingRoutine,
        getDraggingTask,
        getDraggableTaskOverlay,
        onDeleteCalendarItem,
        onDragStart,
        onDragEnd,
        handleCellClick,
        getNewCalendarItem,
        handleRemoveUnscheduledTask,
        handleRemoveUnscheduledRoutine,
        handleDeleteUnscheduledTask,
        handleDeleteUnscheduledRoutine,
        updateBigTask,
    };
};



