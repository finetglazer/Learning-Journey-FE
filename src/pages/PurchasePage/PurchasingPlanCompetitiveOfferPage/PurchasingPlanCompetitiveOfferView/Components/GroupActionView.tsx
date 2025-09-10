import {
  ApproveIcon,
  ContinueIcon,
  DeleteIcon,
  EditIcon,
  IcSendWhite,
  RejectIcon,
  ReturnIcon,
  SaveIcon,
} from "assets/icons";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
} from "config/route-const";
import { isEmpty } from "lodash";
import {
  ButtonType,
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../../PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { getPurchasingPlanObject } from "pages/PurchasePage/constants";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
} from "models/PurchasingPlan/PurchasingPlanConstant";

const RETURN_PARAM = "isReturn";
const DECLINE_PARAM = "isDecline";
const CAN_APPROVED_CANCELED_PARAM = "canApprovedCancelled";

const GroupActionView = () => {
  const {
    model,
    setModelSelected,
    handleApprovePurchasingPlan,
    handleApproveCancellationPurchasingPlan,
    setIsOpenModalNextRoundBid,
    setIsOpenModalAddSupplierQuote,
    setActionQuote,
    setIsOpenProceedNegotiationModal,
    setIsOpenPrioritySupplier,
    handleGetListSupplierForNegotiation,
    handleValidateSaveDraft,
    handleConfirmSummary,
    handleSummarizeResult,
    stepChooseSupplier,
    setStepChooseSupplier,
    handleWaitingApprovalSelectSupplier,
    handleInitialPlan,
  } = useContext<PurchasingPlanModel>(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const [translate] = useTranslation();
  const history = useHistory();

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  const handleGoToEdit = useCallback(() => {
    history.push(
      `${PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE}/${model?.id}`
    );
  }, [history, model?.id]);

  const handleGoToAdjustCompetitiveOfferDetail = useCallback(() => {
    history.push(PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE, {
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

  const isSelectSupplierStatus = useMemo(() => {
    return model?.status === PURCHASING_PLAN_STATUS.SELECT_SUPPLIER;
  }, [model?.status]);

  const getAction = useCallback(
    (model: PurchasingPlanTypeModel) => ({
      //xóa
      canDelete: {
        isShow: model?.canDelete,
        icon: <img src={DeleteIcon} alt="img" />,
        label: translate("PR.btn_delete"),
        type: "secondary",
        onClick: () => handleOpenModalByType(ConfirmModalType.DELETE),
      },

      // lưu nháp
      canSaveDraft: {
        isShow: model?.canSaveDraft,
        icon: <img src={SaveIcon} alt="img" />,
        label: translate("PL.purchasing_plan_btn_save_draft"),
        type: "secondary",
        onClick: () => handleConfirmSummary(true),
      },

      //từ chối
      canDeclined: {
        isShow: model?.canDeclined,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("BG.btn_reject"),
        type: "secondary",
        onClick: () => handleOpenModalByType(ConfirmModalType.REJECT),
      },
      //trả lai
      canReturn: {
        isShow: model?.canReturn,
        icon: <img src={ReturnIcon} alt="img" />,
        label: translate("BG.btn_return"),
        type: "secondary",
        onClick: () => handleOpenModalByType(ConfirmModalType.RETURN),
      },
      //hủy
      canCancel: {
        isShow: model?.canCancel,
        icon: <img src={RejectIcon} alt="img" />,
        label: translate("PR.btn_cancel"),
        type: "secondary",
        onClick: () => handleOpenModalByType(ConfirmModalType.CANCEL),
      },
      // Thêm vòng đàm phán
      canCreateNegotiationRound: {
        isShow: model?.canCreateNegotiationRound,
        icon: <ContinueIcon fillColor={"#DD502E"} />,
        label: translate("PL.txt_add_new_round_talks"),
        type: "secondary",
        onClick: () => {
          setActionQuote(SupplierQuotationAction.AddNegotiationRound);
          setIsOpenModalAddSupplierQuote(true);
        },
      },
      // Quay lại
      canBack: {
        isShow:
          model?.canSaveAndPreview &&
          !!stepChooseSupplier &&
          isSelectSupplierStatus,
        icon: <img src={ReturnIcon} alt="img" />,
        label: translate("CM.back"),
        type: "secondary",
        onClick: () => {
          setStepChooseSupplier(false);
          handleInitialPlan();
        },
      },
      // điều chỉnh
      canCreatePurchaseRequestAdjustment: {
        isShow: model?.canCreatePurchaseRequestAdjustment,
        icon: <img src={EditIcon} alt="img" />,
        label: translate("PL.bidding.button.edit_purchase_plan"),
        type: "primary",
        onClick: handleGoToAdjustCompetitiveOfferDetail,
      },

      // tổng hợp đánh giá
      canSummarize: {
        isShow: model?.canSummarize,
        icon: <img src={IcSendWhite} alt="img" />,
        label: translate("PL.bidding.button.summary"),
        type: "primary",
        onClick: handleSummarizeResult,
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

      // gửi kêt quả
      canSendResult: {
        isShow: model?.canSendResult,
        icon: <img src={IcSendWhite} alt="img" />,
        label: translate("PL.bidding.button.send_result"),
        type: "primary",
        onClick: () => handleOpenModalByType(ConfirmModalType.SEND_RESULT),
      },
      // Gửi duyệt
      canSendApproval: {
        isShow:
          model?.canSaveAndPreview &&
          !!stepChooseSupplier &&
          isSelectSupplierStatus,
        icon: <img src={IcSendWhite} alt="Submit icon" />,
        label: translate("PL.bidding.button.approve"),
        type: "primary",
        onClick: () => {
          handleWaitingApprovalSelectSupplier();
        },
      },
      // đàm phán lại
      canNegotiateAgain: {
        isShow:
          !stepChooseSupplier &&
          isSelectSupplierStatus &&
          model?.canNegotiateAgain,
        icon: <img src={ReturnIcon} alt="Renegotiation icon" />,
        label: translate("PL.select_supplier.button.renegotiation"),
        type: "secondary",
        onClick: () => {
          handleOpenModalByType(ConfirmModalType.RENEGOTIATION);
        },
      },
      // lưu nháp nhà cung cấp cùng lưu và xem trước
      canSaveAndPreviewDraft: {
        isShow:
          !stepChooseSupplier &&
          isSelectSupplierStatus &&
          model?.canSaveAndPreview,
        icon: <img src={SaveIcon} alt="img" />,
        label: translate("PL.purchasing_plan_btn_save_draft"),
        type: "secondary",
        onClick: () => handleValidateSaveDraft(true),
      },
      // lưu và xem trước
      canSaveAndPreview: {
        isShow:
          !stepChooseSupplier &&
          isSelectSupplierStatus &&
          model?.canSaveAndPreview,
        icon: <img src={IcSendWhite} alt="Submit icon" />,
        label: translate("PL.select_supplier.button.save_and_preview"),
        type: "primary",
        onClick: () => {
          handleValidateSaveDraft(false);
        },
      },
      //sửa
      canEdit: {
        isShow: model?.canEdit,
        icon: <img src={EditIcon} alt="img" />,
        label: translate("PR.btn_edit"),
        type: "primary",
        onClick: handleGoToEdit,
      },
      // báo giá vòng tiếp theo
      canCreateSupplierQuotation: {
        isShow: model?.canCreateSupplierQuotation,
        icon: <ContinueIcon />,
        label: translate("PL.txt_btn_continue"),
        type: "primary",
        onClick: () => {
          setIsOpenModalNextRoundBid(true);
        },
      },
      // Tiền hành đàm phán
      canNegotiate: {
        isShow: model?.canNegotiate,
        icon: <img src={IcSendWhite} alt="Submit icon" />,
        label: translate("PL.txt_proceedNegotiation"),
        type: "primary",
        onClick: handleOpenModalSelectSupplierForNegotiation,
      },
      // Chọn nhà cung cấp ưu tiên đàm phán
      canSelectPrioritySupplier: {
        isShow: model?.canSelectPrioritySupplier,
        icon: <img src={ApproveIcon} alt="Submit icon" />,
        label: translate("PL.txt_prioritize_supplier"),
        type: "primary",
        onClick: handleOpenModalPrioritizeSupplier,
      },
      // phê duyệt
      canApproved: {
        isShow: model?.canApproved,
        icon: <img src={ApproveIcon} alt="Submit icon" />,
        label: translate("BG.btn_approve"),
        type: "primary",
        onClick: () => {
          handleApprovePurchasingPlan(model?.idDetail);
        },
      },
      // phê duyệt hủy
      canApprovedCanceled: {
        isShow: model?.canApprovedCanceled,
        icon: <img src={ApproveIcon} alt="Submit icon" />,
        label: translate("BG.btn_approve"),
        type: "primary",
        onClick: () => {
          handleApproveCancellationPurchasingPlan(model?.idDetail);
        },
      },
      // xác nhận
      canConfirm: {
        isShow: model?.canConfirm,
        icon: <img src={IcSendWhite} alt="Submit icon" />,
        label: translate("CM.btn_confirm"),
        type: "primary",
        onClick: () => {
          handleConfirmSummary(false);
        },
      },
    }),
    [
      handleApproveCancellationPurchasingPlan,
      handleApprovePurchasingPlan,
      handleConfirmSummary,
      handleGoToAdjustCompetitiveOfferDetail,
      handleGoToEdit,
      handleInitialPlan,
      handleOpenModalByType,
      handleOpenModalPrioritizeSupplier,
      handleOpenModalSelectSupplierForNegotiation,
      handleSummarizeResult,
      handleValidateSaveDraft,
      handleWaitingApprovalSelectSupplier,
      isSelectSupplierStatus,
      setActionQuote,
      setIsOpenModalAddSupplierQuote,
      setIsOpenModalNextRoundBid,
      setStepChooseSupplier,
      stepChooseSupplier,
      translate,
    ]
  );

  useEffect(() => {
    const isReturn = history.location.search.includes(`${RETURN_PARAM}=true`);
    const isDecline = history.location.search.includes(`${DECLINE_PARAM}=true`);

    if (isReturn && !isEmpty(model?.id) && model?.canReturn) {
      handleOpenModalByType(ConfirmModalType.RETURN);
    }
    if (isDecline && !isEmpty(model?.id) && model?.canDeclined) {
      handleOpenModalByType(ConfirmModalType.REJECT);
    }
  }, [
    model?.id,
    model?.canDeclined,
    model?.canRefuse,
    handleOpenModalByType,
    model?.canReturn,
    model.canApprovedCanceled,
    model.idDetail,
    history.location.search,
  ]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);

    // Check if both canSummarize and canCreateNextQuotationRound are present and true
    const summarizeIndex = filtered.findIndex(
      (action) => action.label === translate("PL.bidding.button.summary")
    );

    const nextQuotationIndex = filtered.findIndex(
      (action) => action.label === translate("PL.btn_txt_add_supplier_quote")
    );
    const sendResultIndex = filtered.findIndex(
      (action) => action.label === translate("PL.bidding.button.send_result")
    );

    // If both buttons are present, swap their positions
    if (
      summarizeIndex !== -1 &&
      nextQuotationIndex !== -1 &&
      sendResultIndex === -1
    ) {
      // Create a copy of the array to avoid mutation issues
      const newFiltered = [...filtered];

      // Swap the items
      const temp = newFiltered[summarizeIndex];
      newFiltered[summarizeIndex] = newFiltered[nextQuotationIndex];
      newFiltered[nextQuotationIndex] = temp;

      setFilteredActions(newFiltered);
    } else {
      setFilteredActions(filtered);
    }
  }, [getAction, translate]);

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
      const lastThree = filteredActions.slice(-2);
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
          {lastThree.map((action, idx) => (
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

  return <div className="group-action">{renderButtonActions()}</div>;
};

export default GroupActionView;
