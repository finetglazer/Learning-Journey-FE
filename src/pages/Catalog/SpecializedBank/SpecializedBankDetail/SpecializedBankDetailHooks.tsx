import { AxiosError } from "axios";
import { VIETNAMESE_TIME_ZONE_OFFSET } from "core/config/consts";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { isNull, isUndefined } from "lodash";
import { SpecializedBank } from "models/SpecializedBank/SpecializedBank";
import { SpecializedBankType } from "models/SpecializedBank/SpecializedBankFilter";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import specializedBankRepository from "../SpecializedBankRepository";

export const useSpecializedBankDetailHooks = (
  dismiss: (shouldReloadList: boolean) => void,
  id?: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<SpecializedBank>(
    SpecializedBank,
    {
      ...new SpecializedBank(),
      isActive: true,
    }
  );

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

  const getDetail = useCallback(() => {
    setLoading(true);
    specializedBankRepository.getDetail(id).subscribe({
      next: (response: SpecializedBank) => {
        dispatch({
          type: GeneralActionEnum.SET,
          payload: {
            ...response,
            isActive: response?.isActive,
            typeId: {
              id: response?.type,
              name: translate(
                `SB.txt_type_specialized_${SpecializedBankType[
                  response?.type
                ]?.toLowerCase()}`
              ),
            },
            startDateValue: dayjs(response?.startDate).add(
              VIETNAMESE_TIME_ZONE_OFFSET,
              "hour"
            ),
            endDateValue: isNull(response?.endDate)
              ? undefined
              : dayjs(response?.endDate).add(
                  VIETNAMESE_TIME_ZONE_OFFSET,
                  "hour"
                ),
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

  const createNewSpecializedBank = () => {
    setLoading(true);
    specializedBankRepository
      .create(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<SpecializedBank>({ model, error, handleChangeAllField }),
      });
  };

  const updateSpecializedBank = () => {
    setLoading(true);
    specializedBankRepository
      .update(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<SpecializedBank>({ model, error, handleChangeAllField }),
      });
  };

  const onSave = () => {
    if (isUndefined(id)) {
      createNewSpecializedBank();
    } else {
      updateSpecializedBank();
    }
  };

  useEffect(() => {
    if (!isUndefined(id)) {
      getDetail();
    }
  }, [getDetail, id]);

  return {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeDateField,
    onSave,
  };
};
