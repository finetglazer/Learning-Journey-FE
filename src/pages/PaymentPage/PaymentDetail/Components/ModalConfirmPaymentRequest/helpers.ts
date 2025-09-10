import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { EConfirmType } from "./ModalConfirmPaymentRequest";

export const getTitleModalConfirm = (modalConfirm: EConfirmType): string => {
  switch (modalConfirm) {
    case EConfirmType.RETURN:
      return "PM.title_confirm_return";
    case EConfirmType.REJECT:
      return "PM.title_confirm_reject";
    case EConfirmType.CANCEL:
      return "PM.title_confirm_cancel";
    case EConfirmType.DELETE:
      return "PM.title_confirm_delete";
    default:
      return "";
  }
};

export const getContentModalConfirm = (modalConfirm: EConfirmType): string => {
  switch (modalConfirm) {
    case EConfirmType.RETURN:
      return "PM.content_confirm_return";
    case EConfirmType.REJECT:
      return "PM.content_confirm_reject";
    case EConfirmType.CANCEL:
      return "PM.content_confirm_cancel";
    case EConfirmType.DELETE:
      return "PM.content_confirm_delete";
    default:
      return "";
  }
};

export const getLabelInputReason = (modalConfirm: EConfirmType): string => {
  switch (modalConfirm) {
    case EConfirmType.RETURN:
      return "PM.txt_reason_return";
    case EConfirmType.REJECT:
      return "PM.txt_reason_reject";
    case EConfirmType.CANCEL:
      return "PM.txt_reason_cancel";
    case EConfirmType.DELETE:
      return "PM.txt_reason_delete";
    default:
      return "";
  }
};

export const getIconModal = (modalConfirm: EConfirmType) => {
  switch (modalConfirm) {
    case EConfirmType.RETURN:
      return ReturnRoundIcon;
    case EConfirmType.REJECT:
      return RejectRoundIcon;
    case EConfirmType.CANCEL:
      return CancelRoundIcon;
    case EConfirmType.DELETE:
      return TrashRoundIcon;
    default:
      return "";
  }
};
