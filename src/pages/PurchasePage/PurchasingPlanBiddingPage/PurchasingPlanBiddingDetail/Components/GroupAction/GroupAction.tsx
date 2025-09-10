import {
  ContinueIcon,
  DeleteIcon,
  IcInfo,
  RejectIcon,
  SaveIcon,
  SendIcon,
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
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
  PURCHASING_PLAN_STATUS_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { getPurchasingPlanObject } from "pages/PurchasePage/constants";
import { EvaluationConfirmModal } from "../../EvaluationCriteriaTab/Components/EvaluationCriteriaConfirmModal/EvaluationConfirmModal";
import { PurchasingPlanBiddingDetailHookContext } from "../../PurchasingPlanBiddingDetailHook";

interface IProps {
  onCreateNextQuotationRound: () => void;
  onConfirmSelectFinalSupplier: () => void;
  onConfirmNextNegotiationRound: () => void;
}

const GroupAction = ({
  onCreateNextQuotationRound,
  onConfirmSelectFinalSupplier,
  onConfirmNextNegotiationRound,
}: IProps) => {
  const currentContext = useContext<PurchasingPlanModel>(
    PurchasingPlanBiddingDetailHookContext
  );

  const {
    handleSave,
    model,
    setModelSelected,
    quoteAgainAction,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    isModalSendApproveOpen,
    setIsModalSendApproveOpen,
    handleValidateSaveForm,
    setActionQuote,
    setIsOpenModalAddSupplierQuote,
    // Thêm các hàm cho negotiate và priority supplier
    setIsOpenProceedNegotiationModal,
    setIsOpenPrioritySupplier,
    handleGetListSupplierForNegotiation,
  } = currentContext;
  const [translate] = useTranslation();

  const handleOpenSendApproveModal = () => {
    setIsModalSendApproveOpen(true); // Mở modal
  };
  const handleCloseSendApproveModal = () => {
    setIsModalSendApproveOpen(false); // Đóng modal
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

  const handleValidate = async () => {
    const isValid = await handleValidateSaveForm(false);
    if (isValid) {
      handleOpenSendApproveModal();
    }
  };

  const handleOpenModalSelectSupplierForNegotiation = async () => {
    try {
      await handleGetListSupplierForNegotiation();
      setActionQuote(SupplierQuotationAction.proceedNegotiation);
      setIsOpenProceedNegotiationModal(true);
    } catch (error) {
      console.error("Error fetching supplier list:", error);
    }
  };

  const handleOpenModalPrioritizeSupplier = useCallback(() => {
    setActionQuote(SupplierQuotationAction.prioritizeSupplier);
    setIsOpenPrioritySupplier(true);
  }, [setActionQuote, setIsOpenPrioritySupplier]);

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
    canSaveDraft: {
      isShow: isShowButtonDraft,
      icon: <img src={SaveIcon} alt="img" />,
      label: translate("PL.purchasing_plan_btn_save_draft"),
      type: "secondary",
      onClick: () => handleSave(true, true),
    },
    isShowButtonDraft: {
      isShow: isShowButtonDraft,
      icon: <img src={SendIcon} alt="img" />,
      label: translate("PL.bidding.button.approve"),
      type: "primary",
      onClick: () => handleValidate(),
    },
    // Thêm NCC Chào giá
    canCreateNextQuotationRound: {
      isShow: model?.canCreateNegotiationRound,
      icon: <ContinueIcon fillColor={"#DD502E"} />,
      label: translate("PL.btn_txt_add_supplier_quote"),
      type: "secondary",
      onClick: () => {
        setActionQuote(SupplierQuotationAction.AddSupplierQuotation);
        setIsOpenModalAddSupplierQuote(true);
      },
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
  });

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  const renderButtonActions = () => {
    if (filteredActions.length < 3) {
      return filteredActions.map((action, idx) => (
        <Button
          key={idx}
          icon={action.icon}
          type={action.type as ButtonType}
          size="lg"
          iconPlace="left"
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
  };

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [translate, model]);

  return (
    <div className="group-action">
      <div className="d-flex gap-2">{renderButtonActions()}</div>

      {/** Comment wait API BE to assemble  */}
      {/* <div className="d-flex gap-2">
        <Button
          icon={<img src={SendIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={() => handleSave(false)}
        >
          {translate("PL.txt_send_results")}
        </Button>
        <Button
          icon={<img src={GetOpinions} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={() => setIsOpenModalGetOpinions(true)}
        >
          {translate("PL.txt_review_summary_get_opinions")}
        </Button>
      </div> */}

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

      {isModalSendApproveOpen && (
        <EvaluationConfirmModal
          onCancel={handleCloseSendApproveModal}
          onSave={() => {
            handleSave(false, true);
          }}
          currentContext={currentContext}
        />
      )}
    </div>
  );
};

export default GroupAction;
