import {
  QUERY_KEY_VALUE_SEPARATOR,
  QUERY_PARAM_PREFIX,
  QUERY_PARAM_SEPARATOR,
} from "config/const";
import { SLASH } from "core/config/consts";
import { isEmpty } from "lodash";

export function getParameterByName(name: string, url?: string) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function getLastPath(path: string): string {
  const parts = path.split(SLASH);
  return SLASH + parts[parts.length - 1];
}

/**
 * Opens a new tab with a URL constructed from the base URL, path array, and query parameters.
 *
 * This function concatenates the elements of the pathArray, filters out invalid elements (null, undefined, empty strings),
 * and constructs a query string from the queryObject (key-value pairs). It then opens a new tab with the resulting URL.
 *
 * @param baseUrl - The base URL
 * @param pathArray - An array of path segments (e.g., ['product', 'details']).
 * @param queryObject - An object representing query parameters (e.g., { id: 123, name: 'product' }).
 */
export const openNewTab = (
  baseUrl: string,
  pathArray: string[] = [],
  queryObject: { [key: string]: string | number | boolean } = {}
): void => {
  let path = pathArray.filter((item) => item && item.trim()).join(SLASH);

  if (path && !path.startsWith(SLASH)) {
    path = SLASH + path;
  }

  let queryParams = "";
  const queryParamsArray = Object.entries(queryObject).filter(
    (query) => !isEmpty(query)
  );

  if (!isEmpty(queryParamsArray)) {
    const queryParts = queryParamsArray.map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      return `${encodedKey}${QUERY_KEY_VALUE_SEPARATOR}${encodedValue}`;
    });

    queryParams = QUERY_PARAM_PREFIX + queryParts.join(QUERY_PARAM_SEPARATOR);
  }

  const url = baseUrl + path + queryParams;

  window.open(url, "_blank");
};
