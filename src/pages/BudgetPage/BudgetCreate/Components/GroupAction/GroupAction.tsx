import { SaveIcon, SendIcon } from "assets/icons";
import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty, isEqual } from "lodash";
import { Budget } from "models/Budget/Budget";
import { ConfirmModalType } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useContext, useMemo } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import "../../BudgetCreate.scss";
import { CreateBudget, CreateBudgetContext } from "../../BudgetCreateHook";

interface GroupActionProps {
  isEditable: boolean;
  handleOpenSigningForm?: () => void;
}

interface Profile {
  account: {
    email?: string;
    name?: string;
  };
  businessDepartment: {
    name?: string;
  };
}

const GroupAction = ({
  isEditable,
  handleOpenSigningForm,
}: GroupActionProps) => {
  const { model, handleSave, setModelSelected } =
    useContext<CreateBudget>(CreateBudgetContext);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const [translate] = useTranslation();
  const profile: Profile = useAppSelector((state) => state.profile);

  const isUserCreator = useMemo(() => {
    return isEqual(
      profile?.account?.email?.toLowerCase(),
      model?.user?.email.toLowerCase()
    );
  }, [model?.user?.email, profile.account.email]);

  const onPressSave = () => {
    if (isEmpty(model?.summary)) {
      notifyToast({
        message: translate("BG.message.budget_import"),
        type: "error",
      });
    } else {
      handleSave({
        isDraft: true,
        callbackFc: handleOpenSigningForm,
      });
    }
  };

  const onPressSaveDraft = () => {
    handleSave({
      isDraft: true,
    });
  };

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

  if (!isUserCreator) return null;

  return (
    <div className="group-action">
      {makeOverflowMenu()}
      <Button
        icon={<img src={SaveIcon} alt="img" />}
        iconPlace="left"
        type="secondary"
        size="lg"
        onClick={onPressSaveDraft}
        disabled={model?.loadingFileBudget}
      >
        {translate("BG.save_draft")}
      </Button>
      <Button
        icon={<img src={SendIcon} alt="img" />}
        iconPlace="left"
        type="primary"
        size="lg"
        onClick={onPressSave}
        disabled={model?.loadingFileBudget}
      >
        {translate("BG.save_and_submit")}
      </Button>
    </div>
  );
};

export default GroupAction;
