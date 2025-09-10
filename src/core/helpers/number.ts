import { isInteger, isNil, toString } from "lodash";

import DecimalJS from "decimal.js";

export const THOUSAND_SEPARATOR = ".";

export const DECIMAL_SEPARATOR = ",";

const VND_CURRENCY = "VND";
export const TWO_NUMBER_FIX = 2;
export const JPY_CURRENCY = "JPY";

export function formatNumber(x: number | string): string | null {
  if (x === null || x === undefined) return null;

  // Chuyển đổi x thành chuỗi
  const str = x.toString();

  // Tách phần nguyên và phần thập phân
  const [integerPart, decimalPart] = str.split(".");

  // Định dạng phần nguyên với dấu phân cách hàng nghìn
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    THOUSAND_SEPARATOR
  );

  // Kết hợp phần nguyên và phần thập phân với dấu phân cách thập phân
  return decimalPart
    ? `${formattedIntegerPart}${DECIMAL_SEPARATOR}${decimalPart}`
    : formattedIntegerPart;
}

function roundValue(
  value: number,
  isVND: boolean,
  shouldRoundTwoNumber?: boolean
): number {
  if (isVND) {
    return roundNumberDecimal(value, 0);
  }
  return roundNumberDecimal(value, shouldRoundTwoNumber ? 2 : 4);
}

/**
 * Thêm dấu chấm (.) ngăn cách 3 chữ số ở phần nguyên
 * 123456 => "123.456"
 */
function formatIntegerPart(rawInteger: string): string {
  return rawInteger.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSAND_SEPARATOR);
}

/**
 * formatCurrency: format tiền tệ
 * - Nếu value null/undefined, NaN, =0 => trả về "0"
 * - Với VND hoặc value kiểu integer => không hiển thị phần thập phân
 * - Với currency khác => hiển thị thập phân (có xử lý trailing zeros)
 * - Dùng dấu "," ngăn cách phần thập phân
 */
export function formatCurrency({
  value = 0,
  shouldRoundTwoNumber = false,
  code = VND_CURRENCY,
}: {
  value: number;
  shouldRoundTwoNumber?: boolean;
  code?: string;
}): string {
  if (isNil(value) || isNaN(value) || value === 0) {
    return "0";
  }

  const isVND = [VND_CURRENCY, JPY_CURRENCY].includes(code?.toUpperCase());

  const rounded = roundValue(value, isVND, shouldRoundTwoNumber);

  // Tách phần nguyên và thập phân
  const [integerPartRaw, decimalPartRaw = ""] =
    toString(rounded).split(THOUSAND_SEPARATOR);
  const integerPart = formatIntegerPart(integerPartRaw);

  // Với VND hoặc value là số nguyên => chỉ trả về phần nguyên
  if (isVND || isInteger(value)) {
    return integerPart;
  }

  // Loại bỏ số 0 thừa ở cuối phần thập phân
  const decimalPartTrimmed = decimalPartRaw.replace(/0+$/, "");

  // Nếu phần thập phân sau khi trim rỗng => không hiển thị
  if (!decimalPartTrimmed) {
    return integerPart;
  }

  // Dùng dấu "," ngăn cách phần thập phân
  return `${integerPart}${DECIMAL_SEPARATOR}${decimalPartTrimmed}`;
}

export function parseNumber(formattedNumber: string): number | null {
  const parts: string[] = formattedNumber.split(DECIMAL_SEPARATOR, 2);
  parts[0] = parts[0].split(THOUSAND_SEPARATOR).join("");
  let result: number;
  if (parts.length === 1) {
    result = parseInt(parts[0], 10);
  } else {
    result = parseFloat(parts.join("."));
  }
  if (Number.isNaN(result)) {
    return null;
  }
  return result;
}

const getMaxDecimalPlaces = (...numbers: number[]): number => {
  return numbers.reduce((max, num) => {
    const decimalPart = num.toString().split(".")[1];
    return decimalPart ? Math.max(max, decimalPart.length) : max;
  }, 0);
};

export const roundTo = (num: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

export const addNumbers = (...numbers: number[]): number => {
  const maxDecimalPlaces = getMaxDecimalPlaces(...numbers);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return roundTo(sum, maxDecimalPlaces);
};

export const addNumberRoundTwo = (...numbers: number[]): number => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return roundTo(sum, 2);
};

export const addNumberRoundFour = (...numbers: number[]): number => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return roundTo(sum, 4);
};

export const addNumberRound = (...numbers: number[]): number => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return roundTo(sum, 0);
};

export const calculateSumArray = (array: number[]) => {
  const sum = array?.reduce((total, current) => total + current, 0);
  return sum;
};

// Rounding integers
export const roundNumber = (value: number | null | undefined): number => {
  return value != null ? Math.round(value) : null;
};

export const roundNumberDecimal = (num: number, precision = 4): number => {
  return parseFloat(num.toFixed(precision));
};

export const addNumbersDecimal = (...numbers: number[]): string => {
  const max = getMaxDecimalPlaces(...numbers);
  let result = numbers
    .reduce((acc, x) => acc.add(x.toString()), new DecimalJS(0))
    .toDecimalPlaces(max)
    .toFixed(max);
  if (result.includes(".")) {
    result = result.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
  }
  return result;
};
