import { AppContext, AppContextProps } from "@/hooks/app-context";
import { dayJsToISOString, getBigTask, getDetails, getEditorAdjustedPosition, getMondayOfThisWeek, getMonthName, getPercentageHeight, getProjectTaskById, getRoutineById, getTaskById, initCalendarMap, reId, timeToFractionalHours, toDayJs, uuid4 } from "@/lib/utils";
import { ProjectGroup, UserTaskItem } from "@/model/project-management";
import { Task, UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
import React, { createContext, Dispatch, RefObject, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";
import { AlertMessage } from "../alert-modal/alert-modal";
import { DraggableTask } from "./draggable-task";

export interface CalendarContextInterface {
    currentDate: Dayjs;
    projectGroups: ProjectGroup[];
    setProjectGroups: Dispatch<SetStateAction<ProjectGroup[]>>;
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
    sidebarRef: RefObject<HTMLDivElement | null>;
    alertMessage: AlertMessage | null;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    onChangeUnscheduledTaskTitle: (taskId: string, newTitle: string) => void;
    isOutBigTaskTimeRange: (task: Task) => boolean | "" | undefined;
    setPanelPosition: Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    }>>;
    panelBufferListPosition: { x: number; y: number; };
    setPanelBufferListPosition: Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    }>>;
    monthPlanId: number | null;
    setMonthPlanId: Dispatch<SetStateAction<number | null>>;
    getSleepBlocks: () => {
        top: string;
        height: string;
    }[];
    handleReload: (silent?: boolean) => void;
    isLoadingCalendar: boolean;
    // For EDITING unscheduled and scheduled task
    selectedTaskId: string | number | null;
    setSelectedTaskId: Dispatch<SetStateAction<string | number | null>>;

    // For EDITING unscheduled and scheduled routine
    selectedRoutineId: string | number | null;
    setSelectedRoutineId: Dispatch<SetStateAction<string | number | null>>;

    // For DRAGGING project task 
    draggingProjectTaskId: number | null;
    setDraggingProjectTaskId: Dispatch<SetStateAction<number | null>>;

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
    isPanelBufferListDragging: boolean;
    setIsPanelBufferListDragging: Dispatch<SetStateAction<boolean>>;

    // For editing CREATED task and NEW task 
    editingTask: Task | Partial<Task> | null;
    setEditingTask: Dispatch<SetStateAction<Task | Partial<Task> | null>>;

    getDraggingRoutine: () => any;
    getDraggingTask: () => any;
    getDraggableTaskOverlay: () => any;
    getDraggingProjectTask: () => any;
    onDeleteCalendarItem: (itemId?: number | string | null) => void;
    getUserProjectTasks: () => void;

    onDragStart: (event: DragStartEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    handleCellClick: (event: React.MouseEvent<HTMLTableCellElement>, cellId: string, scrollContainerRef?: any) => void;
    getNewCalendarItem: (itemId: number, isNew?: boolean) => void;
    handleRemoveUnscheduledTask: (unscheduledTaskId: number | string | null, bigTaskId: number) => void;
    handleRemoveUnscheduledRoutine: (unscheduledRoutineId: number | string | null) => void;
    updateBigTask: (monthData: UnscheduledMonthData[], bigTaskParams: { index: number; item: UnscheduledBigTask; monthDataIndex: number; }) => void;
    handleTaskEditorClose: () => void;

    // Resize state and handlers
    resizingItemId: number | null;
    setResizingItemId: Dispatch<SetStateAction<number | null>>;
    resizePreviewEndTime: string | null;
    setResizePreviewEndTime: Dispatch<SetStateAction<string | null>>;
    isResizeOverlapping: boolean;
    setIsResizeOverlapping: Dispatch<SetStateAction<boolean>>;
    onResizeStart: (itemId: number, originalEndTime: string, occurrenceKey?: string) => void;
    onResizeMove: (itemId: number, newEndTime: string) => void;
    onResizeEnd: (itemId: number, newEndTime: string) => void;
    originalResizeEndTime: string | null;
    resizingOccurrenceKey: string | null;

    // Routine resize confirmation state and handlers
    pendingRoutineResize: { itemId: number; newEndTime: string; originalStartTime: string } | null;
    showRoutineResizeConfirm: boolean;
    onRoutineResizeConfirmUpdate: () => void;
    onRoutineResizeConfirmDetach: () => void;
    onRoutineResizeCancel: () => void;
};

export const CalendarContext = createContext<CalendarContextInterface>({
    currentDate: dayjs(),
    setCurrentDate: () => { },
    tasksStyle: {},
    sidebarRef: null as any,
    calendarMap: {},
    projectGroups: [],
    setProjectGroups: () => { },
    currentView: "week",
    setCurrentView: () => { },
    updatedTasks: [],
    setUpdatedTasks: () => { },
    activeTask: null,
    editorPosition: { x: 0, y: 0 },
    setEditorPosition: () => { },
    panelPosition: { x: 0, y: 0 },
    panelBufferListPosition: { x: 0, y: 0 },
    setPanelBufferListPosition: () => { },
    unscheduledMonthData: [],
    setUnscheduledMonthData: () => { },
    activeUnscheduledTask: undefined,
    activeUnscheduledRoutine: undefined,
    CELL_HEIGHT: 4.6,
    hours: [],
    monthPlanId: null,
    setMonthPlanId: () => { },
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
    isLoadingCalendar: false,
    // Editing state
    selectedTaskId: null,
    setSelectedTaskId: () => { },
    selectedRoutineId: null,
    setSelectedRoutineId: () => { },

    // Dragging state for items
    draggingProjectTaskId: null,
    setDraggingProjectTaskId: () => { },
    draggingUnscheduledTaskId: null,
    setDraggingUnscheduledTaskId: () => { },
    draggingScheduledTaskId: null,
    setDraggingScheduledTaskId: () => { },
    draggingUnscheduledRoutineId: null,
    setDraggingUnscheduledRoutineId: () => { },

    // Dragging state for the panel
    isPanelDragging: false,
    setIsPanelDragging: () => { },
    isPanelBufferListDragging: false,
    setIsPanelBufferListDragging: () => { },

    // Editor state for new/created tasks
    editingTask: null,
    setEditingTask: () => { },
    getDraggingRoutine: () => { },
    getDraggingTask: () => { },
    getDraggingProjectTask: () => { },
    getDraggableTaskOverlay: () => { },
    getUserProjectTasks: () => { },
    onDeleteCalendarItem: () => { },

    onDragStart: () => { },
    onDragEnd: () => { },
    handleCellClick: () => { },
    getNewCalendarItem: () => { },
    handleRemoveUnscheduledTask: () => { },
    handleRemoveUnscheduledRoutine: () => { },
    updateBigTask: () => { },
    getSleepBlocks: () => [],
    handleTaskEditorClose: () => { },

    // Resize defaults
    resizingItemId: null,
    setResizingItemId: () => { },
    resizePreviewEndTime: null,
    setResizePreviewEndTime: () => { },
    isResizeOverlapping: false,
    setIsResizeOverlapping: () => { },
    onResizeStart: () => { },
    onResizeMove: () => { },
    onResizeEnd: () => { },
    originalResizeEndTime: null,
    resizingOccurrenceKey: null,

    // Routine resize confirmation defaults
    pendingRoutineResize: null,
    showRoutineResizeConfirm: false,
    onRoutineResizeConfirmUpdate: () => { },
    onRoutineResizeConfirmDetach: () => { },
    onRoutineResizeCancel: () => { },
});

export const useCalendarHooks = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Derived State
    const dateParam = searchParams?.get("date");
    // Memoize currentDate to prevent infinite loops in useEffects that depend on it
    const currentDate = React.useMemo(() => {
        return dateParam ? dayjs(dateParam) : toDayJs();
    }, [dateParam]);

    const viewParam = searchParams?.get("view");
    const isPlanningPath = pathname?.startsWith("/calendar/planning");
    const currentView = viewParam || (isPlanningPath ? "month-planning" : "week");

    // Local State
    const [tasksStyle, setTasksStyle] = useState<Record<string, any>>({});
    const [calendarMap, setCalendarMap] = useState<Record<string, any[]>>({});
    const [currentMondayTime, setCurrentMondayTime] = useState<Dayjs>(getMondayOfThisWeek());

    // Setters (URL updates)
    const setCurrentDate = useCallback((action: SetStateAction<Dayjs>) => {
        const nextDate = typeof action === 'function' ? action(currentDate) : action;
        const params = new URLSearchParams(searchParams?.toString());
        const dateStr = nextDate.format("YYYY-MM-DD");
        params.set("date", dateStr);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("calendar_session_date", dateStr);
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [currentDate, pathname, router, searchParams]);

    const setCurrentView = useCallback((action: SetStateAction<string>) => {
        const nextView = typeof action === 'function' ? action(currentView) : action;
        const params = new URLSearchParams(searchParams?.toString());
        params.set("view", nextView);

        if (typeof window !== "undefined" && nextView !== "month-planning") {
            sessionStorage.setItem("calendar_session_view", nextView);
        }

        if (nextView === "month-planning") {
            router.push(`/calendar/planning?${params.toString()}`);
        } else {
            if (pathname?.startsWith("/calendar/planning")) {
                router.push(`/calendar?${params.toString()}`);
            } else {
                router.push(`${pathname}?${params.toString()}`);
            }
        }
    }, [currentView, pathname, router, searchParams]);
    const [updatedTasks, setUpdatedTasks] = useState<Task[]>(reId([]));
    const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
    const [panelBufferListPosition, setPanelBufferListPosition] = useState({ x: 20, y: 100 });

    // Resize state
    const [resizingItemId, setResizingItemId] = useState<number | null>(null);
    const [resizingOccurrenceKey, setResizingOccurrenceKey] = useState<string | null>(null);
    const [resizePreviewEndTime, setResizePreviewEndTime] = useState<string | null>(null);
    const [isResizeOverlapping, setIsResizeOverlapping] = useState<boolean>(false);
    const [originalResizeEndTime, setOriginalResizeEndTime] = useState<string | null>(null);

    // Routine resize confirmation state
    const [pendingRoutineResize, setPendingRoutineResize] = useState<{ itemId: number; newEndTime: string; originalStartTime: string } | null>(null);
    const [showRoutineResizeConfirm, setShowRoutineResizeConfirm] = useState<boolean>(false);

    // Ref to store occurrence key (avoids closure issues)
    const resizingOccurrenceKeyRef = useRef<string | null>(null);

    const justClosedRef = useRef(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPanelPosition({
                x: window.visualViewport ? window.visualViewport.pageLeft + window.visualViewport.width / 2 + 250 : 20,
                y: window.visualViewport ? window.visualViewport.pageTop + window.visualViewport.height - 250 : 100,
            });
            setPanelBufferListPosition({
                x: window.visualViewport ? window.visualViewport.pageLeft + window.visualViewport.width / 3 + 250 : 20,
                y: window.visualViewport ? window.visualViewport.pageTop + window.visualViewport.height - 250 : 100,
            });

            // Restore from sessionStorage if URL params are missing
            const savedView = sessionStorage.getItem("calendar_session_view");
            const savedDate = sessionStorage.getItem("calendar_session_date");

            // Only restore if we are on a calendar page (prevent hijacking other pages like Projects)
            const isCalendarPage = pathname?.startsWith("/calendar");

            // Case 1: Fresh Session (Empty Storage) - Force Default Logic
            // User requirement: "When I sign in should be ... current week view".
            // If explicit params are NOT present, or even if they are present but we want to ENFORCE default on fresh login (though usually login redirects to /calendar clean)
            // But if user clicks a link with params, we might want to respect it? 
            // The prompt says: "When I put the current private calendar view: .../calendar?date=...&view=month-view ... I log out then sign in, the page shows .../calendar?view=month-view... What I want when I sign in should be ... containing the current week view."
            // This implies even if there ARE params (maybe from browser history or redirect), we should override them if it's a "fresh" login? 
            // Or simpler: The login page redirects to /calendar (no params). 
            // If they navigate manually, we check session.

            // If no saved state exists, and we are on /calendar without params, set default params.
            if (isCalendarPage && !savedView && !savedDate && !viewParam && !dateParam) {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("view", "week");
                params.set("date", toDayJs().format("YYYY-MM-DD"));
                router.replace(`${pathname}?${params.toString()}`);
                return;
            }

            // Case 2: Restore State (Missing URL params but have Saved Session)
            // If I am on /calendar and have NO params, but I HAVE a saved session, restore it.
            if (isCalendarPage && !viewParam && !dateParam && (savedView || savedDate)) {
                const params = new URLSearchParams(searchParams?.toString());

                // Special handling: If on standard /calendar but saved view is 'month-planning',
                // DO NOT redirect to planning page. Just restore the date and let view default to week/day.
                if (pathname === '/calendar' && savedView === 'month-planning') {
                    if (savedDate) params.set("date", savedDate);
                    // Force view to week if we were in planning but now in standard calendar
                    params.set("view", "week");
                    router.replace(`${pathname}?${params.toString()}`);
                    return;
                }

                if (savedView) params.set("view", savedView);
                if (savedDate) params.set("date", savedDate);

                const targetPath = savedView === 'month-planning' ? '/calendar/planning' : (pathname === '/calendar/planning' ? '/calendar' : pathname);

                // If we are already on the target path, just replace params.
                if (targetPath !== pathname) {
                    router.push(`${targetPath}?${params.toString()}`);
                } else {
                    router.replace(`${targetPath}?${params.toString()}`);
                }
                return;
            }

            // Case 3: Sync URL to Session (Persistence during session)
            // If URL has params, ensure they are saved to session so navigation away (e.g. to Projects) remembers them.
            // Also, if we just landed on a page with params (e.g. manually typed), valid them.
            if (isCalendarPage && (viewParam || dateParam)) {
                if (viewParam && viewParam !== savedView && viewParam !== "month-planning") {
                    sessionStorage.setItem("calendar_session_view", viewParam);
                }
                if (dateParam && dateParam !== savedDate) {
                    sessionStorage.setItem("calendar_session_date", dateParam);
                }
            }
        }
    }, [viewParam, dateParam, pathname]);


    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [monthPlanId, setMonthPlanId] = useState<number | null>(null);

    const [unscheduledMonthData, setUnscheduledMonthData] = useState<UnscheduledMonthData[]>([]);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const {
        calendarRepository,
        projectRepository,
        calendarId,
    } = useContext<AppContextProps>(AppContext);

    const CELL_HEIGHT = 4.57;
    const [topPosition, setTopPosition] = useState("0");

    useEffect(() => {
        const now = dayjs();
        const hoursNow = now.hour();
        const minutesNow = now.minute();
        setTopPosition(`calc(${(hoursNow + minutesNow / 60) * CELL_HEIGHT}rem - 0.25rem)`);
    }, [CELL_HEIGHT]);

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

        // determine view range for routine generation
        // default to current month +/- 1 month for safety
        const viewStart = currentDate.clone().subtract(1, "month").startOf("month");
        const viewEnd = currentDate.clone().add(1, "month").endOf("month");

        const updatedCalendarMap = initCalendarMap(newTasks, viewStart, viewEnd);
        const newTasksStyle: Record<string, any> = {};
        let currentZIndex = 0;

        setCalendarMap(updatedCalendarMap);

        const calculateWidthAndLeft = (task: Task, tasksVal: Task[], count: number) => {
            const width = Math.min(95, 95 / tasksVal.length);
            const left = count * width; // Simple stacking for now, can be improved for complex overlaps
            return { width, left };
        };

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

                if (!newStyle) {
                    const widthAndLeft = calculateWidthAndLeft(task, tasksVal, count);
                    newStyle = { zIndex: currentZIndex++, ...widthAndLeft };
                    newTasksStyle[task?.id as number] = newStyle;
                }

                newTasksStyle[task?.id as number] = {
                    ...newTasksStyle[task?.id as number],
                    top: Math.max((diff) - 20, 0),    // %
                    height: getPercentageHeight(task) * CELL_HEIGHT, // rem
                }
            });
        });

        // const sortedKeys = Object.keys(newTasksStyle).sort((a, b) => { // Sort by startTime
        //     const taskA = newTasks.find(t => t.id === Number(a));
        //     const taskB = newTasks.find(t => t.id === Number(b));
        //     return (taskA?.startTime && taskB?.startTime) ? dayjs(taskA.startTime).diff(dayjs(taskB.startTime)) : 0;
        // });

        // for (const taskId of sortedKeys) {
        //     const task = newTasks.find(t => t.id === Number(taskId));
        //     if (!task) continue;

        //     // Recalculate based on overlapping
        //     const overlaps = newTasks.filter(otherTask =>
        //         otherTask.id !== task.id &&
        //         toDayJs(task.startTime).isBefore(toDayJs(otherTask.endTime)) &&
        //         toDayJs(otherTask.startTime).isBefore(toDayJs(task.endTime))
        //     );

        //     const width = 95 / (overlaps.length + 1); // +1 for the current task
        //     overlaps.sort((a, b) => String(a.id).localeCompare(String(b.id)));
        //     const columnIndex = overlaps.findIndex(t => t.id === task.id) === -1 ? overlaps.length : overlaps.findIndex(t => t.id === task.id);
        //     const left = columnIndex * width;

        //     newTasksStyle[task?.id as number] = {
        //         ...newTasksStyle[task?.id as number],
        //         width,
        //         left,
        //     };
        // }

        setTasksStyle(newTasksStyle);

    }, [currentMondayTime, updatedTasks, currentDate]);



    // console.log("updatedTasks", updatedTasks);
    // console.log("calendarMap", calendarMap)
    // console.log("tasksStyle", tasksStyle);

    const getRequestView = useCallback(() => {
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
            default:
                return "WEEK";
        }
    }, [currentView]);

    // For EDITING unscheduled and scheduled task
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
    // For EDITING unscheduled and scdeduled routine
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | number | null>(null);
    // For DRAGGING project task
    const [draggingProjectTaskId, setDraggingProjectTaskId] = useState<number | null>(null);
    // For DRAGGING scheduled task
    const [draggingUnscheduledTaskId, setDraggingUnscheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING scheduled task
    const [draggingScheduledTaskId, setDraggingScheduledTaskId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled routine
    const [draggingUnscheduledRoutineId, setDraggingUnscheduledRoutineId] = useState<string | number | null>(null);
    // For DRAGGING unscheduled items panel
    const [isPanelDragging, setIsPanelDragging] = useState<boolean>(false);
    // For DRAGGING unscheduled buffer list panel
    const [isPanelBufferListDragging, setIsPanelBufferListDragging] = useState<boolean>(false);
    // For editing CREATED task and NEW task 
    const [editingTask, setEditingTask] = useState<Task | Partial<Task> | null>(null);
    // For calendar loading state (Week/Month views)
    const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);
    const {
        sleepHours, // Using the new sleepHours array: {startTime: "HH:mm", endTime: "HH:mm"}[]
    } = useContext<AppContextProps>(AppContext);

    const handleReload = useCallback((silent: boolean = false) => {
        // Only show loading skeleton for non-silent reloads (page load, view changes)
        if (!silent) {
            setIsLoadingCalendar(true);
        }
        calendarRepository?.getScheduledItems({
            view: getRequestView(),
            date: currentDate.format('YYYY-MM-DD'),
            calendarId: calendarId || 0,
        }).subscribe({
            next: (res: any) => {
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
                setIsLoadingCalendar(false);
            },
            error: (err: any) => {
                console.log("Error occurs while fetching scheduled items", err);
                setIsLoadingCalendar(false);
            }
        });
    }, [calendarRepository, currentDate, getRequestView, calendarId]);

    useEffect(() => {
        if (!calendarRepository) {
            return;
        }
        if (currentView !== 'month-planning') {
            handleReload();
        }

        setCurrentMondayTime(getMondayOfThisWeek(currentDate));
        setSelectedTaskId(null);
        setSelectedRoutineId(null);
        setEditingTask(null);
        setDraggingScheduledTaskId(null);
        setDraggingUnscheduledRoutineId(null);
        setDraggingUnscheduledTaskId(null);
    }, [
        currentView,
        currentDate,
        calendarRepository,
        handleReload,
    ]);

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
        calendarRepository?.getCalendarItem({ itemId: taskId })
            .subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        setSelectedTaskId(taskId);
                        setEditingTask({
                            ...res?.data,
                            startTime: _task?.startTime ? _task.startTime : (res?.data?.timeSlot?.startTime as string).concat("Z"),
                            endTime: _task?.endTime ? _task.endTime : (res?.data?.timeSlot?.endTime as string).concat("Z"),
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
                error: (err: any) => { }
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

    const getDraggingProjectTask = () => {
        return getProjectTaskById(projectGroups, draggingProjectTaskId);
    };

    const onDeleteCalendarItem = (itemId?: number | string | null, wouldGetUnscheduledItems?: boolean) => {
        // itemId could only be number
        calendarRepository?.deleteCalendarItem(itemId as number)
            .subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.msg || res?.message);
                        setSelectedTaskId(null);
                        setSelectedRoutineId(null);
                        setEditingTask(null);
                        handleReload(true);
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
                error: (err: any) => {
                    if (wouldGetUnscheduledItems) {
                        getUnscheduledItems();
                    }
                },
            });
    };

    const onDragStart = (event: DragStartEvent) => {
        if (event.active?.data?.current?.type === "unscheduled-task") {
            setDraggingUnscheduledTaskId(event.active.id);
            setDraggingProjectTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
            setIsPanelBufferListDragging(false);
        }
        if (event.active?.data?.current?.type === "project-task") {
            setDraggingUnscheduledTaskId(null);
            setDraggingProjectTaskId(event.active.id as number);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
            setIsPanelBufferListDragging(false);
        }
        else if (event.active?.data?.current?.type === "unscheduled-routine") {
            setDraggingUnscheduledTaskId(null);
            setDraggingProjectTaskId(null);
            setDraggingUnscheduledRoutineId(event.active.id);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
            setIsPanelBufferListDragging(false);
        }
        else if (event.active?.id === "draggable-panel") {
            setDraggingUnscheduledTaskId(null);
            setDraggingProjectTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(true);
            setIsPanelBufferListDragging(false);
        }
        else if (event.active?.id === "draggable-panel-buffer-list") {
            setDraggingUnscheduledTaskId(null);
            setDraggingProjectTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(null);
            setIsPanelDragging(false);
            setIsPanelBufferListDragging(true);
        }
        else if (["task", "event"].includes((event.active?.data?.current?.type || "").toLowerCase())) {
            setDraggingUnscheduledTaskId(null);
            setDraggingProjectTaskId(null);
            setDraggingUnscheduledRoutineId(null);
            setDraggingScheduledTaskId(event.active.id);
            setIsPanelDragging(false);
            setIsPanelBufferListDragging(false);
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
        calendarRepository?.updateRoutineList({
            monthPlanId,
        }, {
            approvedRoutineNames: newRoutineList,
        }).subscribe({
            next: (res: any) => {
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
            error: (err: any) => {
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
        const unscheduledRoutineIndex = (updatedMonthDataItem?.unscheduledRoutines || []).findIndex((routine: any) => routine?.id === unscheduledRoutineId);

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
        const { monthPlanId, newRoutineList } = res;
        updateRoutineList(monthPlanId as number, newRoutineList, true);
    };

    const getNewCalendarItem = (itemId: number, isNew?: boolean, openEditor: boolean = true) => {
        calendarRepository?.getCalendarItem({ itemId: itemId })
            .subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    const updatedCalendarItem: Task = res?.data;
                    if (success) {
                        const newCalendarItem = {
                            ...updatedCalendarItem,
                            startTime: (updatedCalendarItem?.timeSlot?.startTime as string).concat("Z"),
                            endTime: (updatedCalendarItem?.timeSlot?.endTime as string).concat("Z"),
                        };
                        if (openEditor) {
                            setEditingTask(newCalendarItem);
                        }

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
                error: (err: any) => {
                    setDraggingUnscheduledTaskId(null);
                    setDraggingUnscheduledRoutineId(null);
                    setDraggingScheduledTaskId(null);

                    handleReload();
                }
            });
    };

    const handleCellClick = (event: React.MouseEvent<HTMLTableCellElement>, cellId: string, scrollContainerRef?: any) => {
        // Prevent opening if we just closed the editor
        if (justClosedRef.current) return;

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
        calendarRepository?.getUnscheduledItems()
            .subscribe({
                next: (res: any) => {
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
                error: (err: any) => {
                    console.log("Error occurs while fetching unscheduled items", err);
                }
            });
    };

    const getUserProjectTasks = () => {
        projectRepository?.getUserProjectTasks().subscribe({
            next: (res: any) => {
                if (res?.status) {
                    setProjectGroups(res?.data?.projects || []);
                }
                else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: (err: any) => { },
        });
    };

    const onDragEnd = (event: DragEndEvent, forceToProceed?: boolean) => {
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
        // For buffer list panel
        if (event.active.id === 'draggable-panel-buffer-list') {
            setPanelBufferListPosition(prev => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
            }));
            setIsPanelBufferListDragging(false);
            return;
        }
        // For project task
        if (!isNil(draggingProjectTaskId)) {
            const projectTask: UserTaskItem | undefined = getProjectTaskById(projectGroups, draggingProjectTaskId);
            if (!projectTask) {
                return;
            }
            if (projectTask.overdue && !forceToProceed) {
                setAlertMessage({
                    type: "warning",
                    title: "This task is overdue",
                    description: "Would you like to continue add this task to calendar?",
                    proceedAnyway: () => {
                        onDragEnd(event, true);
                    },
                })
                return;
            }
            const cellId = String(event.over?.id);
            const newTask: Task = {
                ...projectTask,
                id: draggingProjectTaskId,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: projectTask.name || "",
                type: "project_work",
                status: 'incomplete',
                completionPercentage: 0,
            };

            // Temporarily update updatedTasks
            setUpdatedTasks([...updatedTasks, newTask]);

            calendarRepository?.createCalendarItem(
                {
                    ...newTask,
                    type: (newTask?.type as string).toUpperCase(),
                    name: newTask?.name,
                    calendarId: calendarId || 0,
                    timeSlot: {
                        startTime: newTask?.startTime,
                        endTime: newTask?.endTime,
                    },
                    pmTaskId: draggingProjectTaskId,
                })
                .pipe(finalize(() => {
                    setDraggingProjectTaskId(null);
                    handleReload(true);
                }))
                .subscribe({
                    next: (res: any) => {
                        const success = res?.status;
                        if (success) { }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg,
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

            calendarRepository?.updateCalendarItem(
                draggingUnscheduledTaskId as number,
                {
                    ...newTask,
                    type: (newTask?.type as string).toUpperCase(),
                    name: newTask?.name,
                    calendarId: calendarId || 0,
                    monthPlanId: monthPlanId || 0,
                    timeSlot: {
                        startTime: newTask?.startTime,
                        endTime: newTask?.endTime,
                    },
                    taskDetails: {
                        estimatedHours: newTask?.estimatedHours,
                        parentBigTaskId: newTask?.parentBigTaskId,
                    },
                }).subscribe({
                    next: (res: any) => {
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
                            handleReload(true);
                            getUnscheduledItems();
                        }
                    },
                    error: (err: any) => {
                        setDraggingUnscheduledTaskId(null);
                        handleReload(true);
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
            // Derive day of week from the actual drop date
            const dropDate = toDayJs(cellId);
            const dayOfWeek = dropDate.format('dddd').toUpperCase(); // "MONDAY", "TUESDAY", etc.

            const newRoutine: Task = {
                ...unscheduledRoutine,
                id: unscheduledRoutine?.id as number,
                startTime: cellId,
                endTime: dayJsToISOString(toDayJs(cellId).add(15, "minute")),
                name: unscheduledRoutine?.name || "",
                type: "routine",
                status: 'incomplete',
                pattern: {
                    daysOfWeek: [dayOfWeek]
                },
                exceptions: [],
            };


            // Temporarily update updatedTasks
            setUpdatedTasks([...updatedTasks, newRoutine]);
            // Temporarily remove unscheduled task
            handleRemoveUnscheduledRoutine(draggingUnscheduledRoutineId);

            // Check if this is an existing routine (has numeric ID from DB)
            const isExistingRoutine = typeof unscheduledRoutine?.id === 'number';

            if (isExistingRoutine) {
                // UPDATE existing unscheduled routine instead of creating a duplicate
                // Only send the fields that need updating
                calendarRepository?.updateCalendarItem(
                    unscheduledRoutine.id as number,
                    {
                        timeSlot: {
                            startTime: newRoutine?.startTime,
                            endTime: newRoutine?.endTime,
                        },
                        routineDetails: {
                            pattern: newRoutine.pattern,
                        },
                    }).subscribe({

                        next: (res: any) => {
                            const success = res?.status;
                            if (success) {
                                // Use the known routine ID since this is an update operation
                                getNewCalendarItem(unscheduledRoutine.id as number, false, false); // false = updating existing item, false = don't open editor
                                getUnscheduledItems();
                            }
                            else {
                                setAlertMessage({
                                    type: "warning",
                                    title: res?.msg || res?.message,
                                    description: res?.data,
                                });
                                setDraggingUnscheduledRoutineId(null);
                                handleReload(true);
                                getUnscheduledItems();
                            }
                        },
                        error: (err: any) => {
                            setDraggingUnscheduledRoutineId(null);
                            handleReload(true);
                            getUnscheduledItems();
                        },
                    });
            } else {
                // CREATE new routine (fallback for edge cases like uuid-based IDs)
                calendarRepository?.createCalendarItem(
                    {
                        ...newRoutine,
                        type: (newRoutine?.type as string).toUpperCase(),
                        name: newRoutine?.name,
                        calendarId: calendarId || 0,
                        monthPlanId: monthPlanId || 0,
                        timeSlot: {
                            startTime: newRoutine?.startTime,
                            endTime: newRoutine?.endTime,
                        },
                        routineDetails: {
                            pattern: newRoutine.pattern,
                        },
                    }).subscribe({
                        next: (res: any) => {
                            // Handle both response formats:
                            // 1. CreateItemResponse: res.data = { itemId: number, ... }
                            // 2. Direct ID (fallback path): res.data = number
                            const itemId = typeof res?.data === 'object' ? res?.data?.itemId : res?.data;
                            const success = res?.status;
                            if (success) {
                                getNewCalendarItem(itemId, true, false); // true = new item, false = don't open editor
                                getUnscheduledItems();
                            }
                            else {
                                setAlertMessage({
                                    type: "warning",
                                    title: res?.msg || res?.message,
                                    description: res?.data,
                                });
                                setDraggingUnscheduledRoutineId(null);
                                handleReload(true);
                                getUnscheduledItems();
                            }
                        },
                        error: (err: any) => {
                            setDraggingUnscheduledRoutineId(null);
                            handleReload(true);
                            getUnscheduledItems();
                        },
                    });
            }

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
        calendarRepository?.updateCalendarItem(
            scheduledItem?.id as number,
            {
                ...scheduledItem,
                type: (scheduledItem?.type as string).toUpperCase(),
                name: scheduledItem?.name,
                calendarId: calendarId || 0,
                timeSlot: {
                    startTime: droppedCellId,
                    endTime: dayJsToISOString(newEndTime),
                },
                ...getDetails(scheduledItem as Task),
            }).subscribe({
                next: (res: any) => {
                    const itemId = res?.data;
                    const success = res?.status;
                    if (success) {
                        // Just reload calendar data, don't open editor
                        handleReload(true);
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg,
                            description: res?.data,
                        });
                        setDraggingScheduledTaskId(null);
                        handleReload(true);
                    }
                },
                error: (err: any) => {
                    setDraggingScheduledTaskId(null);
                    handleReload(true);
                },
            });
    };

    return {
        currentDate,
        setCurrentDate,
        tasksStyle,
        calendarMap,
        projectGroups,
        setProjectGroups,
        topPosition,
        currentView,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        getUserProjectTasks,
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
        sidebarRef,
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
        isLoadingCalendar,
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
        isPanelBufferListDragging,
        setIsPanelDragging,
        setIsPanelBufferListDragging,
        panelBufferListPosition,
        setPanelBufferListPosition,
        editingTask,
        draggingProjectTaskId,
        setDraggingProjectTaskId,
        setEditingTask,
        getDraggingRoutine,
        getDraggingTask,
        getDraggableTaskOverlay,
        getDraggingProjectTask,
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
        monthPlanId,
        setMonthPlanId,
        handleTaskEditorClose: () => {
            justClosedRef.current = true;
            setTimeout(() => { justClosedRef.current = false }, 200);
        },

        // Resize state and handlers
        resizingItemId,
        setResizingItemId,
        resizePreviewEndTime,
        setResizePreviewEndTime,
        isResizeOverlapping,
        setIsResizeOverlapping,
        originalResizeEndTime,
        resizingOccurrenceKey,
        onResizeStart: (itemId: number, originalEndTime: string, occurrenceKey?: string) => {
            setResizingItemId(itemId);
            setResizingOccurrenceKey(occurrenceKey || null);
            resizingOccurrenceKeyRef.current = occurrenceKey || null;  // Also update ref
            setOriginalResizeEndTime(originalEndTime);
            setResizePreviewEndTime(originalEndTime);
            setIsResizeOverlapping(false);
        },
        onResizeMove: (itemId: number, newEndTime: string) => {
            setResizePreviewEndTime(newEndTime);
            // FE overlap check - find the item being resized
            const resizingItem = updatedTasks.find(t => t.id === itemId);
            if (resizingItem) {
                const newStart = toDayJs(resizingItem.startTime);
                const newEnd = toDayJs(newEndTime);
                // Check against all updatedTasks on the same day
                const dayKey = newStart.format("YYYY-MM-DD");
                const hasOverlap = updatedTasks.some((item: Task) => {
                    if (item.id === itemId) return false;
                    if ((item.type || "").toLowerCase() === "routine") return false;
                    const itemDay = toDayJs(item.startTime).format("YYYY-MM-DD");
                    if (itemDay !== dayKey) return false;
                    const itemStart = toDayJs(item.startTime);
                    const itemEnd = toDayJs(item.endTime);
                    return newStart.isBefore(itemEnd) && itemStart.isBefore(newEnd);
                });
                setIsResizeOverlapping(hasOverlap);
            }
        },
        onResizeEnd: (itemId: number, newEndTime: string) => {
            // If overlapping on FE, revert and don't call API
            if (isResizeOverlapping) {
                setResizingItemId(null);
                setResizingOccurrenceKey(null);
                setResizePreviewEndTime(null);
                setOriginalResizeEndTime(null);
                setIsResizeOverlapping(false);
                return;
            }

            // Find the item
            const resizingItem = updatedTasks.find(t => t.id === itemId);
            if (!resizingItem) {
                setResizingItemId(null);
                setResizingOccurrenceKey(null);
                setResizePreviewEndTime(null);
                setOriginalResizeEndTime(null);
                return;
            }

            // Check if it's a routine - show confirmation dialog
            const isRoutine = (resizingItem.type || "").toLowerCase() === "routine";
            if (isRoutine) {
                // Check if it's a standalone routine (no recurring pattern)
                const routinePattern = (resizingItem as any).pattern;
                const isStandalone = !routinePattern ||
                    !routinePattern.daysOfWeek ||
                    (Array.isArray(routinePattern.daysOfWeek) && routinePattern.daysOfWeek.length === 0);

                if (isStandalone) {
                    // For standalone routines, directly update (no confirmation needed)
                    // Temporarily update UI
                    const newUpdatedTasks = [...updatedTasks];
                    const taskIndex = newUpdatedTasks.findIndex(t => t.id === itemId);
                    if (taskIndex !== -1) {
                        newUpdatedTasks[taskIndex] = { ...resizingItem, endTime: newEndTime };
                        setUpdatedTasks(newUpdatedTasks);
                    }

                    // Call BE API to update standalone routine
                    calendarRepository?.updateCalendarItem(
                        itemId,
                        {
                            ...resizingItem,
                            type: (resizingItem.type as string).toUpperCase(),
                            name: resizingItem.name,
                            calendarId: calendarId || 0,
                            timeSlot: {
                                startTime: resizingItem.startTime,
                                endTime: newEndTime,
                            },
                            ...getDetails(resizingItem),
                        }
                    ).subscribe({
                        next: (res: any) => {
                            const success = res?.status;
                            if (success) {
                                handleReload(true);
                                toast.success("Duration updated");
                            } else {
                                setAlertMessage({
                                    type: "warning",
                                    title: res?.msg || "Update failed",
                                    description: res?.data,
                                });
                                handleReload(true);
                            }
                        },
                        error: (err: any) => {
                            const message = err?.response?.data?.msg || err?.response?.data?.message || "Update failed";
                            setAlertMessage({
                                type: "warning",
                                title: message,
                                description: err?.response?.data?.data,
                            });
                            handleReload(true);
                        },
                    });

                    // Reset resize state
                    setResizingItemId(null);
                    setResizingOccurrenceKey(null);
                    setResizePreviewEndTime(null);
                    setOriginalResizeEndTime(null);
                    setIsResizeOverlapping(false);
                    return;
                }

                // For recurring routines, show confirmation dialog
                // Store pending resize data and show dialog
                // Use ref for occurrence key to avoid closure issues
                const occurrenceStartTime = resizingOccurrenceKeyRef.current || (resizingItem.startTime as string);
                setPendingRoutineResize({
                    itemId,
                    newEndTime,
                    originalStartTime: occurrenceStartTime,
                });
                setShowRoutineResizeConfirm(true);
                // Reset resize state
                setResizingItemId(null);
                setResizingOccurrenceKey(null);
                resizingOccurrenceKeyRef.current = null;  // Also reset ref
                setResizePreviewEndTime(null);
                setOriginalResizeEndTime(null);
                setIsResizeOverlapping(false);
                return;
            }

            // For non-routines (tasks/events), proceed with immediate update
            // Temporarily update UI
            const newUpdatedTasks = [...updatedTasks];
            const taskIndex = newUpdatedTasks.findIndex(t => t.id === itemId);
            if (taskIndex !== -1) {
                newUpdatedTasks[taskIndex] = { ...resizingItem, endTime: newEndTime };
                setUpdatedTasks(newUpdatedTasks);
            }

            // Call BE API
            calendarRepository?.updateCalendarItem(
                itemId,
                {
                    ...resizingItem,
                    type: (resizingItem.type as string).toUpperCase(),
                    name: resizingItem.name,
                    calendarId: calendarId || 0,
                    timeSlot: {
                        startTime: resizingItem.startTime,
                        endTime: newEndTime,
                    },
                    ...getDetails(resizingItem),
                }
            ).subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        handleReload(true);
                        toast.success("Duration updated");
                    } else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || "Update failed",
                            description: res?.data,
                        });
                        handleReload(true);
                    }
                },
                error: (err: any) => {
                    const message = err?.response?.data?.msg || err?.response?.data?.message || "Update failed";
                    setAlertMessage({
                        type: "warning",
                        title: message,
                        description: err?.response?.data?.data,
                    });
                    handleReload(true);
                },
            });

            // Reset resize state
            setResizingItemId(null);
            setResizingOccurrenceKey(null);
            setResizePreviewEndTime(null);
            setOriginalResizeEndTime(null);
            setIsResizeOverlapping(false);
        },

        // Routine resize confirmation state (must be exported for views to access)
        showRoutineResizeConfirm,
        pendingRoutineResize,

        // Routine resize confirmation handlers
        onRoutineResizeConfirmUpdate: () => {
            if (!pendingRoutineResize || !calendarRepository) {
                setShowRoutineResizeConfirm(false);
                setPendingRoutineResize(null);
                return;
            }

            // For "All Current & Future", we need to calculate the new duration
            // The user resized an occurrence, so we need to find how much the duration changed
            // and apply that to the master routine's endTime
            const { itemId, newEndTime, originalStartTime } = pendingRoutineResize;
            const resizingItem = updatedTasks.find(t => t.id === itemId);
            if (!resizingItem) {
                setShowRoutineResizeConfirm(false);
                setPendingRoutineResize(null);
                return;
            }

            // Calculate the new duration from the occurrence's resize
            // originalStartTime is the occurrence's start (e.g., 2026-01-08T07:00:00Z)
            // newEndTime is the occurrence's new end after resize (e.g., 2026-01-08T08:00:00Z)
            const occurrenceStart = new Date(originalStartTime).getTime();
            const occurrenceNewEnd = new Date(newEndTime).getTime();
            const newDurationMs = occurrenceNewEnd - occurrenceStart;

            // Apply the new duration to the master routine's start time
            const masterStartMs = new Date(resizingItem.startTime || '').getTime();
            const newMasterEndTime = new Date(masterStartMs + newDurationMs).toISOString();

            // Calculate the new end time for the occurrence date
            // Use originalStartTime (occurrence date) + new duration
            const occurrenceNewEndTime = new Date(new Date(originalStartTime).getTime() + newDurationMs).toISOString();

            // Call updateCalendarItem API (All Current & Future)
            // Note: We must use the OCCURRENCE's date (originalStartTime) to match TaskEditor format
            // The backend will update the routine's time pattern based on the occurrence date provided
            calendarRepository.updateCalendarItem(
                itemId,
                {
                    ...resizingItem,
                    type: (resizingItem.type as string).toUpperCase(),
                    name: resizingItem.name,
                    calendarId: calendarId || 0,
                    // Use occurrence's date (originalStartTime) - this matches how form editing works
                    startTime: originalStartTime,
                    endTime: occurrenceNewEndTime,
                    // Also set timeSlot with occurrence times
                    timeSlot: {
                        startTime: originalStartTime,
                        endTime: occurrenceNewEndTime,
                    },
                    ...getDetails(resizingItem),
                }
            ).subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        handleReload(true);
                        toast.success("Routine duration updated for all occurrences");
                    } else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || "Update failed",
                            description: res?.data,
                        });
                        handleReload(true);
                    }
                    setShowRoutineResizeConfirm(false);
                    setPendingRoutineResize(null);
                },
                error: (err: any) => {
                    const message = err?.response?.data?.msg || err?.response?.data?.message || "Update failed";
                    setAlertMessage({
                        type: "warning",
                        title: message,
                        description: err?.response?.data?.data,
                    });
                    handleReload(true);
                    setShowRoutineResizeConfirm(false);
                    setPendingRoutineResize(null);
                },
            });
        },

        onRoutineResizeConfirmDetach: () => {
            if (!pendingRoutineResize || !calendarRepository) {
                setShowRoutineResizeConfirm(false);
                setPendingRoutineResize(null);
                return;
            }

            const { itemId, newEndTime, originalStartTime } = pendingRoutineResize;
            const resizingItem = updatedTasks.find(t => t.id === itemId);
            if (!resizingItem) {
                setShowRoutineResizeConfirm(false);
                setPendingRoutineResize(null);
                return;
            }

            // Build detach payload
            // For "This Occurrence Only", use the OCCURRENCE's times (not master routine's)
            // Calculate occurrence end time based on original duration of routine
            const masterStartMs = new Date(resizingItem.startTime || '').getTime();
            const masterEndMs = new Date(resizingItem.endTime || '').getTime();
            const originalDurationMs = masterEndMs - masterStartMs;

            // The occurrence's newEndTime was calculated during drag
            // originalStartTime is the occurrence's start time
            const newDetails = {
                calendarId: calendarId || 0,
                type: (resizingItem.type as string).toUpperCase(),
                name: resizingItem.name,
                note: resizingItem.note,
                // Top-level times for the new standalone item
                startTime: originalStartTime,
                endTime: newEndTime,
                // Also set timeSlot
                timeSlot: {
                    startTime: originalStartTime,  // Use occurrence's start time, not master's
                    endTime: newEndTime,           // Use the resized end time
                },
                color: resizingItem.color,
                ...getDetails(resizingItem),
            };

            // Call detachRoutineInstance API (This Occurrence Only)
            calendarRepository.detachRoutineInstance(
                itemId,
                {
                    exceptionDate: originalStartTime,
                    newDetails: newDetails,
                }
            ).subscribe({
                next: (res: any) => {
                    const success = res?.status;
                    if (success) {
                        handleReload(true);
                        toast.success("This occurrence updated");
                    } else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || "Update failed",
                            description: res?.data,
                        });
                        handleReload(true);
                    }
                    setShowRoutineResizeConfirm(false);
                    setPendingRoutineResize(null);
                },
                error: (err: any) => {
                    const message = err?.response?.data?.msg || err?.response?.data?.message || "Update failed";
                    setAlertMessage({
                        type: "warning",
                        title: message,
                        description: err?.response?.data?.data,
                    });
                    handleReload(true);
                    setShowRoutineResizeConfirm(false);
                    setPendingRoutineResize(null);
                },
            });
        },

        onRoutineResizeCancel: () => {
            setShowRoutineResizeConfirm(false);
            setPendingRoutineResize(null);
            handleReload(true);
        },
    };
};



