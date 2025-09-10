import { SaveIcon, SendIcon } from "assets/icons";
import { PaymentCreateModel, PaymentRequestModel } from "models/Payment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import "../../PaymentCreate.scss";
import { ListOverflowMenu } from "../../../../BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { ConfirmModalType } from "../../../../BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { isEmpty } from "lodash";

type GroupActionProps = {
  idDetail?: string;
  handleOpenSigningForm?: () => void;
};
const GroupAction = ({ idDetail, handleOpenSigningForm }: GroupActionProps) => {
  const { translate, handleSave, model, setModelSelected } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const menu = useCallback(
    (modelPayment: PaymentRequestModel) => {
      const list: ListOverflowMenu[] = [
        // Cancel
        {
          title: translate("PM.txt_cancel_vote"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: modelPayment,
            });
          },
          isShow: modelPayment?.canCancel,
        },
        // Delete
        {
          title: translate("PM.txt_delete_vote"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: modelPayment,
            });
          },
          isShow: modelPayment?.canDelete,
        },
      ];

      return <OverflowMenu isActionRowTable={false} list={list} />;
    },
    [translate]
  );

  const [isShowButton, setIsShowButton] = useState({
    canSaveDraft: false,
    canWaitingForApprove: false,
    canDelete: false,
    canCancel: false,
  });

  useEffect(() => {
    setIsShowButton({
      canSaveDraft: model?.canSaveDraft,
      canWaitingForApprove: model?.canWaitingForApprove,
      canDelete: model?.canDelete,
      canCancel: model?.canCancel,
    });
  }, [
    model?.canWaitingForApprove,
    model?.canSaveDraft,
    model?.canDelete,
    model?.canCancel,
  ]);

  return (
    <div className="group-action">
      {!isEmpty(model?.id) &&
      !isEmpty(idDetail) &&
      (isShowButton?.canDelete || isShowButton?.canCancel)
        ? menu(model)
        : null}
      {isShowButton?.canSaveDraft || isEmpty(model?.id) ? (
        <Button
          icon={<img src={SaveIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleSave(true, idDetail)}
        >
          {translate("PM.save_draft")}
        </Button>
      ) : (
        ""
      )}
      {isShowButton?.canWaitingForApprove || isEmpty(model?.id) ? (
        <Button
          icon={<img src={SendIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={() => {
            // Chỗ này vì sau khi lưu nhưng vẫn muốn ở lại màn này và không phải reload nên set cho button saveDraft và waitingForApprove giữ nguyên
            setIsShowButton({
              canSaveDraft: true,
              canWaitingForApprove: true,
              canDelete: model?.canDelete,
              canCancel: model?.canCancel,
            });
            handleSave(true, idDetail, handleOpenSigningForm);
          }}
        >
          {translate("PM.save_and_submit")}
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default GroupAction;
