import { AddIcon } from "assets/icons";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import EvaluationTable from "./EvaluationTable";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../../PurchasingPlanCompetitiveOfferDetailHook";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { isNil, size } from "lodash";

const EvaluationTeamInformation = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext<PurchasingPlanModel>(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const addNewEvaluator = () => {
    handleChangeSingleField({
      fieldName: "evaluationTeams",
    })([
      ...(model?.evaluationTeams || []),
      {
        id: uuidv4(),
        isMe: false,
        criteriaCount: 0,
      },
    ]);
  };

  const isShowAddNewEvaluatorButton = () => !model?.isView && model?.isEdit;

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
      <EvaluationTable addNewEvaluator={addNewEvaluator} />
    </div>
  );
};

export default EvaluationTeamInformation;
