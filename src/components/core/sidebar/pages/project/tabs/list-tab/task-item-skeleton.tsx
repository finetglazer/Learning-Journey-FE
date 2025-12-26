export const TaskItemSkeleton = () => {
    return (
        <div className="animate-pulse flex items-center gap-4 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
            {/* Checkbox skeleton */}
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Task name skeleton */}
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

            {/* Status badge skeleton */}
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Priority badge skeleton */}
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Assigned to skeleton */}
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    );
};
