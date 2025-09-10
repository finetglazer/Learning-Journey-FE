import { isEqual } from "lodash";
import { useContext, useMemo } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import { BUDGET_ADJUST_EDIT_ROUTE } from "config/route-const";
import { Budget } from "models/Budget/Budget";
import { StatusBudgetPlan } from "models/CostOwner/BudgetPlan";
import { ConfirmModalType } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useHistory } from "react-router";
import { useAppSelector } from "rtk/useRedux";
import { BudgetAdjust, BudgetAdjustContext } from "../../BudgetAdjustHook";

interface Profile {
  account: {
    email?: string;
    name?: string;
  };
  businessDepartment: {
    name?: string;
  };
}

const GroupActionDetail = () => {
  const { model, handleChangeSingleField, setModelSelected, handleGoMaster } =
    useContext<BudgetAdjust>(BudgetAdjustContext);

  const profile: Profile = useAppSelector((state) => state.profile);

  const [translate] = useTranslation();
  const history = useHistory();

  const isUserCreator = useMemo(() => {
    return isEqual(
      profile?.account?.email?.toLowerCase(),
      model?.user?.email.toLowerCase()
    );
  }, [model?.user?.email, profile.account.email]);

  const onPressEdit = () => {
    history.push(`${BUDGET_ADJUST_EDIT_ROUTE}/${model.id}`);
  };

  const onPressCancel = () => {
    const budget: Budget = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };
    setModelSelected({ type: ConfirmModalType.CANCEL, model: budget });
  };

  const makeOverflowMenu = () => {
    if (isEqual(model?.isReturn, true)) return null;
    const budget: Budget = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };
    const list: ListOverflowMenu[] = [
      {
        title: translate("BG.txt_delete_vote"),
        action: () => {
          setModelSelected({ type: ConfirmModalType.DELETE, model: budget });
        },
        isShow: true,
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  if (isEqual(model?.status, StatusBudgetPlan.DRAFT) && isUserCreator) {
    return (
      <div className="group-action">
        {makeOverflowMenu()}
        {/* Cancel button */}
        <Button type="secondary" size="lg" onClick={onPressCancel}>
          {translate("CM.txt_cancel")}
        </Button>
        {/* Edit button */}
        <Button type="primary" size="lg" onClick={onPressEdit}>
          {translate("CM.txt_update")}
        </Button>
      </div>
    );
  }

  if (
    isEqual(model?.status, StatusBudgetPlan.IN_PROGRESS) &&
    model?.canCancel &&
    isUserCreator
  ) {
    return (
      <div className="group-action">
        <Button type="secondary" size="lg" onClick={onPressCancel}>
          {translate("CM.txt_cancel")}
        </Button>
      </div>
    );
  }

  if (!isEqual(model?.status, StatusBudgetPlan.IN_PROGRESS)) return null;

  return (
    <div className="group-action">
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
