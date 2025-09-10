import { isEmpty } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import GenerationInfoTab from "../GenerationInfoTab/GenerationInfoTab";
import OfferRequestTab from "../OfferRequestTab/OfferRequestTab";
import { TabKeyBidder } from "models/PurchasingPlan";
import EvaluationTeamInformationTab from "../EvaluationTeamInformationTab/EvaluationTeamInformationTab";
import SupplierInfoTab from "../SupplierInfoTab/SupplierInfoTab";
import styles from "./useRepositoriesStepTabHook.module.scss";
import SelectSupplierTab from "../SelectSupplierTab/SelectSupplierTab";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../PurchasingPlanCompetitiveOfferDetailHook";

function useRepositoriesStepTabHook(
  tabKeyError: number[],
  idDetail?: string,
  step = 0
) {
  const contextValue = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const [translate] = useTranslation();

  const generateTabConfig = useCallback(
    (
      tabKeyError: number[],
      tabs: { key: string; title: string; component: React.ReactNode }[]
    ): RepoStateDetail[] =>
      tabs.map((tab) => ({
        tabKey: tab.key,
        tabTitle: (
          <TabName
            text={translate(tab.title)}
            isShowIconError={tabKeyError?.includes(parseInt(tab.key))}
          />
        ),
        children: <div className={styles["scroll"]}>{tab.component}</div>,
      })),
    [translate]
  );

  const initializeTabs = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <GenerationInfoTab />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTab />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTab />,
      },
    ],
    []
  );

  const approveSupplier = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <GenerationInfoTab />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTab />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTab />,
      },
    ],
    []
  );

  const selectSupplierTabs = useMemo(
    () => [
      {
        key: TabKeyBidder.GenerationInfo,
        title: "PL.purchasing_plan_general_information_tab",
        component: <GenerationInfoTab />,
      },
      {
        key: TabKeyBidder.SupplierInfo,
        title: "PL.purchasing_plan_supplier_information",
        component: <SupplierInfoTab isDetail={true} />,
      },
      {
        key: TabKeyBidder.EvaluationTeamInformation,
        title: "PL.competitive_offer.title.evaluation_team_information",
        component: <EvaluationTeamInformationTab />,
      },
      {
        key: TabKeyBidder.RequestForBid,
        title: "PL.competitive_offer.title.request_offer",
        component: <OfferRequestTab />,
      },
      {
        key: TabKeyBidder.SelectSupplier,
        title: "PL.txt_prioritize_supplier",
        component: <SelectSupplierTab />,
      },
    ],
    []
  );

  const [tabRepositories, setTabRepositories] =
    useState<RepoStateDetail[]>(null);

  const setTabRepositoriesFunc = useCallback(() => {
    if (isEmpty(idDetail)) {
      setTabRepositories(generateTabConfig(tabKeyError, initializeTabs));
      return;
    }

    const mapTabs = new Map([
      [PURCHASING_PLAN_STATUS.DRAFT, initializeTabs],
      [PURCHASING_PLAN_STATUS.SELECT_SUPPLIER, selectSupplierTabs],
      [PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER, approveSupplier],
    ]);

    if (mapTabs.has(step)) {
      setTabRepositories(generateTabConfig(tabKeyError, mapTabs.get(step)));
    } else {
      setTabRepositories(generateTabConfig(tabKeyError, initializeTabs));
    }
  }, [
    idDetail,
    selectSupplierTabs,
    approveSupplier,
    step,
    generateTabConfig,
    tabKeyError,
    initializeTabs,
  ]);

  useEffect(() => {
    setTabRepositoriesFunc();
  }, [tabKeyError, step, setTabRepositoriesFunc]);

  return {
    tabRepositories,
  };
}

export default useRepositoriesStepTabHook;
