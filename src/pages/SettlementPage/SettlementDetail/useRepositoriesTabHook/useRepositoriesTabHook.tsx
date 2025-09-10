import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SettlementInfo from "../../Components/SettlementInfo/SettlementInfo";
import ContractSettlementInfo from "pages/SettlementPage/Components/ContractSettlementInfo/ContractSettlementInfo";
import AssetInformation from "pages/SettlementPage/Components/AssetInformation/AssetInformation";
import SettlementFileTab from "../components/SettlementFileTab/SettlementFileTab";

function useRepositoriesTabHook(tabKeyError: number[]) {
  const [translate] = useTranslation();

  const generateTabConfig = useCallback(
    (
      tabKeyError: number[],
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
            <SettlementInfo />
          </div>
        ),
      },
      {
        key: "1",
        title: "settlement.settlement_goodsServices",
        component: <ContractSettlementInfo />,
      },
      {
        key: "2",
        title: "settlement.property_info",
        component: <AssetInformation />,
      },
      {
        key: "3",
        title: "settlement.settlement_file",
        component: <SettlementFileTab />,
      },
    ],
    []
  );

  const memoizedGetTabSettlementRepositories = useCallback(() => {
    return generateTabConfig(tabKeyError, settlementTabs);
  }, [tabKeyError]);

  const [tabRepositories, setTabRepositories] =
    useState<RepoStateDetail[]>(null);

  useEffect(() => {
    setTabRepositories(memoizedGetTabSettlementRepositories);
  }, [tabKeyError]);

  return {
    tabRepositories,
  };
}

export default useRepositoriesTabHook;
