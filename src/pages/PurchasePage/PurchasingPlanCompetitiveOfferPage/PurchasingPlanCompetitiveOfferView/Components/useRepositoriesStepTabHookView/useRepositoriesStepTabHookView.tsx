import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import _, { isEqual } from "lodash";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import PurchasePlanCompetitiveOfferGenerationInfoTabView from "../GenerationInfoTab/GenerationInfoTab";

import { TabKeyBidder } from "models/PurchasingPlan";
import SelectSupplierTab from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/SelectSupplierTab/SelectSupplierTab";
import SupplierInfoTab from "../../../PurchasingPlanCompetitiveOfferDetail/SupplierInfoTab/SupplierInfoTab";
import OfferRequestTabView from "../OfferRequestTabView/OfferRequestTabView";
import styles from "./useRepositoriesStepTabHookView.module.scss";
import EvaluationTeamInformationTabView from "../EvaluationTeamInformationTabView/EvaluationTeamInformationTabView";
function getLastPath(path: string, idDetail?: string | number): string {
  const parts = path.split("/");
  if (!_.isEmpty(idDetail)) {
    return "/" + parts[parts.length - 2];
  }
  return "/" + parts[parts.length - 1];
}

const PATH_END_PURCHASING_PLAN_VIEW = "purchase-plan-competitive-offer-view";

type Props = {
  idDetail?: string | number;
  tabKeyError: number[];
  pathname?: string;
  step?: number;
};

function useRepositoriesStepTabHookView({
  idDetail,
  step,
  pathname = PATH_END_PURCHASING_PLAN_VIEW,
  tabKeyError,
}: Props) {
  const [translate] = useTranslation();

  const generateTabConfig = useCallback(
    (
      tabs: { key: string; title: string; component: React.ReactNode }[]
    ): RepoStateDetail[] => {
      return tabs.map((tab) => ({
        tabKey: tab.key,
        tabTitle: (
          <TabName
            text={translate(tab.title)}
            isShowIconError={tabKeyError?.includes(parseInt(tab.key))}
          />
        ),
        children: <div className={styles.scroll}>{tab.component}</div>,
      }));
    },
    [tabKeyError, translate]
  );

  const initializeTabsView = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanCompetitiveOfferGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTabView isDetail={true} />,
      },
    ],
    []
  );

  const quotationTabsView = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanCompetitiveOfferGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTabView isDetail={true} />,
      },
    ],
    []
  );

  const chooseSupplierTabs = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanCompetitiveOfferGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTabView isDetail={true} />,
      },
      {
        key: TabKeyBidder.SelectSupplier,
        title: "PL.txt_prioritize_supplier",
        component: <SelectSupplierTab />,
      },
    ],
    []
  );

  const otherTabs = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanCompetitiveOfferGenerationInfoTabView />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTabView />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTabView isDetail={true} />,
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
      case PURCHASING_PLAN_STATUS.SELECT_SUPPLIER:
      case PURCHASING_PLAN_STATUS.WAITING_FOR_APPROVAL:
      case PURCHASING_PLAN_STATUS.APPROVED:
        setTabRepositoriesView(generateTabConfig(chooseSupplierTabs));
        break;
      default:
        setTabRepositoriesView(generateTabConfig(otherTabs));
        break;
    }
  }, [
    step,
    generateTabConfig,
    initializeTabsView,
    quotationTabsView,
    chooseSupplierTabs,
    otherTabs,
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
