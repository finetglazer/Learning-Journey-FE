import { isEmpty } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PurchasePlanGenerationInfoTabView from "../../Components/PurchasePlanGenerationInfoTabView/PurchasePlanGenerationInfoTabView";
import PurchasePlanGenerationInfoTab from "../PurchasePlanGenerationInfoTab/PurchasePlanGenerationInfoTab";
import PurchasingPlanSupplierTab from "../PurchasingPlanSupplierTab/PurchasingPlanSupplierTab";

import PurchasePlanSupplierTabView from "../../Components/PurchasePlanSupplierTabView/PurchasePlanSupplierTabView";
import SelectSupplierTab from "../SelectSupplierTab/SelectSupplierTab";
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
        component: <PurchasingPlanSupplierTab />,
      },
    ],
    []
  );

  const quotationTabs = useMemo(
    () => [
      {
        key: "0",
        title: "PL.purchasing_plan_general_information_tab",
        component: <PurchasePlanGenerationInfoTabView />,
      },
      {
        key: "1",
        title: "PL.purchasing_plan_supplier_tab",
        component: <PurchasePlanSupplierTabView />,
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
    switch (step) {
      case PURCHASING_PLAN_STATUS.DRAFT:
        setTabRepositories(generateTabConfig(tabKeyError, initializeTabs));
        break;
      case PURCHASING_PLAN_STATUS.WAITING_QUOTATION:
        setTabRepositories(generateTabConfig(tabKeyError, quotationTabs));
        break;
      case PURCHASING_PLAN_STATUS.SELECT_SUPPLIER:
        setTabRepositories(generateTabConfig(tabKeyError, chooseSupplierTabs));
        break;
      default:
        setTabRepositories(generateTabConfig(tabKeyError, quotationTabs));
        break;
    }
  }, [tabKeyError, step, idDetail]);

  useEffect(() => {
    setTabRepositoriesFunc();
  }, [tabKeyError, step]);

  return {
    tabRepositories,
  };
}

export default useRepositoriesStepTabHook;
