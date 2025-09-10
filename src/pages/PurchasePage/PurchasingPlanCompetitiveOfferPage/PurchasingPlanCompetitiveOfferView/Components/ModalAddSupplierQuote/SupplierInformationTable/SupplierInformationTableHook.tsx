import { useState } from "react";
import { listService } from "core/services/page-services/list-service";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";

export const useSupplierInformationTableHook = (props: PurchasingPlanModel) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    setSelectedDetailSupplierId,
    handleChangeAllField,
  } = props;

  const { notifyToast } = appMessageService.useCRUDMessage();

  // Hàm mới nhận array indices
  function removeSuppliersByIndices(obj, indices) {
    // Nếu indices không phải array, convert thành array
    const indexArray = Array.isArray(indices) ? indices : [indices];

    // Tạo regex pattern để match tất cả indices cần xóa
    const pattern = indexArray.join("|");
    const regex = new RegExp(`^suppliers\\[(${pattern})\\]`);

    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !regex.test(key))
    );
  }

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { model: modelSupplier, dispatch: dispatchModelSupplier } =
    detailService.useModel<SupplierModel>(SupplierModel);

  const { handleChangeAllField: handleChangeAllFieldSupplier } =
    fieldService.useField(modelSupplier, dispatchModelSupplier);

  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openModalSupplierInformation, setOpenModalSupplierInformation] =
    useState<boolean>(false);
  const [
    isLoadingPrincipleContractBySupplier,
    setIsLoadingPrincipleContractBySupplier,
  ] = useState(false);

  const {
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
    selectedRow,
  } = listService.useRowSelection<SupplierModel>(
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

  const handleDeleteNotConfirm = (selectedId: string) => {
    const ids = selectedId ? [selectedId] : [...selectedRowKeys];
    const newPrincipleContractList =
      model?.masterSupplierAddQuote?.listSupplierAddQuote?.filter(
        (item: SupplierModel) => !ids.includes(item?.id)
      );

    const indexErrors = model?.masterSupplierAddQuote?.listSupplierAddQuote
      ?.map((item: SupplierModel, index) =>
        ids.indexOf(item?.id) !== -1 ? index : null
      )
      ?.filter((index: number | null) => index !== null && index !== undefined);

    const newErrors = removeSuppliersByIndices(model.errors, indexErrors);

    handleChangeAllField({
      ...model,
      masterSupplierAddQuote: {
        ...model?.masterSupplierAddQuote,
        listSupplierAddQuote: newPrincipleContractList,
      },
      errors: newErrors as any,
    });

    setSelectedRowKeys([]);
  };

  const handleDeletePrincipleContracts = () => {
    const ids = selectedId ? [selectedId] : [...selectedRowKeys];

    const newPrincipleContractList =
      model?.masterSupplierAddQuote?.listSupplierAddQuote?.filter(
        (item: SupplierModel) => !ids.includes(item?.id)
      );

    handleChangeSingleField({
      fieldName: "masterSupplierAddQuote",
    })({
      ...model?.masterSupplierAddQuote,
      listSupplierAddQuote: newPrincipleContractList,
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
    handleChangeAllFieldSupplier,
    currentItem: modelSupplier,
    setSelectedRow,
    selectedRow,
    handleDeleteNotConfirm,
  };
};
