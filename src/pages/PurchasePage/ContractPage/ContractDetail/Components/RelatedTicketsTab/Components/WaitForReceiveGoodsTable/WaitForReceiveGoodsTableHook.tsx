import { useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  ContractDetailModel,
  WaitForReceiveGoodsByUser,
  WaitForReceiveGoodsModalFilter,
} from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { numberConstants } from "core/config/consts";
import { filterService } from "core/services/page-services/filter-service";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { listService } from "core/services/page-services/list-service";

export const useWaitForReceiveGoodsTableHook = () => {
  const [translate] = useTranslation();
  const {
    model,
    contractId,
    selectedUserEmailWaitForReceiveGoods,
    setSelectedUserEmailWaitForReceiveGoods,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const waitForReceiveGoodsList = model?.ticketRelated?.waitingReceipts || [];

  const baseFilter: WaitForReceiveGoodsModalFilter = useMemo(() => {
    return {
      receipter: selectedUserEmailWaitForReceiveGoods,
      search: "",
      pageIndex: numberConstants.ONE,
      pageSize: numberConstants.TEN,
    };
  }, [selectedUserEmailWaitForReceiveGoods]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(WaitForReceiveGoodsModalFilter, baseFilter);

  const {
    list: waitForReceiveGoodsListByUser,
    loadingList: loadingWaitForReceiveGoodsListByUser,
    handleLoadList: handleLoadWaitForReceiveGoodsListByUser,
    handleResetList: handleResetWaitForReceiveGoodsListByUser,
  } = listService.useList<
    WaitForReceiveGoodsByUser,
    WaitForReceiveGoodsModalFilter
  >(
    useCallback(
      (filterParam) =>
        contractRepository.getWaitForReceiveGoodsListByUser(
          contractId,
          filterParam
        ),
      [contractId]
    ),
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const handleOpenWaitForReceiveGoodsModal = (email: string) => {
    setSelectedUserEmailWaitForReceiveGoods(email);
  };

  const handleCloseWaitForReceiveGoodsModal = () => {
    setSelectedUserEmailWaitForReceiveGoods("");
    handleResetWaitForReceiveGoodsListByUser();
  };

  useEffect(() => {
    if (selectedUserEmailWaitForReceiveGoods) {
      handleLoadWaitForReceiveGoodsListByUser(baseFilter);
    }
  }, [
    baseFilter,
    selectedUserEmailWaitForReceiveGoods,
    handleLoadWaitForReceiveGoodsListByUser,
  ]);

  return {
    translate,
    waitForReceiveGoodsList,
    waitForReceiveGoodsListByUser,
    modelFilter,
    loadingWaitForReceiveGoodsListByUser,
    selectedUserEmailWaitForReceiveGoods,
    contractId,
    dispatchFilter,
    handleLoadWaitForReceiveGoodsListByUser,
    handleResetWaitForReceiveGoodsListByUser,
    handleOpenWaitForReceiveGoodsModal,
    handleCloseWaitForReceiveGoodsModal,
  };
};
