import { CHARACTER_TAB_REGEX, EMAIL_REGEX } from "core/config/consts";
import { t } from "i18next";
import { get, gt, isArray, isEmpty, isNil, isObject } from "lodash";

export interface ValidatorParams<T> {
  filedValidate: string[];
  data: T;
  maxLength?: number;
}

export const validator = {
  required: function required<T>({ filedValidate, data }: ValidatorParams<T>) {
    return filedValidate.reduce(
      (accumulator: { [key: string]: string }, currentFiled) => {
        const value = get(data, currentFiled);
        if (
          isNil(value) ||
          value === "" ||
          (isArray(value) && isEmpty(value))
        ) {
          accumulator[currentFiled] = t("CM.input_require_validation");
        }
        return accumulator;
      },
      {}
    );
  },

  tabCharacter: function tab<T>({ filedValidate, data }: ValidatorParams<T>) {
    return filedValidate.reduce(
      (accumulator: { [key: string]: string }, currentFiled) => {
        const value = get(data, currentFiled);

        if (!value) {
          return accumulator;
        }

        if (CHARACTER_TAB_REGEX.test(value)) {
          accumulator[currentFiled] = t("CM.input_tab_validation");
        }

        return accumulator;
      },
      {}
    );
  },

  maxLength: function maxLength<T>({
    filedValidate,
    data,
    maxLength,
  }: ValidatorParams<T>) {
    return filedValidate.reduce(
      (accumulator: { [key: string]: string }, currentFiled) => {
        if (gt(get(data, currentFiled)?.length, maxLength)) {
          accumulator[currentFiled] = t("CM.input_length_validation", {
            maxLength,
          });
        }

        return accumulator;
      },
      {}
    );
  },

  isEmail: function isEmail<T>({ filedValidate, data }: ValidatorParams<T>) {
    return filedValidate.reduce(
      (accumulator: { [key: string]: string }, currentFiled) => {
        const value = get(data, currentFiled);
        if (!value) {
          return accumulator;
        }
        if (typeof value === "string" && !EMAIL_REGEX.test(value)) {
          accumulator[currentFiled] = t("CM.input_email_validation");
        }
        return accumulator;
      },
      {}
    );
  },
};

/**
 * Recursively validates fields in an object and populates an errors object.
 *
 * @param {any} obj - The object to validate.
 * @param {Record<string, any>} [errors={}] - The object to store validation errors.
 * @param {string} [parentKey=""] - The parent key for nested objects.
 * @returns {Record<string, any>} The errors object populated with validation errors.
 */
export const validateFieldsClearError = (
  obj: Record<string, any>,
  errors: Record<string, any> = {},
  parentKey?: string
): Record<string, any> => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (isObject(value) && !Array.isArray(value)) {
      // If the value is an object, recursively validate its fields
      validateFieldsClearError(value, errors, fullKey);
    } else if (Array.isArray(value)) {
      // If the value is an array, iterate over its elements
      value.forEach((item, index) => {
        if (isObject(item)) {
          validateFieldsClearError(item, errors, `${fullKey}[${index}]`);
        } else if (!isEmpty(item)) {
          errors[`${fullKey}[${index}]`] = null;
        }
      });
    } else if (!isEmpty(value)) {
      // If the value is not empty, add an error entry
      errors[fullKey] = null;
    }
  });

  return errors;
};
