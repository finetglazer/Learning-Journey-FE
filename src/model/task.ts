import { dayJsToISOString } from "@/lib/utils";
import dayjs from "dayjs";
import { Model } from "react-3layer-common";

export class Task extends Model {
    public id: string = dayJsToISOString(dayjs());
    public status?: 'in-progress' | 'completed' | 'plan' | 'incomplete';
    //2025-10-03T10:45:00.000Z
    public title?: string;
    public description?: string;
    public startTime: string = dayJsToISOString(dayjs());
    public endTime: string = dayJsToISOString(dayjs());
    public type?: "event" | "routine" | "task" | "big-task";
    public parentBigTaskId?: string;
    public routineId?: string;
    public routineStartHour?: string;
    public routineEndHour?: string;
    public routinePatterns?: number[]; 
    public subtasks?: Task[];
    public steps?: TaskStep[];
};

export interface TaskStep {
    id: string;
    description?: string;
};

export interface UnscheduledTask {
    id: string;
    parentBigTaskId?: string;
    month: number;
    active: boolean;
    title?: string;
    bigTaskStartTime?: string;
    bigTaskEndTime?: string;
};

export interface UnscheduledRoutine {
    id: string;
    month: number;
    active: boolean;
    title?: string;
    routinePatterns?: number[];
    routineStartHour?: string;
    routineEndHour?: string;
};

export interface UnscheduledMonthData {
    monthNumber: number;
    unscheduledBigTasks?: UnscheduledBigTask[];
    unscheduledRoutines?: UnscheduledRoutine[];
}

export interface UnscheduledBigTask extends UnscheduledTask {
    subtasks?: UnscheduledTask[];
    active: boolean;
};