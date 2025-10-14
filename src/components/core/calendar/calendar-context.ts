import { dayJsToISOString, getNearestMonday, initCalendarMap, isCollidingWithSleepTime, reId, toDayJs, uuid4 } from "@/lib/utils";
import { Task, UnscheduledBigTask, UnscheduledTask } from "@/model/task";
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertMessage } from "../alert-modal/alert-modal";
import { COLLIDING_WITH_SLEEP_TIME_WARNING, OVERLAPPING_TIME_WARNING, SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING, UNSCHEDULED_BIGTASK_DEFAULT_TITLE, UNSCHEDULED_BIGTASK_PREFIX, UNSCHEDULED_SUBTASK_PREFIX } from "@/const/consts";

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
    unscheduledBigTasks: UnscheduledBigTask[];
    setUnscheduledBigTasks: Dispatch<SetStateAction<UnscheduledBigTask[]>>;
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
    handleCellClick: (event: React.MouseEvent<HTMLTableCellElement>, cellId: string, scrollContainerRef: React.RefObject<HTMLDivElement | null>) => void;
    handleTaskDoubleClick: (event: React.MouseEvent<HTMLDivElement>, task: Task, scrollContainerRef: React.RefObject<HTMLDivElement | null>) => void;
    handleRemoveUnscheduledBigTask: (bigTaskId: string) => void;
    handleRemoveUnscheduledSubTask: (bigTaskId: string, subTaskId: string) => void;
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
    unscheduledBigTasks: [],
    setUnscheduledBigTasks: () => { },
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
}: CalendarContextProps): CalendarContextInterface => {
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
    const [removedUnscheduledBigTasks, setRemovedUnscheduledBigTasks] = useState<Record<string, any>>({});
    const initUnscheduledBigTasks: UnscheduledBigTask[] = [
        {
            id: "unscheduled-big-task-1",
            title: "Unscheduled big task 1",
            subtasks: [
                { id: "unscheduled-task-1-1", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 1" },
                { id: "unscheduled-task-1-2", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 2" },
                { id: "unscheduled-task-1-3", parentBigTaskId: "unscheduled-big-task-1", title: "Unscheduled task 3" },
            ],
            bigTaskStartTime: dayJsToISOString(dayjs()),
            bigTaskEndTime: dayJsToISOString(dayjs().add(1, "day"))
        },
        {
            id: "unscheduled-big-task-2",
            title: "Unscheduled big task 2",
            subtasks: [
                { id: "unscheduled-task-2-1", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 1" },
                { id: "unscheduled-task-2-2", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 2" },
                { id: "unscheduled-task-2-3", parentBigTaskId: "unscheduled-big-task-2", title: "Unscheduled task 3" },
            ],
        },
        {
            id: "unscheduled-big-task-3",
            title: "Unscheduled big task 3",
            subtasks: [
                { id: "unscheduled-task-3-1", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 1" },
                { id: "unscheduled-task-3-2", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 2" },
                { id: "unscheduled-task-3-3", parentBigTaskId: "unscheduled-big-task-3", title: "Unscheduled task 3" },
            ],
        },
    ];
    const [unscheduledBigTasks, setUnscheduledBigTasks] = useState(initUnscheduledBigTasks);

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
                const monthStart = currentDate.startOf('month');
                const monthEnd = currentDate.endOf('month');
                // Format: <start date>-<end date> / <month #> / <year>
                return `${monthStart.format('D')} - ${monthEnd.format('D')} / ${currentDate.format('M')} / ${currentDate.format('YYYY')}`;

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

    const handleRemoveUnscheduledBigTask = (bigTaskId: string) => {
        const newUnscheduledBigTasks = (unscheduledBigTasks || []).filter(
            task => task.id !== bigTaskId
        );
        let updatedRemovedUnscheduledBigTasks = {...removedUnscheduledBigTasks};
        const bigTask = unscheduledBigTasks.find(bigTask => bigTask.id === bigTaskId);
        if (bigTask) {
            updatedRemovedUnscheduledBigTasks[bigTaskId] = {
                ...bigTask,
                bigTaskStartTime: bigTask?.bigTaskStartTime,
                bigTaskEndTime: bigTask?.bigTaskEndTime,
            };
        }
        
        setRemovedUnscheduledBigTasks(updatedRemovedUnscheduledBigTasks);
        setUnscheduledBigTasks?.(newUnscheduledBigTasks);
    };

    const handleRemoveUnscheduledSubTask = (bigTaskId: string, subTaskId: string) => {
        const bigTask: UnscheduledBigTask | undefined = ((unscheduledBigTasks || []).find(bigTask => bigTask.id === bigTaskId));
        if (!bigTask) {
            return;
        }
        const newSubtasks = (bigTask?.subtasks || []).filter(
            subtask => subtask.id !== subTaskId
        );

        const newUnscheduledBigTasks = [...(unscheduledBigTasks || [])];
        const bigTaskIndex = newUnscheduledBigTasks.findIndex(unscheduledBigTask => unscheduledBigTask.id === bigTask.id);
        if (bigTaskIndex !== -1) {
            if (!newSubtasks.length) {
                handleRemoveUnscheduledBigTask(bigTask.id);
                return;
            }
            newUnscheduledBigTasks[bigTaskIndex] = {
                ...newUnscheduledBigTasks[bigTaskIndex],
                subtasks: [...newSubtasks]
            }
        }

        setUnscheduledBigTasks?.(newUnscheduledBigTasks);
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

    const getUnscheduledSubTask = (subtaskId: string) => {
        const unscheduledBigTask = unscheduledBigTasks.find(bigTask =>
            (bigTask?.subtasks || []).some(subtask => subtask.id === subtaskId)
        );
        if (!unscheduledBigTask) {
            return null;
        }
        return (unscheduledBigTask?.subtasks || []).find(subtask => subtask.id === subtaskId);
    };

    const isOutBigTaskTimeRange = (task: Task) => {
        const bigTask = unscheduledBigTasks.find(bigTask => bigTask.id === task?.parentBigTaskId);
        const bigTaskStartTime = bigTask ? bigTask?.bigTaskStartTime : removedUnscheduledBigTasks[task?.parentBigTaskId as string]?.bigTaskStartTime;
        const bigTaskEndTime = bigTask ? bigTask?.bigTaskEndTime : removedUnscheduledBigTasks[task?.parentBigTaskId as string]?.bigTaskEndTime;
        if (!bigTaskStartTime && !bigTaskEndTime) {
            return false;
        }
        return task?.startTime < bigTaskStartTime || task?.endTime > bigTaskEndTime;
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
            const subtask = getUnscheduledSubTask(String(event.active.id));
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
                        handleRemoveUnscheduledSubTask(subtask?.parentBigTaskId || "", subtask.id);
                    }
                });
                return;
            }

            setUpdatedTasks(reId([...updatedTasks, newTask]));
            setEditingTask(newTask);

            handleRemoveUnscheduledSubTask(subtask?.parentBigTaskId || "", subtask.id);
            return;
        }
        if (!droppedCellId) {
            setActiveDragId(null);
            setActiveTask(null);
            return;
        }
        // There are no 2 tasks with the same startTime
        if ((calendarMap[droppedCellId] || []).length) {
            setAlertMessage(OVERLAPPING_TIME_WARNING);
            return;
        }
        const updatedTaskIndex = updatedTasks.findIndex(task => task.id === activeDragId);
        const oldTask = updatedTasks[updatedTaskIndex];
        const newUpdatedTasks = [...updatedTasks];
        const taskDuration = toDayJs(oldTask.endTime).diff(toDayJs(oldTask.startTime));
        if (!isNil(updatedTaskIndex)) {
            newUpdatedTasks[updatedTaskIndex] = {
                ...oldTask,
                id: droppedCellId,
                startTime: droppedCellId,
                endTime: dayJsToISOString(toDayJs(droppedCellId).add(taskDuration)),
            };
        }

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
            const unscheduledBigTask = unscheduledBigTasks.find(bigTask => bigTask.id === task?.parentBigTaskId);
            // Unscheduled big task had been removed
            if (!unscheduledBigTask) {
                const postfix = uuid4();
                const newUnscheduledBigTasks = [...unscheduledBigTasks, {
                    id: UNSCHEDULED_BIGTASK_PREFIX.concat(postfix),
                    title: UNSCHEDULED_BIGTASK_DEFAULT_TITLE.concat(postfix),
                    subtasks: [{
                        ...task,
                        id: UNSCHEDULED_SUBTASK_PREFIX.concat(postfix).concat("-" + uuid4()),
                        parentBigTaskId: UNSCHEDULED_BIGTASK_PREFIX.concat(postfix),
                        title: task?.title,
                    }],
                    bigTaskStartTime: removedUnscheduledBigTasks[task?.parentBigTaskId]?.bigTaskStartTime,
                    bigTaskEndTime: removedUnscheduledBigTasks[task?.parentBigTaskId]?.bigTaskEndTime,
                }];

                // Update all tasks in updatedTasks that have old parentBigTaskId
                const newUpdatedTasks = [...updatedTasks];
                setUpdatedTasks(reId((newUpdatedTasks.map(updatedTask => {
                    if (updatedTask?.parentBigTaskId === task?.parentBigTaskId) {
                        return {
                            ...updatedTask,
                            parentBigTaskId: UNSCHEDULED_BIGTASK_PREFIX.concat(postfix),
                        };
                    }
                    else {
                        return updatedTask;
                    }
                })).filter(newUpdatedTask => newUpdatedTask.id !== task.id)));
                setEditingTask(null);
                setUnscheduledBigTasks(newUnscheduledBigTasks);
                return;
            }
            else {
                const newUnscheduledBigTask = {
                    ...unscheduledBigTask,
                    subtasks: [...(unscheduledBigTask?.subtasks || []), {
                        ...task,
                        id: UNSCHEDULED_SUBTASK_PREFIX.concat(unscheduledBigTask.id.replace(UNSCHEDULED_BIGTASK_PREFIX, "")).concat("-" + uuid4()),
                        title: task?.title,
                    }]
                };
                const bigTaskIndex = unscheduledBigTasks.findIndex(bigTask => bigTask.id === unscheduledBigTask.id);
                if (bigTaskIndex !== -1) {
                    const newUnscheduledBigTasks = [...unscheduledBigTasks];
                    newUnscheduledBigTasks[bigTaskIndex] = newUnscheduledBigTask;
                    setUnscheduledBigTasks(newUnscheduledBigTasks);
                }
            }
        }

        setUpdatedTasks(reId([...updatedTasks.filter(updatedTask => updatedTask.id !== task.id)]));
        setEditingTask(null);
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string) => {
        if ((event.target as HTMLElement).closest('.cursor-grab')) {
            return;
        }

        const adjustedPosition = getAdjustedPosition(event.clientX, event.clientY);

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

    const getAdjustedPosition = (x: number, y: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const EDITOR_WIDTH = 380;
        const EDITOR_HEIGHT = 550;
        const SCREEN_PADDING = 0;

        let adjustedX = x;
        let adjustedY = y;

        // Adjust X if it's too far to the right
        if (x + EDITOR_WIDTH + SCREEN_PADDING > viewportWidth) {
            adjustedX = viewportWidth - EDITOR_WIDTH - SCREEN_PADDING;
        }

        // Adjust Y if it's too far down
        if (y + EDITOR_HEIGHT + SCREEN_PADDING > viewportHeight) {
            adjustedY = viewportHeight - EDITOR_HEIGHT - SCREEN_PADDING;
        }

        if (adjustedX < SCREEN_PADDING) {
            adjustedX = SCREEN_PADDING;
        }
        if (adjustedY < SCREEN_PADDING) {
            adjustedY = SCREEN_PADDING;
        }

        return { x: adjustedX, y: adjustedY };
    };

    const handleTaskDoubleClick = (event: React.MouseEvent<HTMLDivElement>, task: Task, scrollContainerRef: React.RefObject<HTMLDivElement | null>) => {
        // if ((event.target as HTMLElement).closest('.cursor-grab')) {
        //     return;
        // }

        const container = scrollContainerRef.current;
        if (!container) return;

        const adjustedPosition = getAdjustedPosition(event.clientX, event.clientY);

        setEditorPosition(adjustedPosition);

        setEditingTask(task);
    };

    const onChangeUnscheduledTaskTitle = (taskId: string, newTitle: string) => {
        // If edited task was unscheduled big task
        const bigTaskIndex = unscheduledBigTasks.findIndex(bigTask => bigTask.id === taskId);
        if (bigTaskIndex !== -1) {
            const updatedUnscheduledBigTasks = [...unscheduledBigTasks];
            updatedUnscheduledBigTasks[bigTaskIndex] = {
                ...updatedUnscheduledBigTasks[bigTaskIndex],
                title: newTitle,
            };
            setUnscheduledBigTasks(updatedUnscheduledBigTasks);
            return;
        }
        // If edited task was unscheduled sub task
        const subtask = getUnscheduledSubTask(taskId);
        if (!subtask) {
            return;
        }
        const bigTask = unscheduledBigTasks.find(bigTask => bigTask.id === subtask?.parentBigTaskId);
        if (!bigTask) {
            return;
        }
        const updatedUnscheduledBigTasks = unscheduledBigTasks.map(bigTask => {
            const containingEditedSubtask = (bigTask?.subtasks || []).some(subtask => subtask.id === taskId);
            if (!containingEditedSubtask) {
                return bigTask;
            }
            const editedSubtaskIndex = (bigTask?.subtasks || []).findIndex(subtask => subtask.id === taskId);
            if (editedSubtaskIndex === -1) {
                return bigTask;
            }
            const updatedSubtasks = (bigTask?.subtasks || []);
            updatedSubtasks[editedSubtaskIndex] = {
                ...updatedSubtasks[editedSubtaskIndex],
                title: newTitle,
            }
            return {
                ...bigTask,
                subtasks: updatedSubtasks,
            }
        });

        setUnscheduledBigTasks(updatedUnscheduledBigTasks);
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

        // if (activeTask) {
        //     newTasksStyle[activeTask.id] = undefined;
        // }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks]);

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
        unscheduledBigTasks,
        setUnscheduledBigTasks,
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
    }
};