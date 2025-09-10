import { DeleteIcon, EditIcon, RejectIcon, ReturnIcon } from "assets/icons";
import ApproveButton from "components/ApproveButton/ApproveButton";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { isEmpty, isEqual } from "lodash";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";
import { getPurchasingPlanObject } from "pages/PurchasePage/constants";

import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";

import { useCallback, useContext, useEffect } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

const RETURN_PARAM = "isReturn";
const DECLINE_PARAM = "isDecline";
const CAN_APPROVED_CANCELED_PARAM = "canApprovedCancelled";

const GroupActionView = ({ loading }: { loading?: boolean }) => {
  const {
    model,
    setModelSelected,
    handleApproveCancellationPurchasingPlan,
    handleChangeSingleField,
  } = useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);
  const [translate] = useTranslation();
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(`${PURCHASING_PLAN_DETAIL_ROUTE}/${model?.id}`);
  };

  const handleOpenModalDelete = () => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model: getPurchasingPlanObject(model),
    });
  };
  const handleOpenModalCancel = () => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: getPurchasingPlanObject(model),
    });
  };
  const handleOpenModalReturn = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.RETURN,
      model: getPurchasingPlanObject(model),
    });
  }, [model, setModelSelected]);

  const handleOpenModalReject = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.REJECT,
      model: getPurchasingPlanObject(model),
    });
  }, [model, setModelSelected]);

  useEffect(() => {
    const isReturn = history.location.search.includes(`${RETURN_PARAM}=true`);
    const isDecline = history.location.search.includes(`${DECLINE_PARAM}=true`);

    if (isReturn && !isEmpty(model?.id) && model?.canDeclined) {
      handleOpenModalReturn();
    }
    if (isDecline && !isEmpty(model?.id) && model?.canRefuse) {
      handleOpenModalReject();
    }
  }, [
    model?.id,
    model?.canDeclined,
    model?.canRefuse,
    handleOpenModalReturn,
    handleOpenModalReject,
    model.canApprovedCanceled,
    model.idDetail,
    history.location.search,
  ]);

  useEffect(() => {
    const isApprovedCancel = history.location.search.includes(
      `${CAN_APPROVED_CANCELED_PARAM}=true`
    );

    if (
      history.location.pathname.includes(PURCHASING_PLAN_VIEW_ROUTE) &&
      isApprovedCancel &&
      !isEmpty(model?.idDetail) &&
      model?.canApprovedCanceled
    ) {
      handleApproveCancellationPurchasingPlan(model.idDetail);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history.location.pathname,
    history.location.search,
    model?.canApprovedCanceled,
    model?.idDetail,
  ]);

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  const handleGoMaster = () => {
    history.push(`${PURCHASING_PLAN_MASTER_ROUTE}`);
  };

  return (
    <div className="group-action">
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={purchasingPlanRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_purchasing_plan")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />
      {model?.canDelete && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={handleOpenModalDelete}
        >
          {translate("PR.btn_delete")}
        </Button>
      )}
      {model?.canCancel && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          onClick={handleOpenModalCancel}
          size="lg"
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}
      {model?.canDeclined && model?.status === 4 && (
        <Button
          icon={<img src={ReturnIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleOpenModalReturn()}
        >
          {translate("BG.btn_return")}
        </Button>
      )}
      {model?.canReturn && model?.status === 4 && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleOpenModalReject()}
        >
          {translate("BG.btn_reject")}
        </Button>
      )}

      {model?.canEdit && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          onClick={handleGoToEdit}
          type="primary"
          size="lg"
        >
          {translate("PR.btn_edit")}
        </Button>
      )}

      {/*phê duyệt hủy*/}
      <ApproveButton
        isShow={model?.canApprovedCanceled}
        disabled={loading}
        handleSubmitApprove={() =>
          handleApproveCancellationPurchasingPlan(model?.idDetail)
        }
      />
    </div>
  );
};

export default GroupActionView;
