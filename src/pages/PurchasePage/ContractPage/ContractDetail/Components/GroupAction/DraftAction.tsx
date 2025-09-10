import { DeleteIcon, RejectIcon, SaveIcon, SendIcon } from "assets/icons";
import { useContext } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ListOverflowMenu } from "pages/DashboardPage/DashboardPage";
type GroupActionProps = {
  handleOpenSigningForm?: () => void;
};
const ContractDetailDraftAction = ({
  handleOpenSigningForm,
}: GroupActionProps) => {
  const { handleSave, loading, model, handleUpdateTypeModal } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  const { canCancel, canDelete } = model;

  const [translate] = useTranslation();

  const onPressSave = () => {
    handleSave({
      isDraft: true,
      callbackFc: handleOpenSigningForm,
    });
  };

  const onPressSaveDraft = () => {
    handleSave({
      isDraft: true,
    });
  };

  const onCancelContract = () => {
    handleUpdateTypeModal(ModelConfirmType.CANCEL);
  };

  const onDeleteContract = () => {
    handleUpdateTypeModal(ModelConfirmType.DELETE);
  };

  const renderRowButton = () => {
    return (
      <>
        {canDelete && (
          <Button
            icon={<img src={DeleteIcon} alt="img" />}
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={onDeleteContract}
          >
            {translate("PR.btn_delete")}
          </Button>
        )}
        {canCancel && (
          <Button
            icon={<img src={RejectIcon} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={onCancelContract}
            size="lg"
          >
            {translate("PR.btn_cancel")}
          </Button>
        )}
      </>
    );
  };

  const makeOverflowMenu = () => {
    const list: ListOverflowMenu[] = [
      {
        title: translate("PR.btn_delete"),
        action: onDeleteContract,
        isShow: true,
      },
      {
        title: translate("PR.btn_cancel"),
        action: onCancelContract,
        isShow: true,
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  const isShowOverFlow = canDelete && canCancel;

  return (
    <>
      {isShowOverFlow ? makeOverflowMenu() : renderRowButton()}
      <Button
        icon={<img src={SaveIcon} alt="img" />}
        iconPlace="left"
        type="secondary"
        size="lg"
        onClick={onPressSaveDraft}
        disabled={loading}
      >
        {translate("BG.save_draft")}
      </Button>
      <Button
        icon={<img src={SendIcon} alt="img" />}
        iconPlace="left"
        type="primary"
        size="lg"
        onClick={onPressSave}
        disabled={loading}
      >
        {translate("PP.submit_for_approval")}
      </Button>
    </>
  );
};

export default ContractDetailDraftAction;
