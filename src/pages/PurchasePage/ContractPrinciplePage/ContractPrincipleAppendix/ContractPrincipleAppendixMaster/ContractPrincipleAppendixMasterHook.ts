import {
  CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { isEmpty, isEqual, isNil, lte } from "lodash";
import {
  ContractPrincioleAppendixFilter,
  ContractPrincipleAppendixListModel,
} from "models/ContractPrincipleAppendix";
import ContractPrincipleAppendixMasterTab from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixTab/ContractPrincipleAppendixMasterTab";
import { contractPrincipleAppendixRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixRepository";
import { TagFilterEnum } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { ActionRowType, TagFilterList } from "../constants";
import { ContractAnnex } from "models/ContractAnnex";
import { openNewTab } from "core/helpers/query";

export const useContractPrincipleAppendixMasterHook = () => {
  const [translate] = useTranslation();
  const history = useHistory();

  const [modal, setModal] = useState<null | unknown>(null);

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "1",
        tabTitle: translate("contractAdjustment.tab_title"),
        children: ContractPrincipleAppendixMasterTab,
        list: contractPrincipleAppendixRepository.getAll,
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
      ContractPrincioleAppendixFilter,
      {
        ...new ContractPrincioleAppendixFilter(),
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
      ...new ContractPrincioleAppendixFilter(),
      tab: modelFilter?.tab,
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
      tabKey: repo?.tabKey,
    };
  }, [modelFilter, repo?.tabKey]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<unknown, ContractPrincioleAppendixFilter>(
      repo?.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

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

  const handleOnClickRow = useCallback(
    (
      record: ContractPrincipleAppendixListModel,
      type: ActionRowType,
      waitingForApproval?: boolean
    ) => {
      const isView = isNil(waitingForApproval) ? true : !waitingForApproval;
      switch (type) {
        case ActionRowType.VIEW:
          history.push(
            `${CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE}/${record.id}`,
            {
              isView,
            }
          );
          return;
        case ActionRowType.VIEW_FROM_MASTER:
          openNewTab(CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE, [record?.id], {
            isView,
          });
          break;
      }
    },
    [history]
  );

  const getLinkClickRow = (
    record: ContractPrincipleAppendixListModel,
    waitingForApproval?: boolean
  ) => {
    const isView = isNil(waitingForApproval) ? true : !waitingForApproval;
    return `${CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE}/${record.id}?isView=${isView}`;
  };

  const handleGoToContractPrincipleAppendixEdit = (appendix: ContractAnnex) => {
    history.push(`${CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE}/${appendix.id}`);
  };

  const handleModal = (modal: null | unknown) => {
    setModal(modal);
  };

  return {
    repo,
    list,
    count,
    translate,
    modelFilter,
    loadingList,
    tabRepositories,
    tabFilterRepository,
    countFilter,
    handleOnClickRow,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
    calculatedFilterCount,
    getEmptyData,
    modal,
    handleModal,
    handleGoToContractPrincipleAppendixEdit,
    getLinkClickRow,
  };
};
