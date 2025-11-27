"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import {
    Users,
    X
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { BufferList } from "./buffer-list";

export interface CollapsibleUnscheduledBufferListPanelProps { };

export function CollapsibleUnscheduledBufferListPanel({
}: CollapsibleUnscheduledBufferListPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'draggable-panel-buffer-list',
    });

    const {
        projectGroups,
        panelBufferListPosition: position,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const memoizedPanelContent = useMemo(() => {
        return (
            <BufferList
                showAllTasks={showAllTasks}
            />
        )
    }, [
        projectGroups,
        showAllTasks,
    ]);

    return (
        <div
            className="absolute"
            style={{ top: position.y, left: position.x, zIndex: 50 }}
        >
            <AnimatePresence>
                {isCollapsed ? (
                    // 3. The Collapsed Icon Button
                    <motion.div
                        key={"icon"}
                        initial={{ opacity: 0, scale: 0.5 }}
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
                            {/* This matches the visual style in the image */}
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-300">
                                <Users className="h-8 w-8 text-black" />
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
                        className="w-[350px] bg-white shadow-lg rounded-lg font-sans flex flex-col"
                    >
                        {/* --- Header Section --- */}
                        <div className="p-4 border-b border-gray-100 flex flex-col gap-4 bg-white rounded-t-lg z-10">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsCollapsed(true)}>
                                <div className="flex items-center gap-2 text-purple-600 font-semibold justify-between">
                                    {/* Icon from image (diamond shape) */}
                                    <div className="h-3 w-3 rotate-45 bg-purple-400 rounded-[1px]" />
                                    <span>Unscheduled buffer list</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsCollapsed(true)}
                                    className="cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* "The project undone tasks check list" Subheader */}
                            <div className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                                <span className="text-lg font-bold">»</span> The project undone tasks check list
                            </div>

                            {/* "Show all tasks" Checkbox */}
                            <div className="flex items-center space-x-2 mt-1">
                                <Checkbox
                                    id="show-all"
                                    checked={showAllTasks}
                                    onCheckedChange={(checked) => setShowAllTasks(checked as boolean)}
                                    className="border-gray-400 data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-800"
                                />
                                <label
                                    htmlFor="show-all"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                >
                                    Show all tasks
                                </label>
                            </div>
                        </div>

                        {/* 6. Add padding to ScrollArea and render content */}
                        <ScrollArea className="h-[45vh] p-0">
                            {memoizedPanelContent}
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}