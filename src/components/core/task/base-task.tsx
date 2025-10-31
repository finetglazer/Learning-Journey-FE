import { CALENDAR_VIEW_OPTIONS } from '@/const/consts';
import { cn, isoToHHMM, toDayJs } from '@/lib/utils';
import { MonthPlanningBigTask, MonthPlanningEvent, Task } from '@/model/task';
import React, { CSSProperties } from 'react';

export interface BaseTaskProps {
    task: Task | MonthPlanningBigTask | MonthPlanningEvent | string;
    handleDoubleClick?: (event?: React.MouseEvent<HTMLDivElement>, taskId?: number) => void;
    key?: string;
    taskType?: string;
    calendarType?: (typeof CALENDAR_VIEW_OPTIONS)[number];
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    titleClassName?: string;
    descriptionClassName?: string;
    badgeWrapperClassName?: string;
    badgeClassName?: string;
};

export const BaseTask: React.FC<BaseTaskProps> = ({
    task,
    handleDoubleClick,
    key,
    taskType,
    calendarType,
    wrapperClassName,
    wrapperStyle,
    titleClassName,
    descriptionClassName,
    badgeWrapperClassName,
    badgeClassName,
}) => {
    const type = taskType || (task as Task)?.type || 'task';

    if (calendarType === 'month-view') {
        return (
            <div
                key={key}
                className={cn("grid grid-cols-2 cursor-pointer items-center gap-4 rounded-lg border-3 border-[#E62E7B] bg-stone-50 p-4 w-full",
                    { "border-sky-300": type === "event" },
                    { "border-[#68DE79]": type === "routine" },
                    wrapperClassName,
                )}
                style={{ ...wrapperStyle }}
                onDoubleClick={(e) => handleDoubleClick?.(e, (task as Task)?.id as number)}
            >
                <span className={cn("font-semibold text-slate-700 text-lg text-left truncate", titleClassName)}>
                    {(task as Task)?.name}
                </span>
                <span className={cn("text-slate-600 text-center truncate", descriptionClassName)}>
                    {(task as Task)?.note}
                </span>
            </div>
        );
    }

    if (calendarType === 'month-planning') {
        return (
            <div key={key} className={cn("grid grid-cols-3 cursor-pointer items-center gap-4 rounded-lg border-3 border-[#E62E7B] bg-stone-50 p-4 w-full",
                { "grid-cols-2": type !== "big-task" },
                { "border-sky-300": type === "event" },
                { "border-[#68DE79]": type === "routine" },
                wrapperClassName,
            )}
                style={{ ...wrapperStyle }}
                onDoubleClick={() => handleDoubleClick?.()}
            >
                {typeof task !== "string" && (
                    <span className={cn("font-bold text-slate-700 text-lg text-left truncate", titleClassName)}>
                        {task?.name}
                    </span>
                )}
                {typeof task !== "string" && !(task instanceof MonthPlanningBigTask) && (
                    <span className={cn("text-slate-600 text-center truncate", descriptionClassName)}>
                        {task?.note}
                    </span>
                )}
                {type === "big-task" && (
                    <div className={cn("flex items-center justify-self-center gap-3", badgeWrapperClassName)}>
                        <div className={cn("flex h-10 w-14 items-center justify-center rounded-lg bg-[#E62E7B] text-white font-bold", badgeClassName)}>
                            {toDayJs((task as MonthPlanningBigTask).estimatedStartDate).get("date").toString().padStart(2)}
                        </div>
                        <div className={cn("flex h-10 w-14 items-center justify-center rounded-lg bg-[#E62E7B] text-white font-bold", badgeClassName)}>
                            {toDayJs((task as MonthPlanningBigTask).estimatedEndDate).get("date").toString().padStart(2)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            key={key}
            className={cn("border-3 border-sky-300 bg-stone-50  cursor-pointer rounded-lg p-4 w-full",
                { "border-[#E62E7B]": type === "task" || type === "big-task" },
                { "border-[#68DE79]": type === "routine" },
                wrapperClassName,
            )}
            style={{ ...wrapperStyle }}
            onDoubleClick={(e) => handleDoubleClick?.(e, (task as Task)?.id as number)}
        >
            <div className={cn("flex items-center gap-2", badgeWrapperClassName)}>
                <div className={cn("rounded bg-sky-400 px-2 py-1 text-xs font-bold text-white",
                    { "bg-[#68DE79]": type === "routine" },
                    { "bg-[#E62E7B]": type === "task" || type === "big-task" },
                    badgeClassName,
                )}>
                    {isoToHHMM((task as Task).startTime)}
                </div>
                <div className={cn("rounded bg-sky-400 px-2 py-1 text-xs font-bold text-white",
                    { "bg-[#68DE79]": type === "routine" },
                    { "bg-[#E62E7B]": type === "task" || type === "big-task" },
                    badgeClassName,
                )}>
                    {isoToHHMM((task as Task).endTime)}
                </div>
            </div>
            <div className={cn("mt-3 pb-2 text-slate-600 font-bold", titleClassName)}>
                <span>{(task as Task)?.name}</span>
            </div>
            <div className={cn("mt-2 text-slate-600", descriptionClassName)}>
                <span>{(task as Task)?.note}</span>
            </div>
        </div>
    );
};