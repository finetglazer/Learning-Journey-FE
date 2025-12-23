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
    EVERY_MONDAY,
    EVERY_TUESDAY,
    EVERY_WEDNESDAY,
    EVERY_THURSDAY,
    EVERY_FRIDAY,
    EVERY_SATURDAY,
    EVERY_SUNDAY,
};

export const CALENDAR_VIEW_OPTIONS = [
    'day',
    'week',
    'month-view',
    'month-planning',
    'year',
];

export const UNSCHEDULED_ROUTINE_PREFIX = "unscheduled-routine-";
export const NEW_ROUTINE_ID_PREFIX = "routine-";
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

export const SUBTASK_OUTSIDE_BIGTASK_TIME_RANGE_WARNING: AlertMessage = {
    type: "warning",
    title: "Your picked time for task is conflict with the big time task range",
};

export const TIMEZONE_GROUPS = [
    {
        group: "Americas",
        zones: [
            { label: "(UTC-10:00) Hawaii-Aleutian", value: "Pacific/Honolulu", utc: "UTC-10:00" },
            { label: "(UTC-09:00) Alaska", value: "America/Anchorage", utc: "UTC-09:00" },
            { label: "(UTC-08:00) Pacific Time (US & Canada)", value: "America/Los_Angeles", utc: "UTC-08:00" },
            { label: "(UTC-07:00) Mountain Time (US & Canada)", value: "America/Denver", utc: "UTC-07:00" },
            { label: "(UTC-06:00) Central Time (US & Canada)", value: "America/Chicago", utc: "UTC-06:00" },
            { label: "(UTC-05:00) Eastern Time (US & Canada)", value: "America/New_York", utc: "UTC-05:00" },
            { label: "(UTC-04:00) Caracas", value: "America/Caracas", utc: "UTC-04:00" },
            { label: "(UTC-04:00) Atlantic Time (Canada)", value: "America/Halifax", utc: "UTC-04:00" },
            { label: "(UTC-03:00) Brasilia, Sao Paulo", value: "America/Sao_Paulo", utc: "UTC-03:00" },
            { label: "(UTC-03:00) Buenos Aires", value: "America/Argentina/Buenos_Aires", utc: "UTC-03:00" },
            { label: "(UTC-02:30) Newfoundland", value: "America/St_Johns", utc: "UTC-02:30" },
        ],
    },
    {
        group: "Europe & Africa",
        zones: [
            { label: "(UTC+00:00) London, Dublin, Lisbon", value: "Europe/London", utc: "UTC+00:00" },
            { label: "(UTC+01:00) Amsterdam, Berlin, Paris, Rome", value: "Europe/Berlin", utc: "UTC+01:00" },
            { label: "(UTC+02:00) Athens, Helsinki, Kyiv", value: "Europe/Athens", utc: "UTC+02:00" },
            { label: "(UTC+02:00) Cairo", value: "Africa/Cairo", utc: "UTC+02:00" },
        ],
    },
    {
        group: "Asia & Pacific",
        zones: [
            { label: "(UTC+03:00) Moscow, Baghdad", value: "Europe/Moscow", utc: "UTC+03:00" },
            { label: "(UTC+04:00) Dubai, Baku", value: "Asia/Dubai", utc: "UTC+04:00" },
            { label: "(UTC+05:30) New Delhi", value: "Asia/Kolkata", utc: "UTC+05:30" },
            { label: "(UTC+07:00) Bangkok, Ho Chi Minh City", value: "Asia/Ho_Chi_Minh", utc: "UTC+07:00" },
            { label: "(UTC+08:00) Beijing, Singapore, Kuala Lumpur", value: "Asia/Singapore", utc: "UTC+08:00" },
            { label: "(UTC+09:00) Tokyo, Seoul", value: "Asia/Tokyo", utc: "UTC+09:00" },
            { label: "(UTC+10:00) Sydney, Melbourne", value: "Australia/Sydney", utc: "UTC+10:00" },
            { label: "(UTC+12:00) Auckland, Wellington", value: "Pacific/Auckland", utc: "UTC+12:00" },
        ],
    },
];

export const FILE_EXTENSION = [
    'doc',
    'docs',
    'docx',
    'txt',
    'pdf',
    'ppt',
    'rar',
    'zip',
    'jpg',
    'png',
    'xls',
    'xlsx',
];

export const FILE_PREVIEWABLE = [
    'doc',
    'docs',
    'docx',
    'txt',
    'pdf',
    'xls',
    'xlsx',
];
