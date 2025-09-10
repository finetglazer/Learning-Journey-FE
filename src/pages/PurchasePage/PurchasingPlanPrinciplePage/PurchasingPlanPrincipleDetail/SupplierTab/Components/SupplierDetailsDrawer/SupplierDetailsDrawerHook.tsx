import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  EMAIL_REGEX,
  MAX_LENGTH_255,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, roundTo } from "core/helpers/number";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { cloneDeep, isEmpty, isEqual } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { GoodsServices } from "models/PurchaseRequest";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";

export const useSupplierDetailsDrawerHook = () => {
  const [translate] = useTranslation();
  const {
    model: modelMaster,
    selectedDetailSupplier,
    selectedDetailSupplierId,
    setSelectedDetailSupplierId,
    handleChangeSingleField: handleChangeSingleFieldMaster,
    handleChangeAllField: handleChangeAllFieldMaster,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);

  const { model: modelDetailSupplier, dispatch: dispatchDetailSupplier } =
    detailService.useModel<SupplierModel>(
      SupplierModel,
      selectedDetailSupplier
    );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(modelDetailSupplier, dispatchDetailSupplier);

  const currencyCode = modelDetailSupplier?.currency || VND_CURRENCY;

  const currentRate = useMemo(() => {
    if (isEqual(currencyCode, VND_CURRENCY)) {
      return numberConstants.ONE;
    }
    return modelMaster?.rateInfoJson?.rate;
  }, [currencyCode, modelMaster?.rateInfoJson?.rate]);

  const handleCloseSupplierDetailsDrawer = () => {
    setSelectedDetailSupplierId("");
  };

  const validate = () => {
    const formValidatedFields: {
      fieldName: string;
      isRequired?: boolean;
      regex?: RegExp;
      maxLength?: number;
    }[] = [
      {
        fieldName: "contactPerson",
        isRequired: true,
        regex: EMAIL_REGEX,
        maxLength: MAX_LENGTH_255,
      },
    ];
    if (currencyCode !== VND_CURRENCY_UNIT) {
      formValidatedFields.push({
        fieldName: "exchangeRate",
        isRequired: true,
      });
    }
    const goodsServicesValidatedFields = ["quantity", "tax"];

    const formFieldsErrors = formValidatedFields.reduce(
      (acc: { [key: string]: string }, field) => {
        const fieldValue = modelDetailSupplier?.[field?.fieldName];

        if (!fieldValue) {
          acc[field?.fieldName] = translate("CM.input_require_validation");
        } else if (fieldValue?.length > field?.maxLength) {
          acc[field?.fieldName] = translate("CM.input_length_validation", {
            maxLength: field?.maxLength,
          });
        } else if (field?.regex && !field?.regex.test(fieldValue)) {
          acc[field?.fieldName] = translate("CM.input_regex_validation");
        }
        return acc;
      },
      {}
    );
    const goodsServicesFieldsErrors: { [key: string]: string } = {};

    if (!isEmpty(modelDetailSupplier?.contractGoodsItems)) {
      modelDetailSupplier?.contractGoodsItems?.forEach(
        (item: GoodsServices) => {
          goodsServicesValidatedFields.forEach((field) => {
            const fieldValue = item?.[field];
            if (!fieldValue) {
              goodsServicesFieldsErrors[
                `contractGoodsItems.${item.id}.${field}`
              ] = translate("CM.input_require_validation");
            }
          });
        }
      );
    }

    if (!isEmpty(formFieldsErrors) || !isEmpty(goodsServicesFieldsErrors)) {
      handleChangeAllField({
        ...modelDetailSupplier,
        errors: {
          ...formFieldsErrors,
          ...goodsServicesFieldsErrors,
        },
      });
      return false;
    }

    return true;
  };

  const handleSaveSupplierDetailsDrawer = () => {
    if (!validate()) {
      return;
    }

    const totalQuantity = modelDetailSupplier?.contractGoodsItems?.reduce(
      (total: number, item: GoodsServices) => total + (item?.quantity || 0),
      0
    );

    const newModelDetailSupplier = {
      ...cloneDeep(modelDetailSupplier),
      totalQuantity,
      totalAmount: getTotalAmount(),
      errors: {},
    };
    const newSupplierPrincipleContracts =
      modelMaster?.supplierPrincipleContracts || [];

    const index = newSupplierPrincipleContracts?.findIndex(
      (item: SupplierModel) => item?.id === newModelDetailSupplier?.id
    );

    newSupplierPrincipleContracts[index] = newModelDetailSupplier;

    handleChangeAllFieldMaster({
      ...modelMaster,
      supplierPrincipleContracts: newSupplierPrincipleContracts,
    });
    handleCloseSupplierDetailsDrawer();
  };

  const getAmountBeforeTax = () => {
    if (isEmpty(modelDetailSupplier?.contractGoodsItems)) return 0;

    const amountBeforeTax = modelDetailSupplier?.contractGoodsItems?.reduce(
      (total: number, item: GoodsServices) =>
        total + roundTo(item?.quantity * item?.unitPrice || 0, 2),
      0
    );

    if (!detectIntegerCurrency(currencyCode)) {
      return roundTo(amountBeforeTax, 2);
    }
    return Math.round(amountBeforeTax);
  };

  const getTaxAmount = () => {
    if (isEmpty(modelDetailSupplier?.contractGoodsItems)) return 0;

    const taxAmount = modelDetailSupplier?.contractGoodsItems?.reduce(
      (total: number, item: GoodsServices) => total + (item?.taxAmount || 0),
      0
    );

    if (!detectIntegerCurrency(currencyCode)) {
      return roundTo(taxAmount, 4);
    }
    return Math.round(taxAmount);
  };

  const getTotalAmount = () => {
    if (isEmpty(modelDetailSupplier?.contractGoodsItems)) return 0;

    const totalAmount = addNumbers(getAmountBeforeTax(), getTaxAmount());

    if (!detectIntegerCurrency(currencyCode)) {
      return roundTo(totalAmount, 4);
    }
    return Math.round(totalAmount);
  };

  const handleChangeItemTable = (
    data: object,
    id: string,
    errorFields: string[]
  ) => {
    const newGoodsItems = modelDetailSupplier.contractGoodsItems.map(
      (item: GoodsServices) => {
        return item?.id === id ? { ...item, ...data } : item;
      }
    );

    handleChangeSingleField({
      fieldName: "contractGoodsItems",
    })(newGoodsItems);
  };

  const handleDeleteSupplierPrincipleContract = () => {
    const newSupplierPrincipleContracts =
      modelMaster?.supplierPrincipleContracts?.filter(
        (item: SupplierModel) => item?.id !== modelDetailSupplier?.id
      );

    handleChangeSingleFieldMaster({
      fieldName: "supplierPrincipleContracts",
    })(newSupplierPrincipleContracts);

    setIsOpenModalConfirmDelete(false);
    handleCloseSupplierDetailsDrawer();
  };

  useEffect(() => {
    if (selectedDetailSupplier?.id) {
      handleChangeAllField(selectedDetailSupplier);
    }
  }, [handleChangeAllField, selectedDetailSupplier]);

  return {
    translate,
    selectedDetailSupplierId,
    modelDetailSupplier,
    currencyCode,
    currentRate,
    isOpenModalConfirmDelete,
    getTaxAmount,
    getAmountBeforeTax,
    getTotalAmount,
    setIsOpenModalConfirmDelete,
    handleChangeItemTable,
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
    handleCloseSupplierDetailsDrawer,
    handleSaveSupplierDetailsDrawer,
    handleDeleteSupplierPrincipleContract,
  };
};
