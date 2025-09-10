import { RejectRoundIcon, ReturnRoundIcon } from "assets/icons";
import { MODEL_CONFIRM_TYPE } from "../../BudgetCreateHook";
import { BudgetType } from "pages/BudgetPage/BudgetMaster/BudgetMasterHook";

export const getTitleModalConfirm = (
  modalConfirm: string,
  type: BudgetType
): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return type == BudgetType.Settlement
        ? "BG.confirm_return_settlement"
        : "BG.confirm_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return type == BudgetType.Settlement
        ? "BG.confirm_rejection_settlement"
        : "BG.confirm_rejection";
    default:
      return "";
  }
};

export const getContentModalConfirm = (
  modalConfirm: string,
  type: BudgetType
): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return type == BudgetType.Settlement
        ? "BG.return_warning_settlement"
        : "BG.return_warning";
    case MODEL_CONFIRM_TYPE.REJECT:
      return type == BudgetType.Settlement
        ? "BG.rejection_warning_settlement"
        : "BG.rejection_warning";
    default:
      return "";
  }
};

export const getLabelInputReason = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "BG.reason_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "BG.reason_reject";
    default:
      return "";
  }
};

export const getIconModal = (modalConfirm: string) => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return ReturnRoundIcon;
    case MODEL_CONFIRM_TYPE.REJECT:
      return RejectRoundIcon;
    default:
      return "";
  }
};
