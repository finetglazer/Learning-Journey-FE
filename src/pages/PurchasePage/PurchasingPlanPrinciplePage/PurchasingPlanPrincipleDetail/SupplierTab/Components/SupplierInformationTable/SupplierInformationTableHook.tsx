import { useContext, useState } from "react";
import { listService } from "core/services/page-services/list-service";

import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";

export const useSupplierInformationTableHook = () => {
  const {
    translate,
    model,
    handleChangeSingleField,
    setSelectedDetailSupplierId,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [
    isLoadingPrincipleContractBySupplier,
    setIsLoadingPrincipleContractBySupplier,
  ] = useState(false);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<SupplierModel>(
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

  const handleDeletePrincipleContracts = () => {
    const selectedPrincipleContractIds = selectedId
      ? [selectedId]
      : [...selectedRowKeys];

    const newPrincipleContractList = model?.supplierPrincipleContracts?.filter(
      (item: SupplierModel) => !selectedPrincipleContractIds.includes(item?.id)
    );

    handleChangeSingleField({
      fieldName: "supplierPrincipleContracts",
    })(newPrincipleContractList);

    handleCloseDeleteModal();
    setSelectedRowKeys([]);
  };

  const navigateToPrincipleContractView = (principleContractId: string) => {
    if (!principleContractId) return;

    window.open(
      `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${principleContractId}`,
      "_blank"
    );
  };

  return {
    translate,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    openModalSupplier,
    isLoadingPrincipleContractBySupplier,
    notifyToast,
    setIsLoadingPrincipleContractBySupplier,
    setOpenModalSupplier,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeletePrincipleContracts,
    navigateToPrincipleContractView,
    setSelectedDetailSupplierId,
  };
};
