import { listService } from "core/services/page-services/list-service";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export enum ReceiptModal {
  LIST = "LIST",
}

export const useDetailsReceiptInformationHooks = () => {
  const [modal, setModal] = useState<ReceiptModal | null>(null);
  const [translate] = useTranslation();

  const {
    rowSelection,
    selectedRow,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<GoodsReceiptRequestItem>(
    "checkbox",
    [],
    false,
    "auto",
    true
  );

  return {
    modal,
    translate,
    setModal,
    rowSelection,
    selectedRow,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
  };
};
