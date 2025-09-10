import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import {
  ERROR_TYPE,
  MAX_LENGTH_REASON,
  numberConstants,
} from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { isNil } from "lodash";
import { AcceptanceModel } from "models/Acceptance/Acceptance";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
interface ModalProps {
  title: string;
  content: string[];
  icon: string;
  reasonLabel: string;
}

interface AcceptanceConfirmModalProps {
  type: ConfirmModalType;
  model?: AcceptanceModel;
  isLoading: boolean;
  onApply?: (acceptanceId: string, reason: string) => void;
  onCancel?: () => void;
  errorMessage?: string;
}

export const AcceptanceConfirmModal = ({
  type,
  model,
  isLoading,
  onApply,
  onCancel,
  errorMessage,
}: AcceptanceConfirmModalProps) => {
  const [translate] = useTranslation();

  const [reason, setReason] = useState<string>("");

  const mapModelToProps = useCallback(
    (type: ConfirmModalType): ModalProps => {
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("AC.title_confirm_delete"),
          content: ["content_confirm_delete"],
          icon: TrashRoundIcon,
          reasonLabel: translate("CM.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("AC.title_confirm_cancel"),
          content: ["content_confirm_cancel"],
          icon: CancelRoundIcon,
          reasonLabel: translate("CM.txt_reason_cancel"),
        },
        [ConfirmModalType.REJECT]: {
          title: translate("AC.title_confirm_reject"),
          content: ["content_confirm_reject"],
          icon: RejectRoundIcon,
          reasonLabel: translate("CM.txt_reason_reject"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("AC.title_confirm_return"),
          content: ["content_confirm_return"],
          icon: ReturnRoundIcon,
          reasonLabel: translate("CM.txt_reason_return"),
        },
      };

      return modalProps[type];
    },
    [translate]
  );

  const modalProps = useMemo(
    () => mapModelToProps(type),
    [mapModelToProps, type]
  );

  const onChangeText = (text: string) => {
    const trimmedValue = text.trim();

    setReason(trimmedValue);
  };

  const onSave = () => {
    if (isNil(onApply)) return;

    onApply(model?.id, reason);
  };

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`AC.${modalProps?.content[numberConstants.ZERO]}`}
          values={{
            receivedName: modalProps?.content[numberConstants.ONE],
            code: model?.code,
            name: model?.name,
          }}
        />
      }
      loading={isLoading}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={onCancel}
    >
      <div className="w-100 h-100 m-t--lg">
        <FormItem
          message={errorMessage || ""}
          validateStatus={isNil(errorMessage) ? undefined : ERROR_TYPE}
        >
          <TextArea
            isRequired
            showCount
            maxLength={MAX_LENGTH_REASON}
            label={modalProps?.reasonLabel}
            placeHolder={translate("BG.input_reason")}
            value={reason}
            onChange={onChangeText}
            resize="none"
          />
        </FormItem>
      </div>
    </ModalConfirm>
  );
};
