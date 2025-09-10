import {
  ApproveIcon,
  DeleteIcon,
  EditIcon,
  RejectIcon,
  ReturnIcon,
} from "assets/icons";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import { PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE } from "config/route-const";
import { isEmpty } from "lodash";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasePlanAdjustCompetitiveOfferPage/PurchasePlanAdjustCompetitiveOfferDetail/PurchasePlanAdjustCompetitiveOfferDetailHook";

import { useCallback, useContext, useEffect } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";

const RETURN_PARAM = "isReturn";
const DECLINE_PARAM = "isDecline";
const GroupActionView = () => {
  const {
    model,
    setModelSelected,
    handleApprovePurchasingPlan,
    handleApproveCancellationPurchasingPlan,
  } = useContext<PurchasePlanAdjustCompetitiveOfferDetailHookContextProps>(
    PurchasePlanAdjustCompetitiveOfferDetailHookContext
  );
  const [translate] = useTranslation();
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(
      `${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE}/${model?.id}`
    );
  };

  const handleOpenModalDelete = () => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model,
    });
  };
  const handleOpenModalCancel = () => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model,
    });
  };
  const handleOpenModalReturn = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.RETURN,
      model,
    });
  }, [model, setModelSelected]);

  const handleOpenModalReject = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.REJECT,
      model,
    });
  }, [model, setModelSelected]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isReturn = queryParams.get(RETURN_PARAM);
  const isDecline = queryParams.get(DECLINE_PARAM);

  useEffect(() => {
    if (isReturn && !isEmpty(model?.id) && model?.canDeclined) {
      handleOpenModalReturn();
    }
    if (isDecline && !isEmpty(model?.id) && model?.canRefuse) {
      handleOpenModalReject();
    }
  }, [
    isReturn,
    isDecline,
    model?.id,
    model?.canDeclined,
    model?.canRefuse,
    handleOpenModalReturn,
    handleOpenModalReject,
  ]);

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }
  return (
    <div className="group-action">
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

      {model?.canReturn && (
        <Button
          icon={<img src={ReturnIcon} alt="" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleOpenModalReturn()}
        >
          {translate("BG.btn_return")}
        </Button>
      )}

      {model?.canDeclined && (
        <Button
          icon={<img src={RejectIcon} alt="" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleOpenModalReject()}
        >
          {translate("CM.txt_rejected")}
        </Button>
      )}

      {model?.canRefuse && (
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

      {/*phê duyệt */}
      {model?.canApproved && (
        <Button
          icon={<img src={ApproveIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          disabled={!model?.isApproveCanClick}
          size="lg"
          onClick={() => handleApprovePurchasingPlan(model?.id)}
        >
          {translate("BG.btn_approve")}
        </Button>
      )}

      {/*phê duyệt hủy*/}
      {model?.canApprovedCanceled && (
        <Button
          icon={<img src={ApproveIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={() => handleApproveCancellationPurchasingPlan(model?.id)}
        >
          {translate("BG.btn_approve")}
        </Button>
      )}
    </div>
  );
};

export default GroupActionView;
