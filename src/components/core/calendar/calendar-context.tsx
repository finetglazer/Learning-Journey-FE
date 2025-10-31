import { dayJsToISOString, getBigTask, getDetails, getEditorAdjustedPosition, getMondayOfThisWeek, getMonthName, getPercentageHeight, getRoutineById, getTaskById, initCalendarMap, reId, toDayJs } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertMessage } from "../alert-modal/alert-modal";
import { DraggableTask } from "./draggable-task";

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
    handleTaskDoubleClick: (event: React.MouseEvent<HTMLDivElement>, taskId: number) => void;
    handleRemoveUnscheduledBigTask: (unscheduledBigTask: UnscheduledBigTask) => void;
    handleRemoveUnscheduledSubTask: (unscheduledSubtask: UnscheduledTask) => void;
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
    handleCellClick: (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => void;
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
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [activeUnscheduledTask, setActiveUnscheduledTask] = useState<UnscheduledTask | undefined>(undefined);
    const [activeUnscheduledRoutine, setActiveUnscheduledRoutine] = useState<UnscheduledRoutine | undefined>(undefined);
    const initUnscheduledBigTasks: UnscheduledBigTask[] = [
        {
            id: "unscheduled-big-task-1",
            title: "Unscheduled big task 1",
            month: 9,
            active: true,
            subtasks: [
                { id: "unscheduled-task-1-1", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 1", month: 9, active: true },
                { id: "unscheduled-task-1-2", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 2", month: 9, active: true },
                { id: "unscheduled-task-1-3", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 3", month: 9, active: true },
            ],
            bigTaskStartTime: dayJsToISOString(dayjs()),
            bigTaskEndTime: dayJsToISOString(dayjs().add(1, "day"))
        },
        {
            id: "unscheduled-big-task-2",
            title: "Unscheduled big task 2",
            month: 9,
            active: true,
            subtasks: [
                { id: "unscheduled-task-2-1", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 1", month: 9, active: true },
                { id: "unscheduled-task-2-2", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 2", month: 9, active: true },
                { id: "unscheduled-task-2-3", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 3", month: 9, active: true },
            ],
        },
        {
            id: "unscheduled-big-task-3",
            title: "Unscheduled big task 3",
            active: true,
            month: 9,
            subtasks: [
                { id: "unscheduled-task-3-1", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 1", month: 9, active: true },
                { id: "unscheduled-task-3-2", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 2", month: 9, active: true },
                { id: "unscheduled-task-3-3", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 3", month: 9, active: true },
            ],
        },
    ];
    const initUnscheduledRoutines: UnscheduledRoutine[] = [
        {
            id: "unscheduled-routine-1",
            title: "Unscheduled routine 1",
            month: 9,
            active: true,
            routinePatterns: [0, 1, 2, 3],
            routineStartHour: "07:00",
            routineEndHour: "09:15",
        },
        {
            id: "unscheduled-routine-2",
            title: "Unscheduled routine 2",
            month: 9,
            active: true,
            routinePatterns: [4, 5, 6],
            routineStartHour: "07:00",
            routineEndHour: "09:15",
        },
        {
            id: "unscheduled-routine-3",
            title: "Unscheduled routine 3",
            month: 9,
            active: true,
            routinePatterns: [0, 3, 5],
            routineStartHour: "07:00",
            routineEndHour: "09:15",
        },
    ];

    const [unscheduledMonthData, setUnscheduledMonthData] = useState<UnscheduledMonthData[]>(
        Array.from({ length: 12 }, (_, i) => {
            if (i === 9) {
                return {
                    monthNumber: 9,
                    unscheduledBigTasks: initUnscheduledBigTasks,
                    unscheduledRoutines: initUnscheduledRoutines,
                };
            }
            return { monthNumber: i };
        })
    );

    const CELL_HEIGHT = 4.57; // rem;
    const now = dayjs();
    const hoursNow = now.hour();
    const minutesNow = now.minute();
    const topPosition = `calc(${(hoursNow + minutesNow / 60) * CELL_HEIGHT}rem - 0.25rem)`; // offset for dot size
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    ); // 00 to 23

    const sleepStartTime = "22:15";
    const sleepEndTime = "06:15";
    const sleepStartHour = Number(sleepStartTime.substring(0, 2));
    const sleepStartMinute = Number(sleepStartTime.substring(3, 5));
    const sleepEndHour = Number(sleepEndTime.substring(0, 2));
    const sleepEndMinute = Number(sleepEndTime.substring(3, 5));
    const startPositionInHours = sleepStartHour + (sleepStartMinute / 60);
    const endPositionInHours = sleepEndHour + (sleepEndMinute / 60);

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
                const weekStart = currentDate.startOf('week');
                const weekEnd = currentDate.endOf('week');
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
                setCurrentDate(currentDate.add(1, 'month'));
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

    const inactiveUnscheduledBigTask = (unscheduledBigTask: UnscheduledBigTask) => {
        return {
            ...unscheduledBigTask,
            active: false,
            subtasks: (unscheduledBigTask?.subtasks || []).map(subtask => ({
                ...subtask,
                active: false,
            })),
        };
    };

    const activeUnscheduledBigTask = (unscheduledBigTask: UnscheduledBigTask) => {
        return {
            ...unscheduledBigTask,
            active: true,
            subtasks: (unscheduledBigTask?.subtasks || []).map(subtask => ({
                ...subtask,
                active: updatedTasks.some(updatedTask => updatedTask.id === subtask.id) ? false : true,
            })),
        };
    };

    const getUnscheduledBigTaskIndex = (monthData: UnscheduledMonthData[], unscheduledBigTask: UnscheduledBigTask) => {
        return ((monthData[unscheduledBigTask.month]?.unscheduledBigTasks || []).findIndex(bigTask => bigTask.id === unscheduledBigTask.id));
    };

    const getUnscheduledBigTaskById = (monthData: UnscheduledMonthData[], unscheduledBigTaskId: string) => {
        for (const monthDataItem of monthData) {
            const foundTask = (monthDataItem?.unscheduledBigTasks || []).find(
                unscheduledBigTask => unscheduledBigTask.active && unscheduledBigTask.id === unscheduledBigTaskId
            );

            if (foundTask) {
                return foundTask;
            }
        }

        return undefined;
    };

    const getUnscheduledBigTaskByIdBothActiveAndInactive = (monthData: UnscheduledMonthData[], unscheduledBigTaskId: string) => {
        for (const monthDataItem of monthData) {
            const foundTask = (monthDataItem?.unscheduledBigTasks || []).find(
                unscheduledBigTask => unscheduledBigTask.id === unscheduledBigTaskId
            );

            if (foundTask) {
                return foundTask;
            }
        }

        return undefined;
    };

    const getUnscheduledSubTaskIndex = (monthData: UnscheduledMonthData[], unscheduledSubtask: UnscheduledTask) => {
        const unscheduledBigTask = getUnscheduledBigTaskById(monthData, unscheduledSubtask?.parentBigTaskId || "");
        if (!unscheduledBigTask) {
            return -1;
        }
        return ((unscheduledBigTask?.subtasks || []).findIndex(subtask => subtask.id === unscheduledSubtask.id));
    };


    const getUnscheduledRoutineById = (monthData: UnscheduledMonthData[], routineId: string) => {
        let res: any = undefined;
        for (const monthDataItem of monthData) {
            (monthDataItem?.unscheduledRoutines || []).forEach(unscheduledRoutine => {
                if (unscheduledRoutine.active && unscheduledRoutine.id === routineId && !res) {
                    res = unscheduledRoutine;
                }
            });
        }

        return res;
    };

    const getUnscheduledSubtaskByIdBothActiveAndInactive = (monthData: UnscheduledMonthData[], subtaskId: string) => {
        for (const monthDataItem of monthData) {
            const foundTask = (monthDataItem?.unscheduledBigTasks || []).find(
                unscheduledBigTask => unscheduledBigTask.active && (unscheduledBigTask?.subtasks || []).some(subtask =>
                    subtask.id === subtaskId
                )
            );

            if (foundTask) {
                return (foundTask?.subtasks || []).find(subtask => subtask.id === subtaskId);
            }
        }

        return undefined;
    };

    const getFirstInactiveUnscheduledSubtaskById = (monthData: UnscheduledMonthData[], bigTaskId: string) => {
        const unscheduledBigTask = getUnscheduledBigTaskById(monthData, bigTaskId);
        if (!unscheduledBigTask) {
            return undefined;
        }
        let res: any = undefined;
        (unscheduledBigTask?.subtasks || []).forEach(subtask => {
            if (!subtask.active && !res) {
                res = subtask;
            }
        });
        return res;
    };

    const updateUnscheduledBigTask = (monthData: UnscheduledMonthData[], updatedUnscheduledBigTask: UnscheduledBigTask) => {
        const updatedMonthData = [...monthData];
        const unscheduledBigTaskIndex = getUnscheduledBigTaskIndex(updatedMonthData, updatedUnscheduledBigTask);
        if (unscheduledBigTaskIndex === -1) {
            return updatedMonthData;
        }
        (updatedMonthData[updatedUnscheduledBigTask.month]?.unscheduledBigTasks || [])[unscheduledBigTaskIndex] = updatedUnscheduledBigTask;
        setUnscheduledMonthData(updatedMonthData);
    };

    const updateUnscheduledSubTask = (monthData: UnscheduledMonthData[], updatedUnscheduledSubTask: UnscheduledTask) => {
        const updatedMonthData = [...monthData];
        const unscheduledSubTaskIndex = getUnscheduledSubTaskIndex(monthData, updatedUnscheduledSubTask);
        const unscheduledSubtask = getUnscheduledSubtaskByIdBothActiveAndInactive(monthData, updatedUnscheduledSubTask.id);
        const unscheduledBigTask = getUnscheduledBigTaskById(monthData, unscheduledSubtask?.parentBigTaskId || "");

        if (!unscheduledBigTask) {
            return updatedMonthData;
        }
        const unscheduledBigTaskIndex = getUnscheduledBigTaskIndex(updatedMonthData, unscheduledBigTask);
        if (unscheduledSubTaskIndex === -1 || unscheduledBigTaskIndex === -1) {
            return updatedMonthData;
        }
        ((updatedMonthData[unscheduledBigTask.month]?.unscheduledBigTasks || [])[unscheduledBigTaskIndex]?.subtasks || [])[unscheduledSubTaskIndex] = updatedUnscheduledSubTask;
        setUnscheduledMonthData(updatedMonthData);
    };

    const handleRemoveUnscheduledBigTask = (unscheduledBigTask: UnscheduledBigTask) => {
        const updatedUnscheduledMonthData = [...unscheduledMonthData];
        let updatedUnscheduledBigTask = getUnscheduledBigTaskById(updatedUnscheduledMonthData, unscheduledBigTask.id);
        if (!updatedUnscheduledBigTask) {
            return;
        }
        updatedUnscheduledBigTask = inactiveUnscheduledBigTask(unscheduledBigTask);
        updateUnscheduledBigTask(updatedUnscheduledMonthData, updatedUnscheduledBigTask);
    };

    const handleRemoveUnscheduledSubTask = (unscheduledSubtask: UnscheduledTask) => {
        const unscheduledBigTask = getUnscheduledBigTaskById(unscheduledMonthData, unscheduledSubtask?.parentBigTaskId || "");
        let updatedUnscheduledSubtask = getUnscheduledSubtaskById(unscheduledMonthData, unscheduledSubtask.id);
        if (!unscheduledBigTask || !updatedUnscheduledSubtask) {
            return;
        }
        updatedUnscheduledSubtask = {
            ...unscheduledSubtask,
            active: false,
        }
        let isAllInactive = true;
        (unscheduledBigTask?.subtasks || []).forEach(subtask => {
            if (subtask.active) {
                isAllInactive = false;
            }
        });
        if (isAllInactive) {
            handleRemoveUnscheduledBigTask(unscheduledBigTask);
            return;
        }
        updateUnscheduledSubTask([...unscheduledMonthData], updatedUnscheduledSubtask);
    };

    const onRemoveDraggableTask = (task: Task) => {
        // if (task?.parentBigTaskId) {
        //     let unscheduledBigTask = getUnscheduledBigTaskByIdBothActiveAndInactive(unscheduledMonthData, task?.parentBigTaskId);
        //     if (!unscheduledBigTask) {
        //         return;
        //     }
        //     // Unscheduled big task had been removed
        //     if (!unscheduledBigTask.active) {
        //         unscheduledBigTask = activeUnscheduledBigTask(unscheduledBigTask);
        //         updateUnscheduledBigTask(unscheduledMonthData, unscheduledBigTask);
        //         setEditingTask(null);
        //         return;
        //     }
        //     else {
        //         let unscheduledSubtask = getFirstInactiveUnscheduledSubtaskById(unscheduledMonthData, task?.parentBigTaskId || "");
        //         if (!unscheduledSubtask) {
        //             return;
        //         }
        //         unscheduledSubtask = {
        //             ...task,
        //             id: unscheduledSubtask.id,
        //             active: true,
        //         };
        //         updateUnscheduledSubTask([...unscheduledMonthData], unscheduledSubtask);
        //     }
        // }

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
        // const getHeight = (timeKey: string, task: Task) => {
        //     const startTime = toDayJs(task.startTime);
        //     const endTime = toDayJs(task.endTime);
        //     const startDiff = startTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
        //     const endDiff = endTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
        //     const nextHour = toDayJs(timeKey).add(1, "hour");

        //     if (startTime <= nextHour && endTime <= nextHour && !visited[task.id]) {
        //         visited[task.id] = true;
        //         return (endTime.diff(startTime) / 60000 * (100 / 60)) / 100 * CELL_HEIGHT;
        //     }
        //     if (!visited[task.id]) {
        //         visited[task.id] = true;
        //         return (100 - startDiff) / 100 * CELL_HEIGHT;
        //     }
        //     if (startTime <= toDayJs(timeKey) && nextHour <= endTime) {
        //         return CELL_HEIGHT;
        //     }
        //     return endDiff / 100 * CELL_HEIGHT;
        // };
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
                    top: !visited[task?.id as number] ? diff : newStyle?.top,    // %
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

    const handleReload = () => {
        calendarRepository.getScheduledItems({
            view: getRequestView(),
            date: currentDate.format('YYYY-MM-DD'),
            calendarId: 2,
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
                setUpdatedTasks(newUpdatedTasks);
            },
            error: err => {
                console.log("Error occurs while fetching scheduled items", err);
            }
        });
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, taskId: number) => {
        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY);

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

    const onDeleteCalendarItem = (itemId?: number | string | null) => {
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
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                    }
                },
                error: err => { },
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
        else if ((event.active?.data?.current?.type || "").toLowerCase() === "task") {
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

    const handleRemoveUnscheduledRoutine = (unscheduledRoutineId: number | string | null) => {
        let updatedMonthDataItem: any = undefined;
        unscheduledMonthData.forEach(monthDataItem => {
            if ((monthDataItem?.unscheduledRoutines || []).some(routine => routine?.id === unscheduledRoutineId) && !updatedMonthDataItem) {
                updatedMonthDataItem = monthDataItem;
            }
        });
        if (!updatedMonthDataItem) {
            return;
        }
        let unscheduledRoutineIndex = (updatedMonthDataItem?.unscheduledRoutines || []).findIndex((routine: any) => routine?.id === unscheduledRoutineId);
        if (unscheduledRoutineIndex === -1) {
            return;
        }
        const updatedUnscheduledRoutines = (updatedMonthDataItem?.unscheduledRoutines || []).splice(unscheduledRoutineIndex, 1);
        updatedMonthDataItem = {
            ...updatedMonthDataItem,
            unscheduledRoutines: updatedUnscheduledRoutines,
        };
        const updatedMonthDataItemIndex = unscheduledMonthData.findIndex(monthDataItem => monthDataItem?.month === updatedMonthDataItem?.month);
        if (updatedMonthDataItemIndex === -1) {
            return;
        }
        setUnscheduledMonthData([...unscheduledMonthData].splice(updatedMonthDataItemIndex, 1, updatedMonthDataItem));
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
                        toast.error(res?.msg);
                    }
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);
                },
                error: err => {
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);
                }
            });
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }

        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY);

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
                id: unscheduledTask?.id as number,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledTask?.name || "",
                parentBigTaskId: unscheduledTask?.parentBigTaskId,
                type: "task",
                status: 'incomplete',
                completionPercentage: 0,
            };

            calendarRepository.updateCalendarItem(
                newTask.id as number,
                {
                    ...newTask,
                    type: (newTask?.type as string).toUpperCase(),
                    name: newTask?.name,
                    calendarId: 2,
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
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
                                description: res?.data,
                            });
                            setDraggingUnscheduledTaskId(null);
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledTaskId(null);
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

            calendarRepository.updateCalendarItem(
                newRoutine.id as number,
                {
                    ...newRoutine,
                    type: (newRoutine?.type as string).toUpperCase(),
                    name: newRoutine?.name,
                    calendarId: 2,
                    timeSlot: {
                        startTime: newRoutine?.startTime,
                        endTime: newRoutine?.endTime,
                    },
                    routineDetails: {
                        pattern: newRoutine.pattern,
                    },
                }).subscribe({
                    next: res => {
                        const itemId = res?.data;
                        const success = res?.status;
                        if (success) {
                            getNewCalendarItem(itemId, true);
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
                                description: res?.data,
                            });
                            setDraggingUnscheduledRoutineId(null);
                        }
                    },
                    error: err => {
                        setDraggingUnscheduledRoutineId(null);
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
        calendarRepository.updateCalendarItem(
            scheduledItem?.id as number,
            {
                ...scheduledItem,
                type: (scheduledItem?.type as string).toUpperCase(),
                name: scheduledItem?.name,
                calendarId: 2,
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
                    }
                },
                error: err => {
                    setDraggingScheduledTaskId(null);
                },
            });
    };

    return {
        currentDate,
        setCurrentDate,
        tasksStyle,
        calendarMap,
        currentView,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        updatedTasks,
        setUpdatedTasks,
        activeTask,
        editorPosition,
        setEditorPosition,
        panelPosition,
        unscheduledMonthData,
        setUnscheduledMonthData,
        activeUnscheduledTask,
        activeUnscheduledRoutine,
        CELL_HEIGHT,
        hours,
        sleepStartTime,
        sleepEndTime,
        topPosition,
        startPositionInHours,
        endPositionInHours,
        sensors,
        handleRemoveUnscheduledBigTask,
        handleRemoveUnscheduledSubTask,
        onRemoveDraggableTask,
        currentMondayTime,
        setCurrentMondayTime,
        activeDragId,
        setActiveDragId,
        handleGoToToday,
        alertMessage,
        setAlertMessage,
        setPanelPosition,

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
        updateBigTask,
    };
};



