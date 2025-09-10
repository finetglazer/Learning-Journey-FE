import { roundTo } from "core/helpers/number";
import { isNil, isNumber } from "lodash";
import {
  GoodService,
  GoodServiceByCategory,
} from "models/Proposal/GoodService";

const formatNumber = (value: number) => {
  if (!value) {
    return "0";
  }
  const parts = value.toString().split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalPart = parts[1] ? parts[1].replace(".", ",") : "";
  return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
};

export const formatNumberToCurrency = (value?: number, roundNum?: number) => {
  return formatNumber(value ? roundTo(value, roundNum ?? 0) : 0);
};

export const convertVNDToPrice = (
  price?: number,
  rate?: number,
  roundNum?: number
) => {
  if (isNil(price) || isNil(rate))
    return {
      display: "0",
      value: 0,
    };
  return {
    display: formatNumberToCurrency(price / rate, roundNum),
    value: price / rate,
  };
};

export const convertPriceToVND = (price?: number, rate?: number) => {
  if (isNil(price) || isNil(rate))
    return {
      display: "0",
      value: 0,
    };
  return {
    display: formatNumberToCurrency(price * rate, 0),
    value: price * rate,
  };
};

export const calculate = (
  arrayNum: Array<number | undefined>,
  roundNum?: number
) => {
  const total = arrayNum.reduce((acc, cur) => {
    return acc * (isNumber(cur) ? cur : 0);
  });

  return {
    display: formatNumberToCurrency(total, roundNum),
    value: Number(total.toFixed(roundNum ?? 0)),
  };
};

export const convertData = (data: GoodService[]) => {
  return Object.values(
    data.reduce((acc: { [key: string]: GoodServiceByCategory }, item) => {
      const categoryId = item?.goodsServicesCategory?.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          renderId: categoryId,
          goodsServicesCategoryId: categoryId,
          goodsServicesCategoryIsActive: item?.goodsServicesCategory?.isActive,
          goodsServicesCategoryCode: item?.goodsServicesCategory?.code,
          goodsServicesCategoryName: item?.goodsServicesCategory?.name,
          children: [],
        };
      }
      acc[categoryId].children.push(item);
      return acc;
    }, {})
  );
};
