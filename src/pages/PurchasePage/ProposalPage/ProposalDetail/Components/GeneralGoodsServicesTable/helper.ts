import {
  SummaryItem,
  SummaryItemByCategory,
} from "models/Proposal/GoodService";

export const convertSummaryData = (data: SummaryItem[]) => {
  const goodsIdCount: Record<string, number> = {};

  return Object.values(
    data.reduce((acc: { [key: string]: SummaryItemByCategory }, item) => {
      const categoryId = item?.categoryId;
      if (!goodsIdCount?.[item.goodsId]) {
        goodsIdCount[item.goodsId] = 0;
      }
      const renderId = `${item.goodsId}@${goodsIdCount[item.goodsId]}`;
      goodsIdCount[item.goodsId]++;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          categoryId: categoryId,
          categoryName: item?.category?.name,
          categoryCode: item?.category?.code,
          children: [],
        };
      }
      acc[categoryId].children.push({ ...item, renderId });
      return acc;
    }, {})
  );
};
