import { RepoStateDetail } from "models/Payment";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContractAdjustmentInfo } from "../../Components/ContractAdjustmentInfo/ContractAdjustmentInfo";
import { ContractAdjustmentInfoView } from "../../Components/ContractAdjustmentInfoView/ContractAdjustmentInfoView";
import styles from "../ContractAdjustmentDetail.module.scss";

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

  const contractAdjustment = useMemo(
    () => [
      {
        key: "0",
        title: "contractAdjustment.txt_information_adjustment",
        component: (
          <div className={styles["scroll"]}>
            <ContractAdjustmentInfo />
          </div>
        ),
      },
    ],
    []
  );

  const contractAdjustmentView = useMemo(
    () => [
      {
        key: "0",
        title: "contractAdjustment.txt_information_adjustment",
        component: (
          <div className={styles["scroll"]}>
            <ContractAdjustmentInfoView />
          </div>
        ),
      },
    ],
    []
  );

  const memoizedGetTabSettlementRepositories = useCallback(() => {
    if (isView) {
      return generateTabConfig(tabKeyError, contractAdjustmentView);
    }
    return generateTabConfig(tabKeyError, contractAdjustment);
  }, [
    isView,
    generateTabConfig,
    tabKeyError,
    contractAdjustment,
    contractAdjustmentView,
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
