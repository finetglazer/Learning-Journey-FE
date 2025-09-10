import { SaveIcon, SendIcon } from "assets/icons";
import { isEqual } from "lodash";
import { Budget } from "models/Budget/Budget";
import { ConfirmModalType } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useContext } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  BudgetSettlementContext,
  BudgetSettlementCreate,
} from "../BudgetSettlementCreateHook";

interface GroupActionProps {
  isEditable: boolean;
  handleOpenSigningForm: () => void;
}

export const GroupAction = ({
  isEditable,
  handleOpenSigningForm,
}: GroupActionProps) => {
  const [translate] = useTranslation();
  const { saveDraft, saveAndSend, setModelSelected, model } =
    useContext<BudgetSettlementCreate>(BudgetSettlementContext);

  const makeOverflowMenu = () => {
    if (!isEditable) return null;
    const DRAFT_STATUS = 0;
    const isDraft = isEqual(model?.status, DRAFT_STATUS);
    const budget: Budget = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };

    const list: ListOverflowMenu[] = [
      {
        title: translate("BG.txt_cancel_vote"),
        action: () => {
          setModelSelected({ type: ConfirmModalType.CANCEL, model: budget });
        },
        isShow: isDraft,
      },
      {
        title: translate("BG.txt_delete_vote"),
        action: () => {
          setModelSelected({ type: ConfirmModalType.DELETE, model: budget });
        },
        isShow: isDraft && isEqual(model?.isReturn, false),
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  return (
    <div className="group-action">
      {makeOverflowMenu()}
      <Button
        icon={<img src={SaveIcon} alt="img" />}
        iconPlace="left"
        type="secondary"
        size="lg"
        onClick={saveDraft}
      >
        {translate("BG.save_draft")}
      </Button>
      <Button
        icon={<img src={SendIcon} alt="img" />}
        iconPlace="left"
        type="primary"
        size="lg"
        onClick={() => saveAndSend(true, handleOpenSigningForm)}
      >
        {translate("BG.save_and_submit")}
      </Button>
    </div>
  );
};
