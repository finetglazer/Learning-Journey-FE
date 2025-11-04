import { dayJsToISOString } from "@/lib/utils";
import dayjs from "dayjs";
import { Model } from "react-3layer-common";

export class Task extends Model {
    // id can be string (from unscheduled task), and number (from scheduled task)
    public id: number | string | null = null;
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

export class UnscheduledTask {
    id?: string | number;
    name?: string;
    description?: string;
    note?: string;
    estimated?: string;
    type?: string = 'task';
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
    type?: string;
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

export class MonthPlanningEvent {
    public id?: number;
    public type: string = 'event';
    public name: string = "New event";
    public note?: string;
    public specificDate: string = dayjs().format('YYYY-MM-DD');
    public startTime: string = "07:00";
    public endTime: string = "07:15";
}

export class MonthPlanningBigTask {
    public id?: number;
    public type: string = 'big-task';
    public name: string = "New big task";
    public estimatedStartDate: string = dayjs().format('YYYY-MM-DD');
    public estimatedEndDate: string = dayjs().format('YYYY-MM-DD');
    public unscheduledTasks?: UnscheduledTask[];    // {id, name, note}
    public derivedTasksCount: number = 0;
    public completionPercentage: number = 0;
    public description?: string;
};