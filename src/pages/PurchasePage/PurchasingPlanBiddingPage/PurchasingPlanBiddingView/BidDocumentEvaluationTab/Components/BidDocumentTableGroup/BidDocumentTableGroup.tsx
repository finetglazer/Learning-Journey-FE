import { useTranslation } from "react-i18next";

import {
  FinancialProfile,
  TechnicalCompetencyProfile,
} from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import BidProfileTable from "../BidProfileTable/BidProfileTable";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";

type Props = {
  technicalCompetencyProfiles: TechnicalCompetencyProfile[];
  financialProfiles: FinancialProfile[];
  handleViewQuote?: () => void;
};

enum CollapseKey {
  TechnicalProfile = "TechnicalProfile",
  FinancialProfile = "FinancialProfile",
}

const SupplierDocumentTableGroup = ({
  technicalCompetencyProfiles,
  financialProfiles,
  handleViewQuote,
}: Props) => {
  const [translate] = useTranslation();

  const { isTechnicalView } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const collapseItems = [
    {
      key: CollapseKey.TechnicalProfile,
      label: translate("PL.txt_technical_profile"),
      children: (
        <BidProfileTable
          data={technicalCompetencyProfiles}
          handleViewQuote={handleViewQuote}
        />
      ),
    },
  ];

  if (!isTechnicalView) {
    collapseItems.push({
      key: CollapseKey.FinancialProfile,
      label: translate("PL.bidding.title.financial_profile"),
      children: (
        <BidProfileTable
          data={financialProfiles}
          handleViewQuote={handleViewQuote}
        />
      ),
    });
  }

  return (
    <div>
      <AdvancedCollapseView
        items={collapseItems}
        defaultActiveKey={Object.values(CollapseKey)}
        isFullView
      />
    </div>
  );
};

export default SupplierDocumentTableGroup;
