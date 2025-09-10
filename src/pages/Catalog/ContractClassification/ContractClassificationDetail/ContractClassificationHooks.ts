import { AxiosError } from "axios";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isNull } from "lodash";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { contractClassificationRepository } from "../ContractClassificationRepository";

export const useContractClassificationDetailHooks = (
  handleCancel: (shouldReloadList?: boolean) => void,
  id?: string,
  open?: boolean,
  date?: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<ContractClassification>(
    ContractClassification,
    {
      ...new ContractClassification(),
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

  const handleGetDetail = useCallback(() => {
    setLoading(true);
    contractClassificationRepository.getDetail(id).subscribe({
      next: (response: ContractClassification) => {
        dispatch({
          type: GeneralActionEnum.SET,
          payload: response,
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

  const createNewContractClassification = () => {
    setLoading(true);
    contractClassificationRepository
      .create({ ...model, date })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleCancel(true);
          dispatch({
            type: GeneralActionEnum.SET,
            payload: {},
          });
          notifyToast({
            type: "success",
            message: translate("CM.txt_update_success"),
          });
        },
        error: (error: AxiosError) =>
          handleError<ContractClassification>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const updateContractClassification = () => {
    setLoading(true);
    contractClassificationRepository
      .update({ ...model, date })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleCancel(true);
          dispatch({
            type: GeneralActionEnum.SET,
            payload: {},
          });
          notifyToast({
            type: "success",
            message: translate("CM.txt_update_success"),
          });
        },
        error: (error: AxiosError) =>
          handleError<ContractClassification>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const onSave = () => {
    if (isNull(id)) {
      createNewContractClassification();
    } else {
      updateContractClassification();
    }
  };

  useEffect(() => {
    if (isNull(id) || isEqual(open, false)) {
      dispatch({
        type: GeneralActionEnum.SET,
        payload: {
          isActive: true,
        },
      });
      return;
    }

    handleGetDetail();
  }, [id, open]);

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
