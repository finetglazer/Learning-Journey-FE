import { DropdownItem } from "@/components/core/dropdown/type";
import { PASSWORD_GOOD_LENGTH, PASSWORD_MINIMUM_LENGTH, PASSWORD_REGEX, TIME_STR_REGEX } from "@/const/consts";
import { FieldError } from "@/model/field-error";
import { Task } from "@/model/task";
import { clsx, type ClassValue } from "clsx"
import { addWeeks, endOfMonth, endOfWeek, format, isBefore, startOfMonth, startOfWeek } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { isNil } from "lodash";
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
  dayjs = dayjs.add(7, "hour").millisecond(0);
  return dayjs.toISOString();
};

export const dateToDayJs = (date: Date, gmt?: number) => {
  return dayjs(date).subtract(isNil(gmt) ? 0 : gmt, "hour");
};

export const dateToIsoString = (date: Date, gmt?: number) => {
  return dayJsToISOString(dateToDayJs(date, gmt));
};

export const isoStringToDate = (isoString: string) => {
  const dayjs = toDayJs(isoString);
  return dayjs.toDate();
};

export const getMondayOfThisWeek = (currentDate?: Dayjs): Dayjs => {
  const dateToProcess = currentDate || dayjs();
  const dayOfWeek = dateToProcess.day(); // 0 = Sunday, 1 = Monday, ...

  // If dayOfWeek is 0 (Sunday), subtract 6 days.
  // Otherwise, subtract (dayOfWeek - 1) days.
  const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return dateToProcess.subtract(adjustment, 'day').startOf('day');
};

export const getTasksForDay = <T extends { id: string }>(
  tasks: T[],
  curDayAsDate: Date
): T[] => {
  return tasks.filter(task => {
    const taskId = task.id.endsWith("Z") ? task.id : task.id.replace(/[+-]\d+$/, ""); // 2025-10-20T09:00:00.000Z-1
    const curDay = dayjs(curDayAsDate);
    const taskDate = dayjs(taskId);
    return taskDate.isSame(curDay, 'day');
  });
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
    const leftTimeIndex = leftBoundIndex(timeKeys, task.startTime);
    const rightTimeIndex = leftBoundIndex(timeKeys, task.endTime);
    if (leftTimeIndex !== null && rightTimeIndex !== null) {
      for (let j = leftTimeIndex; j <= rightTimeIndex; ++j) {
        map[timeKeys[j]].push(task);
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
  const newTasks = [...tasks];
  for (let i = 0; i < newTasks.length; ++i) {
    const indexes: number[] = [];
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

export const toDayJs = (time?: string, gmt?: number) => {
  if (!time) {
    return dayjs().subtract(isNil(gmt) ? 7 : gmt, "hour");
  }
  return dayjs(time).subtract(isNil(gmt) ? 7 : gmt, "hour");
};

export const isoToHHMM = (isoString: string, gmt?: number) => {
  const time = toDayJs(isoString, gmt);
  const hours = time.get("hour").toString().padStart(2, '0');
  const minutes = time.get("minute").toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export const isoToStandardTime = (isoString: string, gmt?: number) => {
  const dayjsObject = toDayJs(isoString, gmt);

  return dayjsObject.format('DD/MM/YYYY');
};

export const getRoutineDates = (task: Task, startTime: string, endTime: string) => {
  const currentTime = task.startTime || dayJsToISOString(dayjs());
  let res = [];
  for (let i = toDayJs(maxTime(currentTime, startTime)); i <= toDayJs(endTime); i = i.add(1, "day")) {
    const isoString = dayJsToISOString(i);
    if (startTime <= isoString && (task?.routinePattern || []).includes(i.get("day"))) {
      res.push(i.get("date"));
    }
  }
  return res;
};

export const isCollidingWithSleepTime = (task: Task, sleepStartTime: string, sleepEndTime: string) => {
  const taskStartHHMM = isoToHHMM(task.startTime);
  const taskEndHHMM = isoToHHMM(task.endTime);
  const isSleepOvernight = sleepEndTime > "00:00" && "23:59" >= sleepStartTime;
  if (isSleepOvernight) {
    return sleepStartTime < taskEndHHMM && taskEndHHMM <= "23:59" ||
      "00:00" <= taskEndHHMM && taskEndHHMM <= sleepEndTime ||
      sleepStartTime <= taskStartHHMM && taskStartHHMM <= "23:59" ||
      "00:00" <= taskStartHHMM && taskStartHHMM < sleepEndTime;
  } else {
    return !(taskStartHHMM >= sleepEndTime || taskEndHHMM <= sleepStartTime);
  }
};

export const overlappingTasksExists = (task: Task, tasks: Task[]) => {
  return tasks.some(taskItem => taskItem.startTime === task.startTime);
};

export const getDaysInMonth = (month: number) => {
  const today = new Date();
  const year = today.getFullYear();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let day = 1; day <= lastDayOfMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

export const getEditorAdjustedPosition = (
  x: number,
  y: number,
  offsetX: number = 0,
  offsetY: number = 0
) => {
  const EDITOR_WIDTH = 380;
  const EDITOR_HEIGHT = 550;
  const SCREEN_PADDING = 0;

  const initialX = x + offsetX;
  const initialY = y + offsetY;

  const maxX = window.innerWidth - EDITOR_WIDTH - SCREEN_PADDING;
  const maxY = window.innerHeight - EDITOR_HEIGHT - SCREEN_PADDING;

  const finalX = Math.max(SCREEN_PADDING, Math.min(initialX, maxX));
  const finalY = Math.max(SCREEN_PADDING, Math.min(initialY, maxY));

  return { x: finalX, y: finalY };
};

export const getWeeksInMonth = (month: number, year?: number) => {
  const date = new Date(year || dayjs().get("year"), month);

  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  const weeks = [];

  let currentWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

  while (isBefore(currentWeekStart, lastDayOfMonth)) {
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    const startDay = format(currentWeekStart, 'd');
    const endDay = format(currentWeekEnd, 'd');

    weeks.push(`${startDay} - ${endDay}`);

    currentWeekStart = addWeeks(currentWeekStart, 1);
  }

  return weeks;
};

export const getMonthName = (monthIndex: number) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[monthIndex];
}