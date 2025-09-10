import { AxiosError } from "axios";
import {
  APP_OVERVIEW,
  CONTRACT_ROUTE_VIEW,
  PURCHASE_REQUEST_VIEW_ROUTE,
  RECEIVING_GOODS_CREATE_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  RECEIVING_GOODS_EDIT_ROUTE,
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
import {
  ReceivingGoodFilter,
  ReceivingGoodModel,
  TagFilterList,
} from "models/ReceivingGood";
import { LOCAL_STORAGE_ACTION_STATE } from "pages/PurchasePage/constants";
import {
  ActionRowType,
  ConfirmModalType,
  ModelSelect,
  TabKeyEnum,
  TagFilterEnum,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import ReceivedTab from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/ReceivedTab/ReceivedGoodsTab";
import WaitingReceivedGoodsTab from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/WaitingDeliveryTab/WaitingReceivedGoodsTab";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { receivedGoodsRepository } from "../ReceivedGoodRepository";

const VALIDATE = "Validate";
const REASON = "reason";
const ERROR_TYPE = "error";

export const useReceivingGoodsHooks = () => {
  const [translate] = useTranslation();

  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const history = useHistory();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_procurement"),
      },
      {
        name: translate("CM.menu_title_receiving_goods"),
      },
    ];
  }, [translate]);

  const receivingTabsFilterRepository = useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("CM.tab_all"),
        value: TagFilterEnum.ALL,
      },
      {
        title: translate("CM.tab_mine"),
        value: TagFilterEnum.MINE,
      },
      {
        title: translate("CM.tab_inprogress"),
        value: TagFilterEnum.IN_PROGRESS,
      },
      {
        title: translate("CM.tab_approval"),
        value: TagFilterEnum.APPROVAL,
      },
    ];
  }, [translate]);

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: TabKeyEnum.CONTRACTS,
        tabTitle: translate("CM.menu_title_receiving_goods"),
        children: <ReceivedTab />,
        list: receivedGoodsRepository.getAll,
      },
      {
        tabKey: TabKeyEnum.CONTRACT_PLAN,
        tabTitle: translate("RG.txt_waiting_for_receive"),
        children: <WaitingReceivedGoodsTab />,
        list: receivedGoodsRepository.getAllReceivedWaiting,
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ReceivingGoodFilter,
      {
        ...new ReceivingGoodFilter(),
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
      ...new ReceivingGoodFilter(),
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

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ReceivingGoodModel, ReceivingGoodFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

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

  const isEmptyData = () => {
    return (
      isEqual(
        modelFilter?.tab,
        receivingTabsFilterRepository[numberConstants.ZERO].value
      ) &&
      isEmpty(modelFilter?.search) &&
      isEmpty(list) &&
      (isNil(modelFilter?.contractValueFrom?.equal) ||
        isEmpty(modelFilter?.contractValueFrom?.equal)) &&
      (isNil(modelFilter?.contractValueTo?.equal) ||
        isEmpty(modelFilter?.contractValueTo?.equal)) &&
      lte(calculatedFilterCount, numberConstants.ZERO)
    );
  };

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const handleOnClickRow = useCallback(
    (
      record: ReceivingGoodModel,
      type: ActionRowType,
      waitingForApproval?: false
    ) => {
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${RECEIVING_GOODS_DETAIL_ROUTE}/${
              record.id
            }?isView=${!waitingForApproval}`
          );
          localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "VIEW");
          return;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            RECEIVING_GOODS_DETAIL_ROUTE,
            [record?.id],
            waitingForApproval ? { isView: true } : {}
          );
          localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "VIEW");
          return;
        case ActionRowType.EDIT:
          history.push(
            `${RECEIVING_GOODS_EDIT_ROUTE}/${
              record.id
            }?isView=${!waitingForApproval}`
          );
          localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "EDIT");
          return;
        case ActionRowType.VIEW_CONTRACT:
          openNewTab(CONTRACT_ROUTE_VIEW, [record?.contractId]);
          break;
        case ActionRowType.VIEW_CONTRACT_WAITING:
          openNewTab(CONTRACT_ROUTE_VIEW, [record.id]);
          break;
        case ActionRowType.VIEW_PURCHASE_REQUEST:
          openNewTab(PURCHASE_REQUEST_VIEW_ROUTE, [
            record?.originalPurchaseRequest?.id,
          ]);
          return;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: ReceivingGoodModel,
    type: ActionRowType,
    waitingForApproval = false
  ) => {
    switch (type) {
      case ActionRowType.VIEW_CONTRACT:
        return `${CONTRACT_ROUTE_VIEW}/${record?.contractId}`;
      case ActionRowType.VIEW_CONTRACT_WAITING:
        return `${CONTRACT_ROUTE_VIEW}/${record?.id}`;
      case ActionRowType.VIEW_PURCHASE_REQUEST:
        return `${PURCHASE_REQUEST_VIEW_ROUTE}/${record?.originalPurchaseRequest?.id}`;
      default:
        return `${RECEIVING_GOODS_DETAIL_ROUTE}/${
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
  const deleteReceivedGood = (id: string, reason: string) => {
    if (isNil(id)) return;
    receivedGoodsRepository
      .deleteReceivedGood(id, reason)
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
  const cancelReceivedGood = (id: string, reason?: string) => {
    receivedGoodsRepository
      .cancelReceivedGood(id, reason)
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
    model: ReceivingGoodModel,
    reason?: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelReceivedGood(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteReceivedGood(model?.id, reason);
        return;
    }
  };

  const handleGoToReceivedClone = (
    received: ReceivingGoodModel,
    model: ReceivingGoodModel,
    waitingForApproval?: boolean
  ) => {
    const statusPayment = {
      statusPayment: waitingForApproval ? model?.status : -1,
    };
    localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "CLONE");
    history.push(
      `${RECEIVING_GOODS_CREATE_ROUTE}/${received.id}`,
      statusPayment
    );
  };

  const handleGoToReceivedEdit = (
    received: ReceivingGoodModel,
    model: ReceivingGoodModel,
    waitingForApproval?: boolean
  ) => {
    const statusPayment = {
      statusPayment: waitingForApproval ? model?.status : -1,
    };
    localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "EDIT");
    history.push(`${RECEIVING_GOODS_EDIT_ROUTE}/${received.id}`, statusPayment);
  };

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);
  return {
    // context value:
    list,
    modelFilter,
    breadcrumbs,
    receivingTabsFilterRepository,
    repo,
    count,
    loadingList,
    countFilter,
    calculatedFilterCount,
    modelSelected,
    setModelSelected,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    isEmptyData,
    handleOnClickRow,
    loadingModal: isLoadingModal,
    handleApplyButtonInConfirmModal,
    handleGoToReceivedClone,
    handleGoToReceivedEdit,
    getLinkClickRow,

    // non-context value:
    translate,
    tabRepositories,
    handleChangeTab,
  };
};
