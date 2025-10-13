"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    ClipboardList,
    MinusCircle
} from "lucide-react";
import { useState } from "react";
import { UnscheduledTaskItem } from "./unscheduled-task-item";
import { UnscheduledBigTask, UnscheduledTask } from "@/model/task";

export interface CollapsibleUnscheduledPanelProps {
    position: { x: number, y: number };
    unscheduledBigTasks?: UnscheduledBigTask[];
    handleRemoveUnscheduledBigTask?: (bigTaskId: string) => void;
    handleRemoveUnscheduledSubTask?: (bigTaskId: string, subTaskId: string) => void;
};

export function CollapsibleUnscheduledPanel({
    unscheduledBigTasks,
    handleRemoveUnscheduledBigTask,
    handleRemoveUnscheduledSubTask,
    position,
}: CollapsibleUnscheduledPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRoutinesOpen, setIsRoutinesOpen] = useState(true);
    const [openTasks, setOpenTasks] = useState(Object.fromEntries(
        (unscheduledBigTasks || []).map(task => [task.id, false])
    ));
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: 'draggable-panel',
    });

    const dragStyle = transform ? {
        transform: CSS.Transform.toString(transform),
    } : undefined;

    const toggleBigTask = (bigTaskId: string) => {
        const newOpenTasks = { ...openTasks };
        newOpenTasks[bigTaskId] = !newOpenTasks[bigTaskId];
        setOpenTasks(newOpenTasks);
    };

    return (
        <div
            className="absolute"
            style={{ top: position.y, left: position.x, zIndex: 50 }}
        >
            <AnimatePresence>
                {isCollapsed ? (
                    <motion.div
                        ref={setNodeRef}
                        style={dragStyle}
                        key="icon" // A unique key is required for AnimatePresence
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            {...listeners}
                            {...attributes}
                            onClick={() => setIsCollapsed(false)}
                            className={cn("h-16 w-16 cursor-grab rounded-full bg-gray-700 border-4 border-none p-0 shadow-lg hover:bg-gray-600",
                                { "opacity-[0.4]": isDragging }
                            )}
                        >
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                <ClipboardList className="h-8 w-8 text-black" />
                            </div>
                        </Button>
                    </motion.div>
                ) : (
                    // 4. The Expanded View (Full Panel)
                    <motion.div
                        key="panel" // A unique key is also required here
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] bg-white shadow-lg rounded-lg p-4 font-sans"
                    >
                        {/* Main Header */}
                        <div
                            onClick={() => setIsCollapsed(true)}
                            className="flex items-center text-lg font-bold text-gray-800 mb-4 cursor-pointer"
                        >
                            <ChevronRight size={20} className="mr-2" />
                            The unscheduled items in {'<month>'}
                        </div>
                        {/* --- Routines Section --- */}
                        {/* <Collapsible open={isRoutinesOpen} onOpenChange={setIsRoutinesOpen} defaultOpen>
                            <CollapsibleTrigger className="flex items-center text-md font-semibold text-gray-700 w-full text-left mb-2">
                                The unscheduled routine check list
                                <ChevronDown
                                    size={16}
                                    className={cn("ml-auto transition-transform", { "-rotate-90": !isRoutinesOpen })}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                <ScrollArea className="h-40 rounded-md border p-2 mt-1">
                                    <div className="space-y-1">
                                        {routines.map((routine) => (
                                            <div
                                                key={routine.id}
                                                onClick={() => setSelectedItem(routine.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded-md cursor-pointer",
                                                    { "bg-gray-200": selectedItem === routine.id }
                                                )}
                                            >
                                                <span className="text-sm text-gray-600">{routine.title}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500">
                                                    <MinusCircle size={18} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible> */}

                        {/* --- Tasks Section */}
                        <Collapsible defaultOpen className="mt-6">
                            <CollapsibleTrigger className="flex items-center gap-5">
                                The unscheduled tasks check list
                                <ChevronDown
                                    size={16}
                                    className={cn("ml-auto transition-transform", { "-rotate-90": !isRoutinesOpen })}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                <ScrollArea className="h-60 rounded-md border p-2">
                                    <div className="space-y-1">
                                        {(unscheduledBigTasks || []).map((bigTask: UnscheduledBigTask) => (
                                            <Collapsible key={bigTask.id} open={openTasks[bigTask.id] ?? true} onOpenChange={() => toggleBigTask(bigTask.id)}>
                                                <div className="flex items-center">
                                                    <UnscheduledTaskItem
                                                        task={bigTask}
                                                        draggable={false}
                                                        onRemove={() => handleRemoveUnscheduledBigTask?.(bigTask.id)}
                                                    />
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <ChevronDown size={16} className={cn("transition-transform", { "-rotate-90": !(openTasks[bigTask.id] ?? true) })} />
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                </div>
                                                <CollapsibleContent className="pl-6 space-y-1 pt-1 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                    {(bigTask.subtasks || []).map((subtask: UnscheduledTask) => (
                                                        <UnscheduledTaskItem key={subtask.id} task={subtask} onRemove={() => handleRemoveUnscheduledSubTask?.(bigTask.id, subtask.id)} />
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}