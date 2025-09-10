import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import minMax from "dayjs/plugin/minMax";

import relativeTime from "dayjs/plugin/relativeTime";
import { isEmpty, isUndefined } from "lodash";
import vi from "dayjs/locale/vi";
import en from "dayjs/locale/en";
import {
  DAY_TYPE,
  STANDARD_DATE_FORMAT_FULL,
  STANDARD_DATE_FORMAT_INVERSE,
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_REGEX,
  STANDARD_DATE_TIME_FORMAT_VIEW,
  STANDARD_DATE_TIME_REGEX,
  STANDARD_DATE_TIME_REGEX_WITHOUT_TIMEZONE,
  STANDARD_TIME_FORMAT,
  STANDARD_TIME_REGEX,
  VIETNAMESE_TIME_ZONE_OFFSET,
} from "./../config/consts";
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(minMax);

export function formatDate(
  date: Dayjs | string | Date,
  dateFormat: string = STANDARD_DATE_FORMAT_INVERSE
) {
  if (date) {
    if (typeof date === "object" && "format" in date) {
      return date.format(dateFormat);
    } else {
      return dayjs(date).format(dateFormat);
    }
  }
  return null;
}

export function formatTime(
  time: Dayjs,
  timeFormat: string = STANDARD_TIME_FORMAT
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(timeFormat);
  }
  return dayjs(time).format(timeFormat);
}

export function formatDateTime(
  time: Dayjs,
  dateTimeFormat: string = STANDARD_DATE_TIME_FORMAT_VIEW
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(dateTimeFormat);
  }
  return dayjs(time).locale(vi).format(dateTimeFormat);
}

export function formatDateTimeFromNow(time: Dayjs, lang: string) {
  return dayjs(time)
    .locale(lang === "vi" ? vi : en)
    .fromNow();
}

export const formatDateTimeToVietnamTimezone = (
  date?: Dayjs | string | undefined,
  format = STANDARD_DATE_FORMAT_FULL
) => {
  if (isEmpty(date) || isUndefined(date)) {
    return null;
  }

  return dayjs(date).add(VIETNAMESE_TIME_ZONE_OFFSET, "hour").format(format);
};

export const formatDateToVietnamTimezone = (
  date?: Dayjs | string | undefined,
  format = STANDARD_DATE_FORMAT_SLASH
) => {
  if (isEmpty(date) || isUndefined(date)) {
    return null;
  }

  return dayjs(date).add(VIETNAMESE_TIME_ZONE_OFFSET, "hour").format(format);
};

export const utcVN = (date: Dayjs) => {
  return dayjs.utc(date).add(VIETNAMESE_TIME_ZONE_OFFSET, "hour");
};

export const getDateToVietnam = (date: Dayjs | string) => {
  return dayjs(date).add(VIETNAMESE_TIME_ZONE_OFFSET, "hour");
};

export const formatDateTimeNow = (
  date?: Dayjs | string | undefined,
  format = STANDARD_DATE_FORMAT_FULL
) => {
  if (isEmpty(date) || isUndefined(date)) {
    return null;
  }

  return dayjs
    .utc(date)
    .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
    .format(format);
};

export const convertUTCTimeToVietnamTimezone = (dateString: string) => {
  return dayjs(dateString).add(VIETNAMESE_TIME_ZONE_OFFSET, "hour");
};

export function isDateValue(date?: string) {
  return date?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
}

export function isTimeValue(time?: string) {
  return time?.match(/[0-9]{2}:[0-9]{2}/);
}

export function isDateTimeValue(time?: string) {
  return (
    time?.match(STANDARD_DATE_TIME_REGEX_WITHOUT_TIMEZONE) ||
    time?.match(STANDARD_DATE_TIME_REGEX) ||
    time?.match(STANDARD_DATE_REGEX) ||
    time?.match(STANDARD_TIME_REGEX)
  );
}

export function timeAgo(time: string) {
  time = time.slice(0, -1);
  const pastTime = dayjs(time);
  const currentTime = dayjs();
  const seconds = dayjs.duration(currentTime.diff(pastTime)).asSeconds();

  const time_formats = [
    [60, "giây trước", 1], // 60
    [120, "1 phút trước", "1 phút tới"], // 60*2
    [3600, " phút trước", 60], // 60*60, 60
    [7200, "1 giờ trước", "1 giờ tới"], // 60*60*2
    [86400, "giờ trước", 3600], // 60*60*24, 60*60
    [172800, "ngày hôm qua", "ngày mai"], // 60*60*24*2
    [604800, "ngày trước", 86400], // 60*60*24*7, 60*60*24
    [1209600, "tuần trước", "tuần sau"], // 60*60*24*7*4*2
    [2419200, "tuần trước", "tuần sau"], // 60*60*24*7*4, 60*60*24*7
    [4838400, "tháng trước", "tháng sau"], // 60*60*24*7*4*2
    [29030400, "tháng trước", "tháng sau"], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "năm trước", "năm sau"], // 60*60*24*7*4*12*2
    [2903040000, "năm trước", "năm sau"], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "thế kỉ trước", "thế kỉ sau"], // 60*60*24*7*4*12*100*2
    [58060800000, "thế kỉ trước", "thế kỉ sau"], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  const token = "",
    list_choice = 1;

  if (seconds === 0) {
    return "Vừa xong";
  }
  if (seconds < 0) {
    return "Vừa xong";
  }
  let i = 0,
    format;
  // eslint-disable-next-line no-cond-assign
  while ((format = time_formats[i++]))
    if (seconds < (format[0] as number)) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return null;
}

export const padMonth = (month: number): string => {
  return month?.toString()?.padStart(2, "0");
};

export const getISOStringDate = (date: Dayjs): string => {
  if (!date) return "";
  return dayjs(date).toISOString();
};

export const getISOStringStartDate = (date: Dayjs): string => {
  if (!date) return "";
  return dayjs(date).startOf("day").toISOString();
};

export const getDayIsoToString = (value: Dayjs | undefined | null | string) => {
  if (!value) return undefined;

  return dayjs(value)
    .startOf("day")
    .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
    .toDate()
    .toISOString();
};

// hide future dates
export const disableFutureDates = (currentDate: Dayjs): boolean => {
  return !!currentDate && currentDate.isAfter(dayjs(), DAY_TYPE);
};

export const addZStringToDate = (date: string): string => {
  return date + "Z";
};

/**
 * Recursively converts ISO date strings without the 'Z' suffix to include it.
 *
 * This function traverses through objects, arrays, and strings to find ISO date
 * strings that are missing the 'Z' timezone suffix and adds it. It works with
 * nested data structures of any depth.
 *
 * @template T - The type of data being processed
 * @param {T} data - The data to process, which can be a primitive, array, or object
 * @returns {T} - The processed data with 'Z' suffix added to matching date strings
 *
 * @example
 * // Returns "2023-01-01T12:00:00.000Z"
 * convertDatesRecursively("2023-01-01T12:00:00.000")
 *
 * @example
 * // Returns an object with converted date strings
 * convertDatesRecursively({
 *   date: "2023-01-01T12:00:00.000",
 *   nested: { anotherDate: "2023-02-01T14:30:00.000" }
 * })
 */
export const convertDatesRecursively = <T>(data: T): T => {
  // Handle string date formats
  if (typeof data === "string") {
    // ISO date format without Z: yyyy-MM-ddTHH:mm:ss.SSS
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
    if (dateRegex.test(data)) {
      return addZStringToDate(data) as unknown as T;
    }
    return data;
  }
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertDatesRecursively(item)) as unknown as T;
  }
  // Handle objects
  if (data !== null && typeof data === "object") {
    const newData: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = convertDatesRecursively(
          (data as Record<string, any>)[key]
        );
      }
    }
    return newData as T;
  }
  // Return primitive values as is
  return data;
};

export const getDisabledTime = (selectedDate: Dayjs | null) => {
  if (selectedDate && selectedDate.isSame(dayjs(), "day")) {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();

    return {
      disabledHours: () =>
        Array.from({ length: currentHour }, (_, hourIndex) => hourIndex),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === currentHour
          ? Array.from(
              { length: currentMinute },
              (_, minuteIndex) => minuteIndex
            )
          : [],
    };
  }
  return {};
};

export const getDisabledTimeOpenBid = (
  selectedDate: Dayjs | null,
  quoteEndTime: Dayjs
) => {
  if (!selectedDate) return {};

  const now = dayjs();
  const minAllowedTime = dayjs.max(now, quoteEndTime);

  const isSameDay = selectedDate.isSame(minAllowedTime, "day");

  if (!isSameDay) return {}; // nếu khác ngày → không chặn gì cả

  const minHour = minAllowedTime.hour();
  const minMinute = minAllowedTime.minute();

  return {
    disabledHours: () => Array.from({ length: minHour }, (_, i) => i),
    disabledMinutes: (selectedHour: number) =>
      selectedHour === minHour
        ? Array.from({ length: minMinute }, (_, i) => i)
        : [],
  };
};

export const getDisabledTimeSelected = (
  selectedDate: Dayjs | null,
  startTime?: Dayjs | null,
  isEndTime?: boolean
) => {
  if (!selectedDate) return {};

  const isToday = selectedDate.isSame(dayjs(), "day");
  const currentHour = dayjs().hour();
  const currentMinute = dayjs().minute();

  // Nếu là end time và có start time
  if (isEndTime && startTime) {
    const isSameDay = selectedDate.isSame(startTime, "day");

    if (isSameDay) {
      const startHour = startTime.hour();
      const startMinute = startTime.minute();

      return {
        disabledHours: () => {
          const disabledHours = [];

          // Disable các giờ đã qua (nếu là ngày hôm nay)
          if (isToday) {
            for (let i = 0; i < currentHour; i++) {
              disabledHours.push(i);
            }
          }

          // Disable các giờ trước start time
          for (let i = 0; i < startHour; i++) {
            if (!disabledHours.includes(i)) {
              disabledHours.push(i);
            }
          }

          return disabledHours;
        },
        disabledMinutes: (selectedHour: number) => {
          const disabledMinutes = [];

          // Nếu là ngày hôm nay và cùng giờ hiện tại
          if (isToday && selectedHour === currentHour) {
            for (let i = 0; i <= currentMinute; i++) {
              disabledMinutes.push(i);
            }
          }

          // Nếu cùng giờ với start time
          if (selectedHour === startHour) {
            for (let i = 0; i <= startMinute; i++) {
              if (!disabledMinutes.includes(i)) {
                disabledMinutes.push(i);
              }
            }
          }

          return disabledMinutes;
        },
      };
    }
  }

  // Logic cũ cho start time hoặc trường hợp thông thường
  if (isToday) {
    return {
      disabledHours: () =>
        Array.from({ length: currentHour }, (_, hourIndex) => hourIndex),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === currentHour
          ? Array.from(
              { length: currentMinute + 1 }, // +1 để disable cả phút hiện tại
              (_, minuteIndex) => minuteIndex
            )
          : [],
    };
  }

  return {};
};
