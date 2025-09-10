import { AxiosError } from "axios";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import appMessageService from "core/services/common-services/app-message-service";
import { webService } from "core/services/common-services/web-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { GoodsPrice, SupplierModel } from "models/PurchasingPlan";
import { TYPE_PURCHASING_PLAN } from "models/PurchasingPlan/PurchasingPlanConstant";
import React, { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import { finalize, Observable } from "rxjs";

export function usePurchasingPlanPrincipleSignFormHook<T extends Model>(
  model?: T,
  handleChangeAllField?: (data: T) => void,
  saveApi?: (data: T) => Observable<any>,
  handleConvertData?: (isDraft: boolean) => T,
  hanleGoMaster?: () => void,
  setLoading?: (data?: boolean) => void,
  setErrorsModal?: Dispatch<SetStateAction<ModalTypeError>>
) {
  const [openSigningForm, setOpenSigningForm] = React.useState(false);
  const [subscription] = webService.useSubscription();
  const handleCancelSigningForm = React.useCallback(() => {
    setOpenSigningForm(false);
  }, []);
  const { notifyUpdateItemSuccess, notifyToast } =
    appMessageService.useCRUDMessage();

  const dataSubmit = {
    purchasePlanId: model?.idDetail || model?.id,
    purchasePlanType: TYPE_PURCHASING_PLAN.FROM_CONTRACT_PRINCIPLE,
    supplierPurchasePlans: model?.supplierPrincipleContracts?.map(
      (el: SupplierModel) => {
        return {
          contactPerson: el.contactPerson,
          principleContractId: el.contractId,
          rate: el.exchangeRate,
          contractGoodsPrices: el.contractGoodsItems?.map(
            (item: GoodsPrice) => ({
              quantity: item.quantity,
              taxAmount: item.taxAmount,
              taxId: item.tax?.id,
              goodsId: item.goodsId,
              unitId: item.unitId,
              manufacturerId: item.branchId,
              contractGoodsItemId: item.id,
            })
          ),
        };
      }
    ),
  };

  const handleOpenSigningForm = React.useCallback(() => {
    const requestBody = {
      ...dataSubmit,
      isDraft: true,
    };
    setLoading(true);
    saveApi({
      ...requestBody,
      requireWorkflowConfiguration: true,
      isHardValidate: true,
    } as unknown as T)
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
    // handleConvertData,
    model,
    notifyToast,
    saveApi,
    setErrorsModal,
    setLoading,
  ]);

  const handleSendRequest = React.useCallback(() => {
    const requestBody = {
      ...dataSubmit,
      isDraft: false,
    };
    setLoading(true);
    subscription.add(
      saveApi(requestBody as any)
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
