"use client";

import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DragCancelZoneProps {
    isVisible: boolean;
}

export function DragCancelZone({ isVisible }: DragCancelZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'drag-cancel-zone',
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={setNodeRef}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    // This is the droppable zone - making it larger (128x128) for easier dropping
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] h-32 w-32 flex items-center justify-center"
                >
                    {/* Visible circle with X icon - smaller than the hit area */}
                    <div
                        className={cn(
                            "flex items-center justify-center",
                            "h-16 w-16 rounded-full",
                            "bg-[#E62E7B] text-white shadow-lg",
                            "border-4 border-white",
                            "transition-all duration-200",
                            isOver && "scale-110 shadow-xl"
                        )}
                    >
                        <X className={cn("h-8 w-8", isOver && "animate-pulse")} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
