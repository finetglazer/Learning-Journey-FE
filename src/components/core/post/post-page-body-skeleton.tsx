import { Skeleton } from "@/components/ui/skeleton";

export function PostPageBodySkeleton() {
    return (
        <div className="flex flex-col gap-6 w-full mt-8">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg">
                    {/* Left Column: Stats */}
                    <div className="flex flex-col items-end gap-3 w-28 shrink-0">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" /> {/* Number */}
                            <Skeleton className="h-4 w-8" /> {/* Label: votes */}
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 rounded">
                            <Skeleton className="h-4 w-4" /> {/* Number */}
                            <Skeleton className="h-4 w-12" /> {/* Label: answers */}
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" /> {/* Number */}
                            <Skeleton className="h-4 w-8" /> {/* Label: views */}
                        </div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="flex flex-col gap-2 flex-1">
                        {/* Title */}
                        <Skeleton className="h-6 w-3/4" />

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        {/* Bottom Row: Tags and User Info */}
                        <div className="flex items-center justify-between mt-2">
                            {/* Tags */}
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" /> {/* Avatar */}
                                <Skeleton className="h-4 w-24" /> {/* Name */}
                                <Skeleton className="h-4 w-20" /> {/* "created just now" */}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
