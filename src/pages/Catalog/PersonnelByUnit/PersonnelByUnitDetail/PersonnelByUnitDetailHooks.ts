import { AxiosError } from "axios";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isNull } from "lodash";
import { PersonnelByUnit } from "models/PersonnelByUnit/PersonnelByUnit";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import personnelByUnitRepository from "../PersonnelByUnitRepository";

export const usePersonnelByUnitDetailHooks = (
  handleCancel: (shouldReloadList?: boolean) => void,
  id?: string,
  open?: boolean,
  date?: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<PersonnelByUnit>(
    PersonnelByUnit,
    {
      ...new PersonnelByUnit(),
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
    personnelByUnitRepository.getDetail(id).subscribe({
      next: (response: PersonnelByUnit) => {
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

  const createNewPersonnelByUnit = useCallback(() => {
    setVisibleConfirmModal(false);
    setLoading(true);
    personnelByUnitRepository
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
          handleError<PersonnelByUnit>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  }, [
    date,
    dispatch,
    handleCancel,
    handleChangeAllField,
    model,
    notifyToast,
    translate,
  ]);

  const updatePersonnelByUnit = useCallback(() => {
    setLoading(true);
    setVisibleConfirmModal(false);
    personnelByUnitRepository
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
          handleError<PersonnelByUnit>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  }, [
    date,
    dispatch,
    handleCancel,
    handleChangeAllField,
    model,
    notifyToast,
    translate,
  ]);

  const onSave = useCallback(() => {
    if (isNull(id)) {
      createNewPersonnelByUnit();
    } else {
      updatePersonnelByUnit();
    }
  }, [createNewPersonnelByUnit, id, updatePersonnelByUnit]);

  const [visibleConfirmModal, setVisibleConfirmModal] =
    useState<boolean>(false);

  const handleConfirmSave = useCallback(() => {
    setLoading(true);
    personnelByUnitRepository
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
          handleError<PersonnelByUnit>({
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
