import { AxiosError } from "axios";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isNull } from "lodash";
import { AreaUnitCode } from "models/AreaUnitCode/AreaUnitCode";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import areaUnitCodeRepository from "../AreaUnitCodeRepository";

export const useAreaUnitCodeDetailHooks = (
  handleCancel: (shouldReloadList?: boolean) => void,
  id?: string,
  open?: boolean,
  date?: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<AreaUnitCode>(
    AreaUnitCode,
    {
      ...new AreaUnitCode(),
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
    areaUnitCodeRepository.getDetail(id).subscribe({
      next: (response: AreaUnitCode) => {
        dispatch({
          type: GeneralActionEnum.SET,
          payload: { ...response, area: response?.value },
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
  }, [dispatch, id, notifyToast, translate]);

  const createNewAreaUnitCode = useCallback(() => {
    setLoading(true);
    areaUnitCodeRepository
      .create({ ...model, date })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleCancel(true);
          notifyToast({
            type: "success",
            message: translate("CM.txt_update_success"),
          });
          dispatch({
            type: GeneralActionEnum.SET,
            payload: {},
          });
        },
        error: (error: AxiosError) =>
          handleError<AreaUnitCode>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  }, [
    model,
    date,
    handleCancel,
    notifyToast,
    translate,
    dispatch,
    handleChangeAllField,
  ]);

  const updateAreaUnitCode = useCallback(() => {
    setLoading(true);
    areaUnitCodeRepository
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
          handleError<AreaUnitCode>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  }, [
    model,
    date,
    handleCancel,
    notifyToast,
    translate,
    dispatch,
    handleChangeAllField,
  ]);

  const onSave = useCallback(() => {
    if (isNull(id)) {
      createNewAreaUnitCode();
    } else {
      updateAreaUnitCode();
    }
    setVisibleConfirmModal(false);
  }, [createNewAreaUnitCode, id, updateAreaUnitCode]);

  const [visibleConfirmModal, setVisibleConfirmModal] =
    useState<boolean>(false);

  const handleConfirmSave = useCallback(() => {
    setLoading(true);
    areaUnitCodeRepository
      .isExisted({ ...model, date })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            setVisibleConfirmModal(true);
          } else {
            onSave();
          }
        },
        error: (error: AxiosError) =>
          handleError<AreaUnitCode>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  }, [date, handleChangeAllField, model, onSave]);

  const handleCancelConfirmModal = useCallback(() => {
    setVisibleConfirmModal(false);
  }, []);

  useEffect(() => {
    if (isNull(id) || isEqual(open, false)) {
      dispatch({
        type: GeneralActionEnum.SET,
        payload: {},
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
    visibleConfirmModal,
    handleConfirmSave,
    handleCancelConfirmModal,
  };
};
