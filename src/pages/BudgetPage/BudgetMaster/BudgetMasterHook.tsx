import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_BUDGET_LIST } from "config/const";
import {
  BUDGET_ADJUST_CREATE_ROUTE,
  BUDGET_ADJUST_DETAIL_ROUTE,
  BUDGET_ADJUST_EDIT_ROUTE,
  BUDGET_CREATE_ROUTE,
  BUDGET_DETAIL_ROUTE,
  BUDGET_EDIT_ROUTE,
  BUDGET_EDIT_SETTLEMENT_ROUTE,
  BUDGET_CREATE_SETTLEMENT_ROUTE as BUDGET_SETTLEMENT_ROUTE_CREATE,
} from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  tabServices,
  TabState,
} from "core/services/page-services/tab-services";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEqual } from "lodash";
import { Budget } from "models/Budget/Budget";
import { BudgetFilter } from "models/Budget/BudgetFilter";
import { BudgetPlan } from "models/CostOwner/BudgetPlan";
import { TagFilterList } from "pages/PurchasePage/ProposalPage/ProposalMaster/ProposalMasterHook";
import React, { createContext, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { budgetRepository } from "../BudgetRepository";
import { ConfirmModalType } from "./BudgetConfirmModal/BudgetConfirmModal";

export enum BudgetAddType {
  Request,
  Adjust,
  Settlement,
}

export enum BudgetType {
  Create = 0,
  Request = 1,
  Adjust = 2,
  Settlement = 3,
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: Budget;
  errorMessage?: string;
}

export interface BudgetMaster {
  modelFilter: BudgetFilter;
  list: Budget[];
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  count: number;
  loadingModal: boolean;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<BudgetFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: BudgetFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<Budget>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  handleOnClickRow: (record: BudgetPlan, shouldOpenNewTab?: boolean) => void;
  handlePressAdd?: (type?: BudgetAddType) => void;
  handleApplyButtonInConfirmModal: (model: Budget, reason: string) => void;
  repo: TabState;
  navigateToEdit: (budget: Budget) => void;
  tabItems?: TagFilterList[];
  handleChangeTab: (activeTabKey: string) => void;
  getLinkClickRow?: (record: BudgetPlan) => string;
}

export const BudgetMasterContext = createContext<BudgetMaster>({
  modelFilter: new BudgetFilter(),
  list: [],
  modelSelected: null,
  setModelSelected: null,
  count: 0,
  loadingModal: false,
  loadingList: false,
  dispatchFilter: null,
  countFilter: 0,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: null,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  canBulkAction: false,
  handleOnClickRow: null,
  handlePressAdd: null,
  handleApplyButtonInConfirmModal: null,
  repo: null,
  navigateToEdit: null,
  handleChangeTab: null,
});

export function useBudgetMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabItems = useMemo<TabState[]>(() => {
    return [
      {
        value: "0",
        title: translate("BG.tab_all"),
      },
      {
        value: "1",
        title: translate("BG.tab_mine"),
      },
      {
        value: "2",
        title: translate("BG.tab_inprogress"),
      },
      {
        value: "3",
        title: translate("BG.tab_approval"),
      },
    ];
  }, [translate]);

  const handlePressAdd = React.useCallback(
    (type?: BudgetAddType) => {
      let routerPath = "";
      switch (type) {
        case BudgetAddType.Request:
          routerPath = BUDGET_CREATE_ROUTE;
          break;
        case BudgetAddType.Adjust:
          routerPath = BUDGET_ADJUST_CREATE_ROUTE;
          break;
        case BudgetAddType.Settlement:
          routerPath = BUDGET_SETTLEMENT_ROUTE_CREATE;
          break;
        default:
          routerPath = "";
      }
      history.push(routerPath);
    },
    [history]
  );

  const getLinkClickRow = (record: BudgetPlan) => {
    const isAdjustPage = [BudgetType.Adjust, BudgetType.Request].includes(
      record?.type
    );

    const detailRoute = isAdjustPage
      ? BUDGET_ADJUST_DETAIL_ROUTE
      : BUDGET_DETAIL_ROUTE;

    return (
      detailRoute +
      `/${record?.id}?isViewWaitingApprove=${!!record?.canViewApprove}`
    );
  };

  const handleOnClickRow = useCallback(
    (record: BudgetPlan) => {
      const url = getLinkClickRow(record);

      history.push(url);
    },
    [history]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      BudgetFilter,
      {
        ...new BudgetFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tabKey", "search"]
    );

  const { repo, handleChangeTab } = tabServices.useTabAction(
    tabItems,
    dispatchFilter
  );

  const baseFilter = React.useMemo(() => {
    return {
      ...new BudgetFilter(),
      tabKey: repo.value,
      pageIndex: 1,
      search: modelFilter?.search,
      pageSize: modelFilter?.pageSize,
    };
  }, [repo.value, modelFilter]);

  const getListFromLocalStorage = (): Budget[] => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_BUDGET_LIST);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Budget, BudgetFilter>(
      budgetRepository.listAll,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<Budget>("checkbox", [], false);

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  // Delete single budget
  const deleteBudget = (budgetId: string, reason: string) => {
    budgetRepository
      .deleteBudget(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel budget request
  const cancelBudget = (budgetId: string, reason: string) => {
    budgetRepository
      .cancelBudget(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (model: Budget, reason: string) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelBudget(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteBudget(model?.id, reason);
        return;
    }
  };

  const navigateToEdit = (budget: Budget) => {
    const { type } = budget;
    let routerPath = "";
    switch (type) {
      case BudgetType.Create:
        routerPath = BUDGET_EDIT_ROUTE;
        break;
      case BudgetType.Request:
      case BudgetType.Adjust:
        routerPath = BUDGET_ADJUST_EDIT_ROUTE;
        break;
      case BudgetType.Settlement:
        routerPath = BUDGET_EDIT_SETTLEMENT_ROUTE;
        break;
      default:
        return;
    }

    history.push(`${routerPath}/${budget.id}`);
  };

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList, repo]);

  return {
    // context value:
    dispatchFilter,
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    loadingModal: isLoadingModal,
    handleResetList,
    handleLoadList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    repo,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    tabItems,
    getLinkClickRow,

    // non-context value:
    translate,
    handleChangeTab,
    handlePressAdd,
    handleOnClickRow,
    navigateToEdit,
  };
}
