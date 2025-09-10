import { ArgsProps } from "antd/lib/notification";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_SETTLEMENT } from "config/const";
import {
  CONTRACT_ROUTE_VIEW,
  SETTLEMENT_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
} from "config/route-const";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { isEqual } from "lodash";
import { ActionRowType, TAB_MASTER, TagFilterList } from "models/Settlement";
import { ConfirmModalType, Settlement } from "models/Settlement/Settlement";
import { SettlementFilter } from "models/Settlement/SettlementFilter";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { settlementRepository } from "../SettlementRepository";
export interface ModelSelect {
  type: ConfirmModalType;
  model: Settlement;
  errorMessage?: string;
}
export interface SettlementMaster {
  modelFilter: SettlementFilter;
  countFilter: number;
  list: Settlement[];
  count: number;
  loadingList: boolean;
  loadingModal: boolean;
  loadingButtonConfirm: boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  notifyToast: (args: ArgsProps) => void;
  handleResetList: () => void;
  handleLoadList: (filterParam?: SettlementFilter) => void;
  tabFilterRepositories: TagFilterList[];
  dispatchFilter: React.Dispatch<FilterAction<SettlementFilter>>;
  handleOnClickRow: (record: Settlement, type: ActionRowType) => void;
  handleApplyButtonInConfirmModal: (model: Settlement, reason?: string) => void;
  handlePressAdd: () => void;
  getLinkClickRow?: (record: Settlement, type: ActionRowType) => string;
}

export const SettlementMasterContext = createContext<SettlementMaster>({
  modelFilter: new SettlementFilter(),
  countFilter: 0,
  list: [],
  count: 0,
  loadingList: true,
  loadingModal: false,
  loadingButtonConfirm: false,
  modelSelected: null,
  setModelSelected: null,
  notifyToast: null,
  handleResetList: null,
  handleLoadList: null,
  tabFilterRepositories: [],
  dispatchFilter: null,
  handleOnClickRow: null,
  handleApplyButtonInConfirmModal: null,
  handlePressAdd: null,
});

export function useSettlementMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [loadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    React.useState<boolean>(false);
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const tabFilterRepositories = React.useMemo<TagFilterList[]>(
    () => [
      {
        title: translate("TIA.tab_all"),
        value: TAB_MASTER.ALL,
      },
      {
        title: translate("TIA.tab_mine"),
        value: TAB_MASTER.MINE,
      },
      {
        title: translate("TIA.tab_inprogress"),
        value: TAB_MASTER.IN_PROGRESS,
      },
      {
        title: translate("TIA.tab_approval"),
        value: TAB_MASTER.APPROVAL,
      },
    ],
    [translate]
  );

  const handlePressAdd = React.useCallback(() => {
    history.push(SETTLEMENT_DETAIL_ROUTE);
  }, [history]);

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
          errorMessage: error?.response?.data?.errors?.reason,
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  const handleOnClickRow = React.useCallback(
    (record: Settlement, type: ActionRowType) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            SETTLEMENT_VIEW_ROUTE +
              `/${record.id}?isView=${!record?.canViewApprove}`
          );
          break;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(SETTLEMENT_VIEW_ROUTE, [record.id], {
            isView: !record?.canViewApprove,
          });
          break;
        case ActionRowType.EDIT:
          history.push(SETTLEMENT_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.CREATE:
          history.push(SETTLEMENT_DETAIL_ROUTE);
          break;
        case ActionRowType.VIEW_CONTRACT:
          openNewTab(CONTRACT_ROUTE_VIEW, [record.contractId]);
          break;
        default:
          break;
      }
    },
    [history]
  );

  const getLinkClickRow = (record: Settlement, type: ActionRowType) => {
    switch (type) {
      case ActionRowType.VIEW_CONTRACT:
        return CONTRACT_ROUTE_VIEW + `/${record.contractId}`;
      default:
        return (
          SETTLEMENT_VIEW_ROUTE +
          `/${record.id}?isView=${!record?.canViewApprove}`
        );
    }
  };

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SettlementFilter,
      {
        ...new SettlementFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "search"]
    );

  const getListFromLocalStorage = (): Settlement[] => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_SETTLEMENT);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new SettlementFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Settlement, SettlementFilter>(
      settlementRepository.listAll,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  // Delete single budget
  const deleteSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .deleteSettlement(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel budget request
  const cancelSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .cancelSettlement(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: Settlement,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelSettlement(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteSettlement(model?.id, reason);
        return;
    }
  };

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
    list,
    count,
    countFilter,
    modelFilter,
    loadingList,
    loadingModal,
    loadingButtonConfirm,
    modelSelected,
    setModelSelected,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    notifyToast,
    tabFilterRepositories,
    handleOnClickRow,
    handleApplyButtonInConfirmModal,
    handlePressAdd,
    getLinkClickRow,
  };
}
