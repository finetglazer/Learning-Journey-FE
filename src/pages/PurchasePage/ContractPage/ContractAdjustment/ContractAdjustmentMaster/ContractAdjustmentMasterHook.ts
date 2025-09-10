/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import { useHistory } from "react-router";
import { listService } from "core/services/page-services/list-service";
import { useTranslation } from "react-i18next";
import { HttpStatusCode } from "core/services/service-types";
import { numberConstants } from "core/config/consts";
import { queryStringService } from "core/services/page-services/query-string-service";
import { isEmpty, isEqual, lte } from "lodash";
import { contractAdjustmentRepository } from "../ContractAdjustmentRepository";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LOCAL_STORAGE_CONTRACT_ADJUSTMENT } from "pages/PurchasePage/constants";
import {
  ContractAdjustmentFilter,
  ContractAdjustment,
} from "models/ContractAdjustment";
import {
  ActionRowType,
  ConfirmModalType,
  ModelSelect,
  TagFilterEnum,
  TagFilterList,
} from "../constants";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import appMessageService from "core/services/common-services/app-message-service";
import {
  CONTRACT_ADJUSTMENT_DETAIL_ROUTE,
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
} from "config/route-const";
import ContractAdjustmentTab from "./ContractAdjustmentTab/ContractAdjustmentTab";
import { finalize, tap } from "rxjs";

const REASON = "reason";
const VALIDATE = "Validate";
const ERROR_TYPE = "error";

export function useContractAdjustmentMasterHook() {
  const history = useHistory();
  const [translate] = useTranslation();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const [modal, setModal] = useState<null | unknown>(null);
  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "3",
        tabTitle: translate("contractAdjustment.tab_title"),
        children: ContractAdjustmentTab,
        list: contractAdjustmentRepository.getAll,
      },
    ];
  }, [translate]);

  const tabFilterRepository = useMemo<TagFilterList[]>(() => {
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

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractAdjustmentFilter,
      {
        ...new ContractAdjustmentFilter(),
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
      ...new ContractAdjustmentFilter(),
      tab: modelFilter?.tab,
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
    };
  }, [modelFilter, repo.tabKey]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ContractAdjustment, ContractAdjustmentFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const handleOnClickRow = useCallback(
    (
      record: ContractAdjustment,
      type: ActionRowType,
      waitingForApproval?: boolean
    ) => {
      const statusPayment = {
        statusPayment: waitingForApproval ? record?.status : -1,
      };
      const id = record.id;
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${CONTRACT_ADJUSTMENT_VIEW_ROUTE}/${id}`,
            statusPayment
          );
          break;

        case ActionRowType.EDIT:
          history.push(
            `${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}/${id}`,
            statusPayment
          );
          break;
        case ActionRowType.VIEW_APPROVE:
          history.push(
            `${CONTRACT_ADJUSTMENT_VIEW_ROUTE}/${id}?isWaitingForApproval=true`
          );
          break;
      }
    },
    [history]
  );

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

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

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

  const handleModal = (modal: null | unknown) => {
    setModal(modal);
  };

  const refreshListAndHideModal = () => {
    notifyToast();
    handleLoadList();
    setModelSelected(null);
  };

  const deleteContractAdjustment = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractAdjustmentRepository
      .deleteContractAdjustment(id, reason)
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

  const cancelContractAdjustment = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractAdjustmentRepository
      .cancelContractAdjustment(id, reason)
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
    model: ContractAdjustment,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelContractAdjustment(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteContractAdjustment(model?.id, reason);
        return;
    }
  };

  return {
    repo,
    list,
    modal,
    count,
    translate,
    modelFilter,
    loadingList,
    tabRepositories,
    tabFilterRepository,
    calculatedFilterCount,
    loadingModal: isLoadingModal,
    countFilter,
    modelSelected,
    getEmptyData,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
    handleOnClickRow,
    setModelSelected,
    handleModal,
    loadingButtonConfirm,
    handleApplyButtonInConfirmModal,
  };
}
