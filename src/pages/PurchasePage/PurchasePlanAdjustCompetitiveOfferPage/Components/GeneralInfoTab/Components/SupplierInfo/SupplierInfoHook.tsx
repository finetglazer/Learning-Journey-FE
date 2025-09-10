import { useContext, useState } from "react";

import { listService } from "core/services/page-services/list-service";
import {
  EmailReceiverInformation,
  SupplierGenerals,
  SupplierModel,
} from "models/PurchasingPlan";
import { MAX_LENGTH_255 } from "core/config/consts";
import { validator } from "core/helpers/validator";
import { isEmpty } from "lodash";
import { IProps } from "./SupplierInfo";

export const useSupplierInfoHook = (props: IProps) => {
  const { contextValue } = props;
  const {
    isDetailPage = false,
    isCreatePage,
    model,
    handleChangeSingleField: handleChangeSingleFieldMaster,
    translate,
  } = contextValue;

  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openModalListSuppliers, setOpenModalListSuppliers] =
    useState<boolean>(false);

  const currentSupplierList = model?.supplierPurchasePlans || [];

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<unknown>("checkbox", [], true, "manual", true);

  const handleOpenDeleteModal = (id: string) => {
    setSelectedId(id);
    setIsOpenConfirmDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedId(null);
    setIsOpenConfirmDeleteModal(false);
  };

  const handleUpdateRowSelected = (newSupplierList: SupplierGenerals[]) => {
    handleChangeSingleFieldMaster({
      fieldName: "supplierPurchasePlans",
    })(newSupplierList);

    const newSupplierIds = newSupplierList?.map((item) => item?.id);

    const newRowKeysSelected = selectedRowKeys?.filter((id) =>
      newSupplierIds.includes(id as string)
    );
    setSelectedRowKeys(newRowKeysSelected);
  };

  const handleDeleteSuppliers = () => {
    const selectedSupplierIds = selectedId
      ? [selectedId]
      : [...selectedRowKeys];

    const newSupplierList = currentSupplierList?.filter(
      (item: SupplierGenerals) => !selectedSupplierIds.includes(item?.id)
    );

    handleCloseDeleteModal();
    handleUpdateRowSelected(newSupplierList);
  };

  const handleOpenModalListSuppliers = () => {
    setOpenModalListSuppliers(true);
  };

  const handleCloseModalListSuppliers = () => {
    setOpenModalListSuppliers(false);
  };

  const handleSelectSuppliers = (selectedSuppliers: SupplierModel[]) => {
    const newSupplierList = selectedSuppliers?.map((item) => {
      if (item?.id && !isEmpty(item?.supplier)) {
        return item;
      }

      const supplierId = item?.supplierId;
      const supplierContactsDefault = item?.supplierContacts?.find(
        (supplierContact) => supplierContact?.isDefault
      );
      return {
        ...item,
        id: supplierId,
        supplierId,
        supplierContactSelected: supplierContactsDefault,
        quoteId: item?.quoteId ?? supplierContactsDefault?.id,
        quoteEmail: item?.quoteEmail ?? supplierContactsDefault?.email,
        quoteName: item?.quoteName ?? supplierContactsDefault?.name,
        phoneNumber: item?.phoneNumber ?? supplierContactsDefault?.phone,
      };
    });

    handleCloseModalListSuppliers();
    handleUpdateRowSelected(newSupplierList);
  };

  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierModel | null>(null);

  const handleUpdateSupplierInfoSelected = (data: SupplierModel | null) => {
    const newData = {
      ...selectedSupplier,
      ...selectedSupplier?.supplier,
      ...data,
    };
    setSelectedSupplier(newData);
  };

  const handleCloseSupplierInfoModal = () => {
    setSelectedSupplier(null);
  };

  const handleUpdateSupplierInfo = () => {
    const emailRecipients: EmailReceiverInformation[] =
      selectedSupplier?.emailRecipients;
    const fieldsToValidate: {
      name: string;
      maxLength?: number;
      isEmail?: boolean;
      isRequired?: boolean;
    }[] = [
      {
        name: "email",
        maxLength: MAX_LENGTH_255,
        isEmail: true,
        isRequired: true,
      },
      { name: "name", maxLength: MAX_LENGTH_255 },
    ];

    let hasError = false;

    const emailReceiverInfo = emailRecipients?.map((emailReceiverInfo) => {
      const errors = fieldsToValidate.reduce((acc, field) => {
        const requiredError = validator.required({
          filedValidate: field?.isRequired ? [field.name] : [],
          data: emailReceiverInfo,
        });

        const maxLengthError = validator.maxLength({
          filedValidate: [field.name],
          data: emailReceiverInfo,
          maxLength: field.maxLength,
        });

        const emailError = validator.isEmail({
          filedValidate: field?.isEmail ? [field.name] : [],
          data: emailReceiverInfo,
        });

        return {
          ...acc,
          ...requiredError,
          ...maxLengthError,
          ...emailError,
        };
      }, {});
      if (!hasError && !isEmpty(errors)) {
        hasError = true;
      }
      return isEmpty(errors)
        ? emailReceiverInfo
        : { ...emailReceiverInfo, errors };
    });

    if (hasError) {
      const newData = {
        ...selectedSupplier,
        supplier: {
          ...selectedSupplier?.supplier,
        },
        emailRecipients: emailReceiverInfo,
      };
      setSelectedSupplier(newData);
      return;
    }

    const newSupplierGenerals = currentSupplierList.map(
      (item: SupplierModel) => {
        if (item.supplierId === selectedSupplier.supplierId) {
          return selectedSupplier;
        }
        return item;
      }
    );

    handleChangeSingleFieldMaster({
      fieldName: "supplierPurchasePlans",
    })(newSupplierGenerals);
    handleCloseSupplierInfoModal();
  };

  return {
    isDetailPage,
    isCreatePage,
    model,
    translate,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    openModalListSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    setOpenModalListSuppliers,
    setSelectedRowKeys,
    setIsOpenConfirmDeleteModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteSuppliers,
    handleOpenModalListSuppliers,
    handleCloseModalListSuppliers,
    handleSelectSuppliers,
    handleCloseSupplierInfoModal,
    handleUpdateSupplierInfo,
    handleUpdateSupplierInfoSelected,
  };
};
