/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import {
  CONTRACT_ANNEX_DETAIL_ROUTE,
  CONTRACT_ANNEX_EDIT_ROUTE,
  CONTRACT_ROUTE_MASTER,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import {
  RepoState,
  masterService,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEmpty, isEqual, isNil, lte } from "lodash";
import { ContractAnnex, ContractAnnexFilter } from "models/ContractAnnex";
import { LOCAL_STORAGE_CONTRACT_ANNEX } from "pages/PurchasePage/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import {
  ActionRowType,
  ModelSelect,
  TagFilterEnum,
  TagFilterList,
} from "../constants";
import { contractAnnexRepository } from "../ContractAnnexRepository";
import ContractAnnexTab from "./ContractAnnexTab/ContractAnnexTab";

const REASON = "reason";
const ERROR_TYPE = "error";
const VALIDATE = "Validate";

export function useContractAnnexMasterHook() {
  const history = useHistory();
  const [translate] = useTranslation();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const [modal, setModal] = useState<null | unknown>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "2",
        tabTitle: translate("CT.contract_appendix.tab"),
        children: <ContractAnnexTab />,
        list: contractAnnexRepository.getAll,
      },
    ];
  }, [translate]);

  const tabFilterRepository = useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("CM.tab_all"),
        value: TagFilterEnum.ALL,
      },
      {
        title: translate("CM.tab_mine"),
        value: TagFilterEnum.MINE,
      },
      {
        title: translate("CM.tab_inprogress"),
        value: TagFilterEnum.IN_PROGRESS,
      },
      {
        title: translate("CM.tab_approval"),
        value: TagFilterEnum.APPROVAL,
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractAnnexFilter,
      {
        ...new ContractAnnexFilter(),
        tab: TagFilterEnum.ALL,
        pageIndex: numberConstants.ONE,
        pageSize: numberConstants.TEN,
      },
      ["orderBy", "orderType", "tab", "tabKey", "search"]
    );

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const baseFilter = useMemo(() => {
    return {
      ...new ContractAnnexFilter(),
      tab: modelFilter?.tab,
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
    };
  }, [
    modelFilter?.tab,
    modelFilter?.search,
    modelFilter?.pageSize,
    repo.tabKey,
  ]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ContractAnnex, ContractAnnexFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const handleOnClickRow = useCallback(
    (
      record: ContractAnnex,
      type: ActionRowType,
      waitingForApproval?: boolean
    ) => {
      const isView = isNil(waitingForApproval) ? true : !waitingForApproval;
      switch (type) {
        case ActionRowType.VIEW:
          history.push(`${CONTRACT_ANNEX_DETAIL_ROUTE}/${record.id}`, {
            isView,
          });
          localStorage.setItem(LOCAL_STORAGE_CONTRACT_ANNEX, "VIEW");
          return;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            CONTRACT_ANNEX_DETAIL_ROUTE,
            [record?.id],
            isView ? { isView } : {}
          );
          localStorage.setItem(LOCAL_STORAGE_CONTRACT_ANNEX, "VIEW");
          return;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: ContractAnnex,
    waitingForApproval?: boolean
  ) => {
    const isView = isNil(waitingForApproval) ? true : !waitingForApproval;
    return `${CONTRACT_ANNEX_DETAIL_ROUTE}/${record.id}?isView=${isView}`;
  };

  const handleBackToList = () => {
    history.push(`${CONTRACT_ROUTE_MASTER}?tabKey=2`);
    notifyToast();
  };

  const handleError = (error: AxiosError) => {
    if (
      error.response &&
      isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
    ) {
      const type = error?.response?.data?.type;
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors[REASON],
        }));
      } else {
        notifyToast({
          type: ERROR_TYPE,
          message: error?.response?.data?.message,
        });
      }
    }
  };

  //  Delete
  const deleteContractAnnex = (id: string, reason: string) => {
    if (isNil(id)) return;
    contractAnnexRepository
      .deleteContractAnnex(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel
  const cancelContractAnnex = (id: string, reason?: string) => {
    contractAnnexRepository
      .cancelContractAnnex(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Reject
  const handleRejectContractAnnex = (id: string, reason?: string) => {
    contractAnnexRepository
      .reject(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleBackToList,
        error: handleError,
      });
  };

  // Return
  const handleReturnContractAnnex = (id: string, reason?: string) => {
    contractAnnexRepository
      .return(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleBackToList,
        error: handleError,
      });
  };

  // Apply button in confirm modal
  const handleApplyButtonInConfirmModal = (
    model: ContractAnnex,
    reason?: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelContractAnnex(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteContractAnnex(model?.id, reason);
        return;

      case ConfirmModalType.RETURN:
        handleReturnContractAnnex(model?.id, reason);
        return;

      case ConfirmModalType.REJECT:
        handleRejectContractAnnex(model?.id, reason);
        return;
    }
  };

  const handleGoToContractAnnexEdit = (received: ContractAnnex) => {
    localStorage.setItem(LOCAL_STORAGE_CONTRACT_ANNEX, "EDIT");
    history.push(`${CONTRACT_ANNEX_EDIT_ROUTE}/${received.id}`);
  };

  useEffect(() => {
    handleLoadList();
  }, [repo]);

  const calculatedFilterCount = useMemo(() => {
    let count = countFilter;
    if (
      modelFilter?.totalAmountFrom?.equal &&
      modelFilter?.totalAmountTo?.equal
    ) {
      count -= numberConstants.ONE;
    }
    if (modelFilter?.contractFrom?.equal && modelFilter?.contractTo?.equal) {
      count -= numberConstants.ONE;
    }

    return count;
  }, [countFilter, modelFilter]);

  const getEmptyData = () =>
    isEqual(
      modelFilter?.tab,
      tabFilterRepository[numberConstants.ZERO].value
    ) &&
    isEmpty(modelFilter?.search) &&
    isEmpty(list) &&
    lte(calculatedFilterCount, numberConstants.ZERO);

  const handleModal = (modal: null | unknown) => {
    setModal(modal);
  };

  return {
    repo,
    list,
    modal,
    count,
    translate,
    countFilter,
    modelFilter,
    loadingList,
    tabRepositories,
    tabFilterRepository,
    calculatedFilterCount,
    loadingModal: isLoadingModal,
    handleModal,
    getEmptyData,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
    handleOnClickRow,
    setModelSelected,
    handleGoToContractAnnexEdit,
    handleApplyButtonInConfirmModal,
    getLinkClickRow,
  };
}
