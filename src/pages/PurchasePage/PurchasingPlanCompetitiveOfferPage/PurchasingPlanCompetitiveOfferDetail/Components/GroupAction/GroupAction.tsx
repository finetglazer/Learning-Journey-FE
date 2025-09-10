import {
  DeleteIcon,
  IcInfo,
  RejectIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { isEqual } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  ModalConfirm,
  OverflowMenu,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  ButtonType,
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
  PURCHASING_PLAN_STATUS_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../../PurchasingPlanCompetitiveOfferDetailHook";

import { getPurchasingPlanObject } from "pages/PurchasePage/constants";
import { ConfirmApproveModal } from "../ConfirmApproveModal/ConfirmApproveModal";

const GroupAction = () => {
  const currentContext = useContext<PurchasingPlanModel>(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const {
    handleSave,
    model,
    setModelSelected,
    quoteAgainAction,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    isSubmit,
    setIsSubmit,
    handleValidateSaveForm,
  } = currentContext;

  const [translate] = useTranslation();

  const handleOpenSendApproveModal = () => {
    setIsSubmit(true); // Mở modal
  };
  const handleCloseSendApproveModal = () => {
    setIsSubmit(false); // Đóng modal
  };

  const handleOpenModalFollowType = useCallback(
    (type: ConfirmModalType) => {
      setModelSelected({
        type,
        model: getPurchasingPlanObject(model),
      });
    },
    [model, setModelSelected]
  );

  const isShowButtonDraft = isEqual(
    PURCHASING_PLAN_STATUS_OPTIONS.find((item) =>
      isEqual(item?.id, model?.status)
    )?.id,
    PURCHASING_PLAN_STATUS.DRAFT
  )
    ? model?.canSaveDraft
    : true;

  const isShowButtonApproved = isEqual(
    PURCHASING_PLAN_STATUS_OPTIONS.find((item) =>
      isEqual(item?.id, model?.status)
    )?.id,
    PURCHASING_PLAN_STATUS.DRAFT
  )
    ? model?.canWaitingForApprove
    : true;

  // Hàm lấy các action có thể hiển thị
  const getAction = useCallback(
    (model: PurchasingPlanTypeModel) => ({
      canSaveDraft: {
        isShow: isShowButtonDraft,
        icon: <img src={SaveIcon} alt="img" />,
        label: translate("PL.purchasing_plan_btn_save_draft"),
        type: "secondary",
        onClick: () => handleSave(true),
      },
      isShowButtonDraft: {
        isShow: isShowButtonApproved,
        icon: <img src={SendIcon} alt="img" />,
        label: translate("PL.bidding.button.approve"),
        type: "primary",
        onClick: () => handleValidate(),
      },
      canDeclined: {
        isShow: model?.canDeclined,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PL.purchasing_plan_status_declined"),
        type: "secondary",
        onClick: () => handleOpenModalFollowType(ConfirmModalType.REJECT),
      },
      canCancel: {
        isShow: model?.canCancel,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PR.btn_cancel"),
        type: "secondary",
        onClick: () => handleOpenModalFollowType(ConfirmModalType.CANCEL),
      },
      canDelete: {
        isShow: model?.canDelete,
        icon: <img src={DeleteIcon} alt="img" />,
        label: translate("PR.btn_delete"),
        type: "secondary",
        onClick: () => handleOpenModalFollowType(ConfirmModalType.DELETE),
      },
      canRenegotiation: {
        isShow: model?.canRenegotiation,
        icon: <img src={SendIcon} alt="img" />,
        label: translate("PL.select_supplier.button.renegotiation"),
        type: "secondary",
        onClick: () =>
          handleOpenModalFollowType(ConfirmModalType.RENEGOTIATION),
      },
    }),
    [
      handleOpenModalFollowType,
      handleSave,
      isShowButtonApproved,
      isShowButtonDraft,
      translate,
    ]
  );

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  const renderButtonActions = () => {
    if (filteredActions.length < 3) {
      return filteredActions.map((action, idx) => (
        <Button
          key={idx}
          icon={action.icon}
          iconPlace="left"
          type={action.type as ButtonType}
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
              type={action.type as ButtonType}
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

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [getAction, model, translate]);

  const onSave = async () => {
    handleSave(false, true);
  };

  const handleValidate = async () => {
    const isValid = await handleValidateSaveForm(false);
    if (isValid) {
      handleOpenSendApproveModal();
    }
  };

  return (
    <div className="group-action">
      <div className="d-flex gap-2">{renderButtonActions()}</div>

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

      {isSubmit && (
        <ConfirmApproveModal
          onCancel={handleCloseSendApproveModal}
          onSave={onSave}
          currentContext={currentContext}
        />
      )}
    </div>
  );
};

export default GroupAction;
