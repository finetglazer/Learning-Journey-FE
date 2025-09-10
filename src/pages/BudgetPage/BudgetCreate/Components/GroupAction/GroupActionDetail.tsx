import { DeleteIcon, EditIcon, RejectIcon } from "assets/icons";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  BUDGET_EDIT_ROUTE,
  BUDGET_EDIT_SETTLEMENT_ROUTE,
} from "config/route-const";
import { Budget } from "models/Budget/Budget";
import { ConfirmModalType } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { BudgetType } from "pages/BudgetPage/BudgetMaster/BudgetMasterHook";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import "../../BudgetCreate.scss";
import { CreateBudget, CreateBudgetContext } from "../../BudgetCreateHook";
import { isEqual } from "lodash";

const GroupActionDetail = () => {
  const { model, handleChangeSingleField, setModelSelected, handleGoMaster } =
    useContext<CreateBudget>(CreateBudgetContext);

  const [translate] = useTranslation();
  const history = useHistory();

  const onPressEdit = () => {
    const { type } = model;
    let routerPath = "";
    switch (type) {
      case BudgetType.Create:
        routerPath = BUDGET_EDIT_ROUTE;
        break;
      case BudgetType.Settlement:
        routerPath = BUDGET_EDIT_SETTLEMENT_ROUTE;
        break;
      default:
        return;
    }

    history.push(`${routerPath}/${model.id}`);
  };

  const onPressCancel = () => {
    const budget: Budget = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };
    setModelSelected({ type: ConfirmModalType.CANCEL, model: budget });
  };

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  return (
    <div className="group-action">
      {model?.canCancel && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onPressCancel}
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}
      {model?.canDelete && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: {
                id: model?.id,
                code: model?.code,
                type: model?.type,
              },
            })
          }
        >
          {translate("CM.txt_delete")}
        </Button>
      )}
      {model?.canEdit && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={onPressEdit}
        >
          {translate("PR.btn_edit")}
        </Button>
      )}
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={budgetRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_budget")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />
    </div>
  );
};

export default GroupActionDetail;
