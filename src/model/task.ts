import { dayJsToISOString } from "@/lib/utils";
import dayjs from "dayjs";
import { Model } from "react-3layer-common";

export class Task extends Model {
    public id: string = "1";
    public status?: 'in-progress' | 'completed' | 'plan' | 'incomplete';
    //2025-10-03T10:45:00.000Z
    public title?: string;
    public description?: string;
    public startTime: string = dayJsToISOString(dayjs());
    public endTime: string = dayJsToISOString(dayjs());
    public type?: "event" | "routine" | "task" | "big-task";
    public routineStartTime?: string;
    public routineEndTime?: string; 
    public routineStartHour?: string;
    public routineEndHour?: string;
    public routinePattern?: number[]; 
    public subtasks?: Task[];
    public steps?: TaskStep[];
};

export interface TaskStep {
    id: string;
    description?: string;
};