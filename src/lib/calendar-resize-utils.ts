import { Dayjs } from "dayjs";
import { Task } from "@/model/task";
import { toDayJs } from "./utils";

/**
 * Check if resizing an item would cause an overlap with other items.
 * Excludes the item being resized and routines from the check.
 * 
 * @param itemId - The ID of the item being resized
 * @param newStart - The start time (unchanged during bottom-edge resize)
 * @param newEnd - The new end time after resize
 * @param calendarMap - Map of time slots to tasks
 * @returns true if overlap detected, false otherwise
 */
export const checkOverlapForResize = (
    itemId: number,
    newStart: Dayjs,
    newEnd: Dayjs,
    calendarMap: Record<string, Task[]>
): boolean => {
    // Get all items for the day of the resized item
    const dayKey = newStart.format("YYYY-MM-DD");

    // Collect all items that could potentially overlap
    const allItems: Task[] = [];
    Object.keys(calendarMap).forEach((key) => {
        if (key.startsWith(dayKey) || toDayJs(key).format("YYYY-MM-DD") === dayKey) {
            allItems.push(...(calendarMap[key] || []));
        }
    });

    // Check for overlaps
    return allItems.some((item) => {
        // Skip self
        if (item.id === itemId) return false;

        // Skip routines (they are handled by BE)
        if ((item.type || "").toLowerCase() === "routine") return false;

        const itemStart = toDayJs(item.startTime);
        const itemEnd = toDayJs(item.endTime);

        // Overlap check: (start1 < end2) && (start2 < end1)
        return newStart.isBefore(itemEnd) && itemStart.isBefore(newEnd);
    });
};

/**
 * Snap a time value to the nearest 15-minute interval.
 * 
 * @param time - The time to snap
 * @returns Snapped time
 */
export const snapToGrid = (time: Dayjs): Dayjs => {
    const minutes = time.minute();
    const snappedMinutes = Math.round(minutes / 15) * 15;
    return time.minute(snappedMinutes).second(0).millisecond(0);
};

/**
 * Calculate new end time based on mouse delta during resize.
 * Enforces 15-minute grid snapping and minimum duration.
 * 
 * @param originalStartTime - The original start time of the item
 * @param originalEndTime - The original end time of the item
 * @param deltaY - The vertical mouse movement in pixels
 * @param cellHeightPx - The height of one hour cell in pixels
 * @returns The new end time, snapped to 15-minute intervals
 */
export const calculateNewEndTime = (
    originalStartTime: Dayjs,
    originalEndTime: Dayjs,
    deltaY: number,
    cellHeightPx: number
): Dayjs => {
    const MIN_DURATION_MINUTES = 15;

    // Convert pixel delta to hours (1 cell = 1 hour)
    const hoursChange = deltaY / cellHeightPx;

    // Calculate new end time
    let newEndTime = originalEndTime.add(hoursChange * 60, "minute");

    // Snap to 15-minute grid
    newEndTime = snapToGrid(newEndTime);

    // Enforce minimum duration
    const durationMinutes = newEndTime.diff(originalStartTime, "minute");
    if (durationMinutes < MIN_DURATION_MINUTES) {
        newEndTime = originalStartTime.add(MIN_DURATION_MINUTES, "minute");
    }

    return newEndTime;
};

/**
 * Calculate the preview height for a resized item in rem.
 * 
 * @param startTime - Start time of the item
 * @param newEndTime - New end time after resize
 * @param cellHeight - Height of one hour in rem (default 4.6)
 * @returns Height string in rem units
 */
export const calculateResizePreviewHeight = (
    startTime: Dayjs,
    newEndTime: Dayjs,
    cellHeight: number = 4.6
): string => {
    const durationHours = newEndTime.diff(startTime, "minute") / 60;
    return `${durationHours * cellHeight}rem`;
};
