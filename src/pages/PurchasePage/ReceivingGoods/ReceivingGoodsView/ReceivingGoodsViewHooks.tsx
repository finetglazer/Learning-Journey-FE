import { APP_OVERVIEW, RECEIVING_GOODS_ROUTE } from "config/route-const";
import { detailService } from "core/services/page-services/detail-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { GeneralActionEnum } from "core/services/service-types";
import { ReceivingGoodFilter } from "models/ReceivingGood";
import { GoodsReceipt } from "models/ReceivingGood/GoodsReceipt";
import HistoryApprovalDetail from "pages/PurchasePage/ReceivingGoods/Components/HistoryApprovalDetail/HistoryApprovalDetail";
import ReceivedGoodsDetailIntergration from "pages/PurchasePage/ReceivingGoods/Components/ReceivedGoodsDetailIntergration/ReceivedGoodsDetailIntergration";
import ReceivedInformationDetail from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/ReceivedInformationDetail";
import SupplierEvaluationDetail from "pages/PurchasePage/ReceivingGoods/Components/SupplierEvaluationDetail/SupplierEvaluationDetail";
import { TabKeyDetailEnum } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { finalize } from "rxjs";
import { receivedGoodsRepository } from "../ReceivedGoodRepository";
interface Parameters {
  id: string;
}

export const useReceivingGoodsViewContextHooks = () => {
  const { id } = useParams<Parameters>();
  const [goodsReceiptIdSelect, setGoodsReceiptIdSelect] = useState<
    string | null
  >(null);
  const { model, dispatch } = detailService.useModel(GoodsReceipt);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [translate] = useTranslation();

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_procurement"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_receiving_goods"),
        path: RECEIVING_GOODS_ROUTE,
      },
    ];
  }, [translate]);

  // Tab
  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: TabKeyDetailEnum.RECEIVED_INFORMATION,
        tabTitle: translate("RG.tab_detail_received_information"),
        children: <ReceivedInformationDetail />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.SUPPLIER_EVALUATION,
        tabTitle: translate("RG.tab_detail_supplier_evaluation"),
        children: <SupplierEvaluationDetail />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.INTEGRATION,
        tabTitle: translate("RG.tab_detail_intergration"),
        children: <ReceivedGoodsDetailIntergration />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.HISTORY_APPROVAL,
        tabTitle: translate("RG.tab_detail_history_approval"),
        children: <HistoryApprovalDetail />,
        list: undefined,
      },
    ];
  }, [translate]);

  const [filter, dispatchFilter] =
    queryStringService.useQueryString(ReceivingGoodFilter);

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const getDetail = useCallback(() => {
    setLoading(true);
    receivedGoodsRepository
      .getDetail(id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: GoodsReceipt) => {
          dispatch({
            type: GeneralActionEnum.SET,
            payload: { ...response },
          });
        },
        error: (error) => {
          //
        },
      });
  }, [dispatch, id]);

  // Get model detail
  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [getDetail, id]);

  return {
    breadcrumbs,
    model,
    tabRepositories,
    repo,
    handleChangeTab,
    isLoading,
    goodsReceiptIdSelect,
    setGoodsReceiptIdSelect,
  };
};
