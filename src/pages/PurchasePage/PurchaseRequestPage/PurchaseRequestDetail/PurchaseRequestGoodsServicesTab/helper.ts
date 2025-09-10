import { formatNumber } from "core/helpers/number";
import { isNil } from "lodash";
import { GoodServiceByCategory, GoodsServices } from "models/PurchaseRequest";

export const convertData = (data: GoodsServices[]): GoodServiceByCategory[] => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category.id]) {
      acc[item.category.id] = {
        ...item,
        id: item.category.id,
        children: [],
      };
    }
    acc[item.category.id].children.push(item);
    return acc;
  }, {} as Record<string, GoodServiceByCategory>);

  return Object.values(groupedData);
};

export const convertPriceToVND = (price?: number, rate?: number) => {
  if (isNil(price) || isNil(rate))
    return {
      display: "0",
      value: 0,
    };
  return {
    display: formatNumber(Math.round(price * rate)),
    value: Math.round(price * rate),
  };
};
