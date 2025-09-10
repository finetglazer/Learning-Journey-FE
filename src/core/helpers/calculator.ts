import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { isEqual, isNil, multiply, sum } from "lodash";

export const toFixedNumber = (
  value: number,
  fractionDigits = numberConstants.TWO
) => {
  if (isNil(value)) return undefined;

  return Number(value.toFixed(fractionDigits));
};

export const sumWithFixed = (
  params: number[],
  numberFix = numberConstants.FOUR
) => {
  return toFixedNumber(sum(params), numberFix);
};

export const exchangeCurrencyWithFixed = (
  money: number,
  exchangeRate: number
) => {
  return toFixedNumber(multiply(exchangeRate, money), numberConstants.ZERO);
};

export const multiplyWithFixed = (a: number, b: number) => {
  return toFixedNumber(multiply(a, b));
};

export const dividedWithFixed = (a: number, b: number) => {
  return toFixedNumber(a / b);
};

export const toFixedByCurrency = (value: number, currencyCode: string) => {
  const fractionDigits =
    isEqual(currencyCode, JPY_CURRENCY_UNIT) ||
    isEqual(currencyCode, VND_CURRENCY_UNIT)
      ? numberConstants.ZERO
      : undefined;
  return toFixedNumber(value, fractionDigits);
};
