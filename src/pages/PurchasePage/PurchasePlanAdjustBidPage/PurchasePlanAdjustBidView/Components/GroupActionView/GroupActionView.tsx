import { DeleteIcon, EditIcon, RejectIcon, ReturnIcon } from "assets/icons";
import ApproveButton from "components/ApproveButton/ApproveButton";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import { PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE } from "config/route-const";
import { isEmpty } from "lodash";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasePlanAdjustBidDetailHookContext } from "pages/PurchasePage/PurchasePlanAdjustBidPage/PurchasePlanAdjustBidDetail/PurchasePlanAdjustBidDetailHook";

import { useContext, useEffect } from "react";
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
  } = useContext<PurchasePlanAdjustBidDetailHookContextProps>(
    PurchasePlanAdjustBidDetailHookContext
  );
  const [translate] = useTranslation();
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(`${PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}/${model?.id}`);
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
  const handleOpenModalReturn = () => {
    setModelSelected({
      type: ConfirmModalType.RETURN,
      model,
    });
  };

  const handleOpenModalReject = () => {
    setModelSelected({
      type: ConfirmModalType.REJECT,
      model,
    });
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isReturn = queryParams.get(RETURN_PARAM);
  const isDecline = queryParams.get(DECLINE_PARAM);

  useEffect(() => {
    if (isReturn && !isEmpty(model?.id) && model?.canReturn) {
      handleOpenModalReturn();
    }
    if (isDecline && !isEmpty(model?.id) && model?.canRefuse) {
      handleOpenModalReject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturn, isDecline, model?.id, model?.canReturn, model?.canRefuse]);

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
          icon={<img src={ReturnIcon} alt="img" />}
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
      <ApproveButton
        isShow={model?.canApproved || model?.canApprovedCanceled}
        handleSubmitApprove={() =>
          model?.canApproved
            ? handleApprovePurchasingPlan(model?.id)
            : handleApproveCancellationPurchasingPlan(model?.id)
        }
      />
    </div>
  );
};

export default GroupActionView;
