import { toFixedByCurrency, toFixedNumber } from "core/helpers/calculator";
import { isEqual, isUndefined, lt } from "lodash";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex/ContractAnnex";
import { useCallback } from "react";

export const useGroupGoodServicesByCategory = (currency: string) => {
  const handleGroupGoodServicesByCategory = useCallback(
    (goodItems: SelectAdjustableGoodsServicesModel[]) => {
      const list: SelectAdjustableGoodsServicesModel[] = [];
      goodItems?.forEach((goodItem) => {
        const goodsServicesCategory = goodItem?.goodCategory;
        const index = list.findIndex((item) => {
          const idCategory = item?.id;
          return isEqual(idCategory, goodsServicesCategory?.id);
        });

        if (lt(index, 0)) {
          const initGoodsReceiptRequest = {
            ...new SelectAdjustableGoodsServicesModel(),
            id: goodsServicesCategory?.id,
            name: goodItem?.goodCategory?.name,
            taxAmount: toFixedByCurrency(goodItem?.taxAmount || 0, currency),
            totalAmount: toFixedByCurrency(
              goodItem?.totalAmount || 0,
              currency
            ),
            totalConvertedAmount: toFixedNumber(
              goodItem?.totalConvertedAmount || 0,
              0
            ),
            totalAmountConvert: toFixedNumber(
              goodItem?.totalAmountConvert || 0,
              0
            ),
            children: [goodItem],
          };
          list.push(initGoodsReceiptRequest);
        } else {
          const item = list?.[index];
          if (isUndefined(item)) return;

          list.splice(index, 1, {
            ...item,
            children: [...item.children, goodItem],
            taxAmount: toFixedByCurrency(
              goodItem?.taxAmount + item?.taxAmount,
              currency
            ),
            totalAmount: toFixedByCurrency(
              goodItem?.totalAmount + item?.totalAmount,
              currency
            ),
            totalConvertedAmount: toFixedNumber(
              goodItem?.totalConvertedAmount + item?.totalConvertedAmount
            ),
            totalAmountConvert: toFixedNumber(
              goodItem?.totalAmountConvert + item?.totalAmountConvert
            ),
          });
        }
      });

      const updateOrderList: SelectAdjustableGoodsServicesModel[] =
        list?.map((item) => item?.children)?.flat() || [];

      return { list, updateOrderList };
    },
    [currency]
  );

  return {
    handleGroupGoodServicesByCategory,
  };
};
