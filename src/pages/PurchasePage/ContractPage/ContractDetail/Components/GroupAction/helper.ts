import {
  ApproveRoundIcon,
  CancelRoundIcon,
  DeleteRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
} from "assets/icons";
import { ModelConfirmType } from "models/Contract";

export interface ModalConfirmObject {
  title: string;
  warning: string;
  label: string;
  icon: string;
}

export const getObjectModalConfirm = (
  modalConfirm: ModelConfirmType
): ModalConfirmObject => {
  const mapTitleModal = new Map([
    [
      ModelConfirmType.RETURN,
      {
        title: "CT.modal.confirm.return",
        warning: "CT.modal.confirm.return_warning",
        label: "PP.reason_return",
        icon: ReturnRoundIcon,
      },
    ],
    [
      ModelConfirmType.REJECT,
      {
        title: "CT.modal.confirm.rejection",
        warning: "CT.modal.confirm.rejection_warning",
        label: "PP.reason_reject",
        icon: RejectRoundIcon,
      },
    ],
    [
      ModelConfirmType.CLOSE,
      {
        title: "CT.modal.confirm.close",
        warning: "CT.modal.confirm.close_warning",
        label: "PP.reason_close",
        icon: RejectRoundIcon,
      },
    ],
    [
      ModelConfirmType.CANCEL,
      {
        title: "CT.modal.confirm.cancel",
        warning: "CT.modal.confirm.cancel_warning",
        label: "PP.reason_cancel",
        icon: CancelRoundIcon,
      },
    ],
    [
      ModelConfirmType.DELETE,
      {
        title: "CT.modal.confirm.delete",
        warning: "CT.modal.confirm.delete_warning",
        label: "PP.reason_delete",
        icon: DeleteRoundIcon,
      },
    ],
    [
      ModelConfirmType.APPROVE,
      {
        title: "CT.modal.confirm.approve",
        warning: "CT.modal.confirm.approve_warning",
        label: "PP.reason_approve",
        icon: ApproveRoundIcon,
      },
    ],
  ]);

  if (mapTitleModal.has(modalConfirm)) {
    return mapTitleModal.get(modalConfirm);
  }

  return { title: "", warning: "", label: "", icon: "" };
};
