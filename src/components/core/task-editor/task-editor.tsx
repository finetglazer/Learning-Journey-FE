"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, dayJsToISOString, getDetails, isoToHHMM, isoToStandardTime, toDayJs, uuid4 } from "@/lib/utils"
import { MonthPlanningBigTask, MonthPlanningEvent, Task, UnscheduledTask } from "@/model/task"
import { formService } from "@/service/form-service"
import { isNil } from "lodash"
import {
    Calendar,
    ChevronDown,
    ListCheck,
    Pencil,
    Plus,
    Trash2
} from "lucide-react"
import { CSSProperties, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { AlertMessage } from "../alert-modal/alert-modal"
import { DateTimePicker } from "../date-time-picker/date-time-picker"
import { RecurringPatterns } from "./recurring-patterns"
import { SubTaskList } from "./sortable-subtask"
import { TaskStatusDropdown } from "./task-status-dropdown"
import { TaskType, TaskTypeDropdown, typeConfig } from "./task-type-dropdown"
import { AppContext, AppContextProps } from "@/hooks/app-context"
import { CalendarContext } from "../calendar/calendar-context";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface TaskEditorProps {
    open: boolean;
    task: Task | Partial<Task> | MonthPlanningEvent | UnscheduledTask;
    currentView?: string;
    currentTaskType?: string;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    setSelectedTaskId?: Dispatch<SetStateAction<string | number | null>>;
    setSelectedRoutineId?: Dispatch<SetStateAction<string | number | null>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    setEditingItem?: Dispatch<SetStateAction<MonthPlanningEvent | UnscheduledTask | null>>;
    handleReload?: (silent?: boolean) => void;
    onDelete?: () => void;
    onClose?: () => void;
    style?: CSSProperties;
};

export const TaskEditor = ({
    open,
    task,
    currentView,
    currentTaskType,
    setAlertMessage,
    setSelectedTaskId,
    setSelectedRoutineId,
    setEditingTask,
    handleReload,
    setEditingItem,
    onClose,
    style,
    onDelete,
}: TaskEditorProps) => {
    const [openStartTimePicker, setOpenStartTimePicker] = useState<boolean>(false);
    const [openEndTimePicker, setOpenEndTimePicker] = useState<boolean>(false);
    const [openSpecificDatePicker, setOpenSpecificDatePicker] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
    const [showDetachConfirm, setShowDetachConfirm] = useState<boolean>(false);
    const editorRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!open) return;

            // Check if click is inside the editor
            if (editorRef.current && editorRef.current.contains(event.target as Node)) {
                return;
            }

            // Check if click is inside a Popover/Portal (e.g. DatePicker, Dropdowns)
            // Radix UI popovers usually have data-slot="popover-content" or similar attributes
            const target = event.target as HTMLElement;
            const isInsidePopover = target.closest('[data-slot="popover-content"]');

            if (isInsidePopover) {
                return;
            }

            // Also check for DropdownMenu content (often has role="menu" or specific data attributes)
            const isInsideDropdown = target.closest('[role="menu"]') || target.closest('[data-radix-menu-content]');
            if (isInsideDropdown) {
                return;
            }

            onClose?.();
        };

        // Use mousedown to capture the event before click (often better for outside click detection)
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    const getInitialModel = (): Task | UnscheduledTask | MonthPlanningEvent => {
        return currentView === 'month-planning' ? (currentTaskType === 'big-task' ? new MonthPlanningBigTask : (currentTaskType === 'event' ? new MonthPlanningEvent : new UnscheduledTask)) : new Task;
    };
    const {
        model,
        updateModel,
        setModel,
    } = formService.useForm(
        currentView === 'month-planning' ? (currentTaskType === 'big-task' ? MonthPlanningBigTask : (currentTaskType === 'event' ? MonthPlanningEvent : UnscheduledTask)) : Task,
        undefined,
        undefined,
        { ...getInitialModel(), ...task } as any,
    );

    // ... existing context hooks ...
    const {
        calendarRepository,
        calendarId,
    } = useContext<AppContextProps>(AppContext);

    const {
        monthPlanId,
        currentDate,
    } = useContext(CalendarContext);

    // ... existing useEffect ...

    // ... handleAddSubtask ...

    // Re-declare needed imports/refs if not clean, but for replace_file_content block edit:
    // We are inserting logic at top of component.

    // ATTACH REF TO CARD

    // The previous code had:
    // return (
    //     <TooltipProvider>
    //         <Card id="task-editor-id" style={style} className={cn("w-[380px] bg-[#F9FAFB] opacity-0 pointer-events-auto rounded-xl shadow-md font-sans p-4 absolute z-[10000]", { "opacity-100": open }, { "pointer-events-none": !open })}>
    // Let's target the Return statement to add ref={editorRef}

    // Wait, replace_file_content is single contiguous block.
    // I need to split this into two edits or be very clever.
    // Edit 1: Add hooks.
    // Edit 2: Add ref to Card.

    // Actually, I can do it in one if I replace from the start of the component to the start of the return. 
    // BUT the component is huge.

    // Let's do it in 2 steps.
    // Step 1: Add hooks (useRef, useEffect) at the start of the component function.


    useEffect(() => {
        setModel({ ...getInitialModel(), ...task } as any);
    }, [task]);

    const executeUpdate = () => {
        console.log("executeUpdate called", { modelId: model?.id, repo: !!calendarRepository });
        if (!calendarRepository || !model?.id) {
            console.error("Missing repo or ID");
            return;
        }

        calendarRepository.updateCalendarItem(
            model.id as number,
            {
                ...model,
                status: model?.status || "INCOMPLETE",
                timeSlot: {
                    startTime: (model as Task)?.startTime,
                    endTime: (model as Task)?.endTime,
                },
                ...getDetails(model as Task),
            },
        ).subscribe({
            next: res => {
                console.log("update success", res);
                const success = res?.status;
                if (success) {
                    toast.success(res?.msg || res?.message);
                    setSelectedTaskId?.(null);
                    setSelectedRoutineId?.(null);
                    setEditingTask?.(null);
                    handleReload?.(true);
                    onClose?.();
                } else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.msg || res?.message,
                        description: res?.data
                    });
                }
                setIsLoading(false);
                setShowDetachConfirm(false);
            },
            error: err => {
                console.error("update error", err);
                setIsLoading(false);
                setShowDetachConfirm(false);
            },
        });
    };

    const executeDetach = () => {
        if (!calendarRepository || !model?.id) return;

        // payload for new item (same as create payload)
        const newDetails = {
            calendarId: calendarId || 0,
            type: ((model as Task)?.type || "").toUpperCase(),
            name: (model as Task)?.name,
            note: (model as Task)?.note,
            timeSlot: {
                startTime: (model as Task)?.startTime,
                endTime: (model as Task)?.endTime,
            },
            color: (model as Task)?.color,
            ...getDetails(model as Task),
        };

        calendarRepository.detachRoutineInstance(
            model.id as number,
            {
                exceptionDate: (task as Task).startTime, // Original start time of the occurrence
                newDetails: newDetails
            }
        ).subscribe({
            next: res => {
                const success = res?.status;
                if (success) {
                    toast.success(res?.msg || res?.message);
                    setSelectedTaskId?.(null);
                    setSelectedRoutineId?.(null);
                    setEditingTask?.(null);
                    handleReload?.(true);
                    onClose?.();
                } else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.msg || res?.message,
                        description: res?.data
                    });
                }
                setIsLoading(false);
                setShowDetachConfirm(false);
            },
            error: err => {
                setIsLoading(false);
                setShowDetachConfirm(false);
                toast.error("Failed to detach instance");
            },
        });
    };

    const handleAddSubtask = () => {
        updateModel(model?.type === "big-task" ? "subtasks" : "steps",
            model?.type === "big-task" ? [...(model?.subtasks || []), new Task] : [...(model?.steps || []), { id: uuid4() }]
        );
    };
    // Helper to check if routine is standalone (no recurring pattern)
    const isStandaloneRoutine = () => {
        const taskPattern = (task as Task)?.pattern;
        const hasPattern = taskPattern &&
            Array.isArray(taskPattern.daysOfWeek) &&
            taskPattern.daysOfWeek.length > 0;
        return !hasPattern;
    };

    // For currentView !== 'month-planning' or model is an instance of Task
    const onSaveEditingTask = () => {
        // Update case
        if (!calendarRepository) {
            return;
        }
        if (!isNil(model?.id)) {
            // If it is a routine, check if it's standalone or has recurring pattern
            if (model?.type === 'routine' || (model as Task)?.type === 'routine') {
                // If standalone routine (no pattern), directly update without confirmation
                if (isStandaloneRoutine()) {
                    executeUpdate();
                    return;
                }
                // Otherwise show confirmation dialog for recurring routine
                setShowDetachConfirm(true);
                setIsLoading(false);
                return;
            }
            executeUpdate();
            return;
        }
        // Create case
        calendarRepository?.createCalendarItem({
            calendarId: calendarId || 0,
            type: ((model as Task)?.type || "").toUpperCase(),
            name: (model as Task)?.name,
            note: (model as Task)?.note,
            timeSlot: {
                startTime: (model as Task)?.startTime,
                endTime: (model as Task)?.endTime,
            },
            color: (model as Task)?.color,
            ...getDetails(model as Task),
        }).subscribe({
            next: res => {
                const success = res?.status;
                if (success) {
                    toast.success(res?.message || res?.msg);
                    setSelectedTaskId?.(null);
                    setSelectedRoutineId?.(null);
                    setEditingTask?.(null);
                    handleReload?.(true);
                    onClose?.();
                } else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                    setEditingTask?.(model as Task);
                }
                setIsLoading(false);
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
                setEditingTask?.(model as Task);
                setIsLoading(false);
            },
        })
    };

    // For currentView === 'month-planning' && model != Task
    const onSaveEditingItem = () => {
        if (!calendarRepository) {
            return;
        }
        // Update if model?.id is not null
        if ((model as any)?.id) {
            // If model is MonthPlanningBigTask
            if (model?.estimatedStartDate) {
                calendarRepository?.updateBigTask({
                    monthPlanId: monthPlanId || 0,
                    bigTaskId: model?.id,
                }, {
                    name: model?.name,
                    note: model?.note,
                    estimatedStartDate: toDayJs(model?.startTime).format('YYYY-MM-DD'),
                    estimatedEndDate: toDayJs(model?.endTime).format('YYYY-MM-DD'),
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.message || res?.msg);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.(true);
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.message || res?.msg,
                                description: res?.data,
                            });
                        }
                        setIsLoading(false);
                    },
                    error: err => {
                        const errors = err?.response?.data?.data;
                        const message = err?.response?.data?.msg || err?.response?.data?.message;
                        setAlertMessage({
                            type: "warning",
                            title: message,
                            description: errors,
                        });
                        setEditingTask?.(model as Task);
                        setIsLoading(false);
                    },
                })
            }
            // Else
            else {
                calendarRepository?.updateUnscheduledTask({
                    monthPlanId: monthPlanId || 0,
                    bigTaskId: (model as any)?.bigTaskId,
                    unscheduledTaskId: (model as any)?.id,
                }, {
                    name: model?.name,
                    note: model?.note,
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.msg || res?.message);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.(true);
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                        }
                        setIsLoading(false);
                    },
                    error: err => { setIsLoading(false); }
                });
            }
        }
        // Else it is create case (create event, create big task, create unscheduled task)
        else {
            // If create event
            if (model?.specificDate) {
                calendarRepository?.createMonthPlanningEvent({
                    monthPlanId: monthPlanId || 0,
                }, {
                    calendarId: calendarId || 0,
                    name: model?.name,
                    note: model?.note,
                    specificDate: toDayJs(model?.specificDate).format("YYYY-MM-DD"),
                    startTime: isoToHHMM(model?.startTime),
                    endTime: isoToHHMM(model?.endTime),
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.msg || res?.message);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.(true);
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                        }
                        setIsLoading(false);
                    },
                    error: err => {
                        const errors = err?.response?.data?.data;
                        const message = err?.response?.data?.msg || err?.response?.data?.message;
                        setAlertMessage({
                            type: "warning",
                            title: message,
                            description: errors,
                        });
                        setIsLoading(false);
                    },
                });
                return;
            }
            // If create big task
            if (model?.estimatedStartDate) {
                calendarRepository?.createBigTask({
                    monthPlanId: monthPlanId || 0,
                }, {
                    name: model?.name,
                    description: model?.note,
                    estimatedStartDate: toDayJs(model?.startTime as string, 0).format("YYYY-MM-DD"),
                    estimatedEndDate: toDayJs(model?.endTime as string, 0).format("YYYY-MM-DD"),
                    unscheduledTasks: model?.unscheduledTasks || [],
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.msg || res?.message);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.(true);
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                        }
                        setIsLoading(false);
                    },
                    error: err => {
                        const errors = err?.response?.data?.data;
                        const message = err?.response?.data?.msg || err?.response?.data?.message;
                        setAlertMessage({
                            type: "warning",
                            title: message,
                            description: errors,
                        });
                        setIsLoading(false);
                    },
                });
                return;
            }
            // If create unscheduled task
            else {
                calendarRepository?.createUnscheduledTask({
                    monthPlanId: monthPlanId || 0,
                    bigTaskId: model?.parentBigTaskId,
                }, {
                    name: model?.name,
                    note: model?.note,
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.msg || res?.message);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.(true);
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
                                description: res?.data,
                            });
                        }
                        setIsLoading(false);
                    },
                    error: err => {
                        const errors = err?.response?.data?.data;
                        const message = err?.response?.data?.msg || err?.response?.data?.message;
                        setAlertMessage({
                            type: "warning",
                            title: message,
                            description: errors,
                        });
                        setIsLoading(false);
                    },
                });
                return;
            }
        }
    };

    const onCancel = () => {
        setEditingTask?.(null);
        setEditingItem?.(null);
        setSelectedTaskId?.(null);
        setSelectedRoutineId?.(null);
        onClose?.();
    };

    const handleSave = () => {
        if (isLoading) {
            return;
        }
        if (!model?.name || model?.name.trim() === "") {
            setIsTitleEmpty(true);
            return;
        }

        if (currentView === 'month-planning' && currentTaskType === 'event') {
            if (!model?.specificDate) {
                toast.warning("Date should not be empty!");
                return;
            }
        }

        setIsLoading(true);

        if (currentView !== 'month-planning' || (model?.specificDate && model?.id)) {
            onSaveEditingTask();
        } else {
            onSaveEditingItem();
        }
    };

    // Get nearest "rounded" times (for init)
    useEffect(() => {
        const startMinute = toDayJs(model?.startTime, 0).get('minute');
        const endMinute = toDayJs(model?.endTime, 0).get('minute');

        if (startMinute % 15 || endMinute % 15) {
            const updatedStartTime = toDayJs(model?.startTime).set('minute', (Math.floor(toDayJs(model?.startTime, 0).get('minute') / 15) * 15));
            const updatedEndTime = updatedStartTime.add(15, 'minutes');
            updateModel("startTime", dayJsToISOString(updatedStartTime, 0));
            updateModel("endTime", dayJsToISOString(updatedEndTime, 0));
        }
        // REMOVED: Potentially harmful date override that breaks cross-month tasks (e.g. Dec 29 - Jan 5)
        // if (currentView === 'month-planning' && !model?.id) {
        //     updateModel("startTime", dayJsToISOString(toDayJs(model?.startTime, 0).set('month', currentDate.get('month')).set('year', currentDate.get('year')), 0));
        //     updateModel("endTime", dayJsToISOString(toDayJs(model?.endTime, 0).set('month', currentDate.get('month')).set('year', currentDate.get('year')), 0));
        // }
    }, [
        model?.startTime,
        model?.endTime,
    ]);

    return (
        <TooltipProvider>
            <Card ref={editorRef} id="task-editor-id" style={style} className={cn("w-[380px] bg-[#F9FAFB] opacity-0 pointer-events-auto rounded-xl shadow-md font-sans p-4 absolute z-[10000]", { "opacity-100": open }, { "pointer-events-none": !open })}>
                <CardContent className="p-2">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4 gap-2">
                        <Input
                            placeholder={isTitleEmpty ? "Title is required!" : "Task title"}
                            className={cn(
                                "truncate font-semibold text-[#1D2129] text-base border-none focus:ring-0 shadow-none placeholder:text-gray-400 bg-transparent",
                                { "border border-red-500 rounded placeholder:text-red-400": isTitleEmpty }
                            )}
                            onChange={(e) => {
                                updateModel("name", e.target.value);
                                if (e.target.value.trim() !== "") {
                                    setIsTitleEmpty(false);
                                }
                            }}
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSave();
                                }
                            }}
                            value={model?.name || ""}
                        />
                        {/* {isEmptyTitle && (
                            <ValidationError tooltip="Title should not be empty" />
                        )} */}
                        <div className="flex items-center space-x-2">
                            <Button
                                className="!text-green-800 rounded-full px-5 text-sm font-semibold cursor-pointer hover:opacity-90"
                                style={{ backgroundColor: "#91FFD9" }}
                                onClick={handleSave}
                            // onSaveEditingTask would be invoked when it is not month-planning mode or update event (apply for update event only) in month-planning mode
                            >
                                Save
                            </Button>
                            <Button variant="ghost" className="text-gray-500 rounded-full px-5 text-sm cursor-pointer" onClick={onCancel}>Cancel</Button>

                            {(model?.id || (currentView === 'month-planning' && model?.bigTaskId)) && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 cursor-pointer hover:text-red-500 rounded-full"
                                            onClick={onDelete}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="z-[99999]">
                                        <p>Delete</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="mb-4">
                        {model.id || currentView === 'month-planning' ? (
                            // --- EDIT MODE OR MONTH-PLANNING MODE: Show static badge ---
                            (() => {
                                const typeKey =
                                    model.type && typeConfig[model?.type as TaskType]
                                        ? (model.type as TaskType)
                                        : "task";
                                const { label, Icon, color } = typeConfig[typeKey];
                                return (
                                    <div
                                        className={`flex items-center cursor-default gap-2 rounded-md px-3 py-1 h-auto w-[35%] text-xs font-medium text-white ${color}`}
                                        style={{
                                            backgroundColor: {
                                                "bg-teal-blue": "#33BFFF",
                                                "bg-pink-500": "#ec4899",
                                                "bg-green-400": "#4ade80",
                                                "bg-yellow-500": "#eab308"
                                            }[color] || color
                                        }}
                                    >
                                        <Icon size={14} />
                                        {label}
                                    </div>
                                );
                            })()
                        ) : (
                            // --- CREATE MODE: Show dropdown ---
                            <TaskTypeDropdown
                                currentType={model?.type as TaskType}
                                onTypeChange={(newType: any) => {
                                    updateModel("type", newType);
                                    if (newType === "routine") {
                                        setModel({
                                            ...model,
                                            type: "routine",
                                            pattern: {
                                                daysOfWeek: ['MONDAY'], // Default pattern
                                            }
                                        });
                                    }
                                }}
                            />
                        )}
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Status Dropdown Section: Only show for tasks (not routines or events) */}
                    {(currentView !== 'month-planning') && model?.type !== 'routine' && model?.type !== 'event' && (
                        <>
                            <div className="mb-4">
                                <TaskStatusDropdown
                                    currentStatus={model?.status}
                                    onStatusChange={(newStatus) => updateModel('status', newStatus)}
                                />
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>
                        </>
                    )}

                    {/* Time Inputs Section */}
                    {/* Create new event in MONTH-PLANNING MODE */}
                    {currentView === 'month-planning' && currentTaskType === 'event' && !model?.id && (
                        <>
                            <div className="relative flex items-center space-x-3 text-gray-500 px-2 cursor-pointer">
                                <Calendar size={20} onClick={() => setOpenSpecificDatePicker(!openSpecificDatePicker)} />
                                <Input
                                    placeholder="Start hour"
                                    className="border-none mt-0.25 focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                    value={isoToStandardTime(model?.specificDate).substring(0, 5)}
                                    readOnly
                                />
                                <DateTimePicker
                                    isOpen={openSpecificDatePicker}
                                    setIsOpen={setOpenSpecificDatePicker}
                                    model={model}
                                    updateModel={updateModel}
                                    taskType={model?.type}  // Handle changing time of routines (scheduled)
                                    fieldName={"specificDate"}
                                    type={'date-only'}
                                />
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            <div className="grid grid-cols-2">
                                <div className="relative flex items-center space-x-3 text-gray-500 px-2 cursor-pointer">
                                    <Calendar size={20} onClick={() => setOpenStartTimePicker(!openStartTimePicker)} />
                                    <Input
                                        placeholder="Start hour"
                                        className="border-none mt-0.25 focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                        value={isoToHHMM(model?.startTime)}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openStartTimePicker}
                                        setIsOpen={setOpenStartTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}  // Handle changing time of routines (scheduled)
                                        fieldName={"startTime"}
                                        type={'time-only'}
                                    />
                                </div>
                                <div className="relative flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200 cursor-pointer">
                                    <Calendar size={20} onClick={() => setOpenEndTimePicker(!openEndTimePicker)} />
                                    <Input
                                        placeholder="End hour"
                                        className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                        value={isoToHHMM(model?.endTime)}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openEndTimePicker}
                                        setIsOpen={setOpenEndTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}  // Handle changing time of routines (scheduled)
                                        fieldName={"endTime"}
                                        type={'time-only'}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>
                        </>
                    )}
                    {(currentView === 'month-planning' && (['task', 'event'].includes(currentTaskType || ""))) && !(model?.id && currentTaskType === 'event') ? null : (
                        <>
                            <div className="grid grid-cols-2">
                                <div className="relative flex items-center space-x-3 text-gray-500 px-2 cursor-pointer">
                                    <Calendar size={20} onClick={() => setOpenStartTimePicker(!openStartTimePicker)} />
                                    <Input
                                        placeholder="Start hour"
                                        className="border-none mt-0.25 focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                        value={
                                            model.type === 'routine'
                                                ? isoToHHMM(model.startTime)
                                                : (currentTaskType === 'big-task' ? isoToStandardTime(model.startTime).substring(0, 5) : isoToStandardTime(model.startTime))
                                        }
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openStartTimePicker}
                                        setIsOpen={setOpenStartTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}
                                        fieldName={"startTime"}
                                        type={currentTaskType === 'big-task' ? 'date-only' : (model.type === 'routine' ? 'time-only' : 'date-time')}
                                    />
                                </div>
                                <div className="relative flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200 cursor-pointer">
                                    <Calendar size={20} onClick={() => setOpenEndTimePicker(!openEndTimePicker)} />
                                    <Input
                                        placeholder="End hour"
                                        className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                        value={
                                            model.type === 'routine'
                                                ? isoToHHMM(model.endTime)
                                                : (currentTaskType === 'big-task' ? isoToStandardTime(model.endTime).substring(0, 5) : isoToStandardTime(model.endTime))
                                        }
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openEndTimePicker}
                                        setIsOpen={setOpenEndTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}  // Handle changing time of routines (scheduled)
                                        fieldName={"endTime"}
                                        type={currentTaskType === 'big-task' ? 'date-only' : (model.type === 'routine' ? 'time-only' : 'date-time')}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>
                        </>
                    )}

                    {/* Sub-task || Steps List || Recurring patterns Section */}
                    {/* {isNotChooseRoutinePattern && (
                        <ValidationError tooltip="Please choose the routine pattern" />
                    )} */}
                    {/* Hide this section ONLY for editing standalone routines (has id and no pattern) */}
                    {model?.type !== 'event' && currentView !== 'month-planning' && !(model?.id && model?.type === 'routine' && isStandaloneRoutine()) && (
                        <>
                            <Collapsible defaultOpen className="px-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <ListCheck className="h-4 w-4 text-gray-600" />
                                        <CollapsibleTrigger asChild>
                                            <div className="flex items-center cursor-pointer mt-0.5">
                                                <Label htmlFor="subtask-toggle" className="text-gray-700 cursor-pointer text-sm">
                                                    {(model?.type === "routine" ? "Routine patterns" : "Steps")}
                                                </Label>
                                                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                                            </div>
                                        </CollapsibleTrigger>
                                    </div>

                                    <Button variant="ghost" size="icon" onClick={handleAddSubtask}>
                                        <Plus className="h-4 w-4 text-gray-600" />
                                    </Button>
                                </div>
                                <CollapsibleContent>
                                    <ScrollArea className="mt-3 ml-2 h-30">
                                        {model.type === 'routine' ? (
                                            <RecurringPatterns
                                                selectedPatterns={model.pattern?.daysOfWeek || []}
                                                onPatternChange={(patterns) => setModel({
                                                    ...model,
                                                    pattern: {
                                                        daysOfWeek: patterns
                                                    }
                                                })}
                                            />
                                        ) : (
                                            <SubTaskList
                                                subtasks={(model?.type === "big-task" ? model?.subtasks : model?.steps) || []}
                                                onSubtasksChange={(newList) => updateModel(model?.type === "big-task" ? "subtasks" : "steps", newList)}
                                                fieldName={model?.type === "big-task" ? "subtasks" : "steps"}
                                                model={model}
                                            />
                                        )}
                                    </ScrollArea>
                                </CollapsibleContent>
                            </Collapsible>

                            <div className="border-t border-gray-200 my-4"></div>
                        </>
                    )}

                    {/* Notes Section */}
                    {currentView !== 'month-planning' && (
                        <div className="flex items-center space-x-3 text-black px-2">
                            <Pencil size={20} />
                            <Input
                                placeholder="Notes"
                                className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                value={model?.note}
                                onChange={(e) => { updateModel("note", e.target.value) }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            <AlertDialog open={showDetachConfirm} onOpenChange={setShowDetachConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit Routine</AlertDialogTitle>
                        <AlertDialogDescription>
                            This is a recurring routine. Do you want to save changes for this occurrence only or for all occurrences in the series?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent focus loss
                                e.stopPropagation();
                                console.log("All Current & Future mouse down");
                                executeUpdate();
                            }}
                            className="bg-[#33BFFF] hover:bg-[#33BFFF]/90 text-white border-none"
                        >
                            All Current & Future
                        </Button>
                        <Button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("This Occurrence Only mouse down");
                                executeDetach();
                            }}
                            className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-white border-none"
                        >
                            This Occurrence Only
                        </Button>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>

    )
}