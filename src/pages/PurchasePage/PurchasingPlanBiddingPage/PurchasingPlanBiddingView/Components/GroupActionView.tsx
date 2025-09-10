import {
  ApproveIcon,
  ContinueIcon,
  DeleteIcon,
  EditIcon,
  GetOpinions,
  IcSendWhite,
  RejectIcon,
  ReturnIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
} from "config/route-const";
import { isEmpty } from "lodash";
import {
  ButtonType,
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
  ViewRole,
} from "models/PurchasingPlan";

import ApproveButton from "components/ApproveButton/ApproveButton";
import { getPurchasingPlanObject } from "pages/PurchasePage/constants";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PurchasingPlanBiddingDetailHookContext } from "../../PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { ModalGetOpinions } from "./ReviewSummaryTab/Components/ModalGetOpinions";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";

const RETURN_PARAM = "isReturn";
const DECLINE_PARAM = "isDecline";
const CAN_APPROVED_CANCELED_PARAM = "canApprovedCancelled";

const GroupActionView = () => {
  const {
    model,
    setModelSelected,
    handleApprovePurchasingPlan,
    handleApproveCancellationPurchasingPlan,
    setIsOpenModalGetOpinions,
    setIsOpenModalNextRoundBid,
    isOpenModalGetOpinions,
    handleSendApprovePurchasingPlan,
    handleApproveEvaluationPurchasingPlan,
    // Thêm các state và hàm có trong context Bidding
    setIsOpenModalAddSupplierQuote,
    setActionQuote,
    // Thêm các hàm cho negotiate và priority supplier
    setIsOpenProceedNegotiationModal,
    setIsOpenPrioritySupplier,
    handleGetListSupplierForNegotiation,
    editEvaluation,
    updateSelectSupplier,
    handleSave,
    handleSummarizeResult,
    handleApprovedPoint,
    handleRequestReMark,
    handleSendPoint,
  } = useContext<PurchasingPlanModel>(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();
  const history = useHistory();

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  const handleGoToEdit = useCallback(() => {
    history.push(`${PURCHASING_PLAN_BIDDING_DETAIL_ROUTE}/${model?.id}`);
  }, [history, model?.id]);

  const handleGoToAdjustBid = useCallback(() => {
    history.push(PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE, {
      originalPurchasePlanId: model?.idDetail,
    });
  }, [history, model?.idDetail]);

  const handleOpenModalByType = useCallback(
    (type: ConfirmModalType) => {
      setModelSelected({
        type,
        model: getPurchasingPlanObject(model),
      });
    },
    [model, setModelSelected]
  );

  const handleOpenModalDelete = useCallback(() => {
    handleOpenModalByType(ConfirmModalType.DELETE);
  }, [handleOpenModalByType]);

  const handleOpenModalCancel = useCallback(() => {
    handleOpenModalByType(ConfirmModalType.CANCEL);
  }, [handleOpenModalByType]);

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

  const handleOpenModalSendResult = useCallback(() => {
    setModelSelected({
      type: ConfirmModalType.SEND_RESULT,
      model: getPurchasingPlanObject(model),
    });
  }, [model, setModelSelected]);

  const handleOpenModalSelectSupplierForNegotiation = useCallback(async () => {
    try {
      await handleGetListSupplierForNegotiation();
      setActionQuote(SupplierQuotationAction.proceedNegotiation);
      setIsOpenProceedNegotiationModal(true);
    } catch (error) {
      console.error("Error fetching supplier list:", error);
    }
  }, [
    handleGetListSupplierForNegotiation,
    setActionQuote,
    setIsOpenProceedNegotiationModal,
  ]);

  const handleOpenModalPrioritizeSupplier = useCallback(() => {
    setActionQuote(SupplierQuotationAction.prioritizeSupplier);
    setIsOpenPrioritySupplier(true);
  }, [setActionQuote, setIsOpenPrioritySupplier]);

  const getAction = useCallback(
    (model: PurchasingPlanTypeModel) => ({
      // Xóa
      canDelete: {
        isShow: model?.canDelete,
        icon: <img src={DeleteIcon} alt="img" />,
        label: translate("PR.btn_delete"),
        type: "secondary",
        onClick: handleOpenModalDelete,
      },

      // Đàm phán lại
      canNegotiateAgain: {
        isShow: model?.canNegotiateAgain,
        icon: <img src={ReturnIcon} alt="Renegotiation icon" />,
        label: translate("PL.select_supplier.button.renegotiation"),
        type: "secondary",
        onClick: () => {
          handleOpenModalByType(ConfirmModalType.RENEGOTIATION);
        },
      },
      // lưu nháp
      canSaveDraft: {
        isShow: model?.canSaveDraft,
        icon: <img src={SaveIcon} alt="img" />,
        label: translate("PL.purchasing_plan_btn_save_draft"),
        type: "secondary",
        onClick: () => {
          if (
            model?.status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING
          ) {
            editEvaluation(true);
            return;
          }

          if (
            model?.status ===
            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER
          ) {
            updateSelectSupplier(true);
            return;
          }

          handleSave(true);
        },
      },

      // Hủy
      canCancel: {
        isShow: model?.canCancel,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PR.btn_cancel"),
        type: "secondary",
        onClick: handleOpenModalCancel,
      },
      // Thêm vòng đàm phán
      canCreateNegotiationRound: {
        isShow: model?.canCreateNegotiationRound,
        icon: <ContinueIcon fillColor={"#DD502E"} />,
        label: translate("PL.txt_add_new_round_talks"),
        type: "secondary",
        onClick: () => {
          if (setActionQuote && setIsOpenModalAddSupplierQuote) {
            setActionQuote(SupplierQuotationAction.AddNegotiationRound);
            setIsOpenModalAddSupplierQuote(true);
          }
        },
      },

      // Thêm NCC Chào giá
      canCreateNextQuotationRound: {
        isShow: model?.canCreateNextQuotationRound,
        icon: <ContinueIcon fillColor={"#DD502E"} />,
        label: translate("PL.btn_txt_add_supplier_quote"),
        type: "secondary",
        onClick: () => {
          setActionQuote(SupplierQuotationAction.AddSupplierQuotation);
          setIsOpenModalAddSupplierQuote(true);
        },
      },

      // Trả lại
      canReturn: {
        isShow: model?.canReturn,
        icon: <img src={ReturnIcon} alt="img" />,
        label: translate("BG.btn_return"),
        type: "secondary",
        onClick: handleOpenModalReturn,
      },
      // Từ chối
      canRefuse: {
        isShow: model?.canRefuse,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("BG.btn_reject"),
        type: "secondary",
        onClick: handleOpenModalReject,
      },
      // Từ chối (declined)
      canDeclined: {
        isShow: model?.canDeclined,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("BG.btn_reject"),
        type: "secondary",
        onClick: handleOpenModalReject,
      },
      // Sửa
      canEdit: {
        isShow: model?.canEdit,
        icon: <img src={EditIcon} alt="img" />,
        label: translate("PR.btn_edit"),
        type: "primary",
        onClick: handleGoToEdit,
      },
      // Điều chỉnh
      canCreatePurchaseRequestAdjustment: {
        isShow: model?.canCreatePurchaseRequestAdjustment,
        icon: <img src={EditIcon} alt="img" />,
        label: translate("PL.bidding.button.edit_purchase_plan"),
        type: "primary",
        onClick: handleGoToAdjustBid,
      },
      // Tổng hợp điểm
      canSummarize: {
        isShow: model?.canSummarize,
        icon: <img src={IcSendWhite} alt="img" />,
        label: translate("PL.bidding.button.summary"),
        type: "primary",
        onClick: handleSummarizeResult,
      },
      // Gửi kết quả
      canSendResult: {
        isShow: model?.canSendResult,
        icon: <img src={IcSendWhite} alt="Submit icon" />,
        label: translate("PL.bidding.button.send_result"),
        type: "primary",
        onClick: handleOpenModalSendResult,
      },
      // Báo giá vòng tiếp theo
      canRound: {
        isShow: model?.canRound,
        icon: <ContinueIcon />,
        label: translate("PL.txt_btn_continue"),
        type: "primary",
        onClick: () => setIsOpenModalNextRoundBid(true),
      },

      // Phê duyệt điểm
      canApproveEvaluation: {
        isShow: model?.canApproveEvaluation,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("BG.btn_approve"),
        type: "primary",
        onClick: () => handleApproveEvaluationPurchasingPlan(model?.idDetail),
      },
      // Gửi duyệt
      canWaitingForApprove: {
        isShow:
          model?.canWaitingForApprove &&
          model?.status !==
            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("PL.bidding.button.approve"),
        type: "primary",
        onClick: () => handleSendApprovePurchasingPlan(model?.idDetail),
      },
      canSaveAndPreview: {
        isShow:
          model?.canWaitingForApprove &&
          model?.status ===
            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER,
        icon: <img src={SendIcon} alt="img" />,
        label: translate("PL.bidding.button.approve"),
        type: "primary",
        onClick: () => updateSelectSupplier(false),
      },
      // Phê duyệt
      canApproved: {
        isShow: model?.canApproved,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("BG.btn_approve"),
        type: "primary",
        onClick: () => handleApprovePurchasingPlan(model?.idDetail),
      },
      // Phê duyệt hủy
      canApprovedCanceled: {
        isShow: model?.canApprovedCanceled,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("BG.btn_approve"),
        type: "primary",
        onClick: () => handleApproveCancellationPurchasingPlan(model?.idDetail),
      },

      // Xác nhận
      canConfirm: {
        isShow: model?.canConfirm,
        icon: <img src={IcSendWhite} alt="img" />,
        label: translate("PL.btn_confirm_point"),
        type: "primary",
        onClick: () => {
          editEvaluation(false);
        },
      },

      // Lấy ý kiến
      canGatherOpinion: {
        isShow: model?.canGatherOpinion,
        icon: <img src={GetOpinions} alt="img" />,
        label: translate("PL.txt_review_summary_get_opinions"),
        type: "primary",
        onClick: () => setIsOpenModalGetOpinions(true),
      },
      // Tiến hành đàm phán
      canNegotiate: {
        isShow: model?.canNegotiate,
        icon: <img src={SendIcon} alt="Submit icon" />,
        label: translate("PL.txt_proceedNegotiation"),
        type: "primary",
        onClick: handleOpenModalSelectSupplierForNegotiation,
      },
      // Chọn nhà cung cấp chốt
      canChooseFinalSupplier: {
        isShow: model?.canChooseFinalSupplier,
        icon: <img src={SendIcon} alt="Submit icon" />,
        label: translate("PL.txt_prioritize_supplier"),
        type: "primary",
        onClick: handleOpenModalPrioritizeSupplier,
      },
      canRequestEvaluateAgain: {
        isShow:
          model?.canRequestEvaluateAgain &&
          model?.viewRole === ViewRole.ProjectDirector,
        icon: <img src={ReturnIcon} alt="img" />,
        label: translate("PL.btn_request_re_mark"),
        type: "secondary",
        onClick: () => handleRequestReMark(model?.quotationRequestId),
      },
      canApproveResult: {
        isShow:
          model?.canApproveResult &&
          model?.viewRole === ViewRole.ProjectDirector,
        icon: <img src={ApproveIcon} alt="img" />,
        label: translate("PL.btn_approved_point"),
        type: "primary",
        onClick: () => handleApprovedPoint(model?.quotationRequestId),
      },
      canSummarizeAgain: {
        isShow:
          model?.canSummarizeAgain &&
          model?.viewRole === ViewRole.TechnicalLeader,
        icon: <img src={ReturnIcon} alt="img" />,
        label: translate("PL.btn_summary_again"),
        type: "secondary",
        onClick: () => handleRequestReMark(model?.quotationRequestId),
      },
      canSendResultApproval: {
        isShow:
          model?.canSendResultApproval &&
          model?.viewRole === ViewRole.TechnicalLeader,
        icon: <img src={SendIcon} alt="img" />,
        label: translate("PL.btn_send_point"),
        type: "primary",
        onClick: () => handleSendPoint(model?.quotationRequestId),
      },
    }),
    [
      translate,
      handleOpenModalDelete,
      handleOpenModalCancel,
      handleOpenModalReturn,
      handleOpenModalReject,
      handleGoToEdit,
      handleGoToAdjustBid,
      handleSummarizeResult,
      handleOpenModalSendResult,
      handleOpenModalSelectSupplierForNegotiation,
      handleOpenModalPrioritizeSupplier,
      handleOpenModalByType,
      handleSave,
      editEvaluation,
      setActionQuote,
      setIsOpenModalAddSupplierQuote,
      setIsOpenModalNextRoundBid,
      handleApproveEvaluationPurchasingPlan,
      handleSendApprovePurchasingPlan,
      handleApprovePurchasingPlan,
      handleApproveCancellationPurchasingPlan,
      setIsOpenModalGetOpinions,
      handleRequestReMark,
      handleApprovedPoint,
      handleSendPoint,
    ]
  );

  useEffect(() => {
    const isReturn = history.location.search.includes(`${RETURN_PARAM}=true`);
    const isDecline = history.location.search.includes(`${DECLINE_PARAM}=true`);

    if (isReturn && !isEmpty(model?.id) && model?.canReturn) {
      handleOpenModalReturn();
    }
    if (isDecline && !isEmpty(model?.id) && model?.canRefuse) {
      handleOpenModalReject();
    }
  }, [
    model?.id,
    model?.canReturn,
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
      history.location.pathname.includes(PURCHASING_PLAN_BIDDING_VIEW_ROUTE) &&
      !isEmpty(model?.idDetail) &&
      model?.canApprovedCanceled &&
      isApprovedCancel
    ) {
      handleApproveCancellationPurchasingPlan(model.idDetail);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history.location.pathname,
    history.location.search,
    model?.canApprovedCanceled,
    model.idDetail,
  ]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [getAction, model]);

  const renderButtonActions = useCallback(() => {
    const numberOfActions = filteredActions.length;

    if (numberOfActions < 4) {
      return filteredActions?.map((action, idx) => (
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
      const lastTwo = filteredActions.slice(-2);
      const restActions = filteredActions.slice(0, -2);

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
          {lastTwo.map((action, idx) => (
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
  }, [filteredActions]);

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  return (
    <div className="group-action">
      {renderButtonActions()}
      {isOpenModalGetOpinions && (
        <ModalGetOpinions dismiss={() => setIsOpenModalGetOpinions(false)} />
      )}
    </div>
  );
};

export default GroupActionView;
