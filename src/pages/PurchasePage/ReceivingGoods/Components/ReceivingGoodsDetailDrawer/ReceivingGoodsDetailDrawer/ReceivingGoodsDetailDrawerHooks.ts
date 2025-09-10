import { MAX_LENGTH_1000, numberConstants } from "core/config/consts";
import { ConfigField } from "core/services/service-types";
import { gt, isEqual, isNull, isUndefined } from "lodash";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ReceivingGoodsDetailDrawerHooksParams {
  goodsReceiptRequestItems: GoodsReceiptRequestItem[];
  goodsReceiptIdSelect: string;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  setGoodsReceiptIdSelect: Dispatch<SetStateAction<string>>;
}

export const useReceivingGoodsDetailDrawerHooks = ({
  goodsReceiptIdSelect,
  goodsReceiptRequestItems,
  handleChangeSingleField,
  setGoodsReceiptIdSelect,
}: ReceivingGoodsDetailDrawerHooksParams) => {
  const [translate] = useTranslation();
  const [goodsReceiptRequestItem, setGoodsReceiptRequestItem] = useState<
    undefined | GoodsReceiptRequestItem
  >(undefined);

  useEffect(() => {
    setGoodsReceiptRequestItem(
      goodsReceiptRequestItems?.find((goodsReceiptRequestItem) =>
        isEqual(goodsReceiptIdSelect, goodsReceiptRequestItem?.id)
      )
    );
  }, [goodsReceiptIdSelect, goodsReceiptRequestItems]);

  const validation = (item: GoodsReceiptRequestItem) => {
    const note =
      !isNull(item.note) &&
      gt(item.note?.trim().length, numberConstants.ZERO) &&
      gt(item.note.length, MAX_LENGTH_1000)
        ? translate("CM.msg_max_length", { maxLength: MAX_LENGTH_1000 })
        : null;
    const quantity =
      isUndefined(item.quantity) || isNull(item.quantity)
        ? translate("CM.input_require_validation")
        : isEqual(item.quantity, numberConstants.ZERO)
        ? translate("RG.txt_actual_quantity_greater_than_zero")
        : null;

    const errors = {
      note,
      quantity,
    };

    return { ...item, errors };
  };

  const hasError = (item: GoodsReceiptRequestItem[]) => {
    return item.some((item) => item.errors?.note || item.errors?.quantity);
  };

  const handleSave = () => {
    const newGoodsReceiptRequestItems = goodsReceiptRequestItems?.map(
      (item) => {
        if (isEqual(item.id, goodsReceiptIdSelect)) {
          return validation(goodsReceiptRequestItem);
        }
        return item;
      }
    );
    handleChangeSingleField({ fieldName: "goodsReceiptRequestItems" })(
      newGoodsReceiptRequestItems
    );

    if (isEqual(hasError(newGoodsReceiptRequestItems), false)) {
      setGoodsReceiptIdSelect(null);
    }
  };

  const handleDelete = () => {
    const newGoodsReceiptRequestItems = goodsReceiptRequestItems?.filter(
      (item) => !isEqual(item.id, goodsReceiptIdSelect)
    );
    handleChangeSingleField({ fieldName: "goodsReceiptRequestItems" })(
      newGoodsReceiptRequestItems
    );

    setGoodsReceiptIdSelect(null);
  };

  return {
    goodsReceiptRequestItem,
    setGoodsReceiptRequestItem,
    // no context
    handleSave,
    handleDelete,
  };
};
