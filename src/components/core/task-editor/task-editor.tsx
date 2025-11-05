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
import { getDetails, isoToHHMM, isoToStandardTime, toDayJs, uuid4 } from "@/lib/utils"
import { MonthPlanningBigTask, MonthPlanningEvent, Task, UnscheduledTask } from "@/model/task"
import { calendarRepository } from "@/repository/calendar-repository"
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
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertMessage } from "../alert-modal/alert-modal"
import { DateTimePicker } from "../date-time-picker/date-time-picker"
import { RecurringPatterns } from "./recurring-patterns"
import { SubTaskList } from "./sortable-subtask"
import { TaskStatusDropdown } from "./task-status-dropdown"
import { TaskType, TaskTypeDropdown, typeConfig } from "./task-type-dropdown"

export interface TaskEditorProps {
    task: Task | Partial<Task> | MonthPlanningEvent | UnscheduledTask;
    currentView?: string;
    currentTaskType?: string;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    setSelectedTaskId?: Dispatch<SetStateAction<string | number | null>>;
    setSelectedRoutineId?: Dispatch<SetStateAction<string | number | null>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    setEditingItem?: Dispatch<SetStateAction<MonthPlanningEvent | UnscheduledTask | null>>;
    handleReload?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
    style?: CSSProperties;
};

export const TaskEditor = ({
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

    useEffect(() => {
        setModel({ ...getInitialModel(), ...task } as any);
    }, [task]);

    const handleAddSubtask = () => {
        updateModel(model?.type === "big-task" ? "subtasks" : "steps",
            model?.type === "big-task" ? [...(model?.subtasks || []), new Task] : [...(model?.steps || []), { id: uuid4() } as TaskStep]
        );
    };
    // For currentView !== 'month-planning' or model is an instance of Task
    const onSaveEditingTask = () => {
        // Update case
        if (!isNil(model?.id)) {
            calendarRepository.updateCalendarItem(
                model.id as number,
                {
                    ...model,
                    timeSlot: {
                        startTime: (model as Task)?.startTime,
                        endTime: (model as Task)?.endTime,
                    },
                    ...getDetails(model as Task),
                },
            ).subscribe({
                next: res => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.msg || res?.message);
                        setSelectedTaskId?.(null);
                        setSelectedRoutineId?.(null);
                        setEditingTask?.(null);
                        handleReload?.();
                        onClose?.();
                    } else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.msg || res?.message,
                            description: res?.data
                        });
                    }
                },
                error: err => { },
            });
            return;
        }
        // Create case
        calendarRepository.createCalendarItem({
            calendarId: 2,
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
                    handleReload?.();
                    onClose?.();
                } else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                    setEditingTask?.(model as Task);
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
                setEditingTask?.(model as Task);
            },
        })
    };

    // For currentView === 'month-planning' && model != Task
    const onSaveEditingItem = () => {
        // Update if model?.id is not null
        if ((model as any)?.id) {
            // If model is MonthPlanningBigTask
            if (model?.estimatedStartDate) {
                calendarRepository.updateBigTask({
                    monthPlanId: localStorage.getItem("monthPlanId"),
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
                            handleReload?.();
                            onClose?.();
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
                        setEditingTask?.(model as Task);
                    },
                })
            }
            // Else
            else {
                calendarRepository.updateUnscheduledTask({
                    monthPlanId: localStorage.getItem("monthPlanId"),
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
                            handleReload?.();
                            onClose?.();
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
            }
        }
        // Else it is create case (create event, create big task, create unscheduled task)
        else {
            // If create event
            if (model?.specificDate) {
                calendarRepository.createMonthPlanningEvent({
                    monthPlanId: localStorage.getItem("monthPlanId"),
                }, {
                    calendarId: 2,
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
                            handleReload?.();
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
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
                return;
            }
            // If create big task
            if (model?.estimatedStartDate) {
                calendarRepository.createBigTask({
                    monthPlanId: localStorage.getItem("monthPlanId"),
                }, {
                    name: model?.name,
                    description: model?.note,
                    estimatedStartDate: toDayJs(model?.startTime as string).format("YYYY-MM-DD"),
                    estimatedEndDate: toDayJs(model?.endTime as string).format("YYYY-MM-DD"),
                    unscheduledTasks: model?.unscheduledTasks || [],
                }).subscribe({
                    next: res => {
                        const success = res?.status;
                        if (success) {
                            toast.success(res?.msg || res?.message);
                            setEditingItem?.(null);
                            setEditingTask?.(null);
                            handleReload?.();
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
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
                return;
            }
            // If create unscheduled task
            else {
                calendarRepository.createUnscheduledTask({
                    monthPlanId: localStorage.getItem("monthPlanId"),
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
                            handleReload?.();
                            onClose?.();
                        }
                        else {
                            setAlertMessage({
                                type: "warning",
                                title: res?.msg || res?.message,
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

    return (
        <TooltipProvider>
            <Card style={style} className="w-[380px] bg-[#F9FAFB] rounded-xl shadow-md font-sans p-4 absolute z-[10000]">
                <CardContent className="p-2">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4 gap-2">
                        <Input
                            placeholder="Task title"
                            className="truncate font-semibold text-[#1D2129] text-base border-none focus:ring-0 shadow-none placeholder:text-gray-400 bg-transparent"
                            onChange={(e) => updateModel("name", e.target.value)}
                            value={model?.name}
                        />
                        {/* {isEmptyTitle && (
                            <ValidationError tooltip="Title should not be empty" />
                        )} */}
                        <div className="flex items-center space-x-2">
                            <Button className="bg-green-300 hover:bg-green-400 text-green-800 rounded-full px-5 text-sm font-semibold cursor-pointer"
                                onClick={currentView !== 'month-planning' || (model?.specificDate && model?.id) ? onSaveEditingTask : onSaveEditingItem}
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
                                        className={`flex items-center cursor-default gap-2 rounded-md px-3 py-1 h-auto w-[100px] text-xs font-medium text-white ${color}`}
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

                    {/* Status Dropdown Section: Only show if current view is not MONTH-PLANNING MODE VIEW */}
                    {currentView !== 'month-planning' && (
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
                                    value={isoToStandardTime(model?.specificDate).substring(0, 2)}
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
                                        value={currentTaskType === 'big-task' ? isoToStandardTime(model.startTime).substring(0, 2) : isoToStandardTime(model.startTime)}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openStartTimePicker}
                                        setIsOpen={setOpenStartTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}
                                        fieldName={"startTime"}
                                        type={currentTaskType === 'big-task' ? 'date-only' : 'date-time'}
                                    />
                                </div>
                                <div className="relative flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200 cursor-pointer">
                                    <Calendar size={20} onClick={() => setOpenEndTimePicker(!openEndTimePicker)} />
                                    <Input
                                        placeholder="End hour"
                                        className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                        value={currentTaskType === 'big-task' ? isoToStandardTime(model.endTime).substring(0, 2) : isoToStandardTime(model.endTime)}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        isOpen={openEndTimePicker}
                                        setIsOpen={setOpenEndTimePicker}
                                        model={model}
                                        updateModel={updateModel}
                                        taskType={model?.type}  // Handle changing time of routines (scheduled)
                                        fieldName={"endTime"}
                                        type={currentTaskType === 'big-task' ? 'date-only' : 'date-time'}
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
                    {model?.type !== 'event' && currentView !== 'month-planning' && (
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
                    <div className="flex items-center space-x-3 text-black px-2">
                        <Pencil size={20} />
                        <Input
                            placeholder="Notes"
                            className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                            value={model?.note}
                            onChange={(e) => { updateModel("note", e.target.value) }}
                        />
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}