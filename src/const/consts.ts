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