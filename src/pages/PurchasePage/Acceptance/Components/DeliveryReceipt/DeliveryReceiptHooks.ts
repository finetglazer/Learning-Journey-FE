import { listService } from "core/services/page-services/list-service";
import { GeneralActionEnum } from "core/services/service-types";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { useMemo, useState } from "react";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";

export const useDeliveryReceiptHooks = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const { dispatch, model, getGetGoodItems } =
    useAcceptanceInformationContext();
  const deliveryReceiptList = useMemo(
    () => model?.goodsReceiptRequests,
    [model?.goodsReceiptRequests]
  );

  const handleUpdateRequestIds = (
    goodsReceiptRequests: GoodsReceiptModel[]
  ) => {
    if (getGetGoodItems) {
      const goodItemIds = goodsReceiptRequests?.map((good) => good?.id);
      getGetGoodItems(goodItemIds);
    }
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        goodsReceiptRequests,
      },
    });
  };

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsReceiptModel>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const deliveryReceiptSelected = useMemo(
    () => deliveryReceiptList?.map((item) => item?.id) || [],
    [deliveryReceiptList]
  );

  const handleAddDeliveryReceipt = ({
    listSelected,
  }: {
    listSelected: GoodsReceiptModel[];
  }) => {
    const list = listSelected.filter(
      (item) => !deliveryReceiptSelected.includes(item?.id)
    );
    const newList = [...list, ...deliveryReceiptList];
    handleUpdateRequestIds(newList);
    setModal(null);
  };

  const handleDeleteDeliveryReceipt = (ids: string[]) => {
    const newDeliveryReceipt = deliveryReceiptList.filter((deliveryReceipt) => {
      return !ids.includes(deliveryReceipt?.id);
    });
    handleUpdateRequestIds(newDeliveryReceipt);
    setSelectedRowKeys(
      selectedRowKeys.filter((id) => !ids.includes(id.toString()))
    );
    setIsOpenModelConfirmDeleteRow(false);
  };

  return {
    modal,
    rowSelection,
    selectedRowKeys,
    deliveryReceiptList,
    deliveryReceiptSelected,
    setModal,
    setSelectedRowKeys,
    handleAddDeliveryReceipt,
    handleDeleteDeliveryReceipt,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
  };
};
