import {
  APP_OVERVIEW,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROJECT_SETTLEMENT_EDIT_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { openNewTab } from "core/helpers/query";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tabServices } from "core/services/page-services/tab-services";
import { isNil } from "lodash";
import {
  Goods,
  ProjectSettlementFilter,
  ProjectSettlementModel,
  TagFilterList,
} from "models/ProjectSettlement";
import { ActionRowType } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import { TagFilterEnum } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { ProjectSettlementModal } from "../Components/constant";
import { useModalConfirm } from "../Components/hooks/useModalConfirm";

export function useProjectSettlementMasterHook() {
  const [translate] = useTranslation();
  const history = useHistory();

  const [modal, setModal] = useState<null | ProjectSettlementModal>(null);
  const [record, setRecord] = useState<Goods | null>(null);

  const reloadList = () => {
    handleLoadList();
    hideModal();
  };

  const { isLoading, errorMessage, processApi, setErrorMessage } =
    useModalConfirm(reloadList);

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("AC.txt_menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("AC.txt_menu_title_shopping"),
      },
      {
        name: translate("CM.menu_title_project_settlement"),
      },
    ];
  }, [translate]);

  const projectSettlementTabsFilterRepository = useMemo<TagFilterList[]>(() => {
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
      ProjectSettlementFilter,
      {
        ...new ProjectSettlementFilter(),
        tab: TagFilterEnum.ALL,
        pageIndex: numberConstants.ONE,
        pageSize: numberConstants.TEN,
      },
      ["orderBy", "orderType", "tab", "search"]
    );

  const { repo, handleChangeTab } = tabServices.useTabAction(
    projectSettlementTabsFilterRepository,
    dispatchFilter
  );

  const baseFilter = useMemo(() => {
    return {
      ...new ProjectSettlementFilter(),
      tab: repo.value,
      search: modelFilter?.search,
      pageSize: numberConstants.TEN,
      pageIndex: numberConstants.ONE,
    };
  }, [modelFilter?.search, repo.value]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ProjectSettlementModel, ProjectSettlementFilter>(
      projectSettlementRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const calculatedFilterCount = useMemo(() => {
    let count = countFilter;
    if (
      modelFilter?.projectSettlementFrom?.equal &&
      modelFilter?.projectSettlementTo?.equal
    ) {
      count -= numberConstants.ONE;
    }

    return count;
  }, [
    countFilter,
    modelFilter?.projectSettlementFrom,
    modelFilter?.projectSettlementTo,
  ]);

  const handleOnClickRow = useCallback(
    (
      record: ProjectSettlementModel,
      type: ActionRowType,
      waitingForApproval?: boolean
    ) => {
      const isView = isNil(waitingForApproval) ? true : !waitingForApproval;

      switch (type) {
        case ActionRowType.VIEW:
          history.push(`${PROJECT_SETTLEMENT_DETAIL_ROUTE}/${record.id}`, {
            isView,
          });
          return;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(
            PROJECT_SETTLEMENT_DETAIL_ROUTE,
            [record?.id],
            isView ? { isView } : {}
          );
          return;
        case ActionRowType.VIEW_POLICY:
          openNewTab(PROPOSAL_DETAIL_ROUTE, [record?.purchaseProposalId]);
          return;
        case ActionRowType.EDIT:
          history.push(`${PROJECT_SETTLEMENT_EDIT_ROUTE}/${record.id}`);
          return;
        case ActionRowType.CANCEL:
          setRecord(record);
          handleModal(ProjectSettlementModal.Cancel);
          return;
        case ActionRowType.DELETE:
          setRecord(record);
          handleModal(ProjectSettlementModal.Delete);
          return;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: ProjectSettlementModel,
    type: ActionRowType,
    waitingForApproval?: boolean
  ) => {
    const isView = isNil(waitingForApproval) ? true : !waitingForApproval;
    switch (type) {
      case ActionRowType.VIEW_POLICY:
        return `${PROPOSAL_DETAIL_ROUTE}/${record.purchaseProposalId}`;
      default:
        return `${PROJECT_SETTLEMENT_DETAIL_ROUTE}/${record.id}?isView=${isView}`;
    }
  };

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const handleModal = (modal: null | ProjectSettlementModal) => {
    setModal(modal);
  };

  const hideModal = () => {
    setRecord(null);
    setModal(ProjectSettlementModal.None);
    setErrorMessage(null);
  };

  const confirmCancel = (id: string, reason: string) => {
    processApi(ProjectSettlementModal.Cancel, id, reason);
  };

  const confirmDelete = (id: string, reason: string) => {
    processApi(ProjectSettlementModal.Delete, id, reason);
  };

  return {
    modal,
    translate,
    breadcrumbs,
    projectSettlementTabsFilterRepository,
    modelFilter,
    countFilter,
    baseFilter,
    list,
    count,
    repo,
    loadingList,
    calculatedFilterCount,
    handleOnClickRow,
    handleResetList,
    handleLoadList,
    handleModal,
    dispatchFilter,
    getModelFilter,
    handleChangeTab,
    record,
    hideModal,
    confirmCancel,
    confirmDelete,
    isLoadingModal: isLoading,
    errorMessage,
    getLinkClickRow,
  };
}
