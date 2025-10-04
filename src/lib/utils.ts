import { DropdownItem } from "@/components/core/dropdown/type";
import { PASSWORD_GOOD_LENGTH, PASSWORD_MINIMUM_LENGTH, PASSWORD_REGEX, TIME_STR_REGEX } from "@/const/consts";
import { FieldError } from "@/model/field-error";
import { Task } from "@/model/task";
import { clsx, type ClassValue } from "clsx"
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const classNames = (...classNames: string[]) => {
  return classNames.reduce((joinedClassName, currentClassName) =>
    joinedClassName + (currentClassName ? currentClassName + " " : ""), "").trim();
};

export const uuid4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const convertArrErrToObjErr = (err: FieldError[]) => {
  return err.reduce((res: any, item) => {
    res[item.field] = item.message;
    return res;
  }, {});
};

export const getNumberOfSatisfiedCategories = (password: string | null) => {
  if (!password) {
    return 0;
  }
  const reachedMinimumLength = password.length >= PASSWORD_MINIMUM_LENGTH;
  const matchedRegex = PASSWORD_REGEX.test(password);
  const reachedGoodLength = password.length >= PASSWORD_GOOD_LENGTH;
  let res = 0;
  if (reachedMinimumLength || matchedRegex || reachedGoodLength) {
    ++res;
  }
  if (matchedRegex && reachedMinimumLength) {
    ++res;
  }
  if (matchedRegex && reachedGoodLength) {
    ++res;
  }
  return res;
};

export const generateTimeSlots = (timeStr?: string) => {
  const times: DropdownItem[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

      const paddedHour = String(displayHour).padStart(2, '0');
      const paddedMinute = String(minute).padStart(2, '0');

      const content = `${displayHour}:${paddedMinute}${period}`;
      const id = `${paddedHour}-${paddedMinute}-${period}`;

      times.push({ id, content });
    }
  }
  const res = times.filter((time: { id: string, content?: string }) => (time?.content || "").includes(timeStr || ""));
  // res does not contain any elements at all but timeStr is a correct time format such as 10:37am, 9:09pm,... 
  if (!res.length && TIME_STR_REGEX.test(timeStr || "")) {
    const filledTimeStr = ((timeStr || "").length === 6 ? "0" : "").concat(timeStr || "")
    return [{
      id: filledTimeStr.split(":").join("-").substring(0, filledTimeStr.length - 2)
        .concat("-")
        .concat(filledTimeStr.substring(filledTimeStr.length - 2, filledTimeStr.length)),
      content: filledTimeStr,
    }];
  }
  return res;
};

export const filterItems = (items: DropdownItem[], name?: string) => {
  const trimmedName = (name || "").trim().toLowerCase();
  return items.filter(item => (item?.content || "").trim().toLowerCase().includes(trimmedName));
};

export const toISOString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString();
}

export const dayJsToISOString = (dayjs: Dayjs) => {
  dayjs = dayjs.add(7, "hour");
  return dayjs.toISOString();
};

export const getNearestMonday = () => {
  return dayjs().subtract(dayjs().get("day") - 1, "day").startOf("day");
};

export const initCalendarMap = (mondayTime: Dayjs, tasks?: Task[]) => {
  const map: Record<string, any[]> = {};

  for (let i = 0; i < 7; i++) {
    const day = mondayTime.add(i, "day");
    for (let j = 0; j < 24; ++j) {
      const isoKey = dayJsToISOString(day.add(j, "hour")); // e.g. "2025-09-29T00:00:00"
      map[isoKey] = [];
    }
  }

  (tasks || []).forEach((task: Task) => {
    const timeKeys = Object.keys(map);
    const day = mondayTime;
    if (task?.type === "routine") {
      const leftBound = toDayJs(maxTime(task?.routineStartTime || dayJsToISOString(dayjs()), dayJsToISOString(day)));
      const rightBound = toDayJs(minTime(dayJsToISOString(day.add(6, "day")), task?.routineEndTime || "9999-12-31T23:59:59.000Z"));
      for (let j = leftBound; j <= rightBound; j = j.add(1, "day")) {
        const startHour = task?.routineStartHour || "00:00";
        const endHour = task?.routineEndHour || "23:59";
        const isoStringStartTime = dayJsToISOString(j.hour(Number(startHour.split(":")[0])).minute(Number(startHour.split(":")[1])));
        const isoStringEndTime = dayJsToISOString(j.hour(Number(endHour.split(":")[0])).minute(Number(endHour.split(":")[1])));
        const dayTimeLeftIndex = leftBoundIndex(timeKeys, isoStringStartTime);
        const dayTimeRightIndex = rightBoundIndex(timeKeys, isoStringEndTime);
        if (dayTimeLeftIndex !== null && dayTimeRightIndex !== null) {
          for (let k = dayTimeLeftIndex; k <= dayTimeRightIndex; ++k) {
            map[timeKeys[k]].push({
              ...task,
              id: isoStringStartTime,
              startTime: isoStringStartTime,
              endTime: isoStringEndTime,
            });
          }
        }
      }
    }
    else {
      const leftTimeIndex = leftBoundIndex(timeKeys, task.startTime);
      const rightTimeIndex = rightBoundIndex(timeKeys, task.endTime);
      if (leftTimeIndex !== null && rightTimeIndex !== null) {
        for (let j = leftTimeIndex; j <= rightTimeIndex; ++j) {
          map[timeKeys[j]].push(task);
        }
      }
    }
  });

  return map;
};

export const leftBoundIndex = (timeKeys: string[], timeStr: string) => {
  let l = 0;
  let r = timeKeys.length;

  while (l < r) {
    const m = Math.floor((l + r) / 2);
    if (timeKeys[m] < timeStr) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  if (timeKeys[l] === timeStr) {
    return l;
  }
  if (timeKeys[l] > timeStr && l > 0) {
    return l - 1;
  }
  return null;
};

export const rightBoundIndex = (timeKeys: string[], timeStr: string): number | null => {
  let l = 0;
  let r = timeKeys.length;

  while (l < r) {
    const m = Math.floor((l + r) / 2);

    if (timeKeys[m] < timeStr) {
      l = m + 1;
    } else {
      r = m;
    }
  }

  if (l === timeKeys.length) {
    return l - 1;
  }

  return l;
};


export const maxTime = (a: string, b: string) => {
  return a > b ? a : b;
};

export const minTime = (a: string, b: string) => {
  return a < b ? a : b;
};

export const reId = (tasks: Task[]) => {
  const newTasks = tasks;
  for (let i = 0; i < newTasks.length; ++i) {
    let indexes: number[] = [];
    for (let j = i + 1; j < newTasks.length; ++j) {
      if (newTasks[i].id === newTasks[j].id) {
        indexes.push(j);
      }
    }
    indexes.forEach((index: number, ind: number) => {
      newTasks[index].id = newTasks[index].id + "-" + (ind + 1);
    });
  }
  return newTasks;
};

export const toDayJs = (time: string, gmt?: number) => {
  return dayjs(time).subtract(7, "hour");
};