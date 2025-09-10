import {
  GoodPriceByCategory,
  GoodsPrice,
  GroupByCategory,
} from "models/PurchasingPlan";
import { VIETNAMESE_CURRENCY } from "../../SelectSupplierSection";

export const TWO_NUMBER_FIX = 2;
export const FOUR_NUMBER_FIX = 4;

export const formatDecimal = (value: number, decimals?: number): string =>
  Number.isInteger(value)
    ? value.toString()
    : value.toFixed(decimals || TWO_NUMBER_FIX);

export const calculateTotal = (
  records: GoodPriceByCategory[] = [],
  key: keyof GoodPriceByCategory
): number => {
  return records?.reduce((sum, record) => sum + (Number(record[key]) || 0), 0);
};

export const groupDataByCategory = (
  goodPrices: GoodsPrice[],
  currencyCode: string,
  biddingExchangeRate: number
): GoodPriceByCategory[] => {
  const grouped =
    goodPrices?.reduce(
      (acc: { [key: string]: GroupByCategory }, item: GoodsPrice) => {
        const categoryId = item?.goodsItem?.category?.id;
        if (categoryId) {
          if (!acc[categoryId]) {
            acc[categoryId] = {
              id: categoryId,
              renderId: categoryId,
              category: item.goodsItem.category,
              children: [],
              amount: 0,
              totalAmount: 0,
              totalConvertedAmount: 0,
              totalTax: 0,
              totalOtherCost: 0,
            };
          }

          const rawAmount = (item.supplyQuantity || 0) * (item.price || 0);
          const amount =
            currencyCode === VIETNAMESE_CURRENCY
              ? Math.round(rawAmount)
              : parseFloat(formatDecimal(rawAmount, TWO_NUMBER_FIX));

          const totalAmountRaw =
            (amount || 0) + (item.taxAmount || 0) + (item.otherCost || 0);
          const totalAmount = parseFloat(
            formatDecimal(totalAmountRaw, FOUR_NUMBER_FIX)
          );

          const totalConvertedAmountRaw =
            (totalAmount || 0) * biddingExchangeRate;
          const totalConvertedAmount = parseFloat(
            formatDecimal(totalConvertedAmountRaw, TWO_NUMBER_FIX)
          );

          const itemWithCalculations: GoodsPrice & {
            amount: number;
            totalAmount: number;
            totalConvertedAmount: number;
          } = {
            ...item,
            amount,
            totalAmount,
            totalConvertedAmount,
          };

          acc[categoryId].children.push(itemWithCalculations);

          acc[categoryId].amount += amount;
          acc[categoryId].totalAmount += totalAmount;
          acc[categoryId].totalConvertedAmount += totalConvertedAmount;
          acc[categoryId].totalTax += item?.taxAmount;
          acc[categoryId].totalOtherCost += item?.otherCost;
        }
        return acc;
      },
      {}
    ) || {};

  return Object.values(grouped);
};
