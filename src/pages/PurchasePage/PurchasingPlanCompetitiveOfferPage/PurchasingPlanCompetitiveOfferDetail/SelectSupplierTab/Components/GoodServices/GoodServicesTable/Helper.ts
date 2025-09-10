import {
  GoodServiceByCategoryModel,
  PurchasePlanGoodsServicesModel,
} from "models/PurchasingPlan";

export const convertData = (data: PurchasePlanGoodsServicesModel[]) => {
  return Object.values(
    data.reduce((acc: { [key: string]: GoodServiceByCategoryModel }, item) => {
      const categoryId = item?.category?.id || item?.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          goodsServicesCategoryId: categoryId,
          goodsServicesCategoryCode: item?.category?.code,
          goodsServicesCategoryName: item?.category?.name,
          children: [],
        };
      }
      acc[categoryId].children.push(item);
      return acc;
    }, {})
  );
};
