import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ContractTerminationInfo from "../Components/ContractTerminationInfo/ContractTerminationInfo";
import ContractTerminationFileTab from "../ContractTerminationDetail/Components/ContractTerminationFile/ContractTerminationFileTab";
import ContractTerminationInfoView from "../ContractTerminationView/ContractTerminationInfoView/ContractTerminationInfoView";

function useRepositoriesTabHook(tabKeyError: number[], isView: boolean) {
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

  const contractTermination = useMemo(
    () => [
      {
        key: "0",
        title: "contractTermination.title",
        component: (
          <div className="payment-scroll">
            <ContractTerminationInfo />
          </div>
        ),
      },
      {
        key: "1",
        title: "contractTermination.liquidation_file",
        component: <ContractTerminationFileTab />,
      },
    ],
    []
  );

  const contractTerminationView = useMemo(
    () => [
      {
        key: "0",
        title: "contractTermination.title",
        component: (
          <div className="payment-scroll">
            <ContractTerminationInfoView />
          </div>
        ),
      },
      {
        key: "1",
        title: "contractTermination.liquidation_file",
        component: <ContractTerminationFileTab />,
      },
    ],
    []
  );

  const memoizedGetTabSettlementRepositories = useCallback(() => {
    if (isView) {
      return generateTabConfig(tabKeyError, contractTerminationView);
    }
    return generateTabConfig(tabKeyError, contractTermination);
  }, [
    isView,
    generateTabConfig,
    tabKeyError,
    contractTermination,
    contractTerminationView,
  ]);

  const tabRepositories = useMemo(
    () => memoizedGetTabSettlementRepositories(),
    [memoizedGetTabSettlementRepositories]
  );

  return {
    tabRepositories,
  };
}

export default useRepositoriesTabHook;
