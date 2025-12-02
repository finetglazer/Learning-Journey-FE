"use client";

import { calculateBarPosition, cn, getId, toDayJs } from "@/lib/utils";
import { TimelineItem } from '@/model/project-management';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

interface GanttBarProps {
    item: TimelineItem;
    totalViewDays: number;
    originalStyle: React.CSSProperties; // Initial positioning
    isHovered: boolean;
    projectStartDate: Date;
    parentStartDate: string;
    parentEndDate: string;
    isRelated: boolean;
    onDateUpdate: (id: number | string, newStart: string, newEnd: string) => void;
    handleMoveGnattBar: (id: string | number, daysShift: number) => void;
};

const GanttBar = ({
    item,
    totalViewDays,
    originalStyle,
    projectStartDate,
    isHovered,
    isRelated,
    onDateUpdate,
    parentStartDate,
    parentEndDate,
    handleMoveGnattBar,
}: GanttBarProps) => {
    const barRef = useRef<HTMLDivElement>(null);

    const currentShiftRef = useRef(0);
    const constraintRef = useRef({
        startDate: item.startDate,
        endDate: item.endDate,
    });

    // Local state for smooth dragging visual feedback
    const [localStartDate, setLocalStartDate] = useState(item.startDate);
    const [localEndDate, setLocalEndDate] = useState(item.endDate);
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'start' | 'end' | 'move' | null>(null);
    const [style, setStyle] = useState<React.CSSProperties | null>(null);

    useEffect(() => {
        if (!isDragging) {
            setLocalStartDate(item.startDate);
            setLocalEndDate(item.endDate);
        }
    }, [item.startDate, item.endDate]);

    useEffect(() => {
        setStyle(originalStyle);
    }, [originalStyle]);

    useEffect(() => {
        const barPosition = calculateBarPosition(localStartDate, localEndDate, projectStartDate, totalViewDays);
        setStyle({
            ...style,
            left: barPosition.left,
            width: barPosition.width,
        });
    }, [
        localStartDate,
        localEndDate,
        projectStartDate,
        totalViewDays,
    ]);


    // --- Math Helper ---
    const calculateDuration = (s: string, e: string) => toDayJs(e).diff(toDayJs(s), 'day') + 1;
    const duration = calculateDuration(localStartDate, localEndDate);

    const applyConstraints = (newStart: dayjs.Dayjs, newEnd: dayjs.Dayjs, initialDurationDays: number, mode: 'start' | 'end' | 'move') => {
        let validStart = newStart;
        let validEnd = newEnd;

        if (parentStartDate && validStart.isBefore(toDayJs(parentStartDate, 0))) {
            validStart = toDayJs(parentStartDate, 0);
            if (mode === 'move') validEnd = validStart.add(initialDurationDays, 'day');
        }

        if (parentEndDate && validEnd.isAfter(toDayJs(parentEndDate, 0))) {
            validEnd = toDayJs(parentEndDate, 0);
            if (mode === 'move') validStart = validEnd.subtract(initialDurationDays, 'day');
        }

        return { validStart, validEnd };
    };

    // --- Drag Logic ---
    const handleMouseDown = (e: React.MouseEvent, edge: 'start' | 'end' | 'move') => {
        if (!isRelated) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();

        setIsDragging(true);
        setDragMode(edge);

        const startX = e.clientX;
        const initialStart = toDayJs(localStartDate, 0);
        const initialEnd = toDayJs(localEndDate, 0);

        // Get the width of the parent timeline container (the 100% width reference)
        // We use offsetParent because the bar is absolute positioned relative to it.
        const parentWidth = (barRef.current?.offsetParent as HTMLElement)?.offsetWidth || 1000;
        const pixelsPerDay = parentWidth / totalViewDays;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const daysShift = Math.round(deltaX / pixelsPerDay);

            let newStart = initialStart;
            let newEnd = initialEnd;
            const initialDurationDays = initialEnd.diff(initialStart, 'day');

            if (edge === 'move') {
                newStart = initialStart.add(daysShift, 'day');
                newEnd = newStart.add(initialDurationDays, 'day');
            }
            else if (edge === 'start') {
                newStart = initialStart.add(daysShift, 'day');
                // Don't let start pass end
                if (newStart.isAfter(initialEnd)) newStart = initialEnd;
            }
            else if (edge === 'end') {
                newEnd = initialEnd.add(daysShift, 'day');
                // Don't let end pass start
                if (newEnd.isBefore(initialStart)) newEnd = initialStart;
            }

            // --- 2. Apply Parent/Project Constraints ---
            constraintRef.current = {
                startDate: newStart.format("YYYY-MM-DD"),
                endDate: newEnd.format("YYYY-MM-DD"),
            }

            const constrained = applyConstraints(newStart, newEnd, initialDurationDays, edge);
            constraintRef.current = {
                startDate: constrained.validStart.format("YYYY-MM-DD"),
                endDate: constrained.validEnd.format("YYYY-MM-DD"),
            }
            currentShiftRef.current = constrained.validStart.diff(initialStart, 'day');

            setLocalStartDate(constraintRef.current.startDate);
            setLocalEndDate(constraintRef.current.endDate);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setDragMode(null);

            // Clean up listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            if (edge === 'move') {
                handleMoveGnattBar(getId(item.type, item.id), currentShiftRef.current);
            } else {
                onDateUpdate(getId(item.type, item.id), constraintRef.current.startDate, constraintRef.current.endDate);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // --- Styles ---
    const getBarStyles = (type: string) => {
        switch (type.toUpperCase()) { // Handle case sensitivity
            case 'DELIVERABLE':
                return { container: 'bg-blue-50 border-blue-400 text-blue-700', border: 'border-blue-400', height: 'h-8' };
            case 'PHASE':
                return { container: 'bg-purple-50 border-purple-400 text-purple-700', border: 'border-purple-400', height: 'h-8' };
            default:
                return { container: 'bg-gray-100 border-gray-300 text-gray-700', border: 'border-gray-400', height: 'h-8' };
        }
    };

    const barStyles = getBarStyles(item.type);

    const connectorCircleClasses = cn(
        "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full z-20 cursor-ew-resize",
        "transition-transform hover:scale-125",
        barStyles.border,
        (isHovered || isDragging) ? "opacity-100" : "opacity-0"
    );

    return (
        <div
            ref={barRef}
            className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-sm border-2 shadow-sm z-10 flex items-center group box-border",
                // Disable transitions while dragging for instant feedback
                isDragging ? "transition-none" : "transition-all duration-300",
                barStyles.container,
                barStyles.height,
                isRelated || isHovered
                    ? ((isHovered || isDragging) ? "cursor-grab ring-2 ring-offset-1 ring-blue-300 opacity-100" : "opacity-90 hover:opacity-100")
                    : "opacity-30 cursor-default bg-transparent border-none",

                isDragging && "transition-none cursor-grabbing",
                (isHovered || isDragging) ? "ring-2 ring-offset-1 ring-blue-300 opacity-100" : "opacity-90 hover:opacity-100"
            )}
            style={style || undefined}
            onMouseDown={(e) => {
                handleMouseDown(e, 'move');
            }}
        // onMouseUp={() => {
        //     if (dragMode !== 'move') {
        //         onDateUpdate(item.id, localStartDate, localEndDate);
        //     }
        //     else {
        //         handleMoveGnattBar(getId(item.type, item.id), currentShiftRef.current);
        //     }
        // }}
        >
            {/* --- Head Handle (Start Date) --- */}
            <div
                className={cn(connectorCircleClasses, "-left-1.5")}
                onMouseDown={(e) => handleMouseDown(e, 'start')}
            />

            {/* Label */}
            {duration > 5 && (
                <span className="text-[10px] font-medium truncate px-2 w-full pointer-events-none select-none">
                    {item.name}
                </span>
            )}

            {/* --- Tail Handle (End Date) --- */}
            <div
                className={cn(connectorCircleClasses, "-right-1.5")}
                onMouseDown={(e) => handleMouseDown(e, 'end')}
            />

            {/* --- Tooltip (Updated with Local State) --- */}
            <div
                className={cn(
                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-30 pointer-events-none",
                    // Show tooltip on hover OR when dragging
                    (isHovered || isDragging) ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-200"
                )}
            >
                <div className="font-semibold mb-0.5">{item.name}</div>
                <div className="text-gray-300 flex items-center gap-1">
                    <span>{toDayJs(localStartDate, 0).format('DD/MM/YY')}</span>
                    <span>-</span>
                    <span>{toDayJs(localEndDate, 0).format('DD/MM/YY')}</span>
                    <span className="text-gray-400 ml-1">({duration} days)</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};

export default GanttBar;