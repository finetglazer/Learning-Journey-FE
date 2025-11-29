"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, uuid4 } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import { useDraggable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import {
    ClipboardList,
    X
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { UnscheduledItemsForMonth } from "./unscheduled-items-for-month";

export interface CollapsibleUnscheduledPanelProps {
    position: { x: number, y: number };
    unscheduledMonthData?: UnscheduledMonthData[];
    handleRemoveUnscheduledRoutine?: (unscheduledRoutineId: string | number) => void;
    handleRemoveUnscheduledSubTask?: (unscheduledSubtaskId: string | number, bigTaskId: number) => void;
    onUnscheduledTaskTitleChange?: (taskId: string, newTitle: string) => void;
    setUnscheduledMonthData?: Dispatch<SetStateAction<UnscheduledMonthData[]>>;
    draggingUnscheduledTaskId?: number | string | null;
    draggingUnscheduledRoutineId?: number | string | null;
    selectedTaskId?: number | string | null;
    selectedRoutineId?: number | string | null;
};

export function CollapsibleUnscheduledPanel({
    unscheduledMonthData,
    position,
    onUnscheduledTaskTitleChange,
    handleRemoveUnscheduledSubTask,
    handleRemoveUnscheduledRoutine,
    setUnscheduledMonthData,
    draggingUnscheduledTaskId,
    draggingUnscheduledRoutineId,
    selectedTaskId,
    selectedRoutineId,
}: CollapsibleUnscheduledPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'draggable-panel',
    });

    // --- 2. Memoize the expensive list rendering ---
    // This content will now only be recalculated if the data or handlers change,
    // not when the panel is being dragged (i.e., when `transform` changes).
    const isAllRoutinesRemoved = (unscheduledRoutines: UnscheduledRoutine[]) => {
        return !unscheduledRoutines.length;
    }
    const isAllBigTasksRemoved = (unscheduledBigTasks: UnscheduledBigTask[]) => {
        return !unscheduledBigTasks.length;
    }
    const memoizedPanelContent = useMemo(() => {
        return (unscheduledMonthData || []).filter(monthData => !isAllBigTasksRemoved(monthData?.unscheduledBigTasks || []) || !isAllRoutinesRemoved(monthData?.unscheduledRoutines || [])).map((monthData) => (
            <UnscheduledItemsForMonth
                key={monthData.month}
                monthData={monthData}
                handleRemoveUnscheduledSubTask={handleRemoveUnscheduledSubTask}
                handleRemoveUnscheduledRoutine={handleRemoveUnscheduledRoutine}
                onUnscheduledTaskTitleChange={onUnscheduledTaskTitleChange}
            />
        ));
    }, [
        unscheduledMonthData,
        handleRemoveUnscheduledRoutine,
        handleRemoveUnscheduledSubTask,
        onUnscheduledTaskTitleChange,
    ]);

    useEffect(() => {
        // Get all unscheduled items, attach IDs for each unscheduled task and unscheduled routine
        const subscription = calendarRepository.getUnscheduledItems()
            .subscribe({
                next: res => {
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
                            id: uuid4(),
                        })),
                        unscheduledTasks: undefined,    // Replaced by unscheduledBigTasks
                    }));

                    setUnscheduledMonthData?.(updatedUnscheduledMonthData);
                },
                error: err => {
                    console.log("Error occurs while fetching unscheduled items", err);
                }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    // Mark items that are being dragged or edited
    useEffect(() => {
        const updatedUnscheduledMonthData: UnscheduledMonthData[] = [...(unscheduledMonthData || [])].map((monthGroup: any) => ({
            ...monthGroup,
            unscheduledBigTasks: (monthGroup?.unscheduledBigTasks || []).map((unscheduledBigTask: UnscheduledBigTask) => ({
                ...unscheduledBigTask,
                suggestedSubtasks: (unscheduledBigTask?.suggestedSubtasks || []).map((subtask: UnscheduledTask) => ({
                    ...subtask,
                    type: 'unscheduled-task',
                    parentBigTaskId: unscheduledBigTask.bigTaskId,
                    isDraggedOrEdited: subtask?.id === draggingUnscheduledTaskId || subtask?.id === selectedTaskId
                }))
            })),
            unscheduledRoutines: (monthGroup?.unscheduledRoutines || []).map((unscheduledRoutine: UnscheduledRoutine) => ({
                ...unscheduledRoutine,
                type: 'unscheduled-routine',
                isDraggedOrEdited: unscheduledRoutine?.id === draggingUnscheduledRoutineId || unscheduledRoutine?.id === selectedRoutineId
            })),
        }));

        setUnscheduledMonthData?.(updatedUnscheduledMonthData);
    }, [
        draggingUnscheduledTaskId,
        draggingUnscheduledRoutineId,
        selectedTaskId,
        selectedRoutineId,
    ]);

    return (
        <div
            className="absolute"
            style={{ top: position.y, left: position.x, zIndex: 50 }}
        >
            <AnimatePresence>
                {isCollapsed ? (
                    <motion.div
                        key={"icon"}
                        initial={{ opacity: 0, scale: 0.5, zIndex: 99999 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            {...listeners}
                            {...attributes}
                            ref={setNodeRef}
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
                        // --- 4. Apply draggable props to the expanded panel as well ---
                        key={"panel"}
                        initial={{ opacity: 0, scale: 0.8, zIndex: 99999 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        // --- 5. Use flex-col and remove padding ---
                        className="w-[350px] bg-white shadow-lg rounded-lg font-sans flex flex-col"
                    >
                        <div
                            className="flex justify-between items-center p-4 border-b cursor-grab"
                            onClick={() => setIsCollapsed(true)}
                        >
                            <h3 className="font-semibold text-lg">Unscheduled Tasks</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(true)}
                                className="cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* --- 6. Add padding to ScrollArea and render memoized content --- */}
                        <ScrollArea className="h-[50vh] p-4">
                            {memoizedPanelContent}
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}