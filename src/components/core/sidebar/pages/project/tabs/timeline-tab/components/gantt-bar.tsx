"use client";

import { calculateBarPosition, cn, findRecursive, getId, toDayJs } from "@/lib/utils";
import { ProjectTimelineStructure, TimelineItem } from '@/model/project-management';
import dayjs from 'dayjs';
import { isEqual, isNil } from "lodash";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

interface GanttBarProps {
    item: TimelineItem;
    isGhosting: boolean;
    ghostBar: {
        itemId: string | number;
        startDate: string;
        endDate: string;
        x: number;
    } | null;
    canEdit: boolean;
    totalViewDays: number;
    originalStyle: React.CSSProperties | undefined; // Initial positioning
    isHovered: boolean;
    timelineStructure: ProjectTimelineStructure | null;
    viewStartDate: Date;
    parentStartDate: string;
    parentEndDate: string;
    isAddingDependency: boolean;
    isRelated: boolean;
    hasUnsavedChanges: boolean;
    parentMap: Record<string, string | undefined>;
    setUnsavedTimelineItem: Dispatch<SetStateAction<TimelineItem | null>>;
    onDateUpdate: (id: number | string, newStart: string, newEnd: string, isUpdate?: boolean) => void;
    handleMoveGnattBar: (id: string | number, daysShift: number) => void;
    handleDraggingLineDropWhenAddingDependency: (item: TimelineItem) => void;
    handleMouseDownWhenAddingDependency: (e: any, item: TimelineItem) => void;
};

const GanttBar = ({
    item,
    isGhosting,
    ghostBar,
    canEdit,
    totalViewDays,
    originalStyle,
    viewStartDate,
    timelineStructure,
    isHovered,
    isRelated,
    onDateUpdate,
    isAddingDependency,
    parentStartDate,
    parentEndDate,
    handleMoveGnattBar,
    hasUnsavedChanges,
    parentMap,
    setUnsavedTimelineItem,
    handleDraggingLineDropWhenAddingDependency,
    handleMouseDownWhenAddingDependency,
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

    const getParentTimelineItem = (timelineItem: TimelineItem) => {
        if (!parentMap[getId(timelineItem.type, timelineItem.id)]) {
            return undefined;
        }

        return findRecursive(timelineStructure?.items || [], parentMap[getId(timelineItem.type, timelineItem.id)] as string);
    };

    useEffect(() => {
        if (isGhosting) {
            if (!ghostBar) {
                return;
            }
            setLocalStartDate(ghostBar.startDate);
            setLocalEndDate(ghostBar.endDate);
            return;
        }
        if (!isDragging) {
            const updatedLocalStartDate = item.startDate || parentStartDate;
            setLocalStartDate(updatedLocalStartDate);
            setLocalEndDate(item.endDate);
        }
    }, [item.startDate, item.endDate, ghostBar, isGhosting]);

    useEffect(() => {
        if (originalStyle) {
            setStyle(originalStyle);
        }
    }, [originalStyle]);


    useEffect(() => {
        const barPosition = calculateBarPosition(localStartDate, localEndDate, viewStartDate, totalViewDays);
        setStyle({
            ...style,
            left: barPosition.left,
            width: barPosition.width,
        });
    }, [
        localStartDate,
        localEndDate,
        viewStartDate,
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

    const getChildLimits = (
        children: TimelineItem[],
        limits: { start: dayjs.Dayjs | null, end: dayjs.Dayjs | null }
    ) => {
        children.forEach(child => {
            const cStart = toDayJs(child.startDate, 0);
            const cEnd = toDayJs(child.endDate, 0);

            if (!limits.start || cStart.isBefore(limits.start)) {
                limits.start = cStart;
            }
            if (!limits.end || cEnd.isAfter(limits.end)) {
                limits.end = cEnd;
            }

            if (child.children && child.children.length > 0) {
                getChildLimits(child.children, limits);
            }
        });
    };

    const applyConstraintsWhenExpandingOrShrinking = (newStart: dayjs.Dayjs, newEnd: dayjs.Dayjs) => {
        const limits = { start: null as dayjs.Dayjs | null, end: null as dayjs.Dayjs | null };

        if (item.children && item.children.length > 0) {
            getChildLimits(item.children, limits);
        }

        let earliestChildStart = limits.start;
        let latestChildEnd = limits.end;
        let validStart = newStart;
        let validEnd = newEnd;

        // 2. Apply Constraint: Parent START cannot be after any child's start
        if (earliestChildStart && newStart.isAfter(earliestChildStart)) {
            validStart = earliestChildStart;
        }

        // 3. Apply Constraint: Parent END cannot be before any child's end
        if (latestChildEnd && newEnd.isBefore(latestChildEnd)) {
            validEnd = latestChildEnd;
        }

        return { validStart, validEnd };
    };

    const recalculateParents = (timeline: TimelineItem, newStart: dayjs.Dayjs, newEnd: dayjs.Dayjs) => {
        const limits = { start: null as dayjs.Dayjs | null, end: null as dayjs.Dayjs | null };

        let parent = getParentTimelineItem(timeline);

        if (!parent) {
            return;
        }

        getChildLimits(parent.children, limits);

        const earliestChildStart = limits.start?.isAfter(newStart) ? newStart : limits.start;
        const latestChildEnd = limits.end?.isBefore(newEnd) ? newEnd : limits.end;

        while (parent) {
            let needToUpdate = false;
            let updateParentStartDate = toDayJs(parent.startDate, 0);
            let updateParentEndDate = toDayJs(parent.endDate, 0);
            if (earliestChildStart && toDayJs(parent.startDate, 0).isAfter(earliestChildStart)) {
                needToUpdate = true;
                updateParentStartDate = earliestChildStart;
            }
            if (latestChildEnd && toDayJs(parent.endDate, 0).isBefore(latestChildEnd)) {
                needToUpdate = true;
                updateParentEndDate = latestChildEnd;
            }

            if (needToUpdate) {
                onDateUpdate(getId(parent.type, parent.id), updateParentStartDate.format("YYYY-MM-DD"), updateParentEndDate.format("YYYY-MM-DD"));
            }

            parent = getParentTimelineItem(parent);

        }
    }

    // --- Drag Logic ---
    const handleMouseDown = (e: React.MouseEvent, edge: 'start' | 'end' | 'move') => {
        if (!isRelated || isGhosting) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();

        if (isAddingDependency) {
            return;
        }

        setIsDragging(true);
        setDragMode(edge);

        const startX = e.clientX;
        const initialStart = toDayJs(localStartDate, 0);
        const initialEnd = toDayJs(localEndDate, 0);

        const DRAG_THRESHOLD = 2; // pixels

        // Get the width of the parent timeline container (the 100% width reference)
        // We use offsetParent because the bar is absolute positioned relative to it.
        const parentWidth = (barRef.current?.offsetParent as HTMLElement)?.offsetWidth || 1000;
        const pixelsPerDay = parentWidth / totalViewDays;
        currentShiftRef.current = 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const daysShift = Math.round(deltaX / pixelsPerDay);
            if (Math.abs(daysShift) <= DRAG_THRESHOLD) {
                currentShiftRef.current = 0;
                return;
            }
            let newStart = initialStart;
            let newEnd = initialEnd;
            const initialDurationDays = initialEnd.diff(initialStart, 'day');

            setUnsavedTimelineItem(item);

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

            let constrained = applyConstraints(newStart, newEnd, initialDurationDays, edge);
            if (!isEqual(edge, 'move') && item.children && item.children.length > 0) {
                let childConstrained = applyConstraintsWhenExpandingOrShrinking(newStart, newEnd);
                constrained = {
                    validStart: childConstrained.validStart.isBefore(constrained.validStart) ? childConstrained.validStart : constrained.validStart,
                    validEnd: childConstrained.validEnd.isAfter(constrained.validEnd) ? childConstrained.validEnd : constrained.validEnd,
                };
            }

            currentShiftRef.current = constrained.validStart.diff(initialStart, 'day');
            constraintRef.current = {
                startDate: constrained.validStart.format("YYYY-MM-DD"),
                endDate: constrained.validEnd.format("YYYY-MM-DD"),
            }
            setLocalStartDate(constraintRef.current.startDate);
            setLocalEndDate(constraintRef.current.endDate);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setDragMode(null);

            // Clean up listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            const newStart = toDayJs(constraintRef.current.startDate, 0);
            const newEnd = toDayJs(constraintRef.current.endDate, 0);

            if (edge === 'move') {
                handleMoveGnattBar(getId(item.type, item.id), currentShiftRef.current);
            } else {
                onDateUpdate(getId(item.type, item.id), constraintRef.current.startDate, constraintRef.current.endDate, true);
            }

            recalculateParents(item, newStart, newEnd);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // --- Styles ---
    const getBarStyles = (type: string) => {
        switch (type.toUpperCase()) { // Handle case sensitivity
            case 'DELIVERABLE':
                return { container: 'bg-green-50 border-[#29CC39] text-green-700', border: 'border-[#29CC39]', height: 'h-8' };
            case 'PHASE':
                return { container: 'bg-blue-50 border-[#33BFFF] text-blue-700', border: 'border-[#33BFFF]', height: 'h-8' };
            case 'TASK':
                return { container: 'bg-purple-50 border-[#8833FF] text-purple-700', border: 'border-[#8833FF]', height: 'h-8' };
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

    if (!isGhosting && (isNil(item.startDate) || isNil(item.endDate))) {
        return <></>;
    }

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
                    ? ((isHovered || isDragging) ? cn("cursor-grab ring-2 ring-offset-1 ring-blue-300 opacity-100", { "cursor-default": !canEdit || isAddingDependency }) : "opacity-90 hover:opacity-100")
                    : "opacity-30 cursor-default bg-transparent border-none",

                isDragging && canEdit ? "transition-none cursor-grabbing" : "",
                (isHovered || isDragging) ? "ring-2 ring-offset-1 ring-blue-300 opacity-100" : "opacity-90 hover:opacity-100",
                { "opacity-50": isGhosting },
            )}
            style={style || undefined}
            onMouseDown={(e) => {
                if (!canEdit || hasUnsavedChanges || isGhosting) {
                    return;
                }

                if (isAddingDependency) {
                    handleMouseDownWhenAddingDependency(e, item);
                }
                else {
                    handleMouseDown(e, 'move');
                }
            }}
            onMouseUp={() => {
                if (isAddingDependency) {
                    handleDraggingLineDropWhenAddingDependency(item);
                }
            }}
        >
            {/* --- Head Handle (Start Date) --- */}
            {canEdit && (
                <div
                    className={cn(connectorCircleClasses, "-left-1.5")}
                    onMouseDown={(e) => {
                        if (!canEdit || hasUnsavedChanges) {
                            return;
                        }

                        handleMouseDown(e, 'start');
                    }}
                />
            )}

            {/* Label */}
            {duration > 5 && (
                <span className="text-[12px] font-medium truncate px-2 w-full pointer-events-none select-none">
                    {item.name}
                </span>
            )}

            {/* --- Tail Handle (End Date) --- */}
            {canEdit && (
                <div
                    className={cn(connectorCircleClasses, "-right-1.5")}
                    onMouseDown={(e) => {
                        if (!canEdit || hasUnsavedChanges) {
                            return;
                        }
                        handleMouseDown(e, 'end');
                    }}
                />
            )}

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