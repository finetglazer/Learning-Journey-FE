import { DropdownItem } from "@/components/core/dropdown/type";
import { PASSWORD_GOOD_LENGTH, PASSWORD_MINIMUM_LENGTH, PASSWORD_REGEX, TIME_STR_REGEX, timezoneGroups } from "@/const/consts";
import { FieldError } from "@/model/field-error";
import { Task, UnscheduledMonthData } from "@/model/task";
import { clsx, type ClassValue } from "clsx"
import { addWeeks, endOfMonth, endOfWeek, format, isBefore, isSameDay, roundToNearestHours, startOfMonth, startOfWeek } from "date-fns";
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

export const getTasksForDay = (
  calendarMap: Record<string, Task[]>,
  curDayAsDate: Date
): Task[] => {
  const tasksForDay: Task[] = [];
  const startOfDay = dayjs(curDayAsDate).startOf('day');
  for (let i = 0; i < 24; i++) {
    const currentHour = startOfDay.add(i, 'hour');
    const key = currentHour.toISOString();
    if (calendarMap[key]) {
      tasksForDay.push(...calendarMap[key]);
    }
  }

  return tasksForDay;
};

export const initCalendarMap = (tasks?: Task[]) => {
  const map: Record<string, Task[]> = {};
  if (!tasks || tasks.length === 0) {
    return map;
  }
  for (const task of tasks) {
    const taskStartTime = toDayJs(task.startTime);
    const targetTime = taskStartTime.startOf("hour");
    if (
      task.type?.toLowerCase() === "routine" &&
      task.pattern &&
      (task.pattern?.daysOfWeek || []).length > 0
    ) {
      // --- ROUTINE LOGIC ---

      // Create a Set for efficient lookup, e.g., {"MONDAY", "FRIDAY"}
      const patternDays = new Set(task.pattern.daysOfWeek);

      // Define loop boundaries
      let currentDay = taskStartTime.clone().startOf("day");
      const endOfMonth = taskStartTime.clone().endOf("month");

      // Iterate from the task's start day to the end of the month
      while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth, "day")) {

        const dayName = currentDay.format("dddd").toUpperCase(); // e.g., "TUESDAY"

        // Check if the current day is in the routine's pattern
        if (patternDays.has(dayName)) {
          // If it matches, create the key for this day at the target time
          const keyTime = currentDay
            .hour(targetTime.hour())
            .minute(targetTime.minute())
            .second(0).millisecond(0);

          const key = dayJsToISOString(keyTime);

          if (!map[key]) {
            map[key] = [];
          }
          map[key].push(task);
        }

        // Move to the next day
        currentDay = currentDay.add(1, "day");
      }
      continue;
    }
    const taskTime = toDayJs(task.startTime);
    const roundedTime = taskTime.startOf("hour");
    const key = dayJsToISOString(roundedTime);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(task);
  }

  return map;
};

export const getPercentageHeight = (task: Task): number => {
  if (!task || !task.startTime || !task.endTime) {
    return 0; // or a default height, e.g., 100
  }

  const startTime = dayjs(task.startTime);
  const endTime = dayjs(task.endTime);

  if (!startTime.isValid() || !endTime.isValid()) {
    return 0; // Invalid dates
  }

  // Calculate the difference in minutes
  const diffInMinutes = endTime.diff(startTime, "minute");

  if (diffInMinutes <= 0) {
    return 0;
  }

  // 1 hour = 60 minutes.
  const percentageHeight = (diffInMinutes / 60) * 100;

  return percentageHeight / 100;
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

  return dayjsObject.format('DD/MM HH:mm');
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
  clickX: number, // This is e.clientX
  clickY: number, // This is e.clientY
  scrollContainer?: HTMLDivElement | null
) => {
  // These constants were in your original stub.
  const EDITOR_WIDTH = 380;
  const EDITOR_HEIGHT = 550;
  const VIEWPORT_PADDING = 16; // Use a simple 16px padding

  // Fallback if the ref isn't ready
  if (!scrollContainer) {
    return { x: clickX, y: clickY };
  }

  // 1. Get the parent container's position on the screen
  const parentRect = scrollContainer.getBoundingClientRect();
  // 2. Get how much the parent container has been scrolled
  const parentScrollTop = scrollContainer.scrollTop;
  const parentScrollLeft = scrollContainer.scrollLeft;

  // 3. Calculate the click position relative to the parent's scrolled content
  // (Click on screen) - (Parent's position on screen) + (Parent's scroll)
  let relativeX = clickX - parentRect.left + parentScrollLeft;
  let relativeY = clickY - parentRect.top + parentScrollTop;

  // 4. (Optional but recommended) Adjust position to prevent editor
  //    from appearing off-screen (based on viewport, not parent)

  // If it overflows the right side of the *viewport*
  if (clickX + EDITOR_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
    // Reposition it to the left of the cursor
    relativeX = (clickX - EDITOR_WIDTH) - parentRect.left + parentScrollLeft;
  }

  // If it overflows the bottom of the *viewport*
  if (clickY + EDITOR_HEIGHT > window.innerHeight - VIEWPORT_PADDING) {
    // Reposition it above the cursor
    relativeY = (clickY - EDITOR_HEIGHT) - parentRect.top + parentScrollTop;
  }

  // 5. Ensure it never goes outside the parent's boundaries
  relativeX = Math.max(parentScrollLeft, relativeX);
  relativeY = Math.max(parentScrollTop, relativeY);

  return { x: relativeX, y: relativeY };
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

export const getTaskById = (monthData: UnscheduledMonthData[], subtaskId?: string | number | null, updatedTasks?: Task[]) => {
  if (!(updatedTasks || []).length) {
    for (const monthDataItem of monthData) {
      const foundTask = (monthDataItem?.unscheduledBigTasks || []).find(
        unscheduledBigTask => (unscheduledBigTask?.suggestedSubtasks || []).some(subtask => subtask.id === subtaskId)
      );

      if (foundTask) {
        return (foundTask?.suggestedSubtasks || []).find(subtask => subtask.id === subtaskId);
      }
    }
  }
  return (updatedTasks || []).find(updatedTask => updatedTask.id === subtaskId);
};

export const getRoutineById = (monthData: UnscheduledMonthData[], routineId?: string | number | null, updatedTasks?: Task[]) => {
  if (!(updatedTasks || []).length) {
    let foundRoutine: any = undefined;
    for (const monthDataItem of monthData) {
      const t = (monthDataItem?.unscheduledRoutines || []).find(
        unscheduledRoutine => unscheduledRoutine?.id === routineId
      );
      if (t && !foundRoutine) {
        foundRoutine = t;
      }
    }
    if (foundRoutine) {
      return foundRoutine;
    }
  }
  return (updatedTasks || []).find(updatedTask => updatedTask?.id === routineId);
};

export const getBigTask = (monthData: UnscheduledMonthData[], bigTaskId: number) => {
  let monthItemRes: any = undefined;
  let monthItemIndex: number = -1;
  monthData.forEach((monthItem, index) => {
    if ((monthItem?.unscheduledBigTasks || []).some(bigTask => bigTask?.bigTaskId === bigTaskId) && !monthItemRes) {
      monthItemRes = monthItem;
      monthItemIndex = index;
    }
  });
  if (!monthItemRes) {
    return { index: -1, item: undefined, monthDataIndex: -1 };
  }
  const bigTask = (monthItemRes?.unscheduledBigTasks || []).find((bigTask: any) => bigTask?.bigTaskId === bigTaskId);
  const bigTaskIndex = (monthData[monthItemIndex]?.unscheduledBigTasks || []).findIndex(bigTask => bigTask?.bigTaskId === bigTask?.bigTaskId);
  return { index: bigTaskIndex, item: bigTask, monthDataIndex: monthItemIndex };
};

export const getDetails = (model: Task | Omit<Task, "id">) => {
  if (model?.type === "task") {
    return {
      taskDetails: {
        estimatedHours: model?.estimatedHours,
        dueDate: model?.dueDate,
        parentBigTaskId: model?.parentBigTaskId,
      },
    };
  }
  if (model?.type === "event") {
    return {
      eventDetails: {
        location: model?.location,
        attendees: model?.attendees,
        isAllDay: model?.isAllDay || false,
      }
    };
  }
  if (model?.type === "routine") {
    return {
      routineDetails: {
        pattern: model?.pattern,
      }
    }
  }
};

// Week: "31-06", "02-09"
export const getWeekStartTimeEndTime = (week: string, currentDate: Dayjs) => {
  const weekParts = week.split("-");
  const weekStartDateNum = Number(weekParts[0]); // 31
  const weekEndDateNum = Number(weekParts[1]);   // 7

  let startDate, endDate;

  // Check if the week spans across two different months (e.g., start date 31, end date 7)
  if (weekStartDateNum > weekEndDateNum) {

    const currentDayOfMonth = currentDate.date(); // 3

    // Check if the current date is in the *first* part of the week (e.g., Oct 31st)
    // or the *second* part (e.g., Nov 3rd)
    if (currentDayOfMonth >= weekStartDateNum) {
      // We are in the first month (e.g., October)
      // e.g., if currentDate was Oct 31st, currentDayOfMonth (31) >= weekStartDateNum (31)
      startDate = currentDate.date(weekStartDateNum);
      // The end date must be in the *next* month
      endDate = currentDate.add(1, 'month').date(weekEndDateNum);
    } else {
      // We are in the second month (e.g., November)
      // e.g., if currentDate is Nov 3rd, currentDayOfMonth (3) < weekStartDateNum (31)
      // The start date must be in the *previous* month
      startDate = currentDate.subtract(1, 'month').date(weekStartDateNum);
      endDate = currentDate.date(weekEndDateNum);
    }

  } else {
    // The week is fully within the current month (e.g., "10-17")
    startDate = currentDate.date(weekStartDateNum);
    endDate = currentDate.date(weekEndDateNum);
  }

  return { startDate, endDate };
};

export const findTimezone = (utc: string) => {
  let res = { label: "(UTC+00:00) London, Dublin, Lisbon", value: "Europe/London", utc: "UTC+00:00" };
  timezoneGroups.forEach(group => group.zones.forEach(zone => {
    if (zone.utc === utc) {
      res = zone;
    }
  }));
  return res;
};

/**
 * Helper function to convert "HH:mm" string to fractional hours.
 * e.g., "06:15" -> 6.25
 */
export const timeToFractionalHours = (time: string): number => {
  if (!time || !time.includes(':')) {
    return 0; // Default to midnight if format is invalid
  }
  const [hours, minutes] = time.split(':').map(Number);
  return hours + (minutes / 60);
};

export const isTaskOnDay = (taskStartTime: string, day: Date) => {
  if (!taskStartTime) {
    return false;
  }
  // dayjs() can parse both the ISO string and the Date object
  return dayjs(taskStartTime).isSame(dayjs(day), 'day');
};

export const getTasksForDayInYearView = (tasks: Task[], day: Date): Task[] => {
    if (!tasks || tasks.length === 0) {
      return [];
    }
    return tasks.filter(task => {
      if (!task.startTime) return false;
      // Compare the task's start date with the day
      return isSameDay(new Date(task.startTime), day);
    });
  };