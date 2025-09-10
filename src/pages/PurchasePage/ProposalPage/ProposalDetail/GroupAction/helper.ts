import { RejectRoundIcon, ReturnRoundIcon } from "assets/icons";
import { MODEL_CONFIRM_TYPE } from "pages/BudgetPage/BudgetCreate/BudgetCreateHook";

export const getTitleModalConfirm = (
  modalConfirm: string,
  isAdjust: boolean
): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return isAdjust ? "PP.confirm_return_adjust" : "PP.confirm_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return isAdjust ? "PP.confirm_rejection_adjust" : "PP.confirm_rejection";
    case MODEL_CONFIRM_TYPE.CLOSE:
      return "PP.confirm_close";
    default:
      return "";
  }
};

export const getContentModalConfirm = (
  modalConfirm: string,
  isAdjust: boolean
): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return isAdjust
        ? "PP.content_confirm_return_adjust"
        : "PP.return_warning";
    case MODEL_CONFIRM_TYPE.REJECT:
      return isAdjust
        ? "PP.content_confirm_rejection_adjust"
        : "PP.rejection_warning";
    case MODEL_CONFIRM_TYPE.CLOSE:
      return "PP.close_warning";
    default:
      return "";
  }
};

export const getLabelInputReason = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "PP.reason_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "PP.reason_reject";
    case MODEL_CONFIRM_TYPE.CLOSE:
      return "PP.reason_close";
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
    case MODEL_CONFIRM_TYPE.CLOSE:
      return RejectRoundIcon;
    default:
      return "";
  }
};
