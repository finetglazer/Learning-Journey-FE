import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { webService } from "core/services/common-services/web-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import React, { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import { finalize, Observable } from "rxjs";

interface ErrorModalType {
  type: "CREATE" | "UPDATE" | "DETAIL" | "DELETE" | "SUBMIT_FAIL" | "NONE";
  id?: string;
  errors?: string[];
}

export function usePurchaseRequestSignFormHook<T extends Model>(
  model?: T,
  handleChangeAllField?: (data: T) => void,
  saveApi?: (data: T) => Observable<T>,
  handleConvertData?: (isDraft: boolean) => T,
  hanleGoMaster?: () => void,
  setLoading?: (data?: boolean) => void,
  setErrorsModal?: Dispatch<SetStateAction<ErrorModalType>>
) {
  const [openSigningForm, setOpenSigningForm] = React.useState(false);
  const [subscription] = webService.useSubscription();
  const handleCancelSigningForm = React.useCallback(() => {
    setOpenSigningForm(false);
  }, []);
  const { notifyUpdateItemSuccess, notifyToast } =
    appMessageService.useCRUDMessage();

  const handleOpenSigningForm = React.useCallback(() => {
    const requestBody = handleConvertData(true);
    setLoading(true);
    saveApi({
      ...requestBody,
      requireWorkflowConfiguration: true,
      isHardValidate: true,
    })
      .pipe(
        finalize(() => {
          setLoading(false);
        })
      )
      .subscribe({
        next: (res) => {
          handleChangeAllField({
            ...model,
            id: res?.id,
            code: res?.code,
          });
          setOpenSigningForm(true);
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              if (typeof setErrorsModal === "function") {
                setErrorsModal({
                  type: "SUBMIT_FAIL",
                  errors: error?.response?.data?.tabErrors || [],
                });
              }
              handleChangeAllField({
                ...convertDataToHaveIndexBeforeValidate(model, [], model, [
                  "startDate",
                ]),
                errors: error.response?.data?.errors,
                errorTabs: error.response?.data?.tabs,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
      });
  }, [
    handleChangeAllField,
    handleConvertData,
    model,
    notifyToast,
    saveApi,
    setErrorsModal,
    setLoading,
  ]);

  const handleSendRequest = React.useCallback(() => {
    const requestBody = handleConvertData(false);
    setLoading(true);
    subscription.add(
      saveApi(requestBody)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyUpdateItemSuccess();
            hanleGoMaster();
          },
          error: (error: AxiosError) => {
            if (error.response && error.response.status === 400)
              if (error.response?.data?.type === "Validate") {
                if (typeof setErrorsModal === "function") {
                  setErrorsModal({
                    type: "SUBMIT_FAIL",
                    errors: error?.response?.data?.tabErrors || [],
                  });
                }
                handleChangeAllField({
                  ...convertDataToHaveIndexBeforeValidate(model, [], model, [
                    "startDate",
                  ]),
                  errors: error.response?.data?.errors,
                  errorTabs: error.response?.data?.tabs,
                });
              } else {
                notifyToast({
                  message: error.response?.data?.message,
                  type: "error",
                });
              }
          },
        })
    );
  }, [
    handleChangeAllField,
    handleConvertData,
    hanleGoMaster,
    model,
    notifyToast,
    notifyUpdateItemSuccess,
    saveApi,
    setErrorsModal,
    setLoading,
    subscription,
  ]);

  return {
    openSigningForm,
    setOpenSigningForm,
    handleCancelSigningForm,
    handleOpenSigningForm,
    handleSendRequest,
  };
}
