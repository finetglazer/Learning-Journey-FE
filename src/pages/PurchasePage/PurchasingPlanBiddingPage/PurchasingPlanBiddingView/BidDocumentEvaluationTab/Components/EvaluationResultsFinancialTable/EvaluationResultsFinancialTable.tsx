import React from "react";
import {
  EvaluationGroupResult,
  EvaluationItemResult,
  EvaluationMethod,
  EvaluationResult,
} from "models/PurchasingPlan";
import { useTranslation } from "react-i18next";

import FinancialCapabilityEvaluationGroup from "../FinancialCapabilityEvaluationGroup/FinancialCapabilityEvaluationGroup";
import { AdvancedCollapseView } from "components";

type Props = {
  model?: EvaluationResult;
  data: EvaluationGroupResult[];
  type?: EvaluationMethod;
  isEdit?: boolean;
  handleUpdate?: (
    evaluationGroupResultId: string,
    data: EvaluationItemResult[]
  ) => void;
};

const EvaluationResultsFinancialTable = ({
  data,
  type,
  isEdit,
  handleUpdate,
  model,
}: Props) => {
  const [translate] = useTranslation();

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.txt_financial_competence_evaluation"),
      children: (
        <FinancialCapabilityEvaluationGroup
          data={data || []}
          type={type}
          isEdit={isEdit}
          model={model}
          handleUpdate={handleUpdate}
        />
      ),
    },
  ];

  return (
    <div>
      <AdvancedCollapseView
        items={collapseItems}
        defaultActiveKey={["1"]}
        isFullView
      />
    </div>
  );
};

export default React.memo(EvaluationResultsFinancialTable);
