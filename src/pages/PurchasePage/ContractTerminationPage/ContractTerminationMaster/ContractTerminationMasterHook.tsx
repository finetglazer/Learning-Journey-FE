import { LOCAL_STORAGE_CONTRACT_LIQUIDATION } from "config/const";
import appMessageService from "core/services/common-services/app-message-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  ConfirmModalType,
  ContractLiquidation,
  ContractLiquidationTypeModel,
  ModelSelect,
  TAB_MASTER,
  TagFilterList,
} from "models/ContractLiquidation";
import { ContractLiquidationFilter } from "models/ContractLiquidation/ContractLiquidationFilter";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { FilterAction } from "core/services/service-types";
import { ArgsProps } from "antd/lib/notification";
import { listService } from "core/services/page-services/list-service";
import { contractTerminationRepository } from "../ContractTerminationRepository";
import { finalize, tap } from "rxjs";
import { AxiosError } from "axios";
import { isEqual } from "lodash";
import {
  CONTRACT_ORDER,
  CONTRACT_ROUTE_VIEW,
  CONTRACT_TERMINATION_DETAIL_ROUTE,
  CONTRACT_TERMINATION_VIEW_ROUTE,
} from "config/route-const";
import { ActionRowType } from "models/ContractTermination";

export interface ContractTerminationMaster {
  modelFilter: ContractLiquidationFilter;
  countFilter: number;
  list: ContractLiquidation[];
  count: number;
  loadingModal: boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal: (
    model: ContractLiquidation,
    reason?: string
  ) => void;
  loadingButtonConfirm: boolean;
  loadingList: boolean;
  handleOnClickRow: (
    record: ContractLiquidationTypeModel,
    type: ActionRowType
  ) => void;
  handleResetList: () => void;
  handleLoadList: (filterParam?: ContractLiquidationFilter) => void;
  dispatchFilter: React.Dispatch<FilterAction<ContractLiquidationFilter>>;
  notifyToast: (args: ArgsProps) => void;
  tabFilterRepositories: TagFilterList[];
  getLinkClickRow?: (
    record: ContractLiquidationTypeModel,
    type: ActionRowType
  ) => string;
}

export const ContractTerminationMasterHookContext =
  createContext<ContractTerminationMaster>({
    modelFilter: new ContractLiquidationFilter(),
    countFilter: 0,
    list: [],
    count: 0,
    loadingModal: false,
    modelSelected: null,
    setModelSelected: null,
    handleApplyButtonInConfirmModal: null,
    loadingButtonConfirm: null,
    loadingList: true,
    handleOnClickRow: null,
    handleResetList: null,
    handleLoadList: null,
    dispatchFilter: null,
    notifyToast: null,
    tabFilterRepositories: [],
  });

export function useContractTerminationMasterHook() {
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
        title: translate("CLQ.tab_all"),
        value: TAB_MASTER.ALL,
      },
      {
        title: translate("CLQ.tab_mine"),
        value: TAB_MASTER.MINE,
      },
      {
        title: translate("CLQ.tab_inprogress"),
        value: TAB_MASTER.IN_PROGRESS,
      },
      {
        title: translate("CLQ.tab_approval"),
        value: TAB_MASTER.APPROVAL,
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractLiquidationFilter,
      {
        ...new ContractLiquidationFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "search"]
    );

  const getListFromLocalStorage = (): ContractLiquidation[] => {
    try {
      const savedList = localStorage.getItem(
        LOCAL_STORAGE_CONTRACT_LIQUIDATION
      );
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const handleOnClickRow = React.useCallback(
    (record: ContractLiquidationTypeModel, type: ActionRowType) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(CONTRACT_TERMINATION_VIEW_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.EDIT:
          history.push(CONTRACT_TERMINATION_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.CREATE:
          history.push(CONTRACT_TERMINATION_DETAIL_ROUTE);
          break;
        case ActionRowType.VIEW_CONTRACT:
          history.push(CONTRACT_ROUTE_VIEW + `/${record.contractId}`);
          break;
        default:
          break;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: ContractLiquidationTypeModel,
    type: ActionRowType
  ) => {
    switch (type) {
      case ActionRowType.VIEW_CONTRACT:
        return CONTRACT_ORDER + `/${record?.contract?.id}`;
      default:
        return CONTRACT_TERMINATION_VIEW_ROUTE + `/${record.id}`;
    }
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new ContractLiquidationFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      search: modelFilter?.search,
      pageSize: modelFilter?.pageSize,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ContractLiquidation, ContractLiquidationFilter>(
      contractTerminationRepository.listAll,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

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

  // Delete single budget
  const deleteContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .deleteContractTermination(id, reason)
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
  const cancelContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .cancelContractTermination(id, reason)
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
    model: ContractLiquidation,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelContractTermination(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteContractTermination(model?.id, reason);
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
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    loadingButtonConfirm,
    handleOnClickRow,
    notifyToast,
    handleResetList,
    handleLoadList,
    dispatchFilter,
    tabFilterRepositories,
    getLinkClickRow,
  };
}
