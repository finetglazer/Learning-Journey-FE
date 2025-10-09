"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    ChevronDown,
    MinusCircle,
    GripVertical,
    ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
const routines = [{ id: "r1", title: "Routine 1" }];
const tasks = [
    {
        id: "t1",
        title: "Name big task 1",
        subtasks: [{ id: "st1", title: "Name task 1" }],
    },
];

export function CollapsibleUnscheduledPanel() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isRoutinesOpen, setIsRoutinesOpen] = useState(true);
    const [isTasksOpen, setIsTasksOpen] = useState(true);
    const [openTasks, setOpenTasks] = useState<{ [key: string]: boolean }>({ t1: true, t2: true });

    const toggleTask = (taskId: string) => {
        setOpenTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    return (
        <AnimatePresence>
            {isCollapsed ? (
                <motion.div
                    key="icon" // A unique key is required for AnimatePresence
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        onClick={() => setIsCollapsed(false)}
                        className="h-16 w-16 rounded-full bg-gray-700 border-4 border-white p-0 shadow-lg hover:bg-gray-600"
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
                    <Collapsible open={isRoutinesOpen} onOpenChange={setIsRoutinesOpen} defaultOpen>
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
                    </Collapsible>

                    {/* --- Tasks Section (Now with smooth animation) --- */}
                        <Collapsible open={isTasksOpen} onOpenChange={setIsTasksOpen} defaultOpen className="mt-6">
                        <CollapsibleTrigger className="flex items-center text-md font-semibold text-gray-700 w-full text-left mb-2" >
                            The unscheduled task check list
                            <ChevronDown
                                size={16}
                                className={cn("ml-auto transition-transform", { "-rotate-90": !isTasksOpen })}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                            <ScrollArea className="h-60 rounded-md border p-2">
                                <div className="space-y-1">
                                    {tasks.map((task) => (
                                        <Collapsible key={task.id} open={openTasks[task.id]} onOpenChange={() => toggleTask(task.id)}>
                                            <div className="flex items-center p-2">
                                                <GripVertical size={18} className="text-gray-400" />
                                                <CollapsibleTrigger className="flex items-center text-sm font-semibold text-gray-800 ml-1">
                                                    {task.title}
                                                    <ChevronDown
                                                        size={16}
                                                        className={cn("ml-2 transition-transform", { "-rotate-90": !openTasks[task.id] })}
                                                    />
                                                </CollapsibleTrigger>
                                            </div>
                                            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                <div className="pl-6 space-y-1">
                                                    {task.subtasks.map((subtask) => (
                                                        <div
                                                            key={subtask.id}
                                                            onClick={() => setSelectedItem(subtask.id)}
                                                            className={cn(
                                                                "flex items-center justify-between p-2 rounded-md cursor-pointer",
                                                                { "bg-blue-100": selectedItem === subtask.id }
                                                            )}
                                                        >
                                                            <span className="text-sm text-gray-600">{subtask.title}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500">
                                                                <MinusCircle size={18} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
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
    );
}