import { PASSWORD_GOOD_LENGTH, PASSWORD_MINIMUM_LENGTH, PASSWORD_REGEX, TIME_STR_REGEX } from "@/const/consts";
import { FieldError } from "@/model/field-error";
import { clsx, type ClassValue } from "clsx"
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
  const times = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

      const paddedHour = String(displayHour).padStart(2, '0');
      const paddedMinute = String(minute).padStart(2, '0');

      const display = `${displayHour}:${paddedMinute}${period}`;
      const id = `${paddedHour}-${paddedMinute}-${period}`;

      times.push({ id, display });
    }
  }
  const res = times.filter((time: {id: string, display: string}) => time.display.includes(timeStr || ""));
  // res does not contain any elements at all but timeStr is a correct time format such as 10:37am, 9:09pm,... 
  if (!res.length && TIME_STR_REGEX.test(timeStr || "")) {
    const filledTimeStr = ((timeStr || "").length === 6 ? "0" : "").concat(timeStr || "")
    return [{
      id: filledTimeStr.split(":").join("-").substring(0, filledTimeStr.length - 2)
      .concat("-")
      .concat(filledTimeStr.substring(filledTimeStr.length - 2, filledTimeStr.length)),
      display: filledTimeStr,
    }];
  }
  return res;
};

export const convertTimeIdToTime = (id: string) => {
  if (id === "") return "";
  const t = id.split("-");
  return t.slice(0, 2).join(":").concat(t[2]);
};