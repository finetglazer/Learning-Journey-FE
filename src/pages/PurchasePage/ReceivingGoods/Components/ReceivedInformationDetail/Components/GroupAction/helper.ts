import { RejectRoundIcon, ReturnRoundIcon } from "assets/icons";
import { MODEL_CONFIRM_TYPE } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";

export const getTitleModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "RG.title_confirm_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "RG.title_confirm_reject";
    default:
      return "";
  }
};

export const getContentModalConfirm = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "RG.content_confirm_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "RG.content_confirm_reject";
    default:
      return "";
  }
};

export const getLabelInputReason = (modalConfirm: string): string => {
  switch (modalConfirm) {
    case MODEL_CONFIRM_TYPE.RETURN:
      return "RG.txt_reason_return";
    case MODEL_CONFIRM_TYPE.REJECT:
      return "RG.txt_reason_reject";
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
