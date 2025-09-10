import { AxiosError } from "axios";
import { ACCEPTANCE_ROUTE_MASTER } from "config/route-const";
import { ERROR_TYPE } from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { ErrorType } from "core/helpers/handle-error";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEqual, isNil } from "lodash";
import { ModelSelect } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import {
  AcceptanceMaster,
  AcceptanceMasterContext,
} from "pages/PurchasePage/Acceptance/AcceptanceMaster/AcceptanceMasterTab/context";
import { ACCEPTANCE_ROUTER } from "pages/PurchasePage/Acceptance/AcceptancePage";
import { useCallback, useContext, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { finalize, tap } from "rxjs";

const REASON = "reason";

export const useAcceptanceActions = () => {
  const { handleLoadList } = useContext<AcceptanceMaster>(
    AcceptanceMasterContext
  );

  const match = useRouteMatch([
    ACCEPTANCE_ROUTER.CREATE,
    ACCEPTANCE_ROUTER.EDIT,
    ACCEPTANCE_ROUTER.DETAIL,
  ]);

  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const state = useMemo(() => {
    switch (match?.path) {
      case ACCEPTANCE_ROUTER.CREATE:
        return "CREATE";
      case ACCEPTANCE_ROUTER.EDIT:
        return "EDIT";
      case ACCEPTANCE_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [ACCEPTANCE_ROUTER.CREATE, ACCEPTANCE_ROUTER.EDIT].includes(
      match?.path
    );
  }, [match?.path]);

  const handleErrorModal = (error: AxiosError) => {
    if (
      error.response &&
      isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
    ) {
      const type = error?.response?.data?.type;
      if (type === ErrorType.VALIDATE) {
        setModelSelected((prevState) => ({
          ...prevState,
          errorMessage: error.response?.data?.errors[REASON],
        }));
      } else {
        notifyToast({
          type: ERROR_TYPE,
          message: error.response?.data?.message,
        });
      }
    }
  };

  const onConfirmSuccess = useCallback(() => {
    history.push(ACCEPTANCE_ROUTE_MASTER);
    notifyToast();
    setModelSelected(null);
    handleLoadList();
  }, [history, notifyToast, handleLoadList]);

  const handleAcceptanceAction = (
    action: ConfirmModalType,
    id: string,
    reason?: string
  ) => {
    if (isNil(id)) return;

    let repositoryMethod;
    switch (action) {
      case ConfirmModalType.DELETE:
        repositoryMethod = acceptanceRepository.deleteAcceptance;
        break;
      case ConfirmModalType.CANCEL:
        repositoryMethod = acceptanceRepository.cancelAcceptance;
        break;
      case ConfirmModalType.RETURN:
        repositoryMethod = acceptanceRepository.returnAcceptance;
        break;
      case ConfirmModalType.REJECT:
        repositoryMethod = acceptanceRepository.rejectAcceptance;
        break;
      default:
        return;
    }

    repositoryMethod(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: onConfirmSuccess,
        error: handleErrorModal,
      });
  };

  const handleApplyButtonInConfirmModal = (id: string, reason?: string) => {
    if (modelSelected) {
      handleAcceptanceAction(modelSelected.type, id, reason);
    }
  };

  return {
    state,
    isEditable,
    modelSelected,
    isLoadingModal,
    handleErrorModal,
    onConfirmSuccess,
    handleAcceptanceAction,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  };
};
