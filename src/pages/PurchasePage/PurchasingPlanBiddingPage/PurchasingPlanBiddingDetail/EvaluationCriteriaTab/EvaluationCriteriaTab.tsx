import { type CollapseProps } from "antd";
import { AdvancedCollapseView } from "components";
import Attachments from "components/Attachments/Attachments";
import { fieldService } from "core/services/page-services/field-service";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchasingPlanBiddingDetailHookContext } from "../PurchasingPlanBiddingDetailHook";
import FinancialCriteria from "./Components/FinancialCriteria/FinancialCriteria";
import TechnicalCriteria from "./Components/TechnicalCriteria/TechnicalCriteria";

enum InformationSectionKey {
  TECHNICAL_EVALUATION_CRITERIA,
  FINANCIAL_EVALUATION_CRITERIA,
  ROLE,
  ATTACHMENT,
}

const EvaluationCriteriaTab = () => {
  const [translate] = useTranslation();
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
  const { model, dispatchModel } = currentContext;

  const { handleChangeListField } = fieldService.useField(model, dispatchModel);

  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.TECHNICAL_EVALUATION_CRITERIA,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_technical_competency_assessment_criteria")}
        </div>
      ),
      children: <TechnicalCriteria contextValue={currentContext} />,
    },
    {
      key: InformationSectionKey.FINANCIAL_EVALUATION_CRITERIA,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_financial_evaluation_criteria")}
        </div>
      ),
      children: <FinancialCriteria contextValue={currentContext} />,
    },
    // {
    //   key: InformationSectionKey.ROLE,
    //   label: <div className="fw-bold">{translate("PL.txt_role")}</div>,
    //   children: <Role />,
    // },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: (
        <Attachments
          attachments={model?.evaluationCriteriaAttachments}
          handleUpdate={handleChangeListField({
            fieldName: "evaluationCriteriaAttachments",
          })}
        />
      ),
    },
  ];

  return (
    <div>
      <AdvancedCollapseView
        ghost
        items={collapseItems}
        defaultActiveKey={[
          InformationSectionKey.TECHNICAL_EVALUATION_CRITERIA,
          InformationSectionKey.FINANCIAL_EVALUATION_CRITERIA,
          // InformationSectionKey.ROLE,
          InformationSectionKey.ATTACHMENT,
        ]}
      />
    </div>
  );
};
export default EvaluationCriteriaTab;
