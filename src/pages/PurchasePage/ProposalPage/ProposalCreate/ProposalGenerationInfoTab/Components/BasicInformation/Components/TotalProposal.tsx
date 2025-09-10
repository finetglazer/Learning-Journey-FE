import { Col, Row } from "antd";
import { addNumbers, formatNumber } from "core/helpers/number";
import { VND_CURRENCY } from "models/Payment";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext } from "react";
import { InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "../BasicInformation.scss";

const TotalProposal = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const originalProposalValue = addNumbers(
    model.originalTotalContingencyAmount,
    model.originalTotalEstimateAmount
  );
  const adjustedProposalValue = addNumbers(
    model.totalEstimateAmount,
    model.totalContingencyAmount
  );
  const difference = addNumbers(adjustedProposalValue, -originalProposalValue);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <InputText
          label={translate("PP.original_proposalValue")}
          isSmall={false}
          value={formatNumber(originalProposalValue)}
          readOnly
          suffix={model?.currency?.code}
        />
      </Col>
      <Col span={8}>
        <InputText
          label={translate("PP.adjusted_proposalValue")}
          isSmall={false}
          value={formatNumber(adjustedProposalValue)}
          readOnly
          suffix={model?.currency?.code}
        />
      </Col>
      <Col span={8}>
        <InputText
          label={translate("PP.difference")}
          isSmall={false}
          value={
            difference >= 0
              ? `+ ${formatNumber(difference)}`
              : `${formatNumber(Math.abs(difference))}`
          }
          readOnly
          suffix={model?.currency?.code}
          className={difference >= 0 ? "text__green" : "text__red"}
        />
      </Col>
    </Row>
  );
};

export default TotalProposal;
