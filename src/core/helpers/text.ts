import { isEmpty, isNil, isUndefined } from "lodash";
import { NOT_TAB_ENTER_REGEX_REPLACE } from "../config/consts";

export const trimText = (value: string) => {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
};

/**
 * Combines two strings with a dash separator.
 * If both strings are undefined or null, an empty string is returned.
 * If only one of the strings is undefined or null, the other string is returned.
 * If both strings have values, they are concatenated with a dash separator.
 *
 * @param text1 - The first string to be combined.
 * @param text2 - The second string to be combined.
 * @returns The combined string.
 * @summary David's - david.jonathan@mail.com
 */
export const combineText = (text1?: string, text2?: string): string => {
  let dash = "";
  if (isNil(text1) && isNil(text2)) {
    return dash;
  }

  if (!isUndefined(text1) && !isUndefined(text2)) {
    dash = " - ";
  }

  return `${text1 || ""}${dash}${text2 || ""}`;
};

export const combineTextExtra = (
  ...texts: (string | undefined | null)[]
): string => {
  const filtered = texts.filter(
    (t) => t !== undefined && t !== null && t !== ""
  );

  return filtered.join(" - ");
};

export const replaceTextEnterTab = (value: string) => {
  if (isEmpty(value)) return "";
  return value.replace(NOT_TAB_ENTER_REGEX_REPLACE, "");
};

/**
 * Checks if a string contains Tab or Enter characters
 * @param text The string to check
 * @returns boolean indicating if Tab or Enter characters are present
 */
export const hasTabOrEnter = (text: string): boolean => {
  if (!text) return false;
  return NOT_TAB_ENTER_REGEX_REPLACE.test(text);
};
