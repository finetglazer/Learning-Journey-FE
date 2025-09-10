import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import _, { isEqual } from "lodash";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import PurchasePlanBiddingGenerationInfoTabView from "../GenerationInfoTab/PurchasePlanBiddingGenerationInfoTabView";
import EvaluationTeamInformationTabView from "../EvaluationTeamInformationTabView/EvaluationTeamInformationTabView";
import RequestForBidTabView from "../RequestForBidTabView/RequestForBidTabView";
import SupplierInfoTabView from "../SupplierInfoTab/SupplierInfoTabView";
import { TabKeyBidder } from "models/PurchasingPlan";

function getLastPath(path: string, idDetail?: string | number): string {
  const parts = path.split("/");
  if (!_.isEmpty(idDetail)) {
    return "/" + parts[parts.length - 2];
  }
  return "/" + parts[parts.length - 1];
}

const PATH_END_PURCHASING_PLAN_VIEW = "purchase-plan-bidding-view";

type Props = {
  idDetail?: string | number;
  pathname?: string;
  step?: number;
};

function useRepositoriesStepTabHookView({
  idDetail,
  step,
  pathname = PATH_END_PURCHASING_PLAN_VIEW,
}: Props) {
  const [translate] = useTranslation();

  const generateTabConfig = useCallback(
    (
      tabs: { key: string; title: string; component: React.ReactNode }[]
    ): RepoStateDetail[] => {
      return tabs.map((tab) => ({
        tabKey: tab.key,
        tabTitle: <TabName text={translate(tab.title)} />,
        children: <>{tab.component}</>,
      }));
    },
    [translate]
  );

  const initializeTabsView = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanBiddingGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTabView isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.bidding.title.request_for_bid",
        component: <RequestForBidTabView isDetail={true} />,
      },
    ],
    []
  );

  const quotationTabsView = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanBiddingGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTabView isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.bidding.title.request_for_bid",
        component: <RequestForBidTabView isDetail={true} />,
      },
    ],
    []
  );

  const chooseSupplierTabs = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanBiddingGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTabView isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.bidding.title.request_for_bid",
        component: <RequestForBidTabView isDetail={true} />,
      },
    ],
    []
  );

  const [tabRepositoriesView, setTabRepositoriesView] =
    useState<RepoStateDetail[]>(null);

  const setTabRepositoriesFunc = useCallback(() => {
    switch (step) {
      case PURCHASING_PLAN_STATUS.DRAFT:
        setTabRepositoriesView(generateTabConfig(initializeTabsView));
        break;
      case PURCHASING_PLAN_STATUS.WAITING_QUOTATION:
      case PURCHASING_PLAN_STATUS.QUOTED:
        setTabRepositoriesView(generateTabConfig(quotationTabsView));
        break;
      default:
        setTabRepositoriesView(generateTabConfig(chooseSupplierTabs));
        break;
    }
  }, [
    step,
    generateTabConfig,
    initializeTabsView,
    quotationTabsView,
    chooseSupplierTabs,
  ]);

  useEffect(() => {
    if (pathname) {
      const pathNameEnd = getLastPath(pathname, idDetail);
      if (!isEqual(pathNameEnd, `/${PATH_END_PURCHASING_PLAN_VIEW}`)) {
        return;
      } else {
        setTabRepositoriesFunc();
      }
    }
  }, [step, pathname, idDetail, setTabRepositoriesFunc]);

  return {
    tabRepositoriesView,
  };
}

export default useRepositoriesStepTabHookView;
