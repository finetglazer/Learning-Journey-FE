import { useState } from "react";
import { listService } from "core/services/page-services/list-service";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import appMessageService from "core/services/common-services/app-message-service";

export const usePrioritySupplierTableHook = (props: PurchasingPlanModel) => {
  const { translate, setSelectedDetailSupplierId } = props;

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SupplierModel>("radio", [], false, "auto");

  return {
    translate,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    notifyToast,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    setSelectedDetailSupplierId,
    selectedRow,
    setSelectedRow,
  };
};
