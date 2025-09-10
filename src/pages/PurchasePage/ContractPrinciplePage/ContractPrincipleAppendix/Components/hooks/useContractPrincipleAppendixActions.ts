import { AxiosError } from "axios";
import { CONTRACT_PRINCIPLE_MASTER_ROUTE } from "config/route-const";
import { ERROR_TYPE } from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { ErrorType } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEqual, isNil } from "lodash";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { CONTRACT_PRINCIPLE_APPENDIX_ROUTER } from "pages/PurchasePage/ContractPrinciplePage/ContractPrinciplePage";
import { useCallback, useContext, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { finalize, tap } from "rxjs";
import { ModelSelect } from "../../constants";
import {
  ContractPrincipleAppendixMaster,
  ContractPrincipleAppendixMasterContext,
} from "../../ContractPrincipleAppendixMaster/context";

const REASON = "reason";

export const useContractPrincipleAppendixActions = () => {
  const { handleLoadList } = useContext<ContractPrincipleAppendixMaster>(
    ContractPrincipleAppendixMasterContext
  );

  const match = useRouteMatch([
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL,
  ]);

  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const state = useMemo(() => {
    switch (match?.path) {
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE:
        return "CREATE";
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT:
        return "EDIT";
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [
      CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE,
      CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT,
    ].includes(match?.path);
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
    history.push(`${CONTRACT_PRINCIPLE_MASTER_ROUTE}?tab=1&tabKey=1`);
    notifyToast();
    setModelSelected(null);
    handleLoadList();
  }, [history, notifyToast, handleLoadList]);

  const handleContractAnnexAction = (
    action: ConfirmModalType,
    id: string,
    reason?: string
  ) => {
    if (isNil(id)) return;

    let repositoryMethod;
    switch (action) {
      case ConfirmModalType.DELETE:
        repositoryMethod = contractAnnexRepository.deleteContractAnnex;
        break;
      case ConfirmModalType.CANCEL:
        repositoryMethod = contractAnnexRepository.cancelContractAnnex;
        break;
      case ConfirmModalType.REJECT:
        repositoryMethod = contractAnnexRepository.reject;
        break;
      case ConfirmModalType.RETURN:
        repositoryMethod = contractAnnexRepository.return;
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
      handleContractAnnexAction(modelSelected.type, id, reason);
    }
  };

  return {
    state,
    isEditable,
    modelSelected,
    isLoadingModal,
    handleErrorModal,
    onConfirmSuccess,
    setModelSelected,
    handleContractAnnexAction,
    handleApplyButtonInConfirmModal,
  };
};
