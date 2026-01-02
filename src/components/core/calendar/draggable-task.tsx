import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';
import { MonthPlanningBigTask, MonthPlanningEvent, Task } from '@/model/task';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface DraggableTaskProps extends Omit<BaseTaskProps, 'task'> {
    task: Task | MonthPlanningBigTask | MonthPlanningEvent;
    handleTaskDoubleClick?: (e: React.MouseEvent<HTMLDivElement>, taskId: number, task?: any, scrollContainerRef?: any) => void;
    isOverlay?: boolean;
    draggable?: boolean;
    scrollContainerRef?: any;
    // Resize props
    resizable?: boolean;
    cellHeightPx?: number;  // Height of 1 hour cell in pixels
    onResizeStart?: (itemId: number, originalEndTime: string) => void;
    onResizeMove?: (itemId: number, newEndTime: string) => void;
    onResizeEnd?: (itemId: number, newEndTime: string) => void;
    isResizing?: boolean;
    isOverlapping?: boolean;
    previewHeight?: string;
}

const MIN_DURATION_MINUTES = 15;

export const DraggableTask = ({
    task,
    isOverlay = false,
    handleTaskDoubleClick,
    scrollContainerRef,
    draggable = true,
    resizable = false,
    cellHeightPx = 73.6,  // Default: 4.6rem * 16px = 73.6px
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    isResizing = false,
    isOverlapping = false,
    previewHeight,
    ...baseTaskProps
}: DraggableTaskProps) => {
    // Get `isDragging` from the hook
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task?.id as number,
        data: task,
        disabled: isResizing,  // Disable drag while resizing
    });

    const [localResizing, setLocalResizing] = useState(false);
    const resizeStartY = useRef<number>(0);
    const originalEndTimeRef = useRef<string>('');
    const originalStartTimeRef = useRef<string>('');  // Store occurrence start time at resize start
    const justResizedRef = useRef<boolean>(false);  // Prevent double-click after resize

    // CRITICAL: Use a ref to always hold the latest task value
    // This avoids stale closure issues where useCallback captures an old task reference
    // For routines, the task prop contains occurrence-specific times that must be captured correctly
    const taskRef = useRef(task);
    taskRef.current = task;  // Always sync to latest task on every render

    // Calculate new end time from mouse delta
    // IMPORTANT: Use refs instead of task from closure to avoid stale closure issues
    // For routines, the task object in closure might contain master routine dates
    // but we need to use the occurrence dates that were set in refs at resize start
    const calculateNewEndTime = useCallback((deltaY: number): string => {
        const hoursChange = deltaY / cellHeightPx;
        // Use refs that were set at resize start (contain correct occurrence times)
        const originalEnd = new Date(originalEndTimeRef.current || '');
        const originalStart = new Date(originalStartTimeRef.current || '');

        // Calculate new end time
        const newEndMs = originalEnd.getTime() + (hoursChange * 60 * 60 * 1000);
        const newEnd = new Date(newEndMs);

        // Snap to 15-minute grid
        const minutes = newEnd.getMinutes();
        const snappedMinutes = Math.round(minutes / 15) * 15;
        newEnd.setMinutes(snappedMinutes);
        newEnd.setSeconds(0);
        newEnd.setMilliseconds(0);

        // Enforce minimum duration
        const durationMs = newEnd.getTime() - originalStart.getTime();
        if (durationMs < MIN_DURATION_MINUTES * 60 * 1000) {
            const minEnd = new Date(originalStart.getTime() + MIN_DURATION_MINUTES * 60 * 1000);
            return minEnd.toISOString();
        }

        return newEnd.toISOString();
    }, [cellHeightPx]);  // Removed task from dependencies since we use refs now

    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // CRITICAL: Read from taskRef.current to get the LATEST task value
        // This ensures we get the correct occurrence times for routines
        const currentTask = taskRef.current as Task;

        setLocalResizing(true);
        resizeStartY.current = e.clientY;
        // Store both start and end times at resize start (these are the correct occurrence times)
        originalEndTimeRef.current = currentTask.endTime || '';
        originalStartTimeRef.current = currentTask.startTime || '';

        onResizeStart?.(currentTask?.id as number, originalEndTimeRef.current);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - resizeStartY.current;
            const newEndTime = calculateNewEndTime(deltaY);
            onResizeMove?.(currentTask?.id as number, newEndTime);
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            const deltaY = upEvent.clientY - resizeStartY.current;
            const newEndTime = calculateNewEndTime(deltaY);

            setLocalResizing(false);
            onResizeEnd?.(currentTask?.id as number, newEndTime);

            // Set flag to prevent double-click from firing
            justResizedRef.current = true;
            setTimeout(() => { justResizedRef.current = false; }, 200);

            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [onResizeStart, onResizeMove, onResizeEnd, calculateNewEndTime]);  // Removed task since we use taskRef

    const style = transform && !isOverlay ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Hide the original task while it's being dragged
    if (isDragging && !isOverlay) {
        return <div ref={setNodeRef} style={{ visibility: 'hidden' }} />;
    }

    if (isOverlay) {
        const overlayWrapperStyle = {
            ...(baseTaskProps.wrapperStyle || {}),
            touchAction: 'none',
        };
        return (
            <BaseTask
                task={task}
                {...baseTaskProps}
                wrapperStyle={overlayWrapperStyle}
            />
        );
    }

    // Compute wrapper style with resize preview
    const computedWrapperStyle = {
        ...(baseTaskProps.wrapperStyle || {}),
        ...(isResizing && previewHeight ? { height: previewHeight } : {}),
    };

    // Wrapper class with resize visual feedback - only show red ring on overlap
    const wrapperClassName = cn(
        baseTaskProps.wrapperClassName,
        {
            'ring-2 ring-red-500 ring-opacity-75': isResizing && isOverlapping,
        }
    );

    const ResizeHandle = resizable ? (
        <div
            className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize z-10"
            onMouseDown={handleResizeMouseDown}
            onPointerDown={(e) => e.stopPropagation()}  // Prevent dnd-kit from capturing
            onClick={(e) => e.stopPropagation()}
        />
    ) : null;

    // Extract height from wrapperStyle for the outer container (needed for resize handle positioning)
    const outerWrapperStyle = {
        ...(style || {}),
        height: computedWrapperStyle?.height,
        top: baseTaskProps.wrapperStyle?.top,
        left: baseTaskProps.wrapperStyle?.left,
        width: baseTaskProps.wrapperStyle?.width,
        position: 'absolute' as const,
    };

    // BaseTask styles without height (height is on outer container now)
    const innerWrapperStyle = {
        ...computedWrapperStyle,
        height: '100%',
        top: undefined,
        left: undefined,
        width: undefined,
        position: undefined,
    };

    return (
        <>
            {draggable ? (
                <div
                    ref={setNodeRef}
                    style={outerWrapperStyle}
                    {...(localResizing ? {} : listeners)}
                    {...(localResizing ? {} : attributes)}
                    className={cn("cursor-grab relative group", { "cursor-ns-resize": localResizing })}
                    onDoubleClickCapture={(e) => {
                        if (justResizedRef.current) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        handleTaskDoubleClick?.(e, task?.id as number, task, scrollContainerRef);
                    }}
                >
                    <BaseTask
                        task={task}
                        {...baseTaskProps}
                        wrapperStyle={innerWrapperStyle}
                        wrapperClassName={wrapperClassName}
                    />
                    {ResizeHandle}
                </div>
            ) : (
                <div
                    ref={setNodeRef}
                    style={outerWrapperStyle}
                    className={cn("cursor-grab relative group", { "cursor-ns-resize": localResizing })}
                    onDoubleClickCapture={(e) => {
                        if (justResizedRef.current) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        handleTaskDoubleClick?.(e, task?.id as number, task, scrollContainerRef);
                    }}
                >
                    <BaseTask
                        task={task}
                        {...baseTaskProps}
                        wrapperStyle={innerWrapperStyle}
                        wrapperClassName={wrapperClassName}
                    />
                    {ResizeHandle}
                </div>
            )}
        </>
    );
}