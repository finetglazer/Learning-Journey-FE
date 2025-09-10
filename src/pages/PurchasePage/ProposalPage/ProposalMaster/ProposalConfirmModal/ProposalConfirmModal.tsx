import { CancelRoundIcon, RejectRoundIcon, TrashRoundIcon } from "assets/icons";
import { isNil } from "lodash";
import { Proposal } from "models/Proposal";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";

const MAX_LENGTH_REASON = 500;
const ZERO = 0;

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  CLOSE = "CLOSE",
}

interface ModalProps {
  title: string;
  content: string[];
  icon: string;
  reasonLabel: string;
}

interface ProposalConfirmModalProps {
  type: ConfirmModalType;
  model?: Proposal;
  isLoading: boolean;
  errorMessage?: string;
  onApply?: (proposal: Proposal, reason: string) => void;
  onCancel?: () => void;
}

export const ProposalConfirmModal = ({
  type,
  model,
  isLoading,
  errorMessage,
  onApply,
  onCancel,
}: ProposalConfirmModalProps) => {
  const [translate] = useTranslation();

  const [reason, setReason] = useState<string>("");

  const getProposalNameBy = useCallback(
    (isAdjust: boolean): string => {
      const key = isAdjust ? "adjust_proposal" : "proposal";
      return translate(`PP.${key}`).toLowerCase();
    },
    [translate]
  );

  const mapModelToProps = useCallback(
    (type: ConfirmModalType): ModalProps => {
      const name = getProposalNameBy(model?.isAdjust);

      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("PP.title_confirm_delete", {
            name,
          }),
          content: model?.isAdjust
            ? ["content_confirm_delete_adjust", model.code]
            : ["content_confirm_delete", model.code],
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("PP.title_confirm_cancel", {
            name,
          }),
          content: model?.isAdjust
            ? ["content_confirm_cancel_adjust", model.code]
            : ["content_confirm_cancel", model.code],
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ConfirmModalType.CLOSE]: {
          title: translate("PP.confirm_close"),
          content: ["close_warning"],
          icon: RejectRoundIcon,
          reasonLabel: "",
        },
      };

      return modalProps[type];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, model?.isAdjust, model.code]
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

    onApply(model, reason);
  };

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`PP.${modalProps?.content[ZERO]}`}
          values={{ code: model.code }}
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
      {type !== ConfirmModalType.CLOSE && (
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
              translate={translate}
            />
          </FormItem>
        </div>
      )}
    </ModalConfirm>
  );
};
