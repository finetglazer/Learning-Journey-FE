import dayjs from "dayjs";
import { cloneDeep, isEmpty, isEqual } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  JPY_CURRENCY_UNIT,
  MAX_LENGTH_20,
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  numberConstants,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { addNumbers, roundTo } from "core/helpers/number";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";

import {
  Base,
  ContractDetailModel,
  ContractGoodsServices,
  ReceivedType,
  ShippingInfo,
} from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";

export const useGoodsServicesDetailsDrawerHook = () => {
  const [translate] = useTranslation();
  const {
    model: modelMaster,
    selectedDetailGoodsServices,
    selectedDetailGoodsServicesId,
    setSelectedDetailGoodsServicesId,
    handleChangeSingleField: handleChangeSingleFieldMaster,
    handleChangeAllField: handleChangeAllFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);

  const {
    model: modelDetailGoodsServices,
    dispatch: dispatchDetailGoodsServices,
  } = detailService.useModel<ContractGoodsServices>(
    ContractGoodsServices,
    selectedDetailGoodsServices
  );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(
    modelDetailGoodsServices,
    dispatchDetailGoodsServices
  );

  const handleCloseGoodsServicesDetailsDrawer = () => {
    setSelectedDetailGoodsServicesId("");
  };

  const validate = () => {
    const detailFields = [
      {
        fieldName: "branch",
        isRequired: true,
      },
      {
        fieldName: "quantity",
        isRequired: true,
      },
      {
        fieldName: "unit",
        isRequired: true,
      },
      {
        fieldName: "unitPrice",
        isRequired: true,
      },
      {
        fieldName: "description",
        isRequired: false,
        maxLength: MAX_LENGTH_500,
      },
      {
        fieldName: "note",
        isRequired: false,
        maxLength: MAX_LENGTH_500,
      },
    ];
    const shippingInfoRequiredFields: {
      fieldName: keyof ShippingInfo;
      isRequired?: boolean;
      maxLength?: number;
      regex?: RegExp;
      isCheckQuantity?: boolean;
    }[] = [
      {
        fieldName: "shippingDate",
        isRequired: true,
      },
      {
        fieldName: "quantity",
        isRequired: true,
        isCheckQuantity: true,
      },
      {
        fieldName: "receivedOrganization",
        isRequired: true,
      },
      {
        fieldName: "receiver",
        isRequired: true,
      },
      {
        fieldName: "phoneNumber",
        isRequired: true,
        maxLength: MAX_LENGTH_20,
        regex: PHONE_NUMBER_REGEX,
      },
      {
        fieldName: "address",
        isRequired: true,
        maxLength: MAX_LENGTH_255,
      },
      {
        fieldName: "note",
        isRequired: false,
        maxLength: MAX_LENGTH_500,
      },
    ];

    if (modelDetailGoodsServices?.tax?.id) {
      detailFields.push({
        fieldName: "taxAmount",
        isRequired: true,
      });
    }

    const errors = detailFields.reduce(
      (acc: { [key: string]: string }, field) => {
        const fieldValue = modelDetailGoodsServices?.[field?.fieldName];
        if (field?.isRequired && !fieldValue && fieldValue !== 0) {
          acc[field.fieldName] = translate("CM.input_require_validation");
        }
        if (fieldValue?.length > field?.maxLength) {
          acc[field.fieldName] = translate("CM.input_length_validation", {
            maxLength: field?.maxLength,
          });
        }
        return acc;
      },
      {}
    );
    const shippingInfoErrors: { [key: string]: string } = {};

    if (
      !isEmpty(modelDetailGoodsServices?.shippingInfo) &&
      shouldShowShippingInformation()
    ) {
      const receivedQuantityTotal =
        modelDetailGoodsServices?.shippingInfo?.reduce(
          (total, item) => total + (item?.quantity || 0),
          0
        );

      modelDetailGoodsServices?.shippingInfo.forEach((item) => {
        shippingInfoRequiredFields.forEach((field) => {
          const fieldValue = item?.[field?.fieldName] as string;
          if (field?.isRequired && !fieldValue) {
            shippingInfoErrors[`shippingInfo.${item.id}.${field?.fieldName}`] =
              translate("CM.input_require_validation");
          } else if (fieldValue?.length > field?.maxLength) {
            shippingInfoErrors[`shippingInfo.${item.id}.${field?.fieldName}`] =
              translate("CM.input_length_validation", {
                maxLength: field?.maxLength,
              });
          } else if (field?.regex && !field?.regex.test(fieldValue)) {
            shippingInfoErrors[`shippingInfo.${item.id}.${field?.fieldName}`] =
              translate("CM.input_regex_validation");
          } else if (
            field?.isCheckQuantity &&
            receivedQuantityTotal !== modelDetailGoodsServices?.quantity
          ) {
            shippingInfoErrors[`shippingInfo.${item.id}.${field?.fieldName}`] =
              translate(
                "CT.total_delivery_quantity_must_equal_purchase_quantity"
              );
          } else if (
            field?.isCheckQuantity &&
            receivedQuantityTotal === modelDetailGoodsServices?.quantity
          ) {
            delete shippingInfoErrors[
              `shippingInfo.${item.id}.${field?.fieldName}`
            ];
          }
        });
      });
    }

    if (!isEmpty(errors) || !isEmpty(shippingInfoErrors)) {
      handleChangeAllField({
        ...modelDetailGoodsServices,
        errors: {
          ...errors,
          ...shippingInfoErrors,
        },
      });
      return false;
    }
    return true;
  };

  const handleSaveGoodsServicesDetailsDrawer = () => {
    if (!validate()) {
      return;
    }

    const newModelDetailGoodsServices = {
      ...cloneDeep(modelDetailGoodsServices),
      errors: {},
    };

    newModelDetailGoodsServices.totalAmount = getTotalAmount();
    newModelDetailGoodsServices.totalConvertedAmount =
      newModelDetailGoodsServices.totalAmount * (modelMaster?.rate || 1);

    const newContractGoodsServicesList =
      modelMaster?.contractGoodsServicesList || [];
    const index = newContractGoodsServicesList.findIndex(
      (item: ContractGoodsServices) => item.id === modelDetailGoodsServices.id
    );
    isEqual(index, -1)
      ? newContractGoodsServicesList.push(newModelDetailGoodsServices)
      : (newContractGoodsServicesList[index] = newModelDetailGoodsServices);

    handleChangeAllFieldMaster({
      ...modelMaster,
      contractGoodsServicesList: newContractGoodsServicesList,
    });
    handleCloseGoodsServicesDetailsDrawer();
  };

  const handleDeleteDetailGoodsServices = () => {
    const newContractGoodsServicesList =
      modelMaster?.contractGoodsServicesList?.filter(
        (item: ContractGoodsServices) => {
          return item?.id !== modelDetailGoodsServices?.id;
        }
      );

    handleChangeSingleFieldMaster({
      fieldName: "contractGoodsServicesList",
    })(newContractGoodsServicesList);
    setIsOpenModalConfirmDelete(false);
    handleCloseGoodsServicesDetailsDrawer();
  };

  const currencyCode = modelMaster?.currency || VND_CURRENCY;
  const roundNumber =
    isEqual(currencyCode, VND_CURRENCY) ||
    isEqual(currencyCode, JPY_CURRENCY_UNIT)
      ? 0
      : 2;

  const currentRate = useMemo(() => {
    if (isEqual(currencyCode, VND_CURRENCY)) {
      return numberConstants.ONE;
    }
    return modelMaster?.rate;
  }, [currencyCode, modelMaster?.rate]);

  const getAmountBeforeTax = () => {
    const amountBeforeTax =
      (modelDetailGoodsServices?.unitPrice || 0) *
      (modelDetailGoodsServices?.quantity || 0);
    if (
      currencyCode !== VND_CURRENCY &&
      !isEqual(currencyCode, JPY_CURRENCY_UNIT)
    ) {
      return roundTo(amountBeforeTax, 2);
    }
    return Math.round(amountBeforeTax);
  };

  const getTaxAmount = (unitPrice: number, quantity: number, tax: Base) => {
    if (!tax?.id) return;

    const taxAmount =
      (unitPrice || 0) * (quantity || 0) * (tax?.rate / 100 || 0);
    if (
      currencyCode !== VND_CURRENCY &&
      !isEqual(currencyCode, JPY_CURRENCY_UNIT)
    ) {
      return roundTo(taxAmount, 2);
    }
    return Math.round(taxAmount);
  };

  const getTotalAmount = () => {
    const baseAmount = roundTo(
      (modelDetailGoodsServices?.unitPrice || 0) *
        (modelDetailGoodsServices?.quantity || 0),
      roundNumber
    );
    const totalAmount = addNumbers(
      baseAmount,
      modelDetailGoodsServices.taxAmount || 0,
      modelDetailGoodsServices.otherAmount || 0
    );
    if (
      currencyCode !== VND_CURRENCY &&
      !isEqual(currencyCode, JPY_CURRENCY_UNIT)
    ) {
      return roundTo(totalAmount, 4);
    }
    return Math.round(totalAmount);
  };

  const shouldShowShippingInformation = () => {
    return modelMaster.receivedType === ReceivedType.MultipleReceivers;
  };

  const handleAddShippingRow = () => {
    const newShippingRow = {
      id: dayjs().valueOf().toString(),
    };
    let shippingInfo = [];
    shippingInfo = !isEmpty(modelDetailGoodsServices.shippingInfo)
      ? [...modelDetailGoodsServices.shippingInfo, newShippingRow]
      : [{ ...newShippingRow, quantity: modelDetailGoodsServices?.quantity }];

    handleChangeSingleField({
      fieldName: "shippingInfo",
    })(shippingInfo);
  };

  const handleChangeItemTable = (
    data: object,
    id: string,
    errorFields: string[]
  ) => {
    const newShippingInfo = modelDetailGoodsServices.shippingInfo.map(
      (item: ShippingInfo) => {
        return item?.id === id ? { ...item, ...data } : item;
      }
    );
    let errors = {};
    if (!isEmpty(errorFields)) {
      errors = errorFields?.reduce((acc: { [key: string]: null }, field) => {
        acc[field] = null;
        return acc;
      }, {});
    }

    handleChangeAllField({
      ...modelDetailGoodsServices,
      shippingInfo: newShippingInfo,
      errors: {
        ...modelDetailGoodsServices.errors,
        ...errors,
      },
    });
  };

  const handleDeleteShippingRow = (id: string) => {
    const newShippingInfo = modelDetailGoodsServices?.shippingInfo?.filter(
      (item) => item?.id !== id
    );

    handleChangeSingleField({
      fieldName: "shippingInfo",
    })(newShippingInfo);
  };

  useEffect(() => {
    if (selectedDetailGoodsServices?.id) {
      handleChangeAllField(selectedDetailGoodsServices);
    }
  }, [handleChangeAllField, selectedDetailGoodsServices]);
  return {
    translate,
    selectedDetailGoodsServicesId,
    modelDetailGoodsServices,
    currencyCode,
    roundNumber,
    currentRate,
    isOpenModalConfirmDelete,
    getTaxAmount,
    getAmountBeforeTax,
    getTotalAmount,
    shouldShowShippingInformation,
    setIsOpenModalConfirmDelete,
    handleAddShippingRow,
    handleDeleteShippingRow,
    handleChangeItemTable,
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
    handleCloseGoodsServicesDetailsDrawer,
    handleSaveGoodsServicesDetailsDrawer,
    handleDeleteDetailGoodsServices,
  };
};
