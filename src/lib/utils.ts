import { PASSWORD_GOOD_LENGTH, PASSWORD_MINIMUM_LENGTH, PASSWORD_REGEX } from "@/const/consts";
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

export const getNumberOfSatisfiedCategories = (password: string) => {
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