import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
  warningIcon,
} from "assets/icons";
import { isNil } from "lodash";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { AppUser } from "../../../models/AppUser";
import { PaymentRequestModel, TYPE_OF_PROPOSAL } from "models/Payment";

const MAX_LENGTH_REASON = 500;

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
  WARNING_INVOICE = "WARNING_INVOICE",
}

interface ModalProps {
  title: string;
  content: string[];
  icon: string;
  reasonLabel: string;
}

interface ConfirmModalProps<T> {
  type: ConfirmModalType;
  model?: AppUser | PaymentRequestModel;
  isLoading: boolean;
  errorMessage?: string;
  onApply?: (item: T, reason: string) => void;
  onCancel?: () => void;
}

export const PaymentConfirmModal = <T extends object>({
  type,
  model,
  isLoading,
  errorMessage,
  onApply,
  onCancel,
}: ConfirmModalProps<T>) => {
  const [translate] = useTranslation();

  const [reason, setReason] = useState<string>("");

  const getNameBy = useCallback(
    (type: number): string => {
      let key = "";
      switch (type) {
        case TYPE_OF_PROPOSAL.PAYMENT:
          key = "txt_create_payment";
          break;
        case TYPE_OF_PROPOSAL.ADVANCE:
          key = "txt_create_payment_advande";
          break;
        case TYPE_OF_PROPOSAL.EXPENSE:
          key = "txt_create_payment_expense";
          break;
        case TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY:
          key = "txt_create_payment_accounting";
          break;
        case TYPE_OF_PROPOSAL.DEPOSIT:
          key = "txt_create_payment_deposit";
          break;
        default:
          key = "";
          break;
      }

      return translate(`PM.${key}`).toLowerCase();
    },
    [translate]
  );

  const mapModelToProps = useCallback(
    (type: ConfirmModalType, paymentType: number): ModalProps => {
      const paymentName = getNameBy(paymentType);
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("PM.title_confirm_delete", { paymentName }),
          content: ["content_confirm_delete", paymentName],
          icon: TrashRoundIcon,
          reasonLabel: translate("PM.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("PM.title_confirm_cancel", { paymentName }),
          content: ["content_confirm_cancel", paymentName],
          icon: CancelRoundIcon,
          reasonLabel: translate("PM.txt_reason_cancel"),
        },
        [ConfirmModalType.REJECT]: {
          title: translate("PM.title_confirm_reject", { paymentName }),
          content: ["content_confirm_reject", paymentName],
          icon: RejectRoundIcon,
          reasonLabel: translate("PM.txt_reason_reject"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("PM.title_confirm_return", { paymentName }),
          content: ["content_confirm_return", paymentName],
          icon: ReturnRoundIcon,
          reasonLabel: translate("PM.txt_reason_return"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("PM.title_confirm_return", { paymentName }),
          content: ["content_confirm_return", paymentName],
          icon: ReturnRoundIcon,
          reasonLabel: translate("PM.txt_reason_return"),
        },
        [ConfirmModalType.WARNING_INVOICE]: {
          title: translate("PM.title_confirm_invoice"),
          content: ["content_confirm_invoice"],
          icon: warningIcon,
          reasonLabel: translate("PM.txt_reason_return"),
        },
      };

      return modalProps[type];
    },
    [getNameBy, translate]
  );

  const modalProps = useMemo(
    () => mapModelToProps(type, model.paymentGroup),
    [mapModelToProps, model.paymentGroup, type]
  );

  const onChangeText = (text: string) => {
    const trimmedValue = text.trim();

    setReason(trimmedValue);
  };

  const onSave = () => {
    if (isNil(onApply)) return;

    onApply(model, reason);
  };

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`BG.${modalProps?.content[0]}`}
          values={{ budgetName: modalProps?.content[1], code: model?.code }}
        />
      }
      loading={isLoading}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={onCancel}
    >
      {/* TextArea */}
      {type === ConfirmModalType.WARNING_INVOICE ? null : (
        <div className="w-100 h-100 m-t--lg">
          <FormItem
            message={errorMessage || ""}
            validateStatus={isNil(errorMessage) ? undefined : "error"}
          >
            <TextArea
              isRequired
              showCount
              maxLength={MAX_LENGTH_REASON}
              label={modalProps.reasonLabel}
              placeHolder={translate("BG.input_reason")}
              value={reason}
              onChange={onChangeText}
              resize="none"
            />
          </FormItem>
        </div>
      )}
    </ModalConfirm>
  );
};
