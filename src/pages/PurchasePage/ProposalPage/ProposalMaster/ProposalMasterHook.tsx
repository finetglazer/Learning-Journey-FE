import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_PROPOSAL_LIST } from "config/const";
import {
  PAYMENT_CREATE_ADVANCE_ROUTE,
  PAYMENT_CREATE_EXPENSE_ROUTE,
  PAYMENT_CREATE_ROUTE,
  PROPOSAL_ADJUST_DETAIL_ROUTE,
  PROPOSAL_ADJUST_VIEW_ROUTE,
  PROPOSAL_CREATE_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
} from "config/route-const";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import {
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  TYPE_CREATE_PAYMENT_INHERITANCE,
} from "models/Payment";
import { Proposal } from "models/Proposal";
import { ProposalFilter } from "models/Proposal/ProposalFilter";
import { PurchaseProposal } from "models/PurchaseRequest";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, lastValueFrom, tap } from "rxjs";
import { paymentRepository } from "../../../PaymentPage/PaymentRepository";
import { proposalRepository } from "../ProposalRepository";
import AdjustProposalMasterTab from "./AdjustProposalMasterTab/AdjustProposalMasterTab";
import { ConfirmModalType } from "./ProposalConfirmModal/ProposalConfirmModal";
import ProposalMasterTab from "./ProposalMasterTab/ProposalMasterTab";
import { ArgsProps } from "antd/lib/notification";

export interface ModelSelect {
  type: ConfirmModalType;
  model: Proposal;
  errorMessage?: string;
}

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  EDIT,
  CREATE_ADJUSTMENT_PROPOSAL,
  CREATE_PAYMENT_REQUEST,
  CREATE_ADVANCE_PAYMENT,
  CREATE_EXPENDITURE_REQUEST,
  VIEW_ORIGINAL_PROPOSAL,
  VIEW_FROM_MASTER,
}

export interface ProposalMaster {
  modelFilter: ProposalFilter;
  list: Proposal[];
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  count: number;
  loadingModal: boolean;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<ProposalFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: ProposalFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<Proposal>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  handleOnClickRow: (record: Proposal, type: ActionRowType) => void;
  handlePressAdd?: (value?: PurchaseProposal) => void;
  handleApplyButtonInConfirmModal: (model: Proposal, reason: string) => void;
  repo: RepoState;
  tabFilterRepository: TagFilterList[];
  getEmptyData?: () => boolean;
  isShowModalProposal: boolean;
  setIsShowModalProposal: React.Dispatch<React.SetStateAction<boolean>>;
  getLinkClickRow?: (record: Proposal, type?: ActionRowType) => string;
  notifyToast: (args: ArgsProps) => void;
}

export const ProposalMasterContext = createContext<ProposalMaster>({
  modelFilter: new ProposalFilter(),
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
  isShowModalProposal: false,
  setIsShowModalProposal: null,
  notifyToast: null,
});

export function useProposalMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isShowModalProposal, setIsShowModalProposal] = React.useState(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabRepositories = React.useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("PP.proposal"),
        children: <ProposalMasterTab />,
        list: proposalRepository.listAll,
      },
      {
        tabKey: "1",
        tabTitle: translate("PP.adjust_proposal"),
        children: <AdjustProposalMasterTab />,
        list: proposalRepository.listAll,
      },
    ];
  }, [translate]);

  const tabFilterRepository = React.useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("BG.tab_all"),
        value: "0",
      },
      {
        title: translate("BG.tab_mine"),
        value: "1",
      },
      {
        title: translate("PP.tab_inprogress"),
        value: "2",
      },
      {
        title: translate("PP.tab_approval"),
        value: "3",
      },
    ];
  }, [translate]);

  const handlePressAdd = React.useCallback(
    (data?: PurchaseProposal) => {
      if (isEmpty(data)) {
        history.push(PROPOSAL_CREATE_ROUTE);
      } else {
        history.push(PROPOSAL_ADJUST_DETAIL_ROUTE, {
          dataProposal: data,
        });
      }
    },
    [history]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ProposalFilter,
      {
        ...new ProposalFilter(),
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
      ...new ProposalFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
      pageSize: modelFilter?.pageSize,
    };
  }, [repo.tabKey, modelFilter]);

  const handleOnClickRow = React.useCallback(
    (record: Proposal, type: ActionRowType) => {
      switch (type) {
        case ActionRowType.VIEW:
          if (modelFilter?.tabKey === "1") {
            history.push(PROPOSAL_ADJUST_VIEW_ROUTE + `/${record.id}`);
            break;
          }
          history.push(PROPOSAL_DETAIL_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.VIEW_FROM_MASTER: {
          const viewRoute = isEqual(modelFilter?.tabKey, "1")
            ? PROPOSAL_ADJUST_VIEW_ROUTE
            : PROPOSAL_DETAIL_ROUTE;
          openNewTab(viewRoute, [record.id]);
          break;
        }
        case ActionRowType.EDIT:
          if (modelFilter?.tabKey === "1") {
            history.push(PROPOSAL_ADJUST_DETAIL_ROUTE + `/${record.id}`);
            break;
          }
          history.push(PROPOSAL_CREATE_ROUTE + `/${record.id}`);
          break;
        case ActionRowType.CREATE_ADJUSTMENT_PROPOSAL:
          handleClickCreateAdjustmentProposal(record);
          break;
        case ActionRowType.CREATE_PAYMENT_REQUEST:
          handleCreatePaymentFromProposal({
            data: record,
            type: TYPE_CREATE_PAYMENT_INHERITANCE?.TTNCC,
          });
          break;
        case ActionRowType.CREATE_ADVANCE_PAYMENT:
          handleCreatePaymentFromProposal({
            data: record,
            type: TYPE_CREATE_PAYMENT_INHERITANCE?.TUNCC,
          });
          break;
        case ActionRowType.CREATE_EXPENDITURE_REQUEST:
          handleCreatePaymentFromProposal({
            data: record,
            type: TYPE_CREATE_PAYMENT_INHERITANCE?.DCNCC,
          });
          break;
        case ActionRowType.VIEW_ORIGINAL_PROPOSAL:
          openNewTab(PROPOSAL_DETAIL_ROUTE, [
            record?.originalPurchaseProposalId,
          ]);
          break;
      }
    },
    [history, modelFilter?.tabKey]
  );

  const getLinkClickRow = (record: Proposal, type?: ActionRowType) => {
    if (type == ActionRowType?.VIEW_ORIGINAL_PROPOSAL) {
      return PROPOSAL_DETAIL_ROUTE + `/${record.originalPurchaseProposalId}`;
    }
    if (modelFilter?.tabKey === "1") {
      return PROPOSAL_ADJUST_VIEW_ROUTE + `/${record.id}`;
    }
    return PROPOSAL_DETAIL_ROUTE + `/${record.id}`;
  };

  const handleClickCreateAdjustmentProposal = async (record: Proposal) => {
    try {
      setIsLoading(true);
      const dataProposal = await purchaseRequestRepository
        .detailProposalAvailable(record.id)
        .toPromise();
      setIsLoading(false);
      handlePressAdd(dataProposal);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getListFromLocalStorage = (): Proposal[] => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_PROPOSAL_LIST);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Proposal, ProposalFilter>(
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
    listService.useRowSelection<Proposal>("checkbox", [], false);

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList(baseFilter);
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: baseFilter,
    });
    setModelSelected(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        if (modelSelected.type !== ConfirmModalType.CLOSE) {
          setModelSelected((previousState) => ({
            ...previousState,
            errorMessage: error?.response?.data?.errors?.["reason"],
          }));
        } else {
          setModelSelected(null);
          notifyToast({
            type: "error",
            message: error?.response?.data?.errors,
          });
        }
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  // Delete proposal
  const deleteProposal = (ProposalId: string, reason: string) => {
    proposalRepository
      .deleteProposal(ProposalId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel proposal
  const cancelProposal = (budgetId: string, reason: string) => {
    proposalRepository
      .cancelProposal(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const closeProposal = (proposalId: string) => {
    setLoadingModal(true);
    proposalRepository
      .closeProposal(proposalId)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (model: Proposal, reason: string) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelProposal(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteProposal(model?.id, reason);
        return;
      case ConfirmModalType.CLOSE:
        closeProposal(model?.id);
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

  const handleCreatePaymentFromProposal = async ({
    data,
    type,
  }: {
    data: Proposal;
    type: number;
  }) => {
    try {
      setIsLoading(true);
      const purchaseProposalId = data?.id;
      const paymentType = type;

      const result = await lastValueFrom(
        paymentRepository.getDataDetailInheritanceFormProposal({
          purchaseProposalId,
          paymentType,
        })
      );
      switch (paymentType) {
        case TYPE_CREATE_PAYMENT_INHERITANCE?.TTNCC:
          history.push(PAYMENT_CREATE_ROUTE, {
            result,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL,
            paymentInheritanceId: purchaseProposalId,
          });
          break;
        case TYPE_CREATE_PAYMENT_INHERITANCE?.TUNCC:
          history.push(PAYMENT_CREATE_ADVANCE_ROUTE, {
            result,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL,
            paymentInheritanceId: purchaseProposalId,
          });
          break;
        case TYPE_CREATE_PAYMENT_INHERITANCE?.DCNCC:
          history.push(PAYMENT_CREATE_EXPENSE_ROUTE, {
            result,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL,
            paymentInheritanceId: purchaseProposalId,
          });
          break;
      }
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
    }
  };

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
    getEmptyData,
    isLoading,
    isShowModalProposal,
    setIsShowModalProposal,
    notifyToast,

    // non-context value:
    translate,
    handleChangeTab,
    tabRepositories,
    tabFilterRepository,
    handlePressAdd,
    handleOnClickRow,
    handleCreatePaymentFromProposal,
    getLinkClickRow,
  };
}
