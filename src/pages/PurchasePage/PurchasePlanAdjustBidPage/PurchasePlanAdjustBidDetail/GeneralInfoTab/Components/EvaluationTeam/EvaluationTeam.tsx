import { AddIcon } from "assets/icons";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import EvaluationTable from "./EvaluationTable";

import { v4 as uuidv4 } from "uuid";
import { isNil, size } from "lodash";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import { useCallback } from "react";

interface EvaluationTeamInformationProps {
  isDetail?: boolean;
  contextValue: PurchasePlanAdjustBidDetailHookContextProps;
}

const EvaluationTeamInformation = (props: EvaluationTeamInformationProps) => {
  const [translate] = useTranslation();
  const { isDetail = false, contextValue } = props;
  const { model, handleChangeSingleField } = contextValue;

  const addNewEvaluator = useCallback(() => {
    if (!model?.evaluationTeamDetails) return;
    const dataClone = [...model.evaluationTeamDetails];
    dataClone.push({
      id: `${uuidv4()}${childText}`,
      isMe: false,
      isActive: true,
      criteriaCount: 0,
      isDraft: true,
    });

    handleChangeSingleField({
      fieldName: "evaluationTeamDetails",
    })(dataClone);
  }, [handleChangeSingleField, model?.evaluationTeamDetails]);

  const isShowAddNewEvaluatorButton = () =>
    !isDetail && !model?.isView && model?.isEdit;

  return (
    <div>
      {(!!isShowAddNewEvaluatorButton() ||
        isNil(isShowAddNewEvaluatorButton())) &&
      size(model?.evaluationTeams) > 0 ? (
        <Button
          iconPlace="left"
          type="secondary"
          icon={<img src={AddIcon} alt="img" width={14} height={14} />}
          onClick={() => {
            addNewEvaluator();
          }}
          className="mb-3"
        >
          {translate("PL.competitive_offer.title.add_reviewer")}
        </Button>
      ) : null}
      <EvaluationTable
        isDetail={isDetail}
        addNewEvaluator={addNewEvaluator}
        contextValue={contextValue}
      />
    </div>
  );
};

export default EvaluationTeamInformation;
