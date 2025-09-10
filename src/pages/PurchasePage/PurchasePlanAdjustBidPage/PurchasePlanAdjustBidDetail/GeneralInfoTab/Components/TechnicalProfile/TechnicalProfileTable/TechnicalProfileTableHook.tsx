import { useState } from "react";
import { listService } from "core/services/page-services/list-service";

import {
  getValueInModel,
  PurchasingPlanModel,
  TechnicalProfile,
} from "models/PurchasingPlan";
import appMessageService from "core/services/common-services/app-message-service";
import { GeneralActionEnum } from "core/services/service-types";

export const useTechnicalProfileTableHook = (props: PurchasingPlanModel) => {
  const { translate, model, dispatchModel, columnKey } = props;

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openModalSupplierInformation, setOpenModalSupplierInformation] =
    useState<boolean>(false);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<TechnicalProfile>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const handleOpenDeleteModal = (id: string) => {
    setSelectedId(id);
    setIsOpenConfirmDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedId(null);
    setIsOpenConfirmDeleteModal(false);
  };

  const handleDelete = () => {
    const listSelectedIds = selectedId ? [selectedId] : [...selectedRowKeys];

    const newList = getValueInModel(model?.tenderRequests, columnKey)?.filter(
      (item: TechnicalProfile) => !listSelectedIds.includes(item?.id)
    );

    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        tenderRequests: {
          ...model?.tenderRequests,
          [columnKey]: newList,
        },
      },
    });

    handleCloseDeleteModal();
    setSelectedRowKeys([]);
  };

  return {
    translate,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    openModalSupplier,
    openModalSupplierInformation,
    notifyToast,
    setOpenModalSupplier,
    setOpenModalSupplierInformation,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDelete,
  };
};
