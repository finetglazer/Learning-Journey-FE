import {
  ApproveIcon,
  ArrowLeftWhiteIcon,
  IcInfo,
  RejectIcon,
  SaveIcon,
} from "assets/icons";
import { isEmpty, isEqual } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  ModalConfirm,
  OverflowMenu,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  ButtonType,
  PurchasingPlan,
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
  PURCHASING_PLAN_STATUS_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { PurchasingPlanPrincipleDetailHookContext } from "../../PurchasingPlanPrincipleDetailHook";

const GroupAction = ({
  handleOpenSigningForm,
}: {
  handleOpenSigningForm: () => void;
}) => {
  const {
    handleSave,
    model,
    setModelSelected,
    quoteAgainAction,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    handleSubmitApproval,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);
  const [translate] = useTranslation();

  const getPurchasingPlanObject = (model: PurchasingPlanTypeModel) => {
    const purchasingPlan = new PurchasingPlan();
    purchasingPlan.id = model.id;
    purchasingPlan.code = model.code;
    purchasingPlan.name = model.name;
    purchasingPlan.createUser = model.createUser;
    purchasingPlan.createUserName = model.createUserName;
    purchasingPlan.purchasePlanType = model?.purchasePlanType?.id;
    purchasingPlan.status = model.status;
    return purchasingPlan;
  };

  const handleOpenModalCancel = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: getPurchasingPlanObject(model),
    });
  }, [model, setModelSelected]);

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
  const getAction = useCallback(
    (model: PurchasingPlanTypeModel) => ({
      canDeclined: {
        isShow: model?.canDeclined,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PL.purchasing_plan_status_declined"),
        type: "secondary",
        onClick: () => handleOpenModalCancel(),
      },
      canCancel: {
        isShow: model?.canCancel,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PR.btn_cancel"),
        type: "secondary",
        onClick: () => handleOpenModalCancel(),
      },
      canSaveDraft: {
        isShow: model?.canSaveDraft,
        icon: <img src={SaveIcon} alt="img" />,
        label: translate("PL.purchasing_plan_btn_save_draft"),
        type: "secondary",
        onClick: () => handleSubmitApproval(true),
      },
      canApproveSupplier: {
        isShow: model?.canApproveSupplier,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("PL.principle.button.approve"),
        type: "primary",
        onClick: () => handleOpenSigningForm(),
      },
    }),
    [handleOpenModalCancel, handleSubmitApproval, translate]
  );

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  const renderButtonActions = () => {
    if (filteredActions.length < 4) {
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
            icon={
              <img
                src={ArrowLeftWhiteIcon}
                style={{ transform: "rotate(180deg)" }}
                alt="img"
              />
            }
            iconPlace="left"
            type="primary"
            size="lg"
            onClick={() => handleSave(false)}
          >
            {translate("PL.principle.button.submit")}
          </Button>
        </div>
      ) : (
        <div className="d-flex gap-2">{renderButtonActions()}</div>
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
