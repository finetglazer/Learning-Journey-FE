import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";

import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isNil } from "lodash";
import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import ContractsCompleted from "pages/PurchasePage/ProjectSettlement/Components/ContractsCompleted/ContractsCompleted";
import DebtPaymentInformation from "pages/PurchasePage/ProjectSettlement/Components/DebtPaymentInformation/DebtPaymentInformation";
import FinalizedEquipmentServiceCosts from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/SettlementInformationComponents/InvestmentResults/Components/FinalizedEquipmentServiceCosts";
import FinalizedInvestmentCosts from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/SettlementInformationComponents/InvestmentResults/Components/FinalizedInvestmentCosts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../ProjectSettlement/ProjectSettlementPage.module.scss";
import { useProjectSettlementViewContext } from "../../context";
import GeneralInformation from "../SettlementInformationComponents/GeneralInformation";

const SettlementInformation = () => {
  const [translate] = useTranslation();
  const { model } = useProjectSettlementViewContext();
  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("CM.tab_general_information"),
        children: <GeneralInformation />,
      },

      {
        key: TabKey.BUYER,
        label: translate("PS.txt_contracts_completed"),
        children: <ContractsCompleted list={model?.contractSettlements} />,
      },
      {
        key: TabKey.SELLER,
        label: translate("PS.txt_investment_results"),
        children: (
          <div className="d-flex flex-column gap-4">
            <div>
              <span className="d-inline-block font-bold mb-2">
                {translate("PS.txt_table_finalized_investment_costs")}
              </span>
              <FinalizedInvestmentCosts data={model?.investmentCosts} isView />
            </div>
            <div>
              <span className="d-inline-block font-bold mb-2">
                {translate("PS.txt_table_finalized_equipment_service_costs")}
              </span>
              <FinalizedEquipmentServiceCosts
                data={model?.goodsCategoryCosts}
                isView
              />
            </div>
          </div>
        ),
      },
      {
        key: TabKey.COMPONENTS,
        label: translate("PS.txt_debt_and_payment_status"),
        children: <DebtPaymentInformation list={model?.debts} isView />,
      },
    ],
    [
      model?.contractSettlements,
      model?.debts,
      model?.goodsCategoryCosts,
      model?.investmentCosts,
      translate,
    ]
  );

  return (
    <div className={styles["content-container"]}>
      <AdvancedCollapseView items={itemsCollapse} />
      {isNil(model?.id) ? null : (
        <div className="px-3 pb-2">
          <Comments
            isNewLayoutVersion
            topicId={model?.id}
            topicType={TopicType.ProjectSettlement}
          />
        </div>
      )}
    </div>
  );
};

export default SettlementInformation;
