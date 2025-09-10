import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import AssetInformationView from "pages/SettlementPage/Components/AssetInformationView/AssetInformationView";
import ContractSettlementView from "pages/SettlementPage/Components/ContractSettlementView/ContractSettlementView";
import SettlementInfoView from "pages/SettlementPage/Components/SettlementInfoView/SettlementInfoView";
import SettlementDetailIntergration from "pages/SettlementPage/SettlementDetail/components/IntergarationView/SettlementDetailIntergration";
import SettlementFileTab from "pages/SettlementPage/SettlementDetail/components/SettlementFileTab/SettlementFileTab";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function useRepositoriesTabHookView() {
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

  const settlementTabs = useMemo(
    () => [
      {
        key: "0",
        title: "settlement.settlement_info",
        component: (
          <div className="payment-scroll">
            <SettlementInfoView />
          </div>
        ),
      },
      {
        key: "1",
        title: "settlement.settlement_goodsServices",
        component: <ContractSettlementView />,
      },
      {
        key: "2",
        title: "settlement.property_info",
        component: <AssetInformationView />,
      },
      {
        key: "3",
        title: "settlement.settlement_file",
        component: <SettlementFileTab />,
      },
      {
        key: "5",
        title: "TIA.tab_integrated_asset_management",
        component: <SettlementDetailIntergration />,
      },
    ],
    []
  );

  const memoizedGetTabSettlementRepositories = useCallback(() => {
    return generateTabConfig(settlementTabs);
  }, []);

  const [tabRepositoriesView, setTabRepositoriesView] =
    useState<RepoStateDetail[]>(null);

  useEffect(() => {
    setTabRepositoriesView(memoizedGetTabSettlementRepositories);
  }, []);

  return {
    tabRepositoriesView,
  };
}

export default useRepositoriesTabHookView;
