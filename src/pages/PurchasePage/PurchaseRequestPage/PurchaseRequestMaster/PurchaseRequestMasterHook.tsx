import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_PURCHASE_REQUEST_LIST } from "config/const";
import {
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE,
  PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
  PURCHASE_REQUEST_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
} from "config/route-const";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import { PurchaseRequest } from "models/PurchaseRequest";
import { PurchaseRequestFilter } from "models/PurchaseRequest/PurchaseRequestFilter";
import { PurchaseProposalModel } from "models/PurchasingPlan";
import React, { createContext } from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { purchaseRequestRepository } from "../PurchaseRequestRepository";
import AdjustPurchaseRequestMasterTab from "./AdjustPurchaseRequestMasterTab/AdjustPurchaseRequestMasterTab";
import { ConfirmModalType } from "./PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import ProposalMasterTab from "./PurchaseRequestMasterTab/PurchaseRequestMasterTab";

export interface ModelSelect {
  type: ConfirmModalType;
  model: PurchaseRequest;
  errorMessage?: string;
}

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  VIEW_PROPOSAL,
  VIEW_FROM_MASTER,
  EDIT,
  CREATE_ADJUSTMENT_PURCHASE_REQUEST,
  VIEW_ORIGINAL_PURCHASE_REQUEST,
  VIEW_APPROVAL,
}

export interface PurchaseRequestMaster {
  modelFilter: PurchaseRequestFilter;
  list: PurchaseRequest[];
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  count: number;
  loadingModal: boolean;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<PurchaseRequestFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: PurchaseRequestFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<PurchaseRequest>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  handleOnClickRow: (record: PurchaseRequest, type: ActionRowType) => void;
  handlePressAdd?: () => void;
  handleApplyButtonInConfirmModal: (
    model: PurchaseRequest,
    reason: string
  ) => void;
  repo: RepoState;
  tabFilterRepository: TagFilterList[];
  purchasingMethodList: Model[];
  getEmptyData?: () => boolean;
  setIsShowModalPurchaseRequest: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModalPurchaseRequest: boolean;
  handleClickCreateAdjustmentPurchase: (
    record: PurchaseRequest | PurchaseProposalModel
  ) => void;
  getLinkClickRow?: (record: PurchaseRequest, type?: ActionRowType) => string;
}

export const PurchaseRequestMasterContext =
  createContext<PurchaseRequestMaster>({
    modelFilter: new PurchaseRequestFilter(),
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
    tabFilterRepository: [],
    purchasingMethodList: [],
    setIsShowModalPurchaseRequest: null,
    isShowModalPurchaseRequest: false,
    handleClickCreateAdjustmentPurchase: null,
  });

export function usePurchaseRequestMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isShowModalPurchaseRequest, setIsShowModalPurchaseRequest] =
    React.useState(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabRepositories = React.useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("PR.purchase_request"),
        children: <ProposalMasterTab />,
        list: purchaseRequestRepository.listAll,
      },
      {
        tabKey: "1",
        tabTitle: translate("PR.adjust_purchasing_requirements"),
        children: <AdjustPurchaseRequestMasterTab />,
        list: purchaseRequestRepository.listAll,
      },
    ];
  }, [translate]);

  const purchasingMethodList = React.useMemo<Model[]>(() => {
    return [
      { id: 0, name: translate("PR.filter_method_decentral") },
      { id: 1, name: translate("PR.filter_method_central") },
    ].sort((a, b) => b.id - a.id);
  }, [translate]);

  const tabFilterRepository = React.useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("PL.tab_all"),
        value: "0",
      },
      {
        title: translate("PL.tab_mine"),
        value: "1",
      },
      {
        title: translate("PL.tab_inprogress"),
        value: "2",
      },
      {
        title: translate("PL.tab_approval"),
        value: "3",
      },
    ];
  }, [translate]);

  const handlePressAdd = React.useCallback(
    (data?: PurchaseRequest) => {
      if (isEmpty(data)) {
        history.push(PURCHASE_REQUEST_DETAIL_ROUTE);
      } else {
        history.push(PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE, {
          dataPurchase: data,
        });
      }
    },
    [history]
  );

  const handleClickCreateAdjustmentPurchase = async (
    record: PurchaseRequest
  ) => {
    try {
      setIsLoading(true);
      const dataPurchaseRequest = await purchaseRequestRepository
        .detail(record.id)
        .toPromise();
      setIsLoading(false);
      handlePressAdd(dataPurchaseRequest);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PurchaseRequestFilter,
      {
        ...new PurchaseRequestFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "tabKey", "search"]
    );

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );
  const baseFilter = React.useMemo(() => {
    return {
      ...new PurchaseRequestFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
      pageSize: modelFilter?.pageSize,
    };
  }, [modelFilter?.tab, modelFilter?.search, repo.tabKey]);

  const getListFromLocalStorage = (): PurchaseRequest[] => {
    try {
      const savedList = localStorage.getItem(
        LOCAL_STORAGE_PURCHASE_REQUEST_LIST
      );
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<PurchaseRequest, PurchaseRequestFilter>(
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

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const handleOnClickRow = React.useCallback(
    (record: PurchaseRequest, type: ActionRowType) => {
      switch (type) {
        case ActionRowType.VIEW:
          if (modelFilter?.tabKey === "1") {
            openNewTab(PURCHASE_REQUEST_ADJUST_VIEW_ROUTE, [record.id], {
              isView: true,
            });
            break;
          }
          openNewTab(PURCHASE_REQUEST_VIEW_ROUTE, [record.id], {
            isView: true,
          });
          break;
        case ActionRowType.VIEW_FROM_MASTER: {
          const viewRoute = isEqual(modelFilter?.tabKey, "1")
            ? PURCHASE_REQUEST_ADJUST_VIEW_ROUTE
            : PURCHASE_REQUEST_VIEW_ROUTE;
          openNewTab(viewRoute, [record?.id]);
          break;
        }
        case ActionRowType.VIEW_PROPOSAL:
          openNewTab(PROPOSAL_DETAIL_ROUTE, [record?.purchaseProposalId]);
          break;
        case ActionRowType.VIEW_ORIGINAL_PURCHASE_REQUEST:
          openNewTab(PURCHASE_REQUEST_VIEW_ROUTE, [
            record?.originalPurchaseRequestId,
          ]);
          break;
        case ActionRowType.EDIT:
          if (modelFilter?.tabKey === "1") {
            history.push(
              PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE + `/${record.id}`
            );
            break;
          }
          history.push(PURCHASE_REQUEST_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.CREATE_ADJUSTMENT_PURCHASE_REQUEST:
          handleClickCreateAdjustmentPurchase(record);
          break;
        case ActionRowType.VIEW_APPROVAL:
          if (modelFilter?.tabKey === "1") {
            openNewTab(PURCHASE_REQUEST_ADJUST_VIEW_ROUTE, [record?.id], {
              isView: false,
            });
          } else {
            openNewTab(PURCHASE_REQUEST_VIEW_ROUTE, [record?.id], {
              isView: false,
            });
          }
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, modelFilter?.tabKey]
  );

  const getLinkClickRow = (record: PurchaseRequest, type?: ActionRowType) => {
    switch (type) {
      case ActionRowType?.VIEW_PROPOSAL:
        return PROPOSAL_DETAIL_ROUTE + `/${record.purchaseProposalId}`;
      case ActionRowType?.VIEW_ORIGINAL_PURCHASE_REQUEST:
        return (
          PURCHASE_REQUEST_VIEW_ROUTE + `/${record.originalPurchaseRequestId}`
        );
      default:
        if (modelFilter?.tabKey === "1") {
          return PURCHASE_REQUEST_ADJUST_VIEW_ROUTE + `/${record.id}`;
        }
        return PURCHASE_REQUEST_VIEW_ROUTE + `/${record.id}`;
    }
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
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

  // Delete purchase request
  const deletePurchaseRequest = (ProposalId: string, reason: string) => {
    purchaseRequestRepository
      .deletePurchaseRequest(ProposalId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel purchase request
  const cancelPurchaseRequest = (PurchaseRequestId: string, reason: string) => {
    purchaseRequestRepository
      .cancelPurchaseRequest(PurchaseRequestId, reason)
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
    model: PurchaseRequest,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelPurchaseRequest(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deletePurchaseRequest(model?.id, reason);
        return;
    }
  };

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList, repo]);

  const getEmptyData = React.useCallback((): boolean => {
    if (isEmpty(modelFilter?.search)) {
      return isEmpty(list) && countFilter === 0 && isEqual(modelFilter?.tab, 0);
    } else {
      return false;
    }
  }, [modelFilter?.search, modelFilter?.tab, list, countFilter]);

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
    purchasingMethodList,
    tabFilterRepository,
    getEmptyData,
    isLoading,
    isShowModalPurchaseRequest,
    setIsShowModalPurchaseRequest,
    handleClickCreateAdjustmentPurchase,
    // non-context value:
    translate,
    handleChangeTab,
    tabRepositories,
    handlePressAdd,
    handleOnClickRow,
    getLinkClickRow,
  };
}
