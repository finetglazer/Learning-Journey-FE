import { useState } from "react";
import { listService } from "core/services/page-services/list-service";

import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import appMessageService from "core/services/common-services/app-message-service";
import { TableRowSelection } from "antd/lib/table/interface";

export const useSupplierInformationTableHook = (props: PurchasingPlanModel) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    setSelectedDetailSupplierId,
  } = props;

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openModalSupplierInformation, setOpenModalSupplierInformation] =
    useState<boolean>(false);
  const [
    isLoadingPrincipleContractBySupplier,
    setIsLoadingPrincipleContractBySupplier,
  ] = useState(false);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<SupplierModel>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const rowSelectionSupplierId: TableRowSelection = {
    ...rowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(selectedRows.filter((item) => item?.supplierId));
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

  const handleDeletePrincipleContracts = () => {
    const selectedPrincipleContractIds = selectedId
      ? [selectedId]
      : [...selectedRowKeys];

    const newPrincipleContractList = model?.supplierGenerals?.filter(
      (item: SupplierModel) =>
        !selectedPrincipleContractIds.includes(item?.supplierId)
    );

    handleChangeSingleField({
      fieldName: "supplierGenerals",
    })(newPrincipleContractList);

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
    isLoadingPrincipleContractBySupplier,
    notifyToast,
    setIsLoadingPrincipleContractBySupplier,
    setOpenModalSupplier,
    setOpenModalSupplierInformation,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeletePrincipleContracts,
    setSelectedDetailSupplierId,
    rowSelectionSupplierId,
  };
};
