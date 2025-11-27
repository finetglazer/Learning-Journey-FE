"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { UnscheduledRoutineItem } from "./unscheduled-routine-item";
import { UnscheduledTaskItem } from "./unscheduled-task-item";
import { MONTHS, UNSCHEDULED_ROUTINE_PREFIX, UNSCHEDULED_SUBTASK_PREFIX } from "@/const/consts";
import { isNil } from "lodash";

export interface UnscheduledItemsForMonthProps {
    monthData: UnscheduledMonthData;
    handleRemoveUnscheduledSubTask?: (unscheduledSubtaskId: string | number, bigTaskId: number) => void;
    handleRemoveUnscheduledRoutine?: (unscheduleRoutineId: string | number) => void;
    onUnscheduledTaskTitleChange?: (taskId: string, newTitle: string) => void;
}

export const UnscheduledItemsForMonth = ({
    monthData,
    onUnscheduledTaskTitleChange,
    handleRemoveUnscheduledRoutine,
    handleRemoveUnscheduledSubTask,
}: UnscheduledItemsForMonthProps) => {
    const unscheduledRoutines = monthData?.unscheduledRoutines;
    const unscheduledBigTasks = monthData?.unscheduledBigTasks;
    const monthName = !isNil(monthData?.month) ? MONTHS[monthData?.month - 1] : "Undefined";
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isRoutinesOpen, setIsRoutinesOpen] = useState(!!(unscheduledRoutines || []).length);
    const [isTasksOpen, setIsTasksOpen] = useState(!!(unscheduledBigTasks || []).length);
    const [openTasks, setOpenTasks] = useState(Object.fromEntries(
        (unscheduledBigTasks || []).map(task => [task?.bigTaskId, false])
    ));

    const toggleBigTask = (bigTaskId: number) => {
        const newOpenTasks = { ...openTasks };
        newOpenTasks[bigTaskId] = !newOpenTasks[bigTaskId];
        setOpenTasks(newOpenTasks);
    };

    useEffect(() => {
        setIsRoutinesOpen(!!(unscheduledRoutines || []).length);
        setIsTasksOpen(!!(unscheduledBigTasks || []).length);

        setOpenTasks(prevOpenTasks => {
            const newOpenTasks = { ...prevOpenTasks };
            (unscheduledBigTasks || []).forEach(task => {
                if (!(task?.bigTaskId in newOpenTasks)) {
                    newOpenTasks[task?.bigTaskId] = false;
                }
            });
            return newOpenTasks;
        });
    }, [
        (unscheduledRoutines || []).length,
        (unscheduledBigTasks || []).length,
    ]);

    return (
        <>
            <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen} className="border-b py-2">
                <CollapsibleTrigger className="flex items-center text-lg font-bold text-gray-800 w-full cursor-pointer">
                    The unscheduled items in {monthName}
                    <ChevronDown size={20} className={cn("ml-auto transition-transform cursor-pointer", { "-rotate-90": !isPanelOpen })} />
                </CollapsibleTrigger>
                {/* --- Routines Section --- */}
                <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <Collapsible open={isRoutinesOpen} onOpenChange={setIsRoutinesOpen} className="mt-4">
                        <CollapsibleTrigger className="flex items-center cursor-pointer text-md font-semibold text-gray-700 w-full text-left mb-2">
                            The unscheduled routine check list
                            <ChevronDown
                                size={16}
                                className={cn("ml-auto transition-transform cursor-pointer", { "-rotate-90": !isRoutinesOpen })}
                            />
                        </CollapsibleTrigger>

                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                            <ScrollArea className="h-40 rounded-md border p-2 mt-1">
                                <div className="space-y-1">
                                    {(unscheduledRoutines || []).filter(routine => !routine.isDraggedOrEdited).map((routine, index) => (
                                        <UnscheduledRoutineItem
                                            key={UNSCHEDULED_ROUTINE_PREFIX + index}
                                            routine={routine}
                                            onRemove={handleRemoveUnscheduledRoutine}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* --- Tasks Section --- */}
                    <Collapsible open={isTasksOpen} onOpenChange={setIsTasksOpen} className="mt-6">
                        <CollapsibleTrigger className="flex items-center text-md font-semibold text-gray-700 w-full text-left mb-2">
                            The unscheduled task check list
                            <ChevronDown
                                size={16}
                                className={cn("ml-auto transition-transform cursor-pointer", { "-rotate-90": !isTasksOpen })}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                            <ScrollArea className="h-60 rounded-md border p-2">
                                <div className="space-y-1">
                                    {(unscheduledBigTasks || []).map((bigTask: UnscheduledBigTask) => (
                                        <Collapsible key={bigTask?.bigTaskId} open={openTasks[bigTask?.bigTaskId] ?? true} onOpenChange={() => toggleBigTask(bigTask?.bigTaskId)}>
                                            <div className="flex items-center">
                                                <UnscheduledTaskItem
                                                    bigTask={bigTask}
                                                    onTitleChange={onUnscheduledTaskTitleChange}
                                                    draggable={false}
                                                />
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ChevronDown size={16} className={cn("transition-transform cursor-pointer", { "-rotate-90": !(openTasks[bigTask?.bigTaskId] ?? true) })} />
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                            <CollapsibleContent className="pl-6 space-y-1 pt-1 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                {(bigTask.suggestedSubtasks || []).filter(subtask => !subtask.isDraggedOrEdited).map((subtask: UnscheduledTask, index: number) => (
                                                    <UnscheduledTaskItem
                                                        key={UNSCHEDULED_SUBTASK_PREFIX + index}
                                                        task={subtask}
                                                        onRemove={() => handleRemoveUnscheduledSubTask?.(subtask?.id as number, bigTask?.bigTaskId)}
                                                        onTitleChange={onUnscheduledTaskTitleChange}
                                                    />
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CollapsibleContent>
                    </Collapsible>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}