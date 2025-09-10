import { AxiosError } from "axios";
import { ACCEPTANCE_ROUTE_MASTER } from "config/route-const";
import { ErrorType } from "core/helpers/handle-error";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { GoodItemsModel } from "models/Acceptance/Acceptance";
import { AcceptanceCreate } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { finalize } from "rxjs";
import { useGetGeneralInformation } from "../Components/hooks/useGetGeneralInformation";

interface Parameters {
  contractId: string | undefined;
  acceptanceId: string | undefined;
}

export const useAcceptanceDetailHooks = () => {
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const { contractId, acceptanceId } = useParams<Parameters>();
  const [errorsModal, setErrorsModal] = useState<ModalTypeError>({
    type: "NONE",
    errors: [],
  });

  const [goodsReceiptSelect, setGoodsReceiptSelect] =
    useState<GoodItemsModel | null>(null);

  const {
    model,
    loading,
    loadingGoodItems,
    dispatch,
    setLoading,
    getGetGoodItems,
  } = useGetGeneralInformation({
    contractId,
    acceptanceId,
  });

  const {
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  const handleCreate = ({ isDraft, isEdit, callbackFc }: AcceptanceCreate) => {
    setLoading(true);
    const body = {
      isDraft,
      contractId: isEdit ? model?.contractId : contractId,
      acceptanceId: acceptanceId || model.id,
      description: model?.description,
      applyDate: model?.applyDate,
      exchangeRate: model?.exchangeRate,
      supplierAgent: model?.supplierAgent,
      supplierPosition: model?.supplierPosition,
      conclude: model?.conclude,
      acceptanceComponents: model?.acceptanceComponents?.map((item) => ({
        id: item?.id,
      })),
      acceptanceGoodsItems: model?.acceptanceGoodsItems?.map((goodItem) => ({
        contractGoodsItemId: goodItem?.contractGoodsItemId,
        acceptanceNote: goodItem?.acceptanceNote || undefined,
        note: goodItem?.note || undefined,
        taxId: goodItem?.tax?.id,
        taxAmount: goodItem?.taxAmount,
        goodsId: goodItem?.goodsId,
        acceptanceId: goodItem?.acceptanceId,
      })),
      goodsReceiptRequestIds: model?.goodsReceiptRequests?.map(
        (item) => item?.id
      ),
      acceptanceFiles: model?.acceptanceFiles?.map((item) => ({
        attachments: item?.attachments,
        note: item?.note,
      })),
      documentGroups: model?.documentGroups?.map((documentGroup) => ({
        description: documentGroup?.description,
        createdDate: dayjs(),
        attachments: documentGroup?.attachments?.map((attachment) => ({
          name: attachment?.name,
          contentType: attachment?.contentType,
          size: attachment?.size,
          path: attachment?.path,
          systemFileId: attachment?.systemFileId,
        })),
      })),
      isHardValidate: !!(typeof callbackFc === "function"),
    };
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model, [
      "service_usage_time",
    ]);

    const acceptanceAction = isEdit || model?.id ? "edit" : "create";

    acceptanceRepository[acceptanceAction](body)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (res) => {
          notifyToast();
          handleChangeAllField({
            ...model,
            id: res?.id,
            code: res?.code,
          });
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            history.push(ACCEPTANCE_ROUTE_MASTER);
          }
        },
        error: (error: AxiosError) => {
          if (
            error.response &&
            isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
          ) {
            if (
              error?.response?.data?.tabErrors?.length > 0 ||
              error?.response?.data?.tabs?.length > 0 ||
              error?.response?.data?.tabs?.errors > 0
            ) {
              setErrorsModal({
                type: "SUBMIT_FAIL",
                errors: error?.response?.data?.tabErrors || [],
              });
            }
            if (isEqual(error.response?.data?.type, ErrorType.VALIDATE)) {
              handleChangeAllField({
                ...newModel,
                errors: error.response?.data?.errors,
                errorTabs: error.response?.data?.tabs,
              });
            } else if (
              isEqual(error.response?.data?.type, ErrorType.BAD_REQUEST)
            ) {
              handleChangeAllField({
                ...newModel,
                errorTabs: error.response?.data?.tabs,
              });
              if (error.response?.data?.message) {
                notifyToast({
                  message: error.response?.data?.message,
                  type: "error",
                });
              }
            }
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  return {
    model,
    loading,
    loadingGoodItems,
    goodsReceiptSelect,
    errorsModal,
    acceptanceId,
    dispatch,
    handleCreate,
    setErrorsModal,
    setGoodsReceiptSelect,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    getGetGoodItems,
  };
};
