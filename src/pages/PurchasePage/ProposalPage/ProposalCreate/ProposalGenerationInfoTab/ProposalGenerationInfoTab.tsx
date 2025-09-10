import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isEmpty, isUndefined } from "lodash";
import { ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ProposalCreateHookContext } from "../ProposalCreateHook";
import Base from "./Components/Base/Base";
import BasicInformation from "./Components/BasicInformation/BasicInformation";
import ProposedBasis from "./Components/ProposedBasis/ProposedBasis";
import "./ProposalGenerationInfoTab.scss";

interface ProposalGenerationInfoTabProps {
  topicId?: string;
}

const ProposalGenerationInfoTab = ({
  topicId,
}: ProposalGenerationInfoTabProps) => {
  const [translate] = useTranslation();
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const topicType = model?.isAdjust
    ? TopicType.PurchaseProposalAdjustment
    : TopicType.PurchaseProposal;

  return (
    <div className="proposal_generation_info_tab">
      <BasicInformation />
      <Base />
      <ProposedBasis
        title={translate("PP.proposal_basis")}
        formEdit={[
          {
            fieldName: "actualSituation",
            title: translate("PP.current_status"),
          },
          {
            fieldName: "necessity",
            title: translate("PP.investment_necessity"),
          },
          {
            fieldName: "assessment",

            title: translate("PP.feasibility_assessment"),
          },
        ]}
      />
      <ProposedBasis
        title={translate("PP.expected_investment_effectiveness")}
        formEdit={[
          {
            fieldName: "financialEffectiveness",
            title: translate("PP.financial_effectiveness"),
          },
          {
            fieldName: "nonFinancialEffectiveness",
            title: translate("PP.non_financial_effectiveness"),
          },
        ]}
      />

      <div className="proposal_generation_info_tab__comment">
        {!isEmpty(topicId) && !isUndefined(model?.isAdjust) && (
          <Comments topicType={topicType} topicId={topicId} />
        )}
      </div>
    </div>
  );
};

export default ProposalGenerationInfoTab;
