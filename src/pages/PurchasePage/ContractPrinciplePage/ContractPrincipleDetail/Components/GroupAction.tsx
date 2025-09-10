import { RejectIcon, SaveIcon, SendIcon } from "assets/icons";
import { isEmpty } from "lodash";
import { ContractDetailModel } from "models/Contract";
import { ContractPrinciple } from "models/ContractPrinciple";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ConfirmModalType } from "../../ContractPrincipleMaster/ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";
type GroupActionProps = {
  handleOpenSigningForm?: () => void;
};
const GroupAction = ({ handleOpenSigningForm }: GroupActionProps) => {
  const { model, handleSave, setSelectedModal } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  const [translate] = useTranslation();
  const [isShowButton, setIsShowButton] = useState({
    canDelete: false,
    canCancel: false,
  });
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

  const menu = useCallback(
    (modelContractPrinciple: ContractPrinciple) => {
      const list: ListOverflowMenu[] = [
        // Cancel
        {
          title: translate("PL.txt_cancel_vote"),
          action: () => {
            setSelectedModal({
              type: ConfirmModalType.CANCEL,
              model: modelContractPrinciple,
            });
          },
          isShow: modelContractPrinciple?.canCancel,
        },
        // Delete
        {
          title: translate("PL.txt_delete_vote"),
          action: () => {
            setSelectedModal({
              type: ConfirmModalType.DELETE,
              model: modelContractPrinciple,
            });
          },
          isShow: modelContractPrinciple?.canDelete,
        },
      ];

      return <OverflowMenu isActionRowTable={false} list={list} />;
    },
    [translate]
  );

  useEffect(() => {
    setIsShowButton({
      canDelete: model?.canDelete,
      canCancel: model?.canCancel,
    });
  }, [model?.canDelete, model?.canCancel]);

  return (
    <>
      <div className="group-action">
        {!isEmpty(model?.id) &&
        isShowButton?.canDelete &&
        isShowButton?.canCancel &&
        !model?.isReturn
          ? menu(model)
          : null}
        {model?.isReturn && (
          <Button
            icon={<img src={RejectIcon} alt="img" />}
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={() =>
              setSelectedModal({
                type: ConfirmModalType.CANCEL,
                model,
              })
            }
          >
            {translate("PR.btn_cancel")}
          </Button>
        )}
        <Button
          icon={<img src={SaveIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onPressSaveDraft}
          disabled={model?.loading}
        >
          {translate("BG.save_draft")}
        </Button>
        <Button
          icon={<img src={SendIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={onPressSave}
          disabled={model?.loading}
        >
          {translate("PP.submit_for_approval")}
        </Button>
      </div>
    </>
  );
};

export default GroupAction;
