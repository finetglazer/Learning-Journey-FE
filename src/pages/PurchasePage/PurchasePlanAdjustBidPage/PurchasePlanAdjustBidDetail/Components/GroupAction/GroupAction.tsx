import { RejectIcon, SaveIcon, SendIcon } from "assets/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchasePlanAdjustBidDetailHookContext } from "../../PurchasePlanAdjustBidDetailHook";
import {
  ConfirmModalType,
  PurchasingPlanBidSendApproveModal,
} from "../PurchasingPlanBidSendApproveModal";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { PurchasePlanBidModel } from "models/PurchasingPlan";
import { isEmpty } from "lodash";

const GroupAction = () => {
  const { model, handleSave, handleValidateSaveForm, setModelSelected } =
    useContext(PurchasePlanAdjustBidDetailHookContext);
  const [translate] = useTranslation();
  const [isModalSendApproveOpen, setIsModalSendApproveOpen] = useState(false);
  const [isShowButton, setIsShowButton] = useState({
    canDelete: false,
    canCancel: false,
  });

  const menu = useCallback(
    (model: PurchasePlanBidModel) => {
      const list: ListOverflowMenu[] = [
        // Cancel
        {
          title: translate("PL.txt_cancel_vote"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model,
            });
          },
          isShow: model?.canCancel,
        },
        // Delete
        {
          title: translate("PL.txt_delete_vote"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model,
            });
          },
          isShow: model?.canDelete,
        },
      ];

      return <OverflowMenu isActionRowTable={false} list={list} />;
    },
    [setModelSelected, translate]
  );

  const handleCheckValidateBeforeSubmit = useCallback(async () => {
    const isValid = await handleValidateSaveForm(false);
    if (isValid) {
      setIsModalSendApproveOpen(true);
    }
  }, [handleValidateSaveForm]);

  useEffect(() => {
    setIsShowButton({
      canDelete: model?.canDelete,
      canCancel: model?.canCancel,
    });
  }, [model?.canDelete, model?.canCancel]);

  return (
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
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model,
            })
          }
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}
      {/* Lưu nháp */}
      <Button
        icon={<img src={SaveIcon} alt="img" />}
        iconPlace="left"
        type="secondary"
        size="lg"
        onClick={() => {
          handleSave(true);
        }}
      >
        {translate("PL.purchasing_plan_btn_save_draft")}
      </Button>
      {/* Gửi duyệt */}
      <Button
        icon={<img src={SendIcon} alt="img" />}
        iconPlace="left"
        type="primary"
        size="lg"
        onClick={handleCheckValidateBeforeSubmit}
      >
        {translate("PL.bidding.button.approve")}
      </Button>
      {isModalSendApproveOpen && (
        <PurchasingPlanBidSendApproveModal
          isLoading={false}
          onCancel={() => setIsModalSendApproveOpen(false)}
          onApply={() => handleSave(false)}
        />
      )}
    </div>
  );
};

export default GroupAction;
