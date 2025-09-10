import { AxiosError } from "axios";
import { ERROR_TYPE } from "core/config/consts";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEqual } from "lodash";
import { useGetGeneralInformation } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetGeneralInformation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";
import { ProjectSettlementModal } from "../Components/constant";
import { useModalConfirm } from "../Components/hooks/useModalConfirm";

interface Parameters {
  originalPurchaseProposalId: string | undefined;
  id: string | undefined;
}
export const useProjectSettlementViewHook = () => {
  const [translate] = useTranslation();
  const { originalPurchaseProposalId, id } = useParams<Parameters>();
  const [modalType, setModalType] = useState<ProjectSettlementModal | null>(
    null
  );
  const [orderFormSelect, setOrderFormSelect] = useState<unknown | null>(null);
  const [isLoadingView, setLoadingView] = useState<boolean>(false);
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const refresh = () => {
    history.goBack();
  };

  const { isLoading, errorMessage, processApi, setErrorMessage } =
    useModalConfirm(refresh);

  const { model, loading, dispatch, setLoading, handleChangeSingleField } =
    useGetGeneralInformation({
      originalPurchaseProposalId,
      id,
    });

  const handleConfirmModal = (type: ProjectSettlementModal) => {
    if (isEqual(type, ProjectSettlementModal.Approve)) {
      setLoadingView(true);
      projectSettlementRepository
        .approve(model?.id)
        .pipe(finalize(() => setLoadingView(false)))
        .subscribe({
          next: () => {
            notifyToast();
            refresh();
          },
          error: (error: AxiosError) => {
            if (isEqual(error?.response?.status, HttpStatusCode.BAD_REQUEST)) {
              notifyToast({
                type: ERROR_TYPE,
                message: error.response?.data?.message,
              });
            }
          },
        });

      return;
    }
    setModalType(type);
  };

  const onApplyConfirmModal = (id: string, reason: string) => {
    processApi(modalType, id, reason);
  };

  const onCancelConfirmModal = () => {
    setModalType(null);
    setErrorMessage(null);
  };

  return {
    model,
    loading,
    dispatch,
    setLoading,
    translate,
    orderFormSelect,
    setOrderFormSelect,
    handleConfirmModal,
    modalType,
    isLoadingModal: isLoading,
    errorMessage,
    onApplyConfirmModal,
    onCancelConfirmModal,
    isLoadingView,
    handleChangeSingleField,
  };
};
