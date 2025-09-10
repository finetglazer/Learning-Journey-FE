import React from "react";
import {
  EvaluationGroupResult,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useTranslation } from "react-i18next";

import TechnicalCapabilityEvaluationGroup from "../TechnicalCapabilityEvaluationGroup/TechnicalCapabilityEvaluationGroup";
import { AdvancedCollapseView } from "components";

type Props = {
  model?: EvaluationResult;
  data: EvaluationGroupResult[];
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (
    evaluationGroupResultId: string,
    data: EvaluationItemResult[]
  ) => void;
};

const EvaluationResultsTechnicalTable = ({
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
      label: translate("PL.txt_technical_competence_evaluation"),
      children: (
        <TechnicalCapabilityEvaluationGroup
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

export default React.memo(EvaluationResultsTechnicalTable);
