import { ArgsProps } from "antd/lib/notification";
import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_PURCHASING_PLAN_LIST } from "config/const";
import {
  PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_DETAIL_ROUTE,
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
import { FilterAction, KeyType, ListResult } from "core/services/service-types";
import { isEmpty, isEqual, isNil } from "lodash";
import { PurchaseRequest } from "models/PurchaseRequest";
import { PurchasePlanTypeRouter, PurchasingPlan } from "models/PurchasingPlan";
import {
  ConfirmModalType,
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasingPlanFilter } from "models/PurchasingPlan/PurchasingPlanFilter";
import React, { createContext, useCallback } from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, of, tap } from "rxjs";
import { purchasingPlanRepository } from "../PurchasingPlanRepository";
import AdjustPurchasingPlanMasterTab from "./AdjustPurchasingPlanMasterTab/AdjustPurchasingPlanMasterTab";
import { DataForm } from "./Components/PurchasingPlanConfirmModal";
import PurchaseRequestWaitingForPlanTab from "./PurchaseRequestWaitingForPlanTab/PurchaseRequestWaitingForPlanTab";
import PurchasingPlanMasterTab from "./PurchasingPlanMasterTab/PurchasingPlanMasterTab";

export interface ModelSelect {
  type: ConfirmModalType;
  model: PurchasingPlan;
  errorMessage?: { [key: string]: string };
}

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  VIEW_PURCHASING_PLAN,
  EDIT,
  CREATE_ADJUSTMENT_PURCHASE_REQUEST,
  VIEW_ADJUST_PURCHASING_PLAN,
  EDIT_ADJUST_PURCHASING_PLAN,
  VIEW_ORIGINAL_PURCHASING_PLAN,
  APPROVAL_CANCEL_ADJUST_PURCHASING_PLAN,
  VIEW_FROM_MASTER,
  VIEW_ADJUST_PURCHASING_PLAN_FROM_MASTER,
}

enum TabKey {
  PURCHASING_PLAN = "0",
  PENDING_PURCHASE_PLAN = "1",
  ADJUST_PURCHASE_PLAN = "2",
}

export interface PurchasingPlanMaster {
  modelFilter: PurchasingPlanFilter;
  count: number;
  countFilter: number;
  list: PurchasingPlan[];
  loadingList: boolean;
  loadingModal: boolean;
  dispatchFilter: React.Dispatch<FilterAction<PurchasingPlanFilter>>;
  handleLoadList: (filterParam?: PurchasingPlanFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<PurchaseRequest>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  repo: RepoState;
  tabFilterRepository: TagFilterList[];
  directContractingList: Model[];
  purchasingMethodList: Model[];
  notifyToast: (args: ArgsProps) => void;
  handleOnClickRow: (record: PurchasingPlan, type: ActionRowType) => void;
  handlePressAdd?: () => void;
  handleApplyButtonInConfirmModal: (
    model: PurchasingPlan,
    data?: DataForm
  ) => void;
  getEmptyData?: () => boolean;
  isOpenCreateModal: boolean;
  handleModal: () => void;
  getPurchasePlanTypeByRouter?: (
    id?: TYPE_PURCHASING_PLAN
  ) => PurchasePlanTypeRouter;
  loadingConfirm: boolean;
  getLinkClickRow?: (record: PurchasingPlan, type?: ActionRowType) => string;
}

export const PurchasingPlanMasterContext = createContext<PurchasingPlanMaster>({
  modelFilter: new PurchasingPlanFilter(),
  count: 0,
  countFilter: 0,
  list: [],
  loadingList: true,
  loadingModal: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: null,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  canBulkAction: false,
  modelSelected: null,
  setModelSelected: null,
  handlePressAdd: null,
  repo: null,
  tabFilterRepository: [],
  notifyToast: null,
  handleOnClickRow: null,
  handleApplyButtonInConfirmModal: null,
  directContractingList: [],
  purchasingMethodList: [],
  isOpenCreateModal: false,
  handleModal: null,
  getPurchasePlanTypeByRouter: null,
  loadingConfirm: false,
});

const TAB = {
  ALL: "0",
  MINE: "1",
  IN_PROGRESS: "2",
  APPROVAL: "3",
  BID_REVIEW: "4",
};

export function usePurchasingPlanMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [loadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [isOpenCreateModal, setOpenCreateModal] =
    React.useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleModal = () => {
    setOpenCreateModal(!isOpenCreateModal);
  };

  const getPurchasePlanTypeByRouter = useCallback(
    (id?: TYPE_PURCHASING_PLAN) => {
      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) => el.pathEdit === history.location.pathname
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return itemPurchasePlanType;
    },
    [history.location.pathname]
  );

  const tabRepositories = React.useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: TabKey.PURCHASING_PLAN,
        tabTitle: translate("CM.menu_title_purchasing_plan"),
        children: <PurchasingPlanMasterTab />,
        list: purchasingPlanRepository.listAll,
      },
      {
        tabKey: TabKey.PENDING_PURCHASE_PLAN,
        tabTitle: translate("PL.purchase_request_waiting_for_plan"),
        children: <PurchaseRequestWaitingForPlanTab />,
        list: () => of({ data: { items: [] } } as ListResult<object>),
      },
      {
        tabKey: TabKey.ADJUST_PURCHASE_PLAN,
        tabTitle: translate("PL.adjust_purchasing_plan"),
        children: <AdjustPurchasingPlanMasterTab />,
        list: purchasingPlanRepository.listAll,
      },
    ];
  }, [translate]);

  const tabFilterRepository = React.useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("PL.tab_all"),
        value: TAB.ALL,
      },
      {
        title: translate("PL.tab_mine"),
        value: TAB.MINE,
      },
      {
        title: translate("PL.tab_inprogress"),
        value: TAB.IN_PROGRESS,
      },
      {
        title: translate("PL.tab_approval"),
        value: TAB.APPROVAL,
      },
      {
        title: translate("PL.tab_bidreview"),
        value: TAB.BID_REVIEW,
      },
    ];
  }, [translate]);

  const purchasingMethodList = React.useMemo<Model[]>(() => {
    return [
      { id: 0, name: translate("PR.filter_method_central") },
      { id: 1, name: translate("PR.filter_method_decentral") },
    ];
  }, [translate]);

  const directContractingList = React.useMemo<Model[]>(() => {
    return [
      { id: 0, name: translate("PL.non_direct") },
      { id: 1, name: translate("PL.direct_contracting") },
    ];
  }, [translate]);

  const handlePressAdd = React.useCallback(() => {
    history.push(PURCHASING_PLAN_DETAIL_ROUTE);
  }, [history]);

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PurchasingPlanFilter,
      {
        ...new PurchasingPlanFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "tabKey", "search"]
    );

  const handleGetLinkCompetitiveBidding = ({
    record,
    action,
  }: {
    record: PurchasingPlan;
    action: ActionRowType;
  }) => {
    const isViewWaitingApprove = TabKey.ADJUST_PURCHASE_PLAN === repo.tabKey;
    const id = record?.id;
    switch (action) {
      case ActionRowType.EDIT_ADJUST_PURCHASING_PLAN:
        return `${
          getPurchasePlanTypeByRouter(record?.purchasePlanType)?.pathAdjustEdit
        }/${id}`;
      default:
        return `${
          getPurchasePlanTypeByRouter(record?.purchasePlanType)?.pathAdjustView
        }/${id}?isViewWaitingApprove=${isViewWaitingApprove}`;
    }
  };

  const handleRedirectCompetitiveBidding = ({
    record,
    action,
  }: {
    record: PurchasingPlan;
    action: ActionRowType;
  }) => {
    const url = handleGetLinkCompetitiveBidding({ record, action });

    history.push(url);
  };

  const handleOnClickRow = React.useCallback(
    (record: PurchasingPlan, type: ActionRowType) => {
      const purchasePlanType = record?.purchasePlanType;
      if (
        purchasePlanType === TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING ||
        purchasePlanType === TYPE_PURCHASING_PLAN.BIDDING
      ) {
        handleRedirectCompetitiveBidding({ record, action: type });
        return "";
      }

      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${
              getPurchasePlanTypeByRouter(record?.purchasePlanType)?.pathView
            }/${record?.id}?isViewWaitingApprove=${
              modelFilter?.tab === TAB.IN_PROGRESS
            }`
          );
          break;
        case ActionRowType.VIEW_FROM_MASTER: {
          openNewTab(
            getPurchasePlanTypeByRouter(record?.purchasePlanType)?.pathView,
            [record?.id],
            {
              isViewWaitingApprove: isEqual(modelFilter?.tab, TAB.IN_PROGRESS),
            }
          );
          break;
        }
        case ActionRowType.VIEW_PURCHASING_PLAN:
          history.push(
            PURCHASING_PLAN_DETAIL_ROUTE + `/${record.purchaseProposalId}`
          );
          break;
        case ActionRowType.VIEW_ADJUST_PURCHASING_PLAN:
          history.push(PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.VIEW_ADJUST_PURCHASING_PLAN_FROM_MASTER:
          openNewTab(PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE, [record?.id], {
            isViewWaitingApprove: isEqual(modelFilter?.tab, TAB.IN_PROGRESS),
          });
          break;
        case ActionRowType.EDIT_ADJUST_PURCHASING_PLAN:
          history.push(PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.VIEW_ORIGINAL_PURCHASING_PLAN:
          openNewTab(PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE, [
            record?.originalPurchasePlanId,
          ]);
          break;
        case ActionRowType.APPROVAL_CANCEL_ADJUST_PURCHASING_PLAN:
          history.push(PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE + `/${record.id}`);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, getPurchasePlanTypeByRouter, modelFilter?.tab]
  );

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const getLinkClickRow = (record: PurchasingPlan, type?: ActionRowType) => {
    const purchasePlanType = record?.purchasePlanType;
    const routerByPurchasePlanType =
      getPurchasePlanTypeByRouter(purchasePlanType);
    if (
      type === ActionRowType.VIEW_ADJUST_PURCHASING_PLAN_FROM_MASTER &&
      purchasePlanType === TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING &&
      TabKey.ADJUST_PURCHASE_PLAN === repo.tabKey
    ) {
      return handleGetLinkCompetitiveBidding({ record, action: type });
    }

    switch (type) {
      case ActionRowType.VIEW_ORIGINAL_PURCHASING_PLAN:
        return (
          routerByPurchasePlanType?.pathView +
          `/${record.originalPurchasePlanId}`
        );
      case ActionRowType.VIEW_ADJUST_PURCHASING_PLAN:
      case ActionRowType.VIEW_ADJUST_PURCHASING_PLAN_FROM_MASTER:
        return routerByPurchasePlanType?.pathAdjustView + `/${record.id}`;
      default:
        return `${routerByPurchasePlanType?.pathView}/${
          record?.id
        }?isViewWaitingApprove=${isEqual(modelFilter?.tab, TAB.IN_PROGRESS)}`;
    }
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new PurchasingPlanFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
    };
  }, [
    modelFilter?.tab,
    modelFilter?.search,
    repo.tabKey,
    modelFilter?.pageSize,
  ]);

  const getListFromLocalStorage = (): PurchasingPlan[] => {
    const savedList = localStorage.getItem(LOCAL_STORAGE_PURCHASING_PLAN_LIST);
    return isNil(savedList) ? JSON.parse(savedList) : [];
  };

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<PurchasingPlan, PurchasingPlanFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<PurchaseRequest>("checkbox", [], false);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return (
        isEmpty(list) &&
        isEqual(countFilter, numberConstants.ZERO) &&
        isEmpty(modelFilter?.search) &&
        (isEmpty(modelFilter?.tab) || modelFilter?.tab === TAB.ALL) &&
        !loadingList
      );
    } else {
      return false;
    }
  }

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors,
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
  const deletePurchasingPlan = (id: string, data: DataForm) => {
    setLoadingConfirm(true);
    purchasingPlanRepository
      .deletePurchasingPlan(id, data)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel budget request
  const cancelPurchasingPlan = (id: string, data: DataForm) => {
    setLoadingConfirm(true);
    purchasingPlanRepository
      .cancelPurchasingPlan(id, data)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingConfirm(false);
          // redirect to tab "Tat ca"
          handleLoadList();
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: PurchasingPlan,
    data: DataForm
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelPurchasingPlan(model?.id, data);
        return;
      case ConfirmModalType.DELETE:
        deletePurchasingPlan(model?.id, data);
        return;
    }
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
    loadingModal,
    isOpenCreateModal,
    handleModal,
    purchasingMethodList,
    directContractingList,
    handleApplyButtonInConfirmModal,
    handleResetList,
    handleLoadList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    repo,
    modelSelected,
    setModelSelected,
    tabFilterRepository,
    loadingConfirm,
    // non-context value:
    translate,
    notifyToast,
    handleChangeTab,
    tabRepositories,
    handlePressAdd,
    handleOnClickRow,
    getEmptyData,
    getPurchasePlanTypeByRouter,
    getLinkClickRow,
  };
}
