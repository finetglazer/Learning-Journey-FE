import {
  ApproveIcon,
  continueIcon,
  IcInfo,
  RejectIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { isEmpty, isEqual } from "lodash";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  ModalConfirm,
  OverflowMenu,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
  PURCHASING_PLAN_STATUS_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { PurchasingPlanDetailHookContext } from "../../PurchasingPlanDetailHook";

import { getPurchasingPlanObject } from "pages/PurchasePage/constants";

interface GroupActionProps {
  handleOpenDrawerNextRoundBid: () => void;
}

const GroupAction = ({ handleOpenDrawerNextRoundBid }: GroupActionProps) => {
  const {
    isSubmit,
    setIsSubmit,
    handleSave,
    handleValidateCreate,
    model,
    selectSupplierAction,
    setModelSelected,
    quoteAgainAction,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    handleSubmitApproval,
    handleValidateSendApproval,
  } = useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);
  const [translate] = useTranslation();

  const handleOpenModalCancel = () => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: getPurchasingPlanObject(model),
    });
  };

  const isShowButtonDraft =
    isEqual(
      PURCHASING_PLAN_STATUS_OPTIONS.find((item) =>
        isEqual(item?.id, model?.status)
      )?.id,
      PURCHASING_PLAN_STATUS.DRAFT
    ) ||
    isEmpty(
      PURCHASING_PLAN_STATUS_OPTIONS.find((item) =>
        isEqual(item?.id, model?.status)
      )
    );

  // Hàm lấy các action có thể hiển thị
  const getAction = (model: PurchasingPlanTypeModel) => ({
    canSaveDraft: {
      isShow: model?.canSaveDraft,
      icon: <img src={SaveIcon} alt="img" />,
      label: translate("PL.purchasing_plan_btn_save_draft"),
      type: "secondary",
      onClick: () => handleSubmitApproval(true),
    },
    canWaitingForApprove: {
      isShow: model?.canWaitingForApprove,
      icon: <img src={SendIcon} alt="img" />,
      label: translate("PM.save_and_submit"),
      type: "primary",
      onClick: () => handleValidateSendApproval(),
    },
    canQuoted: {
      isShow: model?.canQuoted,
      icon: <img src={continueIcon} alt="img" />,
      label: translate("PL.purchasing_plan_requote"),
      type: "secondary",
      onClick: () => setIsOpenModalQuoteAgain(true),
    },
    canCancel: {
      isShow: model?.canCancel,
      icon: <img src={RejectIcon} alt="img" />,
      label: translate("PR.btn_cancel"),
      type: "secondary",
      onClick: () => handleOpenModalCancel(),
    },
    canRound: {
      isShow: model?.canRound,
      icon: <img src={continueIcon} alt="img" />,
      label: translate("PL.txt_btn_continue"),
      type: "secondary",
      onClick: () => handleOpenDrawerNextRoundBid(),
    },
    canChooseSupplier: {
      isShow: model?.canChooseSupplier,
      icon: <img src={ApproveIcon} alt="img" />,
      label: translate("PL.select_supplier_step_text"),
      type: "primary",
      onClick: () => selectSupplierAction(model),
    },
  });

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [model, translate]);

  const numberOfActions = filteredActions.length;

  const renderButtonActions = () => {
    if (numberOfActions < 4) {
      return filteredActions.map((action, idx) => (
        <Button
          key={idx}
          icon={action.icon}
          iconPlace="left"
          type={action.type as any}
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ));
    } else {
      const firstThree = filteredActions.slice(0, 2);
      const restActions = filteredActions.slice(2);

      const list: ListOverflowMenu[] = restActions.map((item) => ({
        title: item.label,
        action: item.onClick,
        isShow: true,
      }));

      return (
        <>
          {/* Nút OverflowMenu */}
          {list.length > 0 && (
            <OverflowMenu isActionRowTable={false} list={list} />
          )}
          {firstThree.map((action, idx) => (
            <Button
              key={idx}
              icon={action.icon}
              iconPlace="left"
              type={action.type as any}
              size="lg"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </>
      );
    }
  };

  return (
    <div className="group-action">
      {isShowButtonDraft ? (
        <div className="d-flex gap-2">
          <Button
            icon={<img src={SaveIcon} alt="img" />}
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={() => handleSave(true)}
          >
            {translate("PL.purchasing_plan_btn_save_draft")}
          </Button>
          <Button
            icon={<img src={SendIcon} alt="img" />}
            iconPlace="left"
            type="primary"
            size="lg"
            onClick={() => handleValidateCreate(false)}
          >
            {translate("PL.purchasing_plan_btn_submit")}
          </Button>
        </div>
      ) : (
        <div className="d-flex gap-2">{renderButtonActions()}</div>
      )}

      {/* Modal Confirm */}
      {isSubmit && (
        <ModalConfirm
          open={isSubmit}
          icon={<img src={IcInfo} alt="img" width={72} height={72} />}
          title={translate("PL.purchasing_plan_title_modal_confirm_submit")}
          content={translate("PL.purchasing_plan_content_modal_confirm_submit")}
          titleButtonCancel={translate("CM.btn_close")}
          titleButtonApply={translate("CM.btn_confirm")}
          handleSave={() => handleSave(false)}
          handleCancel={() => setIsSubmit(false)}
        />
      )}

      {isOpenModalQuoteAgain && (
        <ModalConfirm
          open={isOpenModalQuoteAgain}
          icon={<img src={IcInfo} alt="img" width={72} height={72} />}
          title={translate("PL.purchasing_plan_confirm_quote_again_title")}
          content={translate("PL.purchasing_plan_confirm_quote_again_content")}
          titleButtonCancel={translate("CM.btn_close")}
          titleButtonApply={translate("CM.btn_confirm")}
          handleSave={() => quoteAgainAction(model)}
          handleCancel={() => setIsOpenModalQuoteAgain(false)}
        />
      )}
    </div>
  );
};

export default GroupAction;
