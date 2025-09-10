import { Key, useState } from "react";
import { listService } from "core/services/page-services/list-service";

import {
  getValueInModel,
  PurchasingPlanModel,
  TechnicalProfile,
} from "models/PurchasingPlan";
import appMessageService from "core/services/common-services/app-message-service";
import { GeneralActionEnum } from "core/services/service-types";
import { RowSelectionType } from "antd/lib/table/interface";
import { Checkbox } from "react-components-design-system";

export const useTechnicalProfileTableHook = (props: PurchasingPlanModel) => {
  const { translate, model, dispatchModel, columnKey } = props;

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openModalSupplierInformation, setOpenModalSupplierInformation] =
    useState<boolean>(false);

  const { selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<TechnicalProfile>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: "checkbox" as RowSelectionType,
    renderCell: (value: boolean, record: TechnicalProfile) => {
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.id)
                );
              }
            }}
          />
        </div>
      );
    },
  };

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

    const newList = getValueInModel(model?.offerRequest, columnKey)?.filter(
      (item: TechnicalProfile) => !listSelectedIds.includes(item?.id)
    );

    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        offerRequest: {
          ...model?.offerRequest,
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
