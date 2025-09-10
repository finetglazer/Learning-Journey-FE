import {
  ContractAnnexMaster,
  ContractAnnexMasterContext,
} from "../../ContractAnnexMaster/context";
import { ErrorType } from "core/helpers/handle-error";
import { AxiosError } from "axios";
import { ERROR_TYPE } from "core/config/consts";
import { isEqual, isNil } from "lodash";
import { HttpStatusCode } from "core/services/service-types";
import { CONTRACT_ANNEX_ROUTER } from "pages/PurchasePage/ContractPage/ContractPage";
import { CONTRACT_ROUTE_MASTER } from "config/route-const";
import { contractAnnexRepository } from "../../ContractAnnexRepository";
import { useHistory, useRouteMatch } from "react-router";
import { ModelSelect } from "../../constants";
import { useCallback, useContext, useMemo, useState } from "react";
import appMessageService from "core/services/common-services/app-message-service";
import { ConfirmModalType } from "core/helpers/enum";

const REASON = "reason";

export const useContractAnnexActions = () => {
  const { handleLoadList } = useContext<ContractAnnexMaster>(
    ContractAnnexMasterContext
  );

  const match = useRouteMatch([
    CONTRACT_ANNEX_ROUTER.EDIT,
    CONTRACT_ANNEX_ROUTER.CREATE,
    CONTRACT_ANNEX_ROUTER.DETAIL,
  ]);

  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const state = useMemo(() => {
    switch (match?.path) {
      case CONTRACT_ANNEX_ROUTER.CREATE:
        return "CREATE";
      case CONTRACT_ANNEX_ROUTER.EDIT:
        return "EDIT";
      case CONTRACT_ANNEX_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [CONTRACT_ANNEX_ROUTER.CREATE, CONTRACT_ANNEX_ROUTER.EDIT].includes(
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
    history.push(`${CONTRACT_ROUTE_MASTER}?tabKey=2`);
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

    setLoadingModal(true);
    repositoryMethod(id, reason).subscribe({
      next: () => {
        setLoadingModal(false);
        onConfirmSuccess();
      },
      error: (error: AxiosError) => {
        setLoadingModal(false);
        handleErrorModal(error);
      },
      complete: () => {
        setLoadingModal(false);
      },
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
