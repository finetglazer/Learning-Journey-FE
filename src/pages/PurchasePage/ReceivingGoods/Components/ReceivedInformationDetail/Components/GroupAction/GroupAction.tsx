import {
  ApproveIcon,
  DeleteIcon,
  EditIcon,
  RejectIcon,
  ReturnIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  RECEIVING_GOODS_EDIT_ROUTE,
  RECEIVING_GOODS_ROUTE,
} from "config/route-const";
import { MAX_LENGTH_TEXT_AREA, numberConstants } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { includes, isEqual, isNull } from "lodash";
import { ContractStatus } from "models/Contract";
import { GoodsReceipt } from "models/ReceivingGood/GoodsReceipt";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { LOCAL_STORAGE_ACTION_STATE } from "pages/PurchasePage/constants";
import { ReceivedConfirmModal } from "pages/PurchasePage/ReceivingGoods/Components/ReceivedGoodConfirmModal/ReceivedGoodConfirmModal";
import {
  ReceivingGoodsDetailContext,
  ReceivingGoodsDetailContextContextType,
  useReceivingGoodsDetailContext,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { ConfirmModalType } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import React, { useContext, useMemo } from "react";
import {
  Button,
  FormItem,
  ModalConfirm,
  OverflowMenu,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAppSelector } from "rtk/useRedux";
import {
  getContentModalConfirm,
  getIconModal,
  getLabelInputReason,
  getTitleModalConfirm,
} from "./helper";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { receivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";

const SIZE_IMG = 72;

interface ButtonType {
  icon?: string;
  type: "secondary" | "primary";
  label: string;
  isDisabled?: boolean;
  isHide?: boolean;
  onClick?: () => void;
}

type GroupActionProps = {
  handleOpenSigningForm?: () => void;
};
export const GroupAction = ({ handleOpenSigningForm }: GroupActionProps) => {
  const {
    setModelSelected,
    handleApplyButtonInConfirmModal,
    modelSelected,
    loadingModal,
  } = useContext<ReceivingGoodsDetailContextContextType>(
    ReceivingGoodsDetailContext
  );
  const {
    model,
    state,
    handleSendRequest,
    handleApproval,
    handleUpdateTypeModal,
    modalConfirm,
    handleReturn,
    handelReject,
    handleChangeSingleField,
  } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const profile = useAppSelector((state) => state.profile);
  const history = useHistory();

  const isUserCreator = useMemo(() => {
    return isEqual(
      profile?.account?.email?.toLowerCase(),
      model?.contractInfo?.receiverEmail?.toLowerCase()
    );
  }, [model?.contractInfo?.receiverEmail, profile.account.email]);

  const isDraft = isEqual(model?.status, ContractStatus.DRAFT);
  const isWaitingForApproval = isEqual(
    model?.status,
    ContractStatus.WAITING_FOR_APPROVAL
  );

  const canDelete = isEqual(model?.canDelete, true);
  const canEdit = isDraft && isUserCreator;

  const onPressSave = () => handleSendRequest(true, handleOpenSigningForm);

  const onPressSaveDraft = () => handleSendRequest(true);

  const onPressReturn = () => {
    handleUpdateTypeModal(ConfirmModalType.RETURN);
  };

  const onPressReject = () => {
    handleUpdateTypeModal(ConfirmModalType.REJECT);
  };

  const navigateToEdit = () => {
    localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "EDIT");
    history.push(`${RECEIVING_GOODS_EDIT_ROUTE}/${model?.id}`);
  };

  const handleGoMaster = () => {
    history.push(RECEIVING_GOODS_ROUTE);
  };

  const getButtonByState = () => {
    const buttons: ButtonType[] = [];

    const goodReceipt: GoodsReceipt = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };

    if (isEqual(state, "VIEW") && !isWaitingForApproval) {
      if (canDelete) {
        // append button delete
        buttons.push({
          icon: DeleteIcon,
          type: "secondary",
          label: translate("CM.txt_delete"),
          onClick: () => {
            // handle delete
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: goodReceipt,
            });
          },
        });
      }

      if (model?.canCancel) {
        buttons.push({
          icon: RejectIcon,
          type: "secondary",
          label: translate("CM.txt_cancel"),
          onClick: () => {
            // handle cancel
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: goodReceipt,
            });
          },
        });
      }

      if (canEdit) {
        // append edit button
        buttons.push({
          icon: EditIcon,
          type: "primary",
          label: translate("CM.txt_update"),
          onClick: navigateToEdit,
        });
      }
    }

    // append cancel button
    if (model?.canCancel && !model?.canDelete && !model?.canEdit) {
      buttons.push({
        type: "primary",
        label: translate("CM.txt_cancel"),
        onClick: () => {
          // handle cancel
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model: goodReceipt,
          });
        },
      });
    }

    if (
      isEqual(state, "CREATE") ||
      isEqual(state, "EDIT") ||
      isEqual(state, "CLONE")
    ) {
      // append save button
      buttons.push({
        icon: SaveIcon,
        type: "secondary",
        label: translate("CM.btn_save_draft"),
        onClick: onPressSaveDraft,
        isDisabled: model?.loadingFileBudget,
      });

      // append send button
      buttons.push({
        icon: SendIcon,
        type: "primary",
        label: translate("CM.btn_send_approval"),
        onClick: onPressSave,
        isDisabled: model?.loadingFileBudget,
      });
    }

    // if (model?.canReturn && model?.canDecline && !isEqual(state, "CREATE")) {
    //   // append return button
    //   buttons.push({
    //     icon: ReturnIcon,
    //     type: "secondary",
    //     label: translate("BG.btn_return"),
    //     onClick: onPressReturn,
    //   });
    //
    //   // append reject button
    //   buttons.push({
    //     icon: RejectIcon,
    //     type: "secondary",
    //     label: translate("BG.btn_reject"),
    //     onClick: onPressReject,
    //   });
    // }
    //
    // if (model?.canApprove) {
    //   // append approval button
    //   buttons.push({
    //     icon: ApproveIcon,
    //     type: "primary",
    //     label: translate("BG.btn_approve"),
    //     onClick: handleApproval,
    //     isDisabled: !model?.isResponse,
    //   });
    // }

    return buttons;
  };

  const makeOverflowMenu = () => {
    if (isEqual(model?.isReturn, true) && !isEqual(state, "EDIT")) return null;
    const goodReceipt: GoodsReceipt = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };
    const list: ListOverflowMenu[] = [
      {
        title: translate("AC.txt_cancel_acceptance"),
        action: () => {
          // handle remove
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model: goodReceipt,
          });
        },
        isShow: isUserCreator && isEqual(model?.status, ContractStatus.DRAFT),
      },
      {
        title: translate("AC.txt_delete_acceptance"),
        action: () => {
          // handle delete
          setModelSelected({
            type: ConfirmModalType.DELETE,
            model: goodReceipt,
          });
        },
        isShow:
          isUserCreator &&
          isEqual(model?.status, ContractStatus.DRAFT) &&
          !isEqual(model?.isReturn, true),
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  // Show action feedback
  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  //  Confirm modal from clicking email
  const onConfirm = () => {
    switch (modalConfirm) {
      case ConfirmModalType.RETURN:
        handleReturn(model?.id, model?.reason);
        break;
      case ConfirmModalType.REJECT:
        handelReject(model?.id, model?.reason);
        break;
      default:
        break;
    }
  };

  //  Close modal from clicking email
  const onDismiss = () => {
    handleUpdateTypeModal(null);
    handleChangeSingleField({
      fieldName: "reason",
    })(null);
  };

  return (
    <div className="group-action">
      {includes(["VIEW", "CREATE", "CLONE"], state) ||
      isEqual(model?.status, numberConstants.ONE)
        ? null
        : makeOverflowMenu()}

      {getButtonByState().map((button, index) => {
        return (
          <Button
            key={index}
            {...(button.icon && { icon: <img src={button.icon} alt="" /> })}
            iconPlace="left"
            type={button.type}
            size="lg"
            onClick={button.onClick}
            disabled={button.isDisabled}
          >
            {button.label}
          </Button>
        );
      })}
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={receivedGoodsRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_receiving_goods")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {/* Modal confirm when clicking email */}

      {/* Modal confirm user action */}
      {!isNull(modelSelected) ? (
        <ReceivedConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={loadingModal}
        />
      ) : null}
    </div>
  );
};
