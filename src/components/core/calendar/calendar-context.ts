import { COLLIDING_WITH_SLEEP_TIME_WARNING, OVERLAPPING_TIME_WARNING, SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING, UNSCHEDULED_SUBTASK_PREFIX } from "@/const/consts";
import { dayJsToISOString, getEditorAdjustedPosition, getMonthName, getNearestMonday, initCalendarMap, isCollidingWithSleepTime, overlappingTasksExists, reId, toDayJs } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertMessage } from "../alert-modal/alert-modal";

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
    editingTask: Task | null;
    setEditingTask: Dispatch<SetStateAction<Task | null>>;
    editorPosition: { x: number; y: number; };
    panelPosition: { x: number; y: number; };
    unscheduledMonthData: UnscheduledMonthData[];
    setUnscheduledMonthData: Dispatch<SetStateAction<UnscheduledMonthData[]>>;
    activeUnscheduledTask?: UnscheduledTask;
    CELL_HEIGHT: number;
    hours: string[];
    startPositionInHours: number;
    endPositionInHours: number;
    sleepStartTime: string;
    sleepEndTime: string;
    topPosition: string;
    sensors: ReturnType<typeof useSensors>;
    onDragStart: (event: DragStartEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    handleCellClick: (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => void;
    handleTaskDoubleClick: (event: React.MouseEvent<HTMLDivElement>, task: Task, scrollContainerRef: React.RefObject<HTMLDivElement | null>) => void;
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
    isOutBigTaskTimeRange: (task: Task) => boolean;
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
    editingTask: null,
    setEditingTask: () => { },
    editorPosition: { x: 0, y: 0 },
    panelPosition: { x: 0, y: 0 },
    unscheduledMonthData: [],
    setUnscheduledMonthData: () => { },
    activeUnscheduledTask: undefined,
    CELL_HEIGHT: 4.6,
    hours: [],
    sleepStartTime: "22:00",
    sleepEndTime: "06:00",
    topPosition: "0",
    startPositionInHours: 0,
    endPositionInHours: 0,
    sensors: null as any,
    onDragStart: () => { },
    onDragEnd: () => { },
    handleCellClick: () => { },
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
});

export const useCalendarHooks = ({
    initTasks,
}: CalendarContextProps) => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getNearestMonday());
    const [currentView, setCurrentView] = useState<string>("day");
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>(reId(initTasks || []));
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [activeUnscheduledTask, setActiveUnscheduledTask] = useState<UnscheduledTask | undefined>(undefined);
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

    const [unscheduledMonthData, setUnscheduledMonthData] = useState<UnscheduledMonthData[]>([
        {
            monthNumber: 9,
            unscheduledBigTasks: initUnscheduledBigTasks,
            unscheduledRoutines: initUnscheduledRoutines,
        },
        {
            monthNumber: 10,
            unscheduledBigTasks: initUnscheduledBigTasks,
            unscheduledRoutines: initUnscheduledRoutines,
        }
    ]);

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

    const getUnscheduledSubtaskById = (monthData: UnscheduledMonthData[], subtaskId: string) => {
        for (const monthDataItem of monthData) {
            const foundTask = (monthDataItem?.unscheduledBigTasks || []).find(
                unscheduledBigTask => unscheduledBigTask.active && (unscheduledBigTask?.subtasks || []).some(subtask =>
                    subtask.active && subtask.id === subtaskId
                )
            );

            if (foundTask) {
                return (foundTask?.subtasks || []).find(subtask => subtask.active && subtask.id === subtaskId);
            }
        }

        return undefined;
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
        const unscheduledSubtask = getUnscheduledSubtaskById(monthData, updatedUnscheduledSubTask.id);
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
        const unscheduledBigTaskIndex = getUnscheduledBigTaskIndex(updatedUnscheduledMonthData, unscheduledBigTask);
        if (unscheduledBigTaskIndex === -1) {
            return;
        }
        (updatedUnscheduledMonthData[unscheduledBigTask.month].unscheduledBigTasks || [])[unscheduledBigTaskIndex] = inactiveUnscheduledBigTask(unscheduledBigTask);
        setUnscheduledMonthData(updatedUnscheduledMonthData);
    };

    const handleRemoveUnscheduledSubTask = (unscheduledSubtask: UnscheduledTask) => {
        const unscheduledBigTask = getUnscheduledBigTaskById(unscheduledMonthData, unscheduledSubtask?.parentBigTaskId || "");
        const unscheduledSubtaskIndex = getUnscheduledSubTaskIndex(unscheduledMonthData, unscheduledSubtask);
        if (!unscheduledBigTask || unscheduledSubtaskIndex === -1) {
            return;
        }
        (unscheduledBigTask?.subtasks || [])[unscheduledSubtaskIndex] = {
            ...(unscheduledBigTask?.subtasks || [])[unscheduledSubtaskIndex],
            active: false,
        };
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
        const updatedUnscheduledMonthData = updateUnscheduledBigTask([...unscheduledMonthData], unscheduledBigTask);
        if (updatedUnscheduledMonthData) {
            setUnscheduledMonthData(updatedUnscheduledMonthData);
        }
    };

    const onDragStart = (event: DragStartEvent) => {
        setActiveDragId(String(event.active.id));
        if (event.active.id.toString().includes(UNSCHEDULED_SUBTASK_PREFIX)) {
            setActiveUnscheduledTask(event.active?.data?.current?.task);
            return;
        }
        const task: Task | undefined = updatedTasks.find(t => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const isOutBigTaskTimeRange = (task: Task) => {
        const bigTask = getUnscheduledBigTaskByIdBothActiveAndInactive(unscheduledMonthData, task?.parentBigTaskId || "");
        const bigTaskStartTime = bigTask ? bigTask?.bigTaskStartTime : undefined;
        const bigTaskEndTime = bigTask ? bigTask?.bigTaskEndTime : undefined;
        if (!bigTaskStartTime && !bigTaskEndTime) {
            return false;
        }
        return (bigTaskStartTime && task?.startTime < bigTaskStartTime) || (bigTaskEndTime && task?.endTime > bigTaskEndTime);
    };

    const onDragEnd = (event: DragEndEvent) => {
        const droppedCellId = String(event.over?.id || null);
        // For unscheduled tasks panel
        if (event.active.id === 'draggable-panel') {
            setPanelPosition(prev => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
            }));
            return;
        }
        // For unscheduled task item
        if (event.active.id.toString().includes(UNSCHEDULED_SUBTASK_PREFIX)) {
            setActiveUnscheduledTask(undefined);
            if (!event.over?.id) {
                return;
            }
            const subtask = getUnscheduledSubtaskById(unscheduledMonthData, String(event.active.id));
            if (!subtask) {
                return;
            }
            const cellId = String(event.over?.id);
            const newTask = {
                id: cellId,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(5, "minute")),
                parentBigTaskId: subtask?.parentBigTaskId,
                type: "task",
                title: subtask?.title || "",
            } as Task;
            if (isCollidingWithSleepTime(newTask, sleepStartTime, sleepEndTime)) {
                setAlertMessage(COLLIDING_WITH_SLEEP_TIME_WARNING);
                return;
            }
            if (isOutBigTaskTimeRange(newTask)) {
                setAlertMessage({
                    ...SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING,
                    proceedAnyway: () => {
                        setUpdatedTasks(reId([...updatedTasks, newTask]));
                        setEditingTask(newTask);
                        handleRemoveUnscheduledSubTask(subtask);
                    }
                });
                return;
            }
            const cloneUpdatedTasks = [...updatedTasks];
            const updatedIndex = cloneUpdatedTasks.findIndex(updatedTask => updatedTask.id === newTask.id);
            if (updatedIndex !== -1) {
                cloneUpdatedTasks.splice(updatedIndex, 1);
            }
            // There are no 2 tasks are overlapping
            if (overlappingTasksExists(newTask, cloneUpdatedTasks)) {
                setAlertMessage(OVERLAPPING_TIME_WARNING);
                return;
            }

            setUpdatedTasks(reId([...cloneUpdatedTasks, newTask]));
            setEditingTask(newTask);

            handleRemoveUnscheduledSubTask(subtask);
            return;
        }
        if (!droppedCellId) {
            setActiveDragId(null);
            setActiveTask(null);
            return;
        }

        const updatedTaskIndex = updatedTasks.findIndex(task => task.id === activeDragId);
        const oldTask = updatedTasks[updatedTaskIndex];
        const taskDuration = toDayJs(oldTask.endTime).diff(toDayJs(oldTask.startTime));
        const updatedTask = {
            ...oldTask,
            id: droppedCellId,
            startTime: droppedCellId,
            endTime: dayJsToISOString(toDayJs(droppedCellId).add(taskDuration)),
        };
        const newUpdatedTasks = [...updatedTasks];
        if (updatedTaskIndex !== -1) {
            newUpdatedTasks.splice(updatedTaskIndex, 1);
        }
        // There are no 2 tasks are overlapping
        if (overlappingTasksExists(updatedTask, newUpdatedTasks)) {
            setAlertMessage(OVERLAPPING_TIME_WARNING);
            return;
        }
        newUpdatedTasks[updatedTaskIndex] = updatedTask;

        const sleepTimeCollision = (newUpdatedTasks.some(task => isCollidingWithSleepTime(task, sleepStartTime, sleepEndTime)));
        if (sleepTimeCollision) {
            setAlertMessage(COLLIDING_WITH_SLEEP_TIME_WARNING);
            return;
        }

        setActiveTask(null);
        setUpdatedTasks(reId(newUpdatedTasks));
    };

    const onRemoveDraggableTask = (task: Task) => {
        if (task?.parentBigTaskId) {
            let unscheduledBigTask = getUnscheduledBigTaskByIdBothActiveAndInactive(unscheduledMonthData, task?.parentBigTaskId);
            if (!unscheduledBigTask) {
                return;
            }
            // Unscheduled big task had been removed
            if (!unscheduledBigTask.active) {
                unscheduledBigTask = activeUnscheduledBigTask(unscheduledBigTask);
                updateUnscheduledBigTask(unscheduledMonthData, unscheduledBigTask);
                setEditingTask(null);
                return;
            }
            else {
                let unscheduledSubtask = getFirstInactiveUnscheduledSubtaskById(unscheduledMonthData, task?.parentBigTaskId || "");
                if (!unscheduledSubtask) {
                    return;
                }
                unscheduledSubtask = {
                    ...task,
                    id: unscheduledSubtask.id,
                    active: true,
                };
                updateUnscheduledSubTask([...unscheduledMonthData], unscheduledSubtask);
            }
        }

        setUpdatedTasks(reId([...updatedTasks.filter(updatedTask => updatedTask.id !== task.id)]));
        setEditingTask(null);
    };
// TODO: Remove unscheduled subtask of Unscheduled big task A making Unscheduled big task B lost unscheduled big task
    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }

        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY);

        setEditorPosition(adjustedPosition);
        const newTask = {
            id: cellId,
            startTime: cellId,
            endTime: dayJsToISOString(toDayJs(cellId).add(5, "minute")),
            type: "task",
            title: "",
        } as Task;

        if (isCollidingWithSleepTime(newTask, sleepStartTime, sleepEndTime)) {
            return;
        }

        setEditorPosition(adjustedPosition);
        setEditingTask(newTask);
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, task: Task, scrollContainerRef: React.RefObject<HTMLDivElement | null>) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const adjustedPosition = getEditorAdjustedPosition(event.clientX, event.clientY);

        setEditorPosition(adjustedPosition);

        setEditingTask(task);
    };

    const onChangeUnscheduledTaskTitle = (taskId: string, newTitle: string) => {
        // If edited task was unscheduled big task
        let unscheduledBigTask = getUnscheduledBigTaskById(unscheduledMonthData, taskId);
        if (unscheduledBigTask) {
            unscheduledBigTask = {
                ...unscheduledBigTask,
                title: newTitle,
            };
            updateUnscheduledBigTask(unscheduledMonthData, unscheduledBigTask);
            return;
        }
        // If edited task was unscheduled sub task
        let subtask = getUnscheduledSubtaskById(unscheduledMonthData, taskId);
        if (subtask) {
            subtask = {
                ...subtask,
                title: newTitle,
            };
            updateUnscheduledSubTask(unscheduledMonthData, subtask);
            return;
        }
    };

    useEffect(() => {
        setCurrentMondayTime(getNearestMonday(currentDate));
    }, [currentDate]);

    useEffect(() => {
        const newTasks = [...updatedTasks];
        const updatedCalendarMap = initCalendarMap(currentMondayTime, newTasks);
        const newTasksStyle: Record<string, any> = {};
        if (activeTask) {
            newTasksStyle[activeTask.id] = tasksStyle[activeTask.id];
        }
        let currentZIndex = 0;

        setCalendarMap(updatedCalendarMap);

        const visited: Record<string, boolean> = {};
        const getHeight = (timeKey: string, task: Task) => {
            const startTime = toDayJs(task.startTime);
            const endTime = toDayJs(task.endTime);
            const startDiff = startTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const endDiff = endTime.diff(toDayJs(timeKey)) / 60000 * (100 / 60);
            const nextHour = toDayJs(timeKey).add(1, "hour");

            if (startTime <= nextHour && endTime <= nextHour && !visited[task.id]) {
                visited[task.id] = true;
                return (endTime.diff(startTime) / 60000 * (100 / 60)) / 100 * CELL_HEIGHT;
            }
            if (!visited[task.id]) {
                visited[task.id] = true;
                return (100 - startDiff) / 100 * CELL_HEIGHT;
            }
            if (startTime <= toDayJs(timeKey) && nextHour <= endTime) {
                return CELL_HEIGHT;
            }
            return endDiff / 100 * CELL_HEIGHT;
        };
        Object.keys(updatedCalendarMap).forEach(timeKey => {
            const tasksVal = updatedCalendarMap[timeKey];
            tasksVal.forEach((task: Task, count: number) => {
                let newStyle = newTasksStyle[task.id];
                const diff = toDayJs(task.startTime).diff(toDayJs(timeKey)) / 60000 * (100 / 60);

                newStyle = {
                    zIndex: !visited[task.id] ? ++currentZIndex : newStyle?.zIndex,
                    top: !visited[task.id] ? diff : newStyle?.top,    // %
                    left: count * 10,    // %
                    height: (newStyle?.height || 0) + getHeight(timeKey, task), // rem
                    width: Math.min(newStyle?.width || 90, 90 / tasksVal.length),   // %
                }

                newTasksStyle[task.id] = newStyle;
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
            overlappingTasks.sort((a, b) => a.id.localeCompare(b.id));
            const columnIndex = overlappingTasks.findIndex(t => t.id === task.id);
            const left = columnIndex * width;

            newTasksStyle[task.id] = {
                ...newTasksStyle[task.id],
                width,
                left,
            };
        }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks]);
    // console.log("updatedTasks", updatedTasks);
    // console.log("calendarMap", calendarMap);
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
        editingTask,
        setEditingTask,
        editorPosition,
        panelPosition,
        unscheduledMonthData,
        setUnscheduledMonthData,
        activeUnscheduledTask,
        CELL_HEIGHT,
        hours,
        sleepStartTime,
        sleepEndTime,
        topPosition,
        startPositionInHours,
        endPositionInHours,
        sensors,
        onDragStart,
        onDragEnd,
        handleCellClick,
        handleTaskDoubleClick,
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
        onChangeUnscheduledTaskTitle,
        isOutBigTaskTimeRange,
    };
};