import { CALENDAR_VIEW_OPTIONS } from '@/const/consts';
import { cn, isoToHHMM, toDayJs } from '@/lib/utils';
import { MonthPlanningBigTask, MonthPlanningEvent, Task } from '@/model/task';
import { Tooltip } from 'antd';
import { Bookmark, Save, Trash2 } from 'lucide-react';
import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface BaseTaskProps {
    task: Task | MonthPlanningBigTask | MonthPlanningEvent | string;
    handleDoubleClick?: (
        event?: React.MouseEvent<HTMLDivElement>,
        taskId?: number | string,
        task?: MonthPlanningBigTask | MonthPlanningEvent | string,
        scrollContainerRef?: any,
    ) => void;
    handleCellClick?: (
        event?: React.MouseEvent<HTMLDivElement>,
        task?: MonthPlanningBigTask,
        scrollContainerRef?: any,
    ) => void;
    updateRoutineList?: (oldName?: string, newName?: string) => void;
    setOpenRoutineEditor?: Dispatch<SetStateAction<boolean>>;
    handleCancelEdit?: () => void;
    key?: string;
    taskType?: string;
    isEditing?: boolean;    // For month-planning mode and taskType === 'routine'
    calendarType?: (typeof CALENDAR_VIEW_OPTIONS)[number];
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    titleClassName?: string;
    descriptionClassName?: string;
    badgeWrapperClassName?: string;
    badgeClassName?: string;
    scrollContainerRef?: any;
};

export const BaseTask: React.FC<BaseTaskProps> = ({
    task,
    handleDoubleClick,
    handleCellClick,
    setOpenRoutineEditor,
    updateRoutineList,
    handleCancelEdit,
    key,
    taskType,
    calendarType,
    isEditing,
    wrapperClassName,
    wrapperStyle,
    titleClassName,
    descriptionClassName,
    badgeWrapperClassName,
    badgeClassName,
    scrollContainerRef,
}) => {
    const type = taskType || (task as Task)?.type || 'task';
    // Get the ID, whether it's a string or number
    const taskId = typeof task === 'string' ? task : task?.id;
    const [routineNewName, setRoutineNewName] = useState<string>(typeof task === "string" ? task : "");

    // Helper function to build the tooltip title
    const getTooltipTitle = () => {
        if (typeof task === 'string') return task;
        if ((task as Task)?.note) {
            return `${(task as Task).name}: ${(task as Task).note}`;
        }
        return (task as Task).name;
    };

    const isBigTask = (task: any): task is MonthPlanningBigTask => {
        return typeof task === "object" && task !== null && (task as MonthPlanningBigTask).estimatedStartDate !== undefined;
    }

    const isEvent = (task: any): task is MonthPlanningEvent => {
        return typeof task === "object" && task !== null && (task as MonthPlanningEvent).specificDate !== undefined;
    }

    useEffect(() => {
        setRoutineNewName(typeof task === 'string' ? task : "");
    }, [isEditing]);

    if (calendarType === 'month-view') {
        return (
            <Tooltip title={getTooltipTitle()} placement="top">
                <div
                    key={key}
                    className={cn("grid grid-cols-2 cursor-pointer items-center gap-4 rounded-lg border-3 border-[#E62E7B] bg-stone-50 p-4 w-full",
                        { "border-sky-300": type === "event" },
                        { "border-[#68DE79]": type === "routine" },
                        { "border-[#91EEFF]": type === "memorable_event" },
                        wrapperClassName,
                    )}
                    style={{ ...wrapperStyle }}
                    onDoubleClick={(e) => { handleDoubleClick?.(e, taskId as number, undefined, scrollContainerRef) }}
                >
                    <span className={cn("font-semibold text-slate-700 text-lg text-left truncate", titleClassName)}>
                        {(task as Task)?.name}
                    </span>
                    <span className={cn("text-slate-600 text-center truncate", descriptionClassName)}>
                        {(task as Task)?.note}
                    </span>
                </div>
            </Tooltip>
        );
    }

    if (calendarType === 'month-planning') {
        if (type === 'routine' && isEditing) {
            return (
                <div key={key} className={cn("h-[105px]! z-[99999] grid grid-cols-[1fr,auto,auto] cursor-default items-center gap-2 rounded-lg border-3 border-[#68DE79] bg-stone-50 p-4 w-full",
                    wrapperClassName
                )}
                    style={{ ...wrapperStyle }}
                    onClick={(e) => e.stopPropagation()} // Prevent any parent clicks
                >
                    <input
                        type="text"
                        value={routineNewName}
                        onChange={(e) => setRoutineNewName(e.target.value)}
                        className="font-bold text-slate-700 text-lg text-left truncate bg-white border border-gray-300 rounded px-2 py-1"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                handleCancelEdit?.();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()} // Stop click from propagating
                    />
                    <div className="flex">
                        <button onClick={() => {
                            updateRoutineList?.(task as string, routineNewName)
                        }} className="cursor-pointer text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100" aria-label="Save">
                            <Save size={20} />
                        </button>
                        <button onClick={() => updateRoutineList?.(task as string, "")} className="cursor-pointer text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100" aria-label="Delete">
                            <Trash2 size={20} />
                        </button>
                        <button className="cursor-pointer ml-3 text-cyan-950" onClick={() => {
                            handleCancelEdit?.();
                        }}>Cancel</button>
                    </div>
                </div>
            )
        }

        return (
            <Tooltip title={getTooltipTitle()} placement="top">
                <div key={key} className={cn(
                    "h-auto sm:h-[105px]! overflow-hidden flex justify-between sm:grid cursor-pointer items-center gap-2 sm:gap-4 rounded-lg border-3 border-[#E62E7B] bg-stone-50 p-4 w-full",
                    type === "big-task" ? "sm:grid-cols-2" : "sm:grid-cols-2",
                    { "border-sky-300": type === "event" },
                    { "border-[#68DE79]": type === "routine" },
                    { "border-[#91EEFF]": type === "memorable_event" },
                    wrapperClassName,
                )}
                    style={{ ...wrapperStyle }}
                    onDoubleClick={(e) => {
                        setOpenRoutineEditor?.(false);
                        handleDoubleClick?.(e, typeof task === "string" ? "" : task?.id as number, task as any, scrollContainerRef);
                    }}
                    onClick={(e) => handleCellClick?.(e, task as MonthPlanningBigTask, scrollContainerRef)}
                >
                    {typeof task !== "string" && (
                        <span className={cn("font-bold text-slate-700 text-[0.9rem]! text-base text-center sm:text-left truncate w-[110%]", titleClassName)}>
                            {task?.name}
                        </span>
                    )}
                    {typeof task === "string" && (
                        <span className={cn("font-bold text-slate-700 text-base sm:text-lg text-center sm:text-left truncate w-full", titleClassName)}>
                            {task}
                        </span>
                    )}
                    {typeof task !== "string" && !isBigTask(task) && (
                        <span className={cn("text-slate-600 text-center truncate text-sm sm:text-base", descriptionClassName)}>
                            {(task as Task)?.note}
                        </span>
                    )}
                    {type === "big-task" && (
                        <div className={cn("flex items-center justify-center sm:justify-self-center gap-2 sm:gap-3", badgeWrapperClassName)}>
                            <div className={cn("flex h-8 w-10 items-center justify-center rounded-lg bg-[#E62E7B] text-white text-sm sm:text-base font-bold", badgeClassName)}>
                                {toDayJs((task as MonthPlanningBigTask).estimatedStartDate).get("date").toString().padStart(2)}
                            </div>
                            <div className={cn("flex h-8 w-10 items-center justify-center rounded-lg bg-[#E62E7B] text-white text-sm sm:text-base font-bold", badgeClassName)}>
                                {toDayJs((task as MonthPlanningBigTask).estimatedEndDate).get("date").toString().padStart(2)}
                            </div>
                        </div>
                    )}
                </div>
            </Tooltip>
        );
    }

    return (
        <Tooltip title={getTooltipTitle()} placement="top">
            <div
                key={key}
                className={cn("border-3 relative border-sky-300 bg-stone-50 cursor-pointer rounded-lg p-4 w-full",
                    { "border-[#E62E7B]": type === "task" || type === "big-task" || type === "project_work" },
                    { "border-[#68DE79]": type === "routine" },
                    { "border-[#91EEFF] !h-[50px]": type === "memorable_event" },
                    wrapperClassName,
                )}
                style={{ ...wrapperStyle }}
                onDoubleClick={(e) => handleDoubleClick?.(e, taskId as number, undefined, scrollContainerRef)}
            >
                {type === "project_work" && (
                    <div
                        className="absolute top-0 right-8 transform translate-x-1/4 -translate-y-1/4"
                        style={{ zIndex: 99 }}
                    >
                        <Bookmark
                            size={25}
                            className="text-[#E62E7B] fill-white drop-shadow-sm"
                            strokeWidth={2}
                        />
                    </div>
                )}
                {type !== "memorable_event" && (
                    <div className={cn("flex items-center gap-2", badgeWrapperClassName)}>
                        <div className={cn("rounded bg-sky-400 px-2 py-1 text-xs font-bold text-white",
                            { "bg-[#68DE79]": type === "routine" },
                            { "bg-[#E62E7B]": type === "task" || type === "big-task" || type === "project_work" },
                            badgeClassName,
                        )}>
                            {isoToHHMM((task as Task).startTime)}
                        </div>
                        <div className={cn("rounded bg-sky-400 px-2 py-1 text-xs font-bold text-white",
                            { "bg-[#68DE79]": type === "routine" },
                            { "bg-[#E62E7B]": type === "task" || type === "big-task" || type === "project_work" },
                            badgeClassName,
                        )}>
                            {isoToHHMM((task as Task).endTime)}
                        </div>
                    </div>
                )}
                <div className={cn("mt-3 pb-2 text-slate-600 font-bold", {"text-center text-xl -mt-2": type === "memorable_event"}, titleClassName)}>
                    <span>{(task as Task)?.name}</span>
                </div>
                <div className={cn("mt-2 text-slate-600", descriptionClassName)}>
                    <span>{(task as Task)?.note}</span>
                </div>
            </div>
        </Tooltip>
    );
};

