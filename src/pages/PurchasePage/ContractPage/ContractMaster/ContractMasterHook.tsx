import { AxiosError } from "axios";
import { isEmpty, isEqual, lte } from "lodash";
import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { finalize, tap } from "rxjs";

import {
  CONTRACT_ADJUSTMENT_DETAIL_ROUTE,
  CONTRACT_ANNEX_CREATE_ROUTE,
  CONTRACT_ORDER_CREATE,
  CONTRACT_ORDER_PRINCIPAL_CREATE,
  CONTRACT_ROUTE_CREATE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
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
import {
  ActionRowType,
  Contract,
  ContractAddType,
  ModelConfirmType,
} from "models/Contract";
import { ContractFilter } from "models/Contract/ContractFilter";
import {
  listContractRequestTypeKey,
  LOCAL_STORAGE_CONTRACT_LIST,
} from "pages/PurchasePage/constants";
import { useHistory } from "react-router";
import {
  CONTRACT_ADJUSTMENT_TAB_KEY,
  CONTRACT_ANNEX_TAB_KEY,
} from "../constants";
import ContractAdjustmentTab from "../ContractAdjustment/ContractAdjustmentMaster/ContractAdjustmentTab/ContractAdjustmentTab";
import ContractAnnexTab from "../ContractAnnex/ContractAnnexMaster/ContractAnnexTab/ContractAnnexTab";
import { contractRepository } from "../ContractRepository";
import ContractMasterTab from "./ContractMasterTab/ContractMasterTab";
import ContractPlanTab from "./ContractPlanTab/ContractPlanTab";

export interface TagFilterList {
  title: string;
  value: string;
}

export interface SelectedModal {
  type: ModelConfirmType;
  model: Contract;
  errorMessage?: string;
}

export interface ContractMaster {
  modelFilter: ContractFilter;
  countFilter: number;
  calculatedFilterCount: number;
  list: Contract[];
  isLoadingModal: boolean;
  selectedModal: SelectedModal;
  setSelectedModal: React.Dispatch<React.SetStateAction<SelectedModal>>;
  handleApplyButtonInConfirmModal: (model: Contract, reason: string) => void;
  count: number;
  loadingList: boolean;
  contractTabsFilterRepository: TagFilterList[];
  repo: RepoState;
  isEmptyData: () => boolean;
  handleClickMenuActions: (
    contractItem: Contract,
    type: ActionRowType,
    isOpenNewTab?: boolean
  ) => void;
  handleResetList: () => void;
  handleLoadList: (filterParam?: ContractFilter) => void;
  dispatchFilter: React.Dispatch<FilterAction<ContractFilter>>;
  handleAddContract?: (type: ContractAddType) => void;
  translate?: (key: string) => string;
  handleOnClickRowWaitCreateContract: (
    record: Contract,
    type: ActionRowType
  ) => void;
  getLinkClickRow?: (contractItem: Contract, type: ActionRowType) => string;
}

export const ContractMasterContext = createContext<ContractMaster>({
  modelFilter: new ContractFilter(),
  list: [],
  isLoadingModal: false,
  selectedModal: null,
  setSelectedModal: null,
  handleApplyButtonInConfirmModal: null,
  countFilter: numberConstants.ZERO,
  calculatedFilterCount: numberConstants.ZERO,
  count: numberConstants.ZERO,
  loadingList: false,
  repo: null,
  isEmptyData: null,
  handleClickMenuActions: null,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  handleAddContract: null,
  contractTabsFilterRepository: [],
  handleOnClickRowWaitCreateContract: null,
});

export function useContractMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [selectedModal, setSelectedModal] =
    React.useState<SelectedModal | null>(null);
  const [isLoadingModal, setIsLoadingModal] = React.useState<boolean>(false);

  const tabRepositories = React.useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("CM.menu_title_contract"),
        children: <ContractMasterTab />,
        list: contractRepository.getAll,
      },
      {
        tabKey: CONTRACT_ANNEX_TAB_KEY,
        tabTitle: translate("CT.contract_appendix.tab"),
        children: <ContractAnnexTab />,
        list: null,
      },
      {
        tabKey: "3",
        tabTitle: translate("CT.adjustment"),
        children: <ContractAdjustmentTab />,
        list: null,
      },
      {
        tabKey: "1",
        tabTitle: translate("CT.txt_contract_plan"),
        children: <ContractPlanTab />,
        list: contractRepository.getContractPlanAll,
      },
    ];
  }, [translate]);

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

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractFilter,
      {
        ...new ContractFilter(),
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

  const baseFilter = React.useMemo(() => {
    return {
      ...new ContractFilter(),
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
    repo.tabKey,
  ]);

  const calculatedFilterCount = React.useMemo(() => {
    let count = countFilter;
    if (
      modelFilter?.totalAmountFrom?.equal &&
      modelFilter?.totalAmountTo?.equal
    ) {
      count -= 1;
    }

    return count;
  }, [
    countFilter,
    modelFilter?.totalAmountFrom?.equal,
    modelFilter?.totalAmountTo?.equal,
  ]);

  const getListFromLocalStorage = (): Contract[] => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_CONTRACT_LIST);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const getLinkRouter = React.useCallback(
    (type: ContractAddType, action?: ActionRowType) => {
      let objectRequestType = listContractRequestTypeKey?.find(
        (item) => item.code === type
      );

      if (action >= ActionRowType.VIEW) {
        objectRequestType = listContractRequestTypeKey?.find((item) => {
          const checkByType = item.code === type;
          return checkByType && item.action.includes(action);
        });
      }

      return objectRequestType?.id;
    },
    []
  );

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Contract, ContractFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  const handleAddContract = React.useCallback(
    (type?: ContractAddType) => {
      const linkRouteFollowType = getLinkRouter(type);
      history.push(linkRouteFollowType);
      return type;
    },
    [getLinkRouter, history]
  );

  const isEmptyData = () =>
    isEqual(modelFilter?.tab, contractTabsFilterRepository[0].value) &&
    isEmpty(modelFilter?.search) &&
    isEmpty(list) &&
    lte(calculatedFilterCount, numberConstants.ZERO);

  const handleClickMenuActions = React.useCallback(
    (contractItem: Contract, type: ActionRowType, isOpenViewTab?: boolean) => {
      const linkRouteFollowType = getLinkRouter(
        contractItem?.contractRequestType,
        type
      );

      if (linkRouteFollowType) {
        if (isOpenViewTab) {
          openNewTab(
            linkRouteFollowType,
            [contractItem?.id],
            isEqual(type, ActionRowType.VIEW_APPROVE)
              ? { isViewWaitingApprove: true }
              : {}
          );
          return;
        }
        history.push(
          `${linkRouteFollowType}/${contractItem?.id}${
            type === ActionRowType.VIEW_APPROVE
              ? "?isViewWaitingApprove=true"
              : ""
          }`
        );
        return;
      }

      if (type === ActionRowType.CANCEL) {
        setSelectedModal({
          type: ModelConfirmType.CANCEL,
          model: contractItem,
        });
        return;
      }

      if (type === ActionRowType.CREATE_ADJUSTMENT_CONTRACT) {
        history.push(
          `${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}/?id=${contractItem?.id}`
        );
        return;
      }

      if (type === ActionRowType.CREATE_APPENDIX_CONTRACT) {
        history.push(`${CONTRACT_ANNEX_CREATE_ROUTE}/${contractItem?.id}`);
        return;
      }

      if (type === ActionRowType.DELETE) {
        setSelectedModal({
          type: ModelConfirmType.DELETE,
          model: contractItem,
        });
        return;
      }

      if (type === ActionRowType.CLOSE) {
        setSelectedModal({
          type: ModelConfirmType.CLOSE,
          model: contractItem,
        });
        return;
      }

      notifyToast({
        message: "This feature isn't available right now",
        type: "error",
      });
    },
    [getLinkRouter, history, notifyToast]
  );

  const getLinkClickRow = (contractItem: Contract, type: ActionRowType) => {
    if (type === ActionRowType.VIEW_SHOPPING_PLAN) {
      const routeMap: Record<number, string> = {
        1: PURCHASING_PLAN_VIEW_ROUTE,
        2: PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
        3: PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
        4: PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
      };
      const route = routeMap[contractItem.purchasePlanType];
      return route ? `${route}/${contractItem.id}` : "";
    }

    const linkRouteFollowType = getLinkRouter(
      contractItem?.contractRequestType,
      type
    );
    return `${linkRouteFollowType}/${contractItem?.id}${
      contractItem.canViewApprove ? "?isViewWaitingApprove=true" : ""
    }`;
  };

  const refreshListAndHideModal = (modalType: ModelConfirmType) => {
    let toastMessage = "";
    if (modalType === ModelConfirmType.CANCEL) {
      toastMessage = translate("CM.cancel_ticket_successfully");
    }
    if (modalType === ModelConfirmType.DELETE) {
      toastMessage = translate("CM.delete_ticket_successfully");
    }
    if (modalType === ModelConfirmType.CLOSE) {
      toastMessage = translate("CM.close_ticket_successfully");
    }

    notifyToast({
      message: toastMessage,
    });
    handleResetList();
    setSelectedModal(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        if (selectedModal?.type !== ModelConfirmType.CLOSE) {
          setSelectedModal((previousState) => ({
            ...previousState,
            errorMessage: error?.response?.data?.errors?.reason,
          }));
        } else {
          setSelectedModal(null);
          notifyToast({
            type: "error",
            message: error?.response?.data?.message,
          });
        }
        return;
      }

      notifyToast({
        type: "error",
        message: error?.response?.data?.message,
      });
    }
  };

  const handleCancelDeleteContract = (
    contractId: string,
    modalType: ModelConfirmType,
    reason: string
  ) => {
    contractRepository
      .actionContract(contractId, modalType, { reason })
      .pipe(
        tap(() => setIsLoadingModal(true)),
        finalize(() => setIsLoadingModal(false))
      )
      .subscribe({
        next: () => refreshListAndHideModal(modalType),
        error: handleError,
      });
  };

  const closeContract = (contractId: string) => {
    setIsLoadingModal(true);
    contractRepository
      .actionContract(contractId, ModelConfirmType.CLOSE, {})
      .pipe(finalize(() => setIsLoadingModal(false)))
      .subscribe({
        next: () => refreshListAndHideModal(ModelConfirmType.CLOSE),
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (model: Contract, reason: string) => {
    if (selectedModal?.type === ModelConfirmType.CLOSE) {
      closeContract(model?.id);
      return;
    }
    handleCancelDeleteContract(model?.id, selectedModal?.type, reason);
  };

  const handleOnClickRowWaitCreateContract = React.useCallback(
    (record: Contract, type: ActionRowType) => {
      if (!record) return;
      if (type === ActionRowType.VIEW_SHOPPING_PLAN) {
        const routeMap: Record<number, string> = {
          1: PURCHASING_PLAN_VIEW_ROUTE,
          2: PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
          3: PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
          4: PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
        };

        const route = routeMap[record.purchasePlanType];
        if (route) {
          openNewTab(route, [record.id]);
        }
      }

      const mapLink = new Map([
        [ActionRowType.CREATE_PRINCIPLE, CONTRACT_ORDER_PRINCIPAL_CREATE],
        [ActionRowType.CREATE_CONTRACT, CONTRACT_ROUTE_CREATE],
        [ActionRowType.CREATE_ORDER, CONTRACT_ORDER_CREATE],
      ]);

      if (mapLink.has(type)) {
        history.push(
          `${mapLink.get(type)}?originalPurchasePlanId=${record.id}`
        );
      }
    },
    [history]
  );

  useEffect(() => {
    if (
      [CONTRACT_ADJUSTMENT_TAB_KEY, CONTRACT_ANNEX_TAB_KEY].includes(
        repo?.tabKey
      )
    ) {
      return;
    }
    handleLoadList();
  }, [handleLoadList, repo?.tabKey]);

  return {
    // context value:
    modelFilter,
    countFilter,
    calculatedFilterCount,
    list,
    count,
    loadingList,
    contractTabsFilterRepository,
    repo,
    isLoadingModal,
    selectedModal,
    setSelectedModal,
    handleApplyButtonInConfirmModal,
    isEmptyData,
    handleClickMenuActions,
    handleResetList,
    handleLoadList,
    dispatchFilter,
    handleAddContract,
    handleOnClickRowWaitCreateContract,
    getLinkClickRow,
    // non-context value:
    translate,
    tabRepositories,
    handleChangeTab,
  };
}
