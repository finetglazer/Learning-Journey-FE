import {
  CalculationValue,
  listPaymentMilestoneType,
  listPaymentTimeType,
  listTypeSuggestion,
  listValueCalculationPaymentSchedule,
  PaymentTimeType,
} from "config/const";
import {
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  numberConstants,
} from "core/config/consts";
import { toFixedByCurrency } from "core/helpers/calculator";
import { validator } from "core/helpers/validator";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import {
  defaultTo,
  get,
  gt,
  isEmpty,
  isEqual,
  isNil,
  isNull,
  isNumber,
  isObject,
  uniqueId,
} from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { PaymentSchedules } from "models/Contract/Contract";
import {
  generateDays,
  generateMonths,
} from "pages/PurchasePage/ContractPage/ContractDetail/Components/PaymentSchedulesTab/Components/PaymentScheduleModal/helper";
import { Dispatch, useMemo, useRef, useState } from "react";

export enum TypeAction {
  "EDIT",
  "CREATE",
  "DELETE",
}

interface PaymentScheduleHooksParams<T> {
  model: T & {
    contractAppendixPaymentSchedules?: (PaymentSchedules & {
      paymentTimeType?: (typeof listPaymentTimeType)[0];
    })[];
    calculationValue?: OptionBaseModel | CalculationValue;
    contractInfo?: {
      contractValue?: number;
      currency?: string;
    };
  };
  onDispatch: Dispatch<GeneralAction<T>>;
}

function usePaymentScheduleHooks<T>({
  model,
  onDispatch,
}: PaymentScheduleHooksParams<T>) {
  const paymentSchedules = useMemo(
    () =>
      model?.contractAppendixPaymentSchedules?.map((item) => {
        const paymentSchedules = { ...item, id: uniqueId("payment-schedules") };
        const suggestionType = item?.suggestionType;
        if (isNumber(suggestionType)) {
          paymentSchedules.suggestionType = listTypeSuggestion.find(
            (typeSuggestion) => isEqual(typeSuggestion?.id, suggestionType)
          );
        }
        const paymentTimeType = item?.paymentTimeType;
        if (isNumber(paymentTimeType)) {
          paymentSchedules.paymentTimeType = listPaymentTimeType.find(
            (paymentTime) => isEqual(paymentTime?.id, paymentTimeType)
          );
        }

        const paymentMilestoneType = item?.paymentMilestoneType;
        if (isNumber(paymentMilestoneType)) {
          paymentSchedules.paymentMilestoneType = listPaymentMilestoneType.find(
            (paymentMilestone) =>
              isEqual(paymentMilestone?.id, paymentMilestoneType)
          );
        }
        const months = item?.months;
        if (!isEmpty(months)) {
          const monthsList = generateMonths();
          paymentSchedules.months = months.map((month) =>
            isObject(month)
              ? month
              : monthsList.find((item) =>
                  isEqual(item?.id, (month as number).toString())
                )
          );
        }

        const paymentDay = paymentSchedules.paymentDay;
        if (
          isEqual(paymentTimeType, PaymentTimeType.DATE) &&
          isNumber(paymentDay)
        ) {
          const dayOptions = generateDays(31);
          paymentSchedules.paymentDay = dayOptions.find((option) =>
            isEqual(option?.id, paymentDay.toString())
          );
        }

        return paymentSchedules;
      }) || [],
    [model?.contractAppendixPaymentSchedules]
  );

  const [typeAction, setTypeAction] = useState<TypeAction | null>(null);
  const contractTermId = useRef<string>(null);

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<PaymentSchedules>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const { model: detailModel, dispatch } =
    detailService.useModel<PaymentSchedules>(PaymentSchedules, {
      ...new PaymentSchedules(),
    });

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(detailModel, dispatch);

  const calculationValue = useMemo(() => {
    const value = model?.calculationValue;
    if (isNumber(value)) {
      return listValueCalculationPaymentSchedule.find(({ id }) =>
        isEqual(id, value)
      );
    }

    return value;
  }, [model?.calculationValue]);

  const calculationSelected = calculationValue?.id as CalculationValue;

  const calcPercentValue = (value?: number, percent?: number) => {
    const safeValue = defaultTo(value, 0);
    const safePercent = defaultTo(percent, 0);
    return (safeValue * safePercent) / 100;
  };

  const handleAction = (typeAction: null | TypeAction, id: string | null) => {
    contractTermId.current = id;

    if (isEqual(typeAction, TypeAction.EDIT)) {
      const dataDetail = paymentSchedules?.find((item) =>
        isEqual(id, item?.id)
      );
      const paymentDay = dataDetail?.paymentDay;
      const isPercentageRate =
        calculationSelected === CalculationValue.PERCENTAGE_RATE;
      handleChangeAllField({
        ...dataDetail,
        paymentDay: isNull(paymentDay) ? undefined : paymentDay,
        amount:
          isPercentageRate && !dataDetail?.amount
            ? toFixedByCurrency(
                calcPercentValue(
                  get(model, "contractInfo.contractValue"),
                  get(dataDetail, "percent")
                ),
                model?.contractInfo?.currency
              )
            : dataDetail?.amount,
      });
    }
    setTypeAction(typeAction);
  };

  const handleClose = () => {
    contractTermId.current = null;
    setTypeAction(null);
    handleChangeAllField({
      ...new PaymentSchedules(),
    });
  };

  const validate = () => {
    const fieldsToValidate: {
      name: string;
      maxLength?: number;
      tabCharacter?: boolean;
      isNotRequired?: boolean;
    }[] = [
      { name: "paymentBatch", maxLength: MAX_LENGTH_255 },
      { name: "suggestionType" },
      { name: "paymentTimeType" },
      { name: "amount" },
      {
        name: "paymentCondition",
        tabCharacter: true,
        maxLength: MAX_LENGTH_500,
        isNotRequired: true,
      },
      {
        name: "referenceDocument",
        maxLength: MAX_LENGTH_500,
      },
      {
        name: "description",
        maxLength: MAX_LENGTH_500,
        isNotRequired: true,
      },
    ];

    if (isEqual(calculationSelected, CalculationValue.PERCENTAGE_RATE)) {
      fieldsToValidate.push({ name: "percent" });
    }

    const paymentTimeType = detailModel?.paymentTimeType;

    if (paymentTimeType) {
      fieldsToValidate.push({ name: "paymentDay" });
    }

    if (isEqual(paymentTimeType?.id, PaymentTimeType.DATE)) {
      fieldsToValidate.push({ name: "months" });
    }

    if (isEqual(paymentTimeType?.id, PaymentTimeType.DAYS)) {
      fieldsToValidate.push({ name: "paymentMilestoneType" });
    }

    if (isEqual(calculationSelected, CalculationValue.PAYMENT_TERM)) {
      fieldsToValidate.push({
        name: "paymentTerm",
        maxLength: MAX_LENGTH_255,
        tabCharacter: true,
      });
    }

    const errors = fieldsToValidate.reduce((acc, field) => {
      const requiredError = validator.required({
        filedValidate: field?.isNotRequired ? [] : [field.name],
        data: detailModel,
      });

      const maxLengthError = validator.maxLength({
        filedValidate: [field.name],
        data: detailModel,
        maxLength: field.maxLength,
      });

      const tabCharacterError = validator.tabCharacter({
        filedValidate: field?.tabCharacter ? [field.name] : [],
        data: detailModel,
      });

      return {
        ...acc,
        ...requiredError,
        ...maxLengthError,
        ...tabCharacterError,
      };
    }, {});

    handleChangeAllField({
      ...detailModel,
      errors,
    });

    return isEmpty(errors);
  };

  const handleAddPaymentSchedule = () => {
    if (!validate()) {
      return;
    }

    const list = paymentSchedules;

    if (isNil(detailModel?.id)) {
      const newCommercial = {
        ...detailModel,
        id: uniqueId(),
      };
      list.push(newCommercial);
    } else {
      const index = paymentSchedules.findIndex((item) =>
        isEqual(item?.id, detailModel?.id)
      );
      if (gt(index, -numberConstants.ONE)) {
        list.splice(index, numberConstants.ONE, {
          ...detailModel,
          id: detailModel.id || uniqueId("payment-schedules"),
        });
      }
    }

    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractAppendixPaymentSchedules: list,
      } as T,
    });

    handleClose();
  };

  const handleDeleteContractTerms = () => {
    const id = contractTermId.current;
    let newList: PaymentSchedules[] = [];
    let remainIds: string[] = [];
    if (isNil(id)) {
      newList = paymentSchedules.filter(
        (item) => !selectedRowKeys?.includes(item?.id)
      );
      remainIds = newList.reduce<string[]>((acc, item) => {
        if (selectedRowKeys.includes(item?.id)) {
          return [...acc, item?.id];
        }
        return acc;
      }, []);
    } else {
      newList = paymentSchedules.filter((item) => item?.id !== id);
      remainIds = selectedRowKeys?.filter(
        (itemId) => itemId !== id
      ) as string[];
      contractTermId.current = null;
    }

    setSelectedRowKeys(remainIds);
    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractAppendixPaymentSchedules: newList,
      } as T,
    });
    setTypeAction(null);
  };

  return {
    calculationValue,
    calculationSelected,
    paymentSchedules,
    typeAction,
    detailModel,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    handleClose,
    handleAction,
    setSelectedRowKeys,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleAddPaymentSchedule,
    handleDeleteContractTerms,
  };
}

export default usePaymentScheduleHooks;
