import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PurchasePlanGenerationInfoTabView from "../GenerationInfoTabView/GenerationInfoTabView";

import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import SupplierTab from "../../PurchasingPlanPrincipleDetail/SupplierTab/SupplierTab";

function useRepositoriesStepTabHookView(
  idDetail?: string,
  step = 0,
  pathname?: string
) {
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
    [translate, pathname]
  );

  const draftTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTabView />,
      },
    ],
    []
  );

  const initializeTabsView = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab />,
      },
    ],
    []
  );

  const quotationTabsView = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab />,
      },
    ],
    []
  );

  const chooseSupplierTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab />,
      },
    ],
    []
  );

  const [tabRepositoriesView, setTabRepositoriesView] =
    useState<RepoStateDetail[]>(null);

  const isRouteView = (path: string) => {
    const lastIndexSlash = path.lastIndexOf("/");
    const routeView = path.substring(0, lastIndexSlash);
    return routeView === PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE;
  };

  const setTabRepositoriesFunc = useCallback(() => {
    const mapTabs = new Map([
      [PURCHASING_PLAN_STATUS.DRAFT, draftTabs],
      [PURCHASING_PLAN_STATUS.WAITING_QUOTATION, quotationTabsView],
      [PURCHASING_PLAN_STATUS.QUOTED, quotationTabsView],
      [PURCHASING_PLAN_STATUS.SELECT_SUPPLIER, chooseSupplierTabs],
    ]);

    if (mapTabs.has(step)) {
      setTabRepositoriesView(generateTabConfig(mapTabs.get(step)));
    } else {
      setTabRepositoriesView(generateTabConfig(initializeTabsView));
    }
  }, [
    draftTabs,
    quotationTabsView,
    chooseSupplierTabs,
    step,
    generateTabConfig,
    initializeTabsView,
  ]);

  useEffect(() => {
    if (isRouteView(pathname)) {
      setTabRepositoriesFunc();
    }
  }, [pathname, setTabRepositoriesFunc]);

  return {
    tabRepositoriesView,
  };
}

export default useRepositoriesStepTabHookView;
