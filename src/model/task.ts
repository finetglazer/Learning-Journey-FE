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
    public routineStartTime?: string;
    public routineEndTime?: string; 
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
    title?: string;
};

export interface UnscheduledBigTask extends UnscheduledTask {
    subtasks?: UnscheduledTask[];
};