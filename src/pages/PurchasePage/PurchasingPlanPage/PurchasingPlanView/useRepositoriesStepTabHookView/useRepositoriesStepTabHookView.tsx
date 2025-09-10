import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PurchasePlanGenerationInfoTabView from "../../Components/PurchasePlanGenerationInfoTabView/PurchasePlanGenerationInfoTabView";

import _, { isEqual } from "lodash";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import PurchasePlanSupplierTabView from "../../Components/PurchasePlanSupplierTabView/PurchasePlanSupplierTabView";
import SelectSupplierTab from "../../PurchasingPlanDetail/SelectSupplierTab/SelectSupplierTab";

function getLastPath(path: string, idDetail?: string): string {
  const parts = path.split("/");
  if (!_.isEmpty(idDetail)) {
    return "/" + parts[parts.length - 2];
  }
  return "/" + parts[parts.length - 1];
}

const PATH_END_PURCHASING_PLAN_VIEW = "purchase-plan-view";

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
        component: (
          <PurchasePlanSupplierTabView
            isViewMode={true}
            isViewModeDraft={true}
          />
        ),
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
        component: <PurchasePlanSupplierTabView isViewMode={true} />,
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
        component: <SelectSupplierTab isView={true} />,
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
        setTabRepositoriesView(generateTabConfig(chooseSupplierTabs));
        break;
      default:
        setTabRepositoriesView(generateTabConfig(chooseSupplierTabs));
        break;
    }
  }, [step, idDetail]);

  useEffect(() => {
    if (pathname) {
      const pathNameEnd = getLastPath(pathname, idDetail);
      if (!isEqual(pathNameEnd, `/${PATH_END_PURCHASING_PLAN_VIEW}`)) {
        return;
      } else {
        setTabRepositoriesFunc();
      }
    }
  }, [step, pathname]);

  return {
    tabRepositoriesView,
  };
}

export default useRepositoriesStepTabHookView;
