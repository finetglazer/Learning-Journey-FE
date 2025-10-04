export interface Task {
    id: string;
    //2025-10-03T10:45:00.000Z
    name?: string;
    startTime: string;
    endTime: string;
    type?: "normal" | "routine";
    routineStartTime?: string;
    routineEndTime?: string; 
    routineStartHour?: string;
    routineEndHour?: string;
    // Task with routine type should have startTime and endTime in a day 
};