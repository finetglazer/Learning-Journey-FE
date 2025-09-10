import { fieldType, NUMBER_MAX_13 } from "config/const";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import { isEqual } from "lodash";
import { TWO_NUMBER_FIX } from "./number";

export const formatCurrency = (value: number): string => {
  const scaledAmount = value;
  const formattedAmount = scaledAmount?.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formattedAmount;
};

export const formatCurrencyByLocale = (
  amount: number,
  currency: string
): string => {
  if (isNaN(amount)) return "0";

  const checkMoney =
    isEqual(currency, VND_CURRENCY_UNIT) ||
    isEqual(currency, JPY_CURRENCY_UNIT);

  if (checkMoney) {
    return Math.round(amount).toLocaleString("vi-VN");
  }

  const formatted = amount.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted.endsWith(",00") ? formatted.replace(",00", "") : formatted;
};

export const getNumberTypeByCurrency = (currencyCode = VND_CURRENCY_UNIT) => {
  return isEqual(currencyCode, VND_CURRENCY_UNIT) ||
    isEqual(currencyCode, JPY_CURRENCY_UNIT)
    ? fieldType.LONG
    : fieldType.DECIMAL;
};

export const detectIntegerCurrency = (currencyCode = VND_CURRENCY_UNIT) =>
  isEqual(currencyCode, VND_CURRENCY_UNIT) ||
  isEqual(currencyCode, JPY_CURRENCY_UNIT);

export const getMaxNumberByCurrency = (currencyCode = VND_CURRENCY_UNIT) => {
  return isEqual(currencyCode, VND_CURRENCY_UNIT) ||
    isEqual(currencyCode, JPY_CURRENCY_UNIT)
    ? NUMBER_MAX_13
    : undefined;
};

export const formatDecimal = (
  value: number,
  decimals = TWO_NUMBER_FIX
): string =>
  Number.isInteger(value) ? value?.toString() : value?.toFixed(decimals);
