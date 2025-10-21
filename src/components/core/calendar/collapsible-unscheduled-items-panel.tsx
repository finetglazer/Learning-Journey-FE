"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MONTHS } from "@/const/consts";
import { cn } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledMonthData, UnscheduledTask } from "@/model/task";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import {
    ClipboardList
} from "lucide-react";
import { useState } from "react";
import { UnscheduledItemsForMonth } from "./unscheduled-items-for-month";

export interface CollapsibleUnscheduledPanelProps {
    position: { x: number, y: number };
    unscheduledMonthData?: UnscheduledMonthData[];
    handleRemoveUnscheduledBigTask?: (unscheduledBigTask: UnscheduledBigTask) => void;
    handleRemoveUnscheduledSubTask?: (unscheduledSubtask: UnscheduledTask) => void;
    onUnscheduledTaskTitleChange?: (taskId: string, newTitle: string) => void;
};

export function CollapsibleUnscheduledPanel({
    unscheduledMonthData,
    position,
    onUnscheduledTaskTitleChange,
    handleRemoveUnscheduledSubTask,
    handleRemoveUnscheduledBigTask,
}: CollapsibleUnscheduledPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: 'draggable-panel',
    });

    const dragStyle = transform ? {
        transform: CSS.Transform.toString(transform),
    } : undefined;

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
                        key={"icon"}
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
                        key={"panel"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] bg-white shadow-lg rounded-lg p-4 font-sans"
                    >
                        <ScrollArea className="h-[50vh]">
                            {(unscheduledMonthData || []).map((monthData) => (
                                <UnscheduledItemsForMonth
                                    monthName={MONTHS[monthData.monthNumber]}
                                    unscheduledRoutines={monthData.unscheduledRoutines}
                                    unscheduledBigTasks={monthData.unscheduledBigTasks}
                                    handleRemoveUnscheduledSubTask={handleRemoveUnscheduledSubTask}
                                    handleRemoveUnscheduledBigTask={handleRemoveUnscheduledBigTask}
                                    onUnscheduledTaskTitleChange={onUnscheduledTaskTitleChange}
                                />
                            ))}
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}