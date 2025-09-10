import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual } from "lodash";
import { AppUser } from "models/AppUser";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize } from "rxjs";
import { appUserRepository } from "../AppUserRepository";

export function useAppUserDetailHook() {
  const { model, dispatch: dispatchModel } = detailService.useModel<AppUser>(
    AppUser,
    {
      ...new AppUser(),
      isActive: true,
    }
  );

  const history = useHistory();

  const { isDetail } = detailService.useGetIsDetail(
    appUserRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleGoMaster = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSave = React.useCallback(() => {
    setLoading(true);
    appUserRepository
      .updateSignature(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleGoMaster();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [handleChangeAllField, handleGoMaster, model, notifyToast, translate]);

  return {
    model,
    isDetail,
    loading,
    setLoading,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleChangeAllField,
    handleSave,
  };
}
