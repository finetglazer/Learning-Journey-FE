"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledMonthData, UnscheduledTask } from "@/model/task";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { UnscheduledRoutineItem } from "./unscheduled-routine-item";
import { UnscheduledTaskItem } from "./unscheduled-task-item";

export interface UnscheduledItemsForMonthProps {
    monthData: UnscheduledMonthData;
    handleRemoveUnscheduledSubTask?: (unscheduledSubtask: UnscheduledTask) => void;
    handleRemoveUnscheduledBigTask?: (unscheduledBigTask: UnscheduledBigTask) => void;
    onUnscheduledTaskTitleChange?: (taskId: string, newTitle: string) => void;
}

export const UnscheduledItemsForMonth = ({
    monthData,
    onUnscheduledTaskTitleChange,
    handleRemoveUnscheduledBigTask,
    handleRemoveUnscheduledSubTask,
}: UnscheduledItemsForMonthProps) => {
    const unscheduledRoutines = monthData?.unscheduledRoutines;
    const unscheduledBigTasks = monthData?.unscheduledBigTasks;
    const monthName = monthData?.monthNumber;
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isRoutinesOpen, setIsRoutinesOpen] = useState((unscheduledRoutines || []).some(routine => routine.active));
    const [isTasksOpen, setIsTasksOpen] = useState((unscheduledBigTasks || []).some(bigTask => bigTask.active));
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [openTasks, setOpenTasks] = useState(Object.fromEntries(
        (unscheduledBigTasks || []).map(task => [task.id, false])
    ));

    const toggleBigTask = (bigTaskId: string) => {
        const newOpenTasks = { ...openTasks };
        newOpenTasks[bigTaskId] = !newOpenTasks[bigTaskId];
        setOpenTasks(newOpenTasks);
    };

    useEffect(() => {
        setIsRoutinesOpen((unscheduledRoutines || []).some(routine => routine.active));
        setIsTasksOpen((unscheduledBigTasks || []).some(bigTask => bigTask.active));

        setOpenTasks(prevOpenTasks => {
            const newOpenTasks = { ...prevOpenTasks };
            (unscheduledBigTasks || []).forEach(task => {
                if (!(task.id in newOpenTasks)) {
                    newOpenTasks[task.id] = false;
                }
            });
            return newOpenTasks;
        });
    }, [
        (unscheduledRoutines || []).some(routine => routine.active),
        (unscheduledBigTasks || []).some(bigTask => bigTask.active),
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
                                    {(unscheduledRoutines || []).filter(routine => routine.active).map((routine) => (
                                        <UnscheduledRoutineItem
                                            key={routine.id}
                                            routine={routine}
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
                                    {(unscheduledBigTasks || []).filter(unscheduledBigTask => unscheduledBigTask.active).map((bigTask: UnscheduledBigTask) => (
                                        <Collapsible key={bigTask.id} open={openTasks[bigTask.id] ?? true} onOpenChange={() => toggleBigTask(bigTask.id)}>
                                            <div className="flex items-center">
                                                <UnscheduledTaskItem
                                                    task={bigTask}
                                                    onTitleChange={onUnscheduledTaskTitleChange}
                                                    draggable={false}
                                                    onRemove={() => handleRemoveUnscheduledBigTask?.(bigTask)}
                                                />
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ChevronDown size={16} className={cn("transition-transform cursor-pointer", { "-rotate-90": !(openTasks[bigTask.id] ?? true) })} />
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                            <CollapsibleContent className="pl-6 space-y-1 pt-1 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                {(bigTask.subtasks || []).filter(subtask => subtask.active).map((subtask: UnscheduledTask) => (
                                                    <UnscheduledTaskItem
                                                        key={subtask.id}
                                                        task={subtask}
                                                        onRemove={() => handleRemoveUnscheduledSubTask?.(subtask)}
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