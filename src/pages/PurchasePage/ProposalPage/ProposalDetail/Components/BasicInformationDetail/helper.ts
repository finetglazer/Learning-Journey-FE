import { addNumbers } from "core/helpers/number";
import { GoodServiceByCategory } from "models/PurchaseRequest";

export type SummaryDataInfo = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  totalAmount: number;
  taxAmount: number;
  totalPrice: number;
  isTotal?: boolean;
};

export const convertSummaryDataInfo = (
  data: GoodServiceByCategory[]
): SummaryDataInfo[] => {
  const goodsIdCount: Record<string, number> = {};

  return Object.values(
    data.reduce((acc: { [key: string]: SummaryDataInfo }, item) => {
      const categoryId = item?.categoryId;
      if (!goodsIdCount?.[item.goodsId]) {
        goodsIdCount[item.goodsId] = 0;
      }
      goodsIdCount[item.goodsId]++;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          categoryId: categoryId,
          categoryName: item?.category?.name,
          categoryCode: item?.category?.code,
          totalAmount: 0,
          taxAmount: 0,
          totalPrice: 0,
        };
      }

      acc[categoryId].totalAmount = addNumbers(
        acc[categoryId].totalAmount,
        item.totalAmount
      );
      acc[categoryId].taxAmount = addNumbers(
        acc[categoryId].taxAmount,
        item.taxAmount
      );
      acc[categoryId].totalPrice = addNumbers(
        acc[categoryId].totalPrice,
        item.quantity * item.unitPrice
      );
      return acc;
    }, {})
  ) as SummaryDataInfo[];
};
