import { AxiosError } from "axios";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isUndefined } from "lodash";
import { GuaranteeType } from "models/GuaranteeType/GuaranteeType";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import guaranteeTypeRepository from "../GuaranteeTypeRepository";

export const useGuaranteeTypeDetailHooks = (
  dismiss: (shouldReloadList: boolean) => void,
  id?: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<GuaranteeType>(
    GuaranteeType,
    {
      ...new GuaranteeType(),
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
    guaranteeTypeRepository.getDetail(id).subscribe({
      next: (response: GuaranteeType) => {
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

  const createGuaranteeType = () => {
    setLoading(true);
    guaranteeTypeRepository
      .create(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<GuaranteeType>({ model, error, handleChangeAllField }),
      });
  };

  const updateGuaranteeType = () => {
    setLoading(true);
    guaranteeTypeRepository
      .update(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<GuaranteeType>({ model, error, handleChangeAllField }),
      });
  };

  const onSave = () => {
    if (isUndefined(id)) {
      createGuaranteeType();
    } else {
      updateGuaranteeType();
    }
  };

  const copyToClipboard = () => {
    const textToCopy = model?.code || "";

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notifyToast({
            message: translate("CL.copied_to_clipboard_message"),
          });
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
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
    copyToClipboard,
  };
};
