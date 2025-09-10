import { useMemo } from "react";
import styles from "./ClauseContractPrincipleAppendix.module.scss";
import { useTranslation } from "react-i18next";
import ContractAppendixClause from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/Tabs/ClauseContractPrincipleAppendix/Components/ContractAppendixClause";
import { AdvancedCollapseView } from "components";

const ClauseContractPrincipleAppendixTab = () => {
  const [translate] = useTranslation();

  const items = useMemo(() => {
    return [
      {
        key: "1",
        label: translate("CPA.tab.terms"),
        children: <ContractAppendixClause />,
      },
    ];
  }, [translate]);
  return (
    <>
      <AdvancedCollapseView
        items={items}
        className={styles["clause_contract_principle_appendix_tab"]}
      />
    </>
  );
};

export default ClauseContractPrincipleAppendixTab;
