import {
  ErrorMap,
  GoodServiceByCategoryModel,
  PurchasePlanGoodsServicesModel,
} from "models/PurchasingPlan";
import { cloneDeep, toInteger } from "lodash";

export const convertData = (data: PurchasePlanGoodsServicesModel[]) => {
  return Object.values(
    data.reduce(
      (acc: { [key: string]: GoodServiceByCategoryModel }, item, index) => {
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
      },
      {}
    )
  );
};

export interface CategoryWithChildren
  extends Omit<GoodServiceByCategoryModel, "children"> {
  children: (PurchasePlanGoodsServicesModel & {
    errorsBE: Record<string, any>;
  })[];
}

/**
 * Group items by category AND attach backend errors (errorsBE) by indexBeforeValidate
 */
export const convertDataWithErrors = (
  data: PurchasePlanGoodsServicesModel[] = [],
  model: { errors?: Record<string, any> } = {}
): CategoryWithChildren[] => {
  // --- 1) clone và build bản đồ lỗi index → { field: value }
  const rawErrors = cloneDeep(model.errors || {});
  const errorsByIndex: ErrorMap = {};
  const PATH_REGEX = /^goodsItems\[(\d+)\]\.(.+)$/;

  Object.entries(rawErrors).forEach(([path, errVal]) => {
    const m = PATH_REGEX.exec(path);
    if (!m) return;
    const idx = toInteger(m[1]);
    const field = m[2].split(".").pop()!;

    if (!errorsByIndex[idx]) errorsByIndex[idx] = {};
    errorsByIndex[idx][field] = errVal;
  });

  // --- 2) reduce luôn vào object tạm để group + attach lỗi
  const grouped = data.reduce<Record<string, CategoryWithChildren>>(
    (acc, item, index) => {
      // xác định categoryId
      const categoryId = item.category?.id ?? item.id;

      // nếu chưa có thì khởi tạo skeleton của category
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          goodsServicesCategoryId: categoryId,
          goodsServicesCategoryCode: item.category?.code ?? "",
          goodsServicesCategoryName: item.category?.name ?? "",
          children: [],
        };
      }

      // tìm lỗi cho item này, dựa vào indexBeforeValidate

      // push item kèm lỗi vào children
      acc[categoryId].children.push({
        ...item,
        errorsBE: errorsByIndex[index],
      });

      return acc;
    },
    {}
  );

  // --- 3) trả về mảng các category
  return Object.values(grouped);
};
