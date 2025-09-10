import { ConfigField } from "core/services/service-types";
import { isEqual } from "lodash";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AcceptanceInformationDrawerHooksParams {
  goodsReceiptRequestItems: GoodsReceiptRequestItem[];
  goodsReceiptIdSelect: string;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  setGoodsReceiptIdSelect: Dispatch<SetStateAction<string>>;
}

export const useAcceptanceInformationDrawerHooks = ({
  goodsReceiptIdSelect,
  goodsReceiptRequestItems,
  handleChangeSingleField,
  setGoodsReceiptIdSelect,
}: AcceptanceInformationDrawerHooksParams) => {
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

  const handleSave = () => {
    const newGoodsReceiptRequestItems = goodsReceiptRequestItems?.map(
      (item) => {
        if (isEqual(item.id, goodsReceiptIdSelect)) {
          return goodsReceiptRequestItem;
        }
        return item;
      }
    );
    handleChangeSingleField({ fieldName: "goodsReceiptRequestItems" })(
      newGoodsReceiptRequestItems
    );
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
