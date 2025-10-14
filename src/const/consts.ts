import { AlertMessage } from "@/components/core/alert-modal/alert-modal";

export const PASSWORD_MINIMUM_LENGTH = 8;
export const PASSWORD_GOOD_LENGTH = 10;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const OTP_REGEX = /^[0-9]+$/;
export const TIME_STR_REGEX = /^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i;
export const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export enum ROUTINE_PATTERNS {
    EVERY_SUNDAY,
    EVERY_MONDAY,
    EVERY_TUESDAY,
    EVERY_WEDNESDAY,
    EVERY_THURSDAY,
    EVERY_FRIDAY,
    EVERY_SATURDAY,
};

export const CALENDAR_VIEW_OPTIONS = [
    'day',
    'week',
    'month-view',
    'month-planning',
    'year'
];

export const UNSCHEDULED_BIGTASK_PREFIX = "unscheduled-big-task-";
export const UNSCHEDULED_BIGTASK_DEFAULT_TITLE = "New unscheduled big task ";
export const UNSCHEDULED_SUBTASK_PREFIX = "unscheduled-task-";

export const COLLIDING_WITH_SLEEP_TIME_WARNING: AlertMessage = {
    type: "warning",
    title: "Your picked time is conflict with the sleeping time",
    description: "Wake up sooner is a better solution!",
};

export const OVERLAPPING_TIME_WARNING: AlertMessage = {
    type: "warning",
    title: "Your picked time is overlapping",
};