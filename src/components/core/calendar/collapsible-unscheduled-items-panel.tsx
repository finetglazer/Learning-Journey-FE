"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, uuid4 } from "@/lib/utils";
import { UnscheduledBigTask, UnscheduledMonthData, UnscheduledRoutine, UnscheduledTask } from "@/model/task";
import { useDraggable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import {
    ClipboardList,
    X
} from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { UnscheduledItemsForMonth } from "./unscheduled-items-for-month";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { AppContext, AppContextProps } from "@/hooks/app-context";

export interface CollapsibleUnscheduledPanelProps {
    position: { x: number, y: number };
    headerRef: RefObject<HTMLDivElement | null>;
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
    headerRef,
    onUnscheduledTaskTitleChange,
    handleRemoveUnscheduledSubTask,
    handleRemoveUnscheduledRoutine,
    setUnscheduledMonthData,
    draggingUnscheduledTaskId,
    draggingUnscheduledRoutineId,
    selectedTaskId,
    selectedRoutineId,
}: CollapsibleUnscheduledPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [bounds, setBounds] = useState({ minX: 0, minY: 0, maxX: window.innerWidth, maxY: window.innerHeight });
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'draggable-panel',
    });
    const PANEL_WIDTH = 350;
    const COLLAPSED_SIZE = 64;

    const {
        sidebarRef,
    } = useContext<CalendarContextInterface>(CalendarContext);

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

    const {
        calendarRepository,
    } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        if (!calendarRepository) {
            return;
        }
        // Get all unscheduled items, attach IDs for each unscheduled task and unscheduled routine
        const subscription = calendarRepository?.getUnscheduledItems()
            .subscribe({
                next: (res: any) => {
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
                error: (err: any) => {
                    console.log("Error occurs while fetching unscheduled items", err);
                }
            });

        return () => {
            subscription?.unsubscribe();
        }
    }, [calendarRepository]);

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

    const getBoundaryCoordinates = (headerRef: any, sidebarRef: any) => {
        let sidebarRightEdgeX = 0;
        let headerBottomEdgeY = 0;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (sidebarRef.current) {
            const rect = sidebarRef.current.getBoundingClientRect();
            sidebarRightEdgeX = rect.left + rect.width;
        }
        if (headerRef.current) {
            const rect = headerRef.current.getBoundingClientRect();
            headerBottomEdgeY = rect.top + rect.height;
        }

        return {
            minX: sidebarRightEdgeX,
            minY: headerBottomEdgeY,
            maxX: viewportWidth,
            maxY: viewportHeight,
        };
    };

    useEffect(() => {
        const calculateBounds = () => {
            const newBounds = getBoundaryCoordinates(headerRef, sidebarRef);
            setBounds(newBounds);
        };

        // Calculate initial bounds
        calculateBounds();

        // Recalculate on window resize
        window.addEventListener('resize', calculateBounds);
        return () => {
            window.removeEventListener('resize', calculateBounds);
        };
    }, [headerRef, sidebarRef]);

    const clampedPosition = useMemo(() => {
        const size = isCollapsed ? COLLAPSED_SIZE : PANEL_WIDTH;

        // Clamp X
        let newX = Math.max(position.x, bounds.minX);
        newX = Math.min(newX, bounds.maxX - size);

        // Clamp Y
        let newY = Math.max(position.y, bounds.minY);
        newY = Math.min(newY, bounds.maxY - size);

        return { x: newX, y: newY };
    }, [position, isCollapsed, bounds]);

    return (
        <div
            className="absolute"
            style={{ top: clampedPosition.y, left: clampedPosition.x, zIndex: 50 }}
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
                            className="flex justify-between items-center p-4 border-b cursor-grab active:cursor-grabbing bg-gray-50 rounded-t-lg"
                            {...listeners}
                            {...attributes}
                            ref={setNodeRef}
                        >
                            <h3 className="font-semibold text-lg text-gray-700">Unscheduled Items</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent drag start when clicking close
                                    setIsCollapsed(true);
                                }}
                                className="h-8 w-8 hover:bg-gray-200"
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