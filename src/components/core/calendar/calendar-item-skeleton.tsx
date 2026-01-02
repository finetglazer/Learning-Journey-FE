"use client";

/**
 * Skeleton placeholder for calendar items (events/tasks/routines).
 * Shows a pulsing animated bar that mimics a calendar item while loading.
 */
export const CalendarItemSkeleton = ({
    className = "",
    variant = "week"
}: {
    className?: string;
    variant?: "week" | "month";
}) => {
    if (variant === "month") {
        return (
            <div className={`animate-pulse h-[28px] mb-2 rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} />
        );
    }

    // Week view variant - taller item
    return (
        <div className={`animate-pulse h-12 rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
    );
};

/**
 * Multiple skeleton items for displaying in a container
 */
export const CalendarSkeletonGroup = ({
    count = 2,
    variant = "week"
}: {
    count?: number;
    variant?: "week" | "month";
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <CalendarItemSkeleton key={index} variant={variant} />
            ))}
        </>
    );
};
