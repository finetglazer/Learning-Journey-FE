import { dayJsToISOString } from "@/lib/utils";
import dayjs from "dayjs";
import { Model } from "react-3layer-common";

export class Task extends Model {
    // id can be string (from unscheduled task), and number (from scheduled task)
    public id: number | string = 1;
    public status?: 'complete' | 'incomplete';
    //2025-10-03T10:45:00.000Z
    public name: string = "";
    public note?: string;
    public startTime: string = dayJsToISOString(dayjs());
    public endTime: string = dayJsToISOString(dayjs());
    public type?: "event" | "routine" | "task" | string;
    public color?: string;
    // For task
    public parentBigTaskId?: number;
    public estimatedHours?: number;
    public actualHours?: number;
    public dueDate?: string; // YYYY-MM-DD
    public completionPercentage?: number;
    public subtasks?: Subtask[];

    // For routine
    public pattern?: RecurringPattern;
    public exceptions?: string[]; // [2025-10-28T04:36:30]

    // For event
    public location?: string;
    public attendees?: string[];
};

export interface Subtask {
    id?: number;
    name?: string;
    description?: string;
    isComplete?: boolean;
    completedAt?: string; // 2025-10-28T04:36:30
}

export interface UnscheduledTask {
    id?: string | number;
    name?: string;
    description?: string;
    estimated?: string;
    type?: string;   // 'unscheduled-task'
    parentBigTaskId?: number;
    isDraggedOrEdited?: boolean;
};

export interface RecurringPattern {
    daysOfWeek?: string[];
}

export interface UnscheduledRoutine {
    id?: number | string;
    name?: string;
    source?: string; // "MONTH_PLAN" or "CALENDAR"
    needsScheduling?: boolean;
    canUsePreviousTiming?: boolean;
    previousTiming?: PreviousTiming;
    type?: string;  // 'unscheduled-routine'
    isDraggedOrEdited?: boolean;
};

export interface PreviousTiming {
    startTime?: string; // hh:mm:ss
    endTime?: string; // hh:mm:ss
    daysOfWeek?: string[];
}

export interface UnscheduledMonthData {
    monthPlanId?: number;
    month?: number;
    year?: number;
    unscheduledBigTasks?: UnscheduledBigTask[];
    unscheduledRoutines?: UnscheduledRoutine[];
}

export interface UnscheduledBigTask {
    bigTaskId: number;
    bigTaskName?: string;
    name: string;
    source?: string;
    estimatedStartDate?: string,    // YYYY-MM-DD
    estimatedEndDate?: string,  // YYYY-MM-DD
    estimatedHours?: number,
    prority?: string,
    suggestedSubtasks?: UnscheduledTask[],
};