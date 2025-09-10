import {
  ApproveRoundIcon,
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { ModelConfirmType } from "models/Contract";

export const getIconModal = (modalConfirm: string) => {
  switch (modalConfirm) {
    case ModelConfirmType.RETURN:
      return ReturnRoundIcon;
    case ModelConfirmType.REJECT:
      return RejectRoundIcon;
    case ModelConfirmType.CLOSE:
      return RejectRoundIcon;
    case ModelConfirmType.DELETE:
      return TrashRoundIcon;
    case ModelConfirmType.CANCEL:
      return CancelRoundIcon;
    case ModelConfirmType.APPROVE:
      return ApproveRoundIcon;
    default:
      return "";
  }
};

export const getLabelInputReason = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case ModelConfirmType.RETURN:
      return "PP.reason_return";
    case ModelConfirmType.REJECT:
      return "PP.reason_reject";
    case ModelConfirmType.CLOSE:
      return "PP.reason_close";
    case ModelConfirmType.DELETE:
      return "BG.txt_reason_delete";
    case ModelConfirmType.CANCEL:
      return "BG.txt_reason_cancel";
    default:
      return "";
  }
};

export const getTitleModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case ModelConfirmType.RETURN:
      return "CT.modal.confirm.return";
    case ModelConfirmType.REJECT:
      return "CT.modal.confirm.rejection";
    case ModelConfirmType.CLOSE:
      return "CT.modal.confirm.close";
    case ModelConfirmType.DELETE:
      return "CT.modal.confirm.delete";
    case ModelConfirmType.CANCEL:
      return "CT.modal.confirm.cancel";
    case ModelConfirmType.APPROVE:
      return "CT.modal.confirm.approve";
    default:
      return "";
  }
};

export const getContentModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case ModelConfirmType.RETURN:
      return "CT.modal.confirm.rejection_warning";
    case ModelConfirmType.REJECT:
      return "CT.modal.confirm.return_warning";
    case ModelConfirmType.CLOSE:
      return "CT.modal.confirm.close_warning";
    case ModelConfirmType.CANCEL:
      return "CT.modal.confirm.cancel_content";
    case ModelConfirmType.DELETE:
      return "CT.modal.confirm.delete_content";
    case ModelConfirmType.APPROVE:
      return "CT.modal.confirm.approve_warning";
    default:
      return "";
  }
};
