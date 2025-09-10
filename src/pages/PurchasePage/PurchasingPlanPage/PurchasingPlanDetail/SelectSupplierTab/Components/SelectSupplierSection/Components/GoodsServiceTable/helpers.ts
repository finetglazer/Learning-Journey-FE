import { detectIntegerCurrency } from "core/helpers/currency";
import { round } from "lodash";
import {
  GoodPriceByCategory,
  GoodsPrice,
  GroupByCategory,
} from "models/PurchasingPlan";
import { VIETNAMESE_CURRENCY } from "../../SelectSupplierSection";

export const TWO_NUMBER_FIX = 2;
export const FOUR_NUMBER_FIX = 4;

export const convertToVNDCurrency = (originalCost?: number) =>
  originalCost ? round(originalCost, 0) : 0;

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
            };
          }

          const rawAmount = (item.supplyQuantityUser || 0) * (item.price || 0);
          const amount = detectIntegerCurrency(currencyCode)
            ? round(rawAmount, 0)
            : round(rawAmount, 2);

          const totalAmountRaw = (amount || 0) + (item.taxAmountQuotation || 0);
          const totalAmount =
            currencyCode === VIETNAMESE_CURRENCY
              ? round(totalAmountRaw, 0)
              : round(totalAmountRaw, 4);

          const totalConvertedAmountRaw =
            (totalAmount || 0) * biddingExchangeRate;
          const totalConvertedAmount = round(totalConvertedAmountRaw, 0);

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
          acc[categoryId].totalTax += item?.taxAmountQuotation || 0;
        }
        return acc;
      },
      {}
    ) || {};

  return Object.values(grouped);
};
