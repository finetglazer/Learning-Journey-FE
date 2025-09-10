import { ArgsProps } from "antd/lib/notification";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET } from "config/const";
import {
  CONTRACT_ROUTE_VIEW,
  TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { isEqual } from "lodash";
import {
  ConfirmModalType,
  TemporaryImportAsset,
  TemporaryImportAssetTypeModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import {
  ActionRowType,
  TAB_MASTER,
} from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { TemporaryImportAssetFilter } from "models/TemporaryImportAsset/TemporaryImportAssetFilter";
import { TagFilterList } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { temporaryImportAssetRepository } from "../TemporaryImportAssetRepository";

export interface ModelSelect {
  type: ConfirmModalType;
  model: TemporaryImportAsset;
  errorMessage?: string;
}
export interface TemporaryImportAssetMaster {
  modelFilter: TemporaryImportAssetFilter;
  countFilter: number;
  list: TemporaryImportAsset[];
  count: number;
  loadingList: boolean;
  loadingModal: boolean;
  loadingButtonConfirm: boolean;
  handleResetList: () => void;
  handleLoadList: (filterParam?: TemporaryImportAssetFilter) => void;
  tabFilterRepositories: TagFilterList[];
  dispatchFilter: React.Dispatch<FilterAction<TemporaryImportAssetFilter>>;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  notifyToast: (args: ArgsProps) => void;
  handleOnClickRow: (
    record: TemporaryImportAssetTypeModel,
    type: ActionRowType,
    tab?: string
  ) => void;
  handlePressAdd: () => void;
  handleApplyButtonInConfirmModal: (
    model: TemporaryImportAssetTypeModel,
    reason?: string,
    action?: number
  ) => void;
  getLinkClickRow?: (
    record: TemporaryImportAssetTypeModel,
    type: ActionRowType,
    tab?: string
  ) => string;
}

export const TemporaryImportAssetMasterContext =
  createContext<TemporaryImportAssetMaster>({
    modelFilter: new TemporaryImportAssetFilter(),
    countFilter: 0,
    list: [],
    count: 0,
    loadingList: true,
    loadingModal: false,
    loadingButtonConfirm: false,
    handleResetList: null,
    handleLoadList: null,
    tabFilterRepositories: [],
    dispatchFilter: null,
    modelSelected: null,
    setModelSelected: null,
    notifyToast: null,
    handleOnClickRow: null,
    handlePressAdd: null,
    handleApplyButtonInConfirmModal: null,
  });

export function useTemporaryImportAssetMasterHook() {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const history = useHistory();
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
    history.push(TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE);
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

  const queryViewApprove = (tab: string) => {
    if (!tab) return;
    return tab == TAB_MASTER.IN_PROGRESS
      ? {
          isViewWaitingApprove: true,
        }
      : {};
  };

  const handleOnClickRow = React.useCallback(
    (
      record: TemporaryImportAssetTypeModel,
      type: ActionRowType,
      tab?: string
    ) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(TEMPORARY_IMPORT_ASSET_VIEW_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
            [record?.id],
            queryViewApprove(tab)
          );
          break;
        case ActionRowType.EDIT:
          history.push(TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.CREATE:
          history.push(TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE);
          break;
        case ActionRowType.VIEW_CONTRACT:
          openNewTab(CONTRACT_ROUTE_VIEW, [record?.contractId]);
          break;
        default:
          break;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: TemporaryImportAssetTypeModel,
    type: ActionRowType,
    tab?: string
  ) => {
    const isViewWaitingApprove = tab === TAB_MASTER.IN_PROGRESS;
    switch (type) {
      case ActionRowType.VIEW_CONTRACT:
        return CONTRACT_ROUTE_VIEW + `/${record?.contractId}`;
      default:
        return `${TEMPORARY_IMPORT_ASSET_VIEW_ROUTE}/${record?.id}?isViewWaitingApprove=${isViewWaitingApprove}`;
    }
  };

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      TemporaryImportAssetFilter,
      {
        ...new TemporaryImportAssetFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "search"]
    );

  const getListFromLocalStorage = (): TemporaryImportAsset[] => {
    try {
      const savedList = localStorage.getItem(
        LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET
      );
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new TemporaryImportAssetFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      search: modelFilter?.search,
      pageSize: modelFilter?.pageSize,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<TemporaryImportAsset, TemporaryImportAssetFilter>(
      temporaryImportAssetRepository.listAll,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  // Delete single budget
  const deleteTemporaryImportAsset = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .deleteTemporaryImportAsset(id, reason)
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
  const cancelTemporaryImportAsset = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .cancelTemporaryImportAsset(id, reason)
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
    model: TemporaryImportAssetTypeModel,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelTemporaryImportAsset(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteTemporaryImportAsset(model?.id, reason);
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
    handleResetList,
    handleLoadList,
    dispatchFilter,
    modelSelected,
    setModelSelected,
    handlePressAdd,
    handleApplyButtonInConfirmModal,
    // non-context value:
    notifyToast,
    tabFilterRepositories,
    handleOnClickRow,
    getLinkClickRow,
  };
}
