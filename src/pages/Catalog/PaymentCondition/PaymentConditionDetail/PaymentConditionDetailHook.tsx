import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { isUndefined } from "lodash";
import { finalize } from "rxjs";

import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";

import { PaymentConditionDetailProps } from "./PaymentConditionDetail";
import paymentConditionRepository from "../PaymentConditionRepository";
import { PaymentCondition } from "models/PaymentCondition";

export const usePaymentConditionDetailHook = (
  dismiss: PaymentConditionDetailProps["dismiss"],
  id?: PaymentConditionDetailProps["paymentConditionId"]
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { model, dispatch } = detailService.useModel<PaymentCondition>(
    PaymentCondition,
    {
      ...new PaymentCondition(),
      isActive: true,
    }
  );

  const title: string = useMemo(() => {
    const translatedKey = isUndefined(id)
      ? "PC.txt_create_payment_condition"
      : "PC.txt_edit_payment_condition";

    return translate(translatedKey);
  }, [id, translate]);

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeBoolField,
  } = fieldService.useField(model, dispatch);

  const getDetail = useCallback(() => {
    setLoading(true);
    paymentConditionRepository.getDetail(id).subscribe({
      next: (response: PaymentCondition) => {
        dispatch({
          type: GeneralActionEnum.SET,
          payload: {
            ...response,
            isActive: response?.isActive,
          },
        });
      },
      error: () => {
        notifyToast({
          type: "error",
          message: translate("CM.message_system_error"),
        });
      },
      complete: () => setLoading(false),
    });
  }, [id, translate]);

  const createNewManufacturerCategory = () => {
    setLoading(true);
    paymentConditionRepository
      .create(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<PaymentCondition>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const updateManufacturerCategory = () => {
    setLoading(true);
    paymentConditionRepository
      .update(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<PaymentCondition>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const onSave = () => {
    isUndefined(id)
      ? createNewManufacturerCategory()
      : updateManufacturerCategory();
  };

  useEffect(() => {
    if (!isUndefined(id)) {
      getDetail();
    }
  }, [getDetail, id]);

  return {
    translate,
    isLoading,
    model,
    title,
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeBoolField,
    onSave,
  };
};
