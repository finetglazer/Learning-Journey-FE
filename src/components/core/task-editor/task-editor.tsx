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
import { getDetails, isoStringToDate, isoToStandardTime, uuid4 } from "@/lib/utils"
import { Task } from "@/model/task"
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
    task: Task | Partial<Task>;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    setSelectedTaskId?: Dispatch<SetStateAction<string | number | null>>;
    setSelectedRoutineId?: Dispatch<SetStateAction<string | number | null>>;
    setEditingTask?: Dispatch<SetStateAction<Task | Partial<Task> | null>>;
    handleReload?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
    style?: CSSProperties;
};

export const TaskEditor = ({
    task,
    setAlertMessage,
    setSelectedTaskId,
    setSelectedRoutineId,
    setEditingTask,
    handleReload,
    onClose,
    style,
    onDelete,
}: TaskEditorProps) => {
    const [openStartTimePicker, setOpenStartTimePicker] = useState<boolean>(false);
    const [openEndTimePicker, setOpenEndTimePicker] = useState<boolean>(false);
    const getInitialModel = (): Task => {
        const newModel = new Task();
        return {
            ...newModel,
            ...(task as Partial<Task>),
            type: (task?.type || "task").toLowerCase(),
        };
    };
    const {
        model,
        updateModel,
        setModel,
    } = formService.useForm(
        Task,
        undefined,
        undefined,
        getInitialModel(),
    );

    useEffect(() => {
        setModel(getInitialModel());
    }, [task]);

    const handleAddSubtask = () => {
        updateModel(model?.type === "big-task" ? "subtasks" : "steps",
            model?.type === "big-task" ? [...(model?.subtasks || []), new Task] : [...(model?.steps || []), { id: uuid4() } as TaskStep]
        );
    };

    const onSave = () => {
        // Update case
        if (!isNil(model?.id)) {
            calendarRepository.updateCalendarItem(
                model.id as number,
                {
                    ...model,
                    timeSlot: {
                        startTime: model?.startTime,
                        endTime: model?.endTime,
                    },
                    ...getDetails(model),
                },
            ).subscribe({
                next: res => {
                    const success = res?.status;
                    if (success) {
                        toast.success(res?.msg);
                        setSelectedTaskId?.(null);
                        setSelectedRoutineId?.(null);
                        setEditingTask?.(null);
                        handleReload?.();
                        onClose?.();
                    }
                    else {
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
            type: (model?.type || "").toUpperCase(),
            name: model?.name,
            note: model?.note,
            timeSlot: {
                startTime: model?.startTime,
                endTime: model?.endTime,
            },
            color: model?.color,
            ...getDetails(model),
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
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                    setEditingTask?.(model);
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
                setEditingTask?.(model);
            },
        })
    };

    const onCancel = () => {
        setEditingTask?.(null);
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
                            <Button className="bg-green-300 hover:bg-green-400 text-green-800 rounded-full px-5 text-sm font-semibold cursor-pointer" onClick={onSave}>Save</Button>
                            <Button variant="ghost" className="text-gray-500 rounded-full px-5 text-sm cursor-pointer" onClick={onCancel}>Cancel</Button>
                            {/* Delete button only appears in UPDATE mode, not CREATE one */}
                            {model?.id && (
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
                        {model.id ? (
                            // --- EDIT MODE: Show static badge ---
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

                    {/* Status Dropdown Section */}
                    <div className="mb-4">
                        <TaskStatusDropdown
                            currentStatus={model?.status}
                            onStatusChange={(newStatus) => updateModel('status', newStatus)}
                        />
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Time Inputs Section */}
                    <div className="grid grid-cols-2">
                        <div className="relative flex items-center space-x-3 text-gray-500 px-2 cursor-pointer">
                            <Calendar size={20} onClick={() => setOpenStartTimePicker(!openStartTimePicker)} />
                            <Input
                                placeholder="Start hour"
                                className="border-none mt-0.25 focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                value={isoToStandardTime(model.startTime)}
                                readOnly
                            />
                            <DateTimePicker
                                isOpen={openStartTimePicker}
                                setIsOpen={setOpenStartTimePicker}
                                model={model}
                                updateModel={updateModel}
                                taskType={model?.type}
                                fieldName={"startTime"}
                                type={'date-time'}
                                enabledDate={isoStringToDate(model.startTime)}
                            />
                        </div>
                        <div className="relative flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200 cursor-pointer">
                            <Calendar size={20} onClick={() => setOpenEndTimePicker(!openEndTimePicker)} />
                            <Input
                                placeholder="End hour"
                                className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                value={isoToStandardTime(model.endTime)}
                                readOnly
                            />
                            {/* {hasTimeError && (
                                <ValidationError tooltip="End time must be after start time" />
                            )} */}
                            <DateTimePicker
                                isOpen={openEndTimePicker}
                                setIsOpen={setOpenEndTimePicker}
                                model={model}
                                updateModel={updateModel}
                                taskType={model?.type}
                                fieldName={"endTime"}
                                type={'date-time'}
                                enabledDate={isoStringToDate(model.endTime)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Sub-task || Steps List || Recurring patterns Section */}
                    {/* {isNotChooseRoutinePattern && (
                        <ValidationError tooltip="Please choose the routine pattern" />
                    )} */}
                    {model?.type !== 'event' && (
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
                    <div className="flex items-center space-x-3 text-gray-500 px-2">
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