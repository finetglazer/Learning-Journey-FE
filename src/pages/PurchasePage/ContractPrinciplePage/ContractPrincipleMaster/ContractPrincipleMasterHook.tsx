import { isEmpty, isEqual } from "lodash";
import React, { createContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST } from "config/const";
import {
  CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { ActionRowType, Contract } from "models/Contract";
import {
  ContractPrinciple,
  ContractPrincipleFilter,
} from "models/ContractPrinciple";
import ContractPrincipleAppendixMasterTab from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixTab/ContractPrincipleAppendixMasterTab";
import ContractPrincipleMasterTab from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleMaster/ContractPrincipleMasterTab/ContractPrincipleMasterTab";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { contractPrincipleRepository } from "../ContractPrincipleRepository";
import { ConfirmModalType } from "./ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";

export interface TagFilterList {
  title: string;
  value: string;
}

export interface SelectedModal {
  type: ConfirmModalType;
  model: Contract;
  errorMessage?: string;
}

export interface ContractPrincipleMaster {
  modelFilter: ContractPrincipleFilter;
  countFilter: number;
  list: ContractPrinciple[];
  selectedModal: SelectedModal | null;
  setSelectedModal: React.Dispatch<React.SetStateAction<SelectedModal | null>>;
  count: number;
  loadingList: boolean;
  loadingModal: boolean;
  contractTabsFilterRepository: TagFilterList[];
  isEmptyData: () => boolean;
  handleOnClickRow: (
    record: ContractPrinciple,
    type: ActionRowType,
    isApproval?: boolean
  ) => void;
  handleResetList: () => void;
  handleLoadList: (filterParam?: ContractPrincipleFilter) => void;
  dispatchFilter: React.Dispatch<FilterAction<ContractPrincipleFilter>>;
  translate?: (key: string) => string;
  getEmptyData?: () => boolean;
  handleAddNew?: () => void;
  handleApplyButtonInConfirmModal: (
    model: ContractPrinciple,
    reason: string
  ) => void;
  getLinkClickRow?: (record: ContractPrinciple) => string;
}

export const ContractPrincipleMasterContext =
  createContext<ContractPrincipleMaster>({
    modelFilter: new ContractPrincipleFilter(),
    list: [],
    selectedModal: null,
    setSelectedModal: null,
    countFilter: numberConstants.ZERO,
    count: numberConstants.ZERO,
    loadingList: false,
    loadingModal: false,
    isEmptyData: null,
    handleOnClickRow: null,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
    contractTabsFilterRepository: [],
    handleAddNew: null,
    handleApplyButtonInConfirmModal: null,
  });

export interface ModalType {
  type: ActionRowType;
  id?: string;
}

export function useContractPrincipleMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const [selectedModal, setSelectedModal] =
    React.useState<SelectedModal | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);
  const contractTabsFilterRepository = React.useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("CM.tab_all"),
        value: "0",
      },
      {
        title: translate("CM.tab_mine"),
        value: "1",
      },
      {
        title: translate("CM.tab_inprogress"),
        value: "2",
      },
      {
        title: translate("CM.tab_approval"),
        value: "3",
      },
    ];
  }, [translate]);

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("CM.menu_title_contract_principle"),
        children: <ContractPrincipleMasterTab />,
        list: contractPrincipleRepository.getAll,
      },
      {
        tabKey: "1",
        tabTitle: translate("CT.contract_appendix.tab"),
        children: <ContractPrincipleAppendixMasterTab />,
        list: contractPrincipleRepository.getAll,
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractPrincipleFilter,
      {
        ...new ContractPrincipleFilter(),
        tab: "0",
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
      ...new ContractPrincipleFilter(),
      tabKey: repo.tabKey,
      tab: modelFilter?.tab,
      search: modelFilter?.search,
      pageSize: modelFilter?.pageSize,
      pageIndex: numberConstants.ONE,
    };
  }, [
    modelFilter?.pageSize,
    modelFilter?.search,
    modelFilter?.tab,
    repo?.tabKey,
  ]);

  const getListFromLocalStorage = (): ContractPrinciple[] => {
    try {
      const savedList = localStorage.getItem(
        LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST
      );
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ContractPrinciple, ContractPrincipleFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  const isEmptyData = () =>
    isEqual(modelFilter?.tab, contractTabsFilterRepository[0].value) &&
    isEmpty(modelFilter?.search) &&
    isEmpty(list);

  const getEmptyData = React.useCallback((): boolean => {
    if (isEmpty(modelFilter?.search)) {
      return isEmpty(list) && countFilter === 0;
    } else {
      return false;
    }
  }, [modelFilter?.search, list, countFilter]);

  const handleOnClickRow = React.useCallback(
    (record: ContractPrinciple, type: ActionRowType, isApproval = false) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${record.id}${
              isApproval ? "?isViewWaitingApprove=true" : ""
            }`
          );
          break;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            CONTRACT_PRINCIPLE_VIEW_ROUTE,
            [record?.id],
            isApproval ? { isViewWaitingApprove: true } : {}
          );
          break;
        case ActionRowType.EDIT:
          history.push(CONTRACT_PRINCIPLE_DETAIL_ROUTE + `/${record.id}`);
          break;
      }
    },
    [history]
  );

  const getLinkClickRow = (record: ContractPrinciple) => {
    return `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${record.id}${
      record.canViewApprove ? "?isViewWaitingApprove=true" : ""
    }`;
  };

  const handleAddNew = React.useCallback(() => {
    history.push(CONTRACT_PRINCIPLE_DETAIL_ROUTE);
  }, [history]);

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setSelectedModal(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setSelectedModal((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors?.["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  // Delete proposal
  const handleContractPrincipleAction = (
    actionType: ConfirmModalType,
    contractPrincipleId: string,
    reason: string
  ) => {
    const repositoryAction =
      actionType === ConfirmModalType.DELETE
        ? contractPrincipleRepository.deleteContractPrinciple
        : contractPrincipleRepository.cancelContractPrinciple;

    repositoryAction(contractPrincipleId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: ContractPrinciple,
    reason: string
  ) => {
    if (selectedModal?.type) {
      handleContractPrincipleAction(selectedModal.type, model?.id, reason);
    }
  };

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
    // context value:
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    loadingModal: isLoadingModal,
    contractTabsFilterRepository,
    selectedModal,
    repo,
    tabRepositories,
    handleChangeTab,
    setSelectedModal,
    handleOnClickRow,
    isEmptyData,
    getEmptyData,
    handleResetList,
    handleLoadList,
    dispatchFilter,
    handleAddNew,
    handleApplyButtonInConfirmModal,
    getLinkClickRow,
  };
}
