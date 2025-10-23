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
import { COLLIDING_WITH_SLEEP_TIME_WARNING, NEW_ROUTINE_ID_PREFIX, OVERLAPPING_TIME_WARNING, SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING } from "@/const/consts"
import { dayJsToISOString, isCollidingWithSleepTime, isoStringToDate, isoToHHMM, isoToStandardTime, overlappingTasksExists, reId, uuid4 } from "@/lib/utils"
import { Task, TaskStep } from "@/model/task"
import { formService } from "@/service/form-service"
import {
    Calendar,
    ChevronDown,
    ListCheck,
    Pencil,
    Plus,
    Trash2
} from "lucide-react"
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from "react"
import { AlertMessage } from "../alert-modal/alert-modal"
import { DateTimePicker } from "../date-time-picker/date-time-picker"
import { RecurringPatterns } from "./recurring-patterns"
import { SubTaskList } from "./sortable-subtask"
import { TaskStatusDropdown } from "./task-status-dropdown"
import { TaskTypeDropdown } from "./task-type-dropdown"
import { ValidationError } from "./validation-error"
import dayjs from "dayjs"

export interface TaskEditorProps {
    task: Task;
    updatedTasks: Task[];
    setUpdatedTasks: Dispatch<SetStateAction<Task[]>>;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    sleepStartTime?: string;
    sleepEndTime?: string;
    onDelete?: () => void;
    isOutBigTaskTimeRange?: (task: Task) => boolean | "" | undefined;
    onClose?: () => void;
    style?: CSSProperties;
};

export const TaskEditor = ({
    task,
    updatedTasks,
    setUpdatedTasks,
    setAlertMessage,
    onClose,
    style,
    sleepStartTime,
    sleepEndTime,
    isOutBigTaskTimeRange,
    onDelete,
}: TaskEditorProps) => {
    const [openStartTimePicker, setOpenStartTimePicker] = useState<boolean>(false);
    const [openEndTimePicker, setOpenEndTimePicker] = useState<boolean>(false);
    const [isEmptyTitle, setIsEmptyTitle] = useState<boolean>(false);
    const [isNotChooseRoutinePattern, setIsNotChooseRoutinePattern] = useState<boolean>(false);
    const {
        model,
        updateModel,
        setModel,
    } = formService.useForm(
        Task,
        undefined,
        undefined,
        task,
    );

    const getDateTimePickerType = () => {
        switch (model?.type) {
            case "task":
            case "event":
            case "routine":
                return "time-only";
            case "big-task":
                return "date-only";
            default:
                break;
        }
    };

    const hasTimeError = model.startTime > model.endTime;

    const handleAddSubtask = () => {
        updateModel(model?.type === "big-task" ? "subtasks" : "steps",
            model?.type === "big-task" ? [...(model?.subtasks || []), new Task] : [...(model?.steps || []), { id: uuid4() } as TaskStep]
        );
    };

    const onSave = () => {
        let cloneUpdatedTasks = [...updatedTasks];
        cloneUpdatedTasks = cloneUpdatedTasks.filter(updatedTask => updatedTask.id !== model.id);

        if (!model?.title) {
            setIsEmptyTitle(true);
            return;
        }
        setIsEmptyTitle(false);

        if (hasTimeError) {
            return;
        }

        if (sleepStartTime && sleepEndTime && isCollidingWithSleepTime(model, sleepStartTime, sleepEndTime)) {
            setAlertMessage(COLLIDING_WITH_SLEEP_TIME_WARNING);
            return;
        }

        if (!(model?.routinePatterns || []).length && model?.type === "routine") {
            setIsNotChooseRoutinePattern(true);
            return;
        }
        setIsNotChooseRoutinePattern(false);

        if (model?.type === "task" && isOutBigTaskTimeRange?.(model)) {
            setAlertMessage({
                ...SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING,
                proceedAnyway: () => {
                    setUpdatedTasks(reId(cloneUpdatedTasks));
                    onClose?.();
                },
            });
            return;
        }

        if (overlappingTasksExists(model, cloneUpdatedTasks)) {
            setAlertMessage(OVERLAPPING_TIME_WARNING);
            return;
        }

        cloneUpdatedTasks.push(model);

        if (model?.type === "routine") {
            // Remove all old routines
            let newRoutineId = task?.routineId || "";
            let t: Task[] = [];
            let isOverlapping = false;
            cloneUpdatedTasks = cloneUpdatedTasks.filter(updatedTask => updatedTask?.type !== "routine" || updatedTask?.routineId !== task?.routineId);
            const curDay = (dayjs().get("day") + 6) % 7;
            for (const routinePattern of (model?.routinePatterns || [])) {
                if (routinePattern >= curDay) {
                    const dayDiff = routinePattern - curDay;
                    const taskDay = dayjs().add(dayDiff, 'day');
                    const startHour = Number((model?.routineStartHour || "").split(":")[0]);
                    const endHour = Number((model?.routineEndHour || "").split(":")[0]);
                    const startMinute = Number((model?.routineStartHour || "").split(":")[1]);
                    const endMinute = Number((model?.routineEndHour || "").split(":")[1]);
                    const startTime = dayJsToISOString(taskDay.hour(startHour).minute(startMinute).second(0));
                    const endTime = dayJsToISOString(taskDay.hour(endHour).minute(endMinute).second(0));
                    if (!newRoutineId) {
                        newRoutineId = NEW_ROUTINE_ID_PREFIX.concat(uuid4());
                    }
                    const newTask: Task = {
                        ...model,
                        id: startTime,
                        routineId: newRoutineId,
                        startTime,
                        endTime,
                    };

                    if (overlappingTasksExists(newTask, cloneUpdatedTasks)) {
                        isOverlapping = true;
                        break;
                    }

                    t.push(newTask);
                }
            };
            if (isOverlapping) {
                
                setAlertMessage(OVERLAPPING_TIME_WARNING);
            }
            else {
                t.forEach(item => cloneUpdatedTasks.push(item));
            }
        }
        setUpdatedTasks(reId(cloneUpdatedTasks));
        onClose?.();
    };

    const onCancel = () => {
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
                            onChange={(e) => updateModel("title", e.target.value)}
                            value={model?.title}
                        />
                        {isEmptyTitle && (
                            <ValidationError tooltip="Title should not be empty" />
                        )}
                        <div className="flex items-center space-x-2">
                            <Button className="bg-green-300 hover:bg-green-400 text-green-800 rounded-full px-5 text-sm font-semibold cursor-pointer" onClick={onSave}>Save</Button>
                            <Button variant="ghost" className="text-gray-500 rounded-full px-5 text-sm cursor-pointer" onClick={onCancel}>Cancel</Button>
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
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="mb-4">
                        <TaskTypeDropdown
                            currentType={model?.type}
                            onTypeChange={(newType: any) => {
                                updateModel('type', newType);
                                if (newType === 'routine') {
                                    setModel({
                                        ...model,
                                        type: "routine",
                                        routineStartHour: isoToHHMM(model.startTime),
                                        routineEndHour: isoToHHMM(model.endTime),
                                    })
                                }
                            }}
                        />
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
                                value={model?.type !== "big-task" ? isoToHHMM(model.startTime) : isoToStandardTime(model.startTime)}
                                readOnly
                            />
                            <DateTimePicker
                                isOpen={openStartTimePicker}
                                setIsOpen={setOpenStartTimePicker}
                                model={model}
                                updateModel={updateModel}
                                taskType={model?.type}
                                fieldName={"startTime"}
                                type={getDateTimePickerType()}
                                enabledDate={model?.type !== "routine" ? undefined : isoStringToDate(model.startTime)}
                            />
                        </div>
                        <div className="relative flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200 cursor-pointer">
                            <Calendar size={20} onClick={() => setOpenEndTimePicker(!openEndTimePicker)} />
                            <Input
                                placeholder="End hour"
                                className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0"
                                value={model?.type !== "big-task" ? isoToHHMM(model.endTime) : isoToStandardTime(model.endTime)}
                                readOnly
                            />
                            {hasTimeError && (
                                <ValidationError tooltip="End time must be after start time" />
                            )}
                            <DateTimePicker
                                isOpen={openEndTimePicker}
                                setIsOpen={setOpenEndTimePicker}
                                model={model}                                
                                updateModel={updateModel}
                                taskType={model?.type}
                                fieldName={"endTime"}
                                type={getDateTimePickerType()}
                                enabledDate={model?.type !== "routine" ? undefined : isoStringToDate(model.startTime)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Sub-task || Steps List || Recurring patterns Section */}
                    {isNotChooseRoutinePattern && (
                        <ValidationError tooltip="Please choose the routine pattern" />
                    )}
                    {model?.type !== 'event' && (
                        <>
                            <Collapsible defaultOpen className="px-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <ListCheck className="h-4 w-4 text-gray-600" />
                                        <CollapsibleTrigger asChild>
                                            <div className="flex items-center cursor-pointer mt-0.5">
                                                <Label htmlFor="subtask-toggle" className="text-gray-700 cursor-pointer text-sm">
                                                    {model?.type === "big-task" ? "Sub task list" : (model?.type === "routine" ? "Routine patterns" : "Steps")}
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
                                                selectedPatterns={model.routinePatterns || []}
                                                onPatternChange={(patterns) => updateModel('routinePatterns', patterns)}
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
                            value={model?.description}
                            onChange={(e) => { updateModel("description", e.target.value) }}
                        />
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}