import { isEmpty } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PurchasePlanGenerationInfoTab from "../GenerationInfoTab/GenerationInfoTab";
import SupplierTab from "../SupplierTab/SupplierTab";

import PurchasePlanPrincipleGenerationInfoTabView from "../../PurchasingPlanPrincipleView/GenerationInfoTabView/GenerationInfoTabView";

function useRepositoriesStepTabHook(
  tabKeyError: number[],
  idDetail?: string,
  step = 0
) {
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
        children: <>{tab.component}</>,
      })),
    [translate]
  );

  const draftTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTab />,
      },
    ],
    []
  );

  const initializeTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTab />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab isDetailPage />,
      },
    ],
    []
  );

  const quotationTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanPrincipleGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab isDetailPage />,
      },
    ],
    []
  );

  const chooseSupplierTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanPrincipleGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <SupplierTab isDetailPage />,
      },
    ],
    []
  );

  const approveSupplier = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanPrincipleGenerationInfoTabView />,
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
      [PURCHASING_PLAN_STATUS.DRAFT, draftTabs],
      [PURCHASING_PLAN_STATUS.WAITING_QUOTATION, quotationTabs],
      [PURCHASING_PLAN_STATUS.SELECT_SUPPLIER, chooseSupplierTabs],
      [PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER, approveSupplier],
    ]);

    if (mapTabs.has(step)) {
      setTabRepositories(generateTabConfig(tabKeyError, mapTabs.get(step)));
    } else {
      setTabRepositories(generateTabConfig(tabKeyError, initializeTabs));
    }
  }, [
    idDetail,
    draftTabs,
    quotationTabs,
    chooseSupplierTabs,
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
