import { AxiosError } from "axios";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  ACCEPTANCE_EDIT_ROUTE,
  CONTRACT_ROUTE_VIEW,
  PURCHASE_REQUEST_VIEW_ROUTE,
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
import { HttpStatusCode } from "core/services/service-types";
import { isEmpty, isEqual, isNil, lte } from "lodash";
import { AcceptanceModel } from "models/Acceptance";
import { AcceptanceFilter } from "models/Acceptance/AcceptanceFilter";
import { LOCAL_STORAGE_ACCEPTANCE } from "pages/PurchasePage/constants";
import { ConfirmModalType } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestMaster/PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import { TagFilterEnum } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { acceptanceRepository } from "../AcceptanceRepository";
import AcceptanceTab from "./AcceptanceMasterTab/AcceptanceTab/AcceptanceTab";
import WaitingAcceptanceTab from "./AcceptanceMasterTab/WaitingAcceptanceTab/WaitingAcceptanceTab";

const VALIDATE = "Validate";
const REASON = "reason";
const ERROR_TYPE = "error";

export interface ModelSelect {
  type: ConfirmModalType;
  model: AcceptanceModel;
  errorMessage?: string;
}

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  VIEW_CONTRACT_WAITING,
  VIEW_PURCHASE_REQUEST,
  EDIT,
  VIEW_FROM_MASTER,
}

export enum TabKeyEnum {
  ACCEPTANCE = "0",
  ACCEPTANCE_WAITING = "1",
}

export function useAcceptanceMasterHook() {
  const history = useHistory();
  const [translate] = useTranslation();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: TabKeyEnum.ACCEPTANCE,
        tabTitle: translate("AC.txt_acceptance"),
        children: <AcceptanceTab />,
        list: acceptanceRepository.getAll as any,
      },
      {
        tabKey: TabKeyEnum.ACCEPTANCE_WAITING,
        tabTitle: translate("AC.txt_waiting_for_acceptance"),
        children: <WaitingAcceptanceTab />,
        list: acceptanceRepository.getAllAcceptanceWaiting,
      },
    ];
  }, [translate]);

  const tabFilterRepository = useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("AC.txt_tab_all"),
        value: TagFilterEnum.ALL,
      },
      {
        title: translate("AC.txt_tab_mine"),
        value: TagFilterEnum.MINE,
      },
      {
        title: translate("AC.txt_tab_inprogress"),
        value: TagFilterEnum.IN_PROGRESS,
      },
      {
        title: translate("AC.txt_tab_approval"),
        value: TagFilterEnum.APPROVAL,
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      AcceptanceFilter,
      {
        ...new AcceptanceFilter(),
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
      ...new AcceptanceFilter(),
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
    listService.useList<AcceptanceModel, AcceptanceFilter>(
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
      record: AcceptanceModel,
      type: ActionRowType,
      waitingForApproval?: false
    ) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${ACCEPTANCE_DETAIL_ROUTE}/${
              record.id
            }?isView=${!waitingForApproval}`
          );
          localStorage.setItem(LOCAL_STORAGE_ACCEPTANCE, "VIEW");
          return;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            ACCEPTANCE_DETAIL_ROUTE,
            [record?.id],
            waitingForApproval ? { isView: true } : {}
          );
          localStorage.setItem(LOCAL_STORAGE_ACCEPTANCE, "VIEW");
          return;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: AcceptanceModel,
    type: ActionRowType,
    waitingForApproval = false
  ) => {
    switch (type) {
      case ActionRowType.VIEW_CONTRACT_WAITING:
        return `${CONTRACT_ROUTE_VIEW}/${record?.id}`;
      case ActionRowType.VIEW_PURCHASE_REQUEST:
        return `${PURCHASE_REQUEST_VIEW_ROUTE}/${record?.originalPurchaseRequest?.id}`;
      default:
        return `${ACCEPTANCE_DETAIL_ROUTE}/${
          record.id
        }?isView=${!waitingForApproval}`;
    }
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

  //  Delete received good
  const deleteAcceptanceGood = (id: string, reason: string) => {
    if (isNil(id)) return;
    acceptanceRepository
      .deleteAcceptanceGood(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Cancel received good
  const cancelAcceptanceGood = (id: string, reason?: string) => {
    acceptanceRepository
      .cancelAcceptanceGood(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  // Apply button in confirm modal
  const handleApplyButtonInConfirmModal = (
    model: AcceptanceModel,
    reason?: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelAcceptanceGood(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteAcceptanceGood(model?.id, reason);
        return;
    }
  };

  const handleGoToAcceptanceEdit = (received: AcceptanceModel) => {
    localStorage.setItem(LOCAL_STORAGE_ACCEPTANCE, "EDIT");
    history.push(`${ACCEPTANCE_EDIT_ROUTE}/${received.id}`);
  };

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList, repo]);

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

  return {
    repo,
    list,
    count,
    translate,
    modelFilter,
    loadingList,
    tabRepositories,
    tabFilterRepository,
    loadingModal: isLoadingModal,
    setModelSelected,
    calculatedFilterCount,
    handleOnClickRow,
    getEmptyData,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
    handleGoToAcceptanceEdit,
    handleApplyButtonInConfirmModal,
    getLinkClickRow,
  };
}
