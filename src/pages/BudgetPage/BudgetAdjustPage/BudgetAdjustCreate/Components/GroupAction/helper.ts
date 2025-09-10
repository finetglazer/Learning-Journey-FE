import { RejectRoundIcon, ReturnRoundIcon } from "assets/icons";
import { MODEL_CONFIRM_TYPE } from "../../BudgetAdjustHook";

export const getTitleModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "BG.confirm_return_adjust";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "BG.confirm_rejection_adjust";
    default:
      return "";
  }
};

export const getContentModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "BG.return_warning_adjust";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "BG.rejection_warning_adjust";
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
