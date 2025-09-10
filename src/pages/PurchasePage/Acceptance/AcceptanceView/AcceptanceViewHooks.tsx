import { AxiosError } from "axios";
import { ACCEPTANCE_ROUTE_MASTER } from "config/route-const";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual, isNil } from "lodash";
import { AcceptanceStatus, GoodItemsModel } from "models/Acceptance";
import { useGetAcceptanceDetail } from "pages/PurchasePage/Acceptance/Components/hooks/useGetAcceptanceDetail";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";

interface Parameters {
  acceptanceId: string | undefined;
}

export const useAcceptanceViewHooks = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();
  const { acceptanceId } = useParams<Parameters>();
  const { model, loading, dispatch, getAcceptanceDetail } =
    useGetAcceptanceDetail({
      acceptanceId,
    });

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  const [goodsReceiptSelect, setGoodsReceiptSelect] =
    useState<GoodItemsModel | null>(null);

  const handleApproval = () => {
    const id = model?.id;
    if (isNil(id)) return;

    setLoading(true);
    acceptanceRepository
      .approval(id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          history.push(ACCEPTANCE_ROUTE_MASTER);
        },
        error: (error: AxiosError) => {
          const message = error?.response?.data?.message;
          notifyToast({
            type: "error",
            message: message || translate("CM.message_system_error"),
          });
        },
      });
  };

  const processAfterFeedbackSubmission = useCallback(() => {
    if (isEqual(model?.status, AcceptanceStatus.WAITING_FOR_APPROVAL)) {
      getAcceptanceDetail();
    }
  }, [getAcceptanceDetail, model?.status]);
  return {
    model,
    loading,
    goodsReceiptSelect,
    isLoading,
    handleApproval,
    setGoodsReceiptSelect,
    dispatch,
    processAfterFeedbackSubmission,
    handleChangeSingleField,
  };
};
