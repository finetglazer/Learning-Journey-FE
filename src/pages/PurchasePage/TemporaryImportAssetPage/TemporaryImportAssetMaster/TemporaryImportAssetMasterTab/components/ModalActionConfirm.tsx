import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { isNil } from "lodash";
import {
  actionType,
  ConfirmModalType,
  TemporaryImportAssetTypeModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";

const MAX_LENGTH_REASON = 500;

interface PurchaseRequestConfirmModalProps {
  type: ConfirmModalType;
  model?: TemporaryImportAssetTypeModel;
  isLoading: boolean;
  loadingButton: boolean;
  errorMessage?: string;
  onApply?: (
    model: TemporaryImportAssetTypeModel,
    reason?: string,
    action?: number
  ) => void;
  onCancel?: () => void;
}

interface ModalProps {
  title: string;
  content: string[];
  icon: string;
  reasonLabel: string;
}

const ModalActionConfirm = ({
  type,
  model,
  isLoading,
  loadingButton,
  errorMessage,
  onApply,
  onCancel,
}: PurchaseRequestConfirmModalProps) => {
  const [translate] = useTranslation();
  const [reason, setReason] = useState<string>("");

  const mapModelToProps = useCallback(
    (type: ConfirmModalType, planType: number): ModalProps => {
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("TIA.title_confirm_delete", { planType }),
          content: ["content_confirm_delete", model?.code],
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("TIA.title_confirm_cancel", { planType }),
          content: ["content_confirm_cancel", model?.code],
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ConfirmModalType.REJECT]: {
          title: translate("TIA.title_confirm_reject", { planType }),
          content: ["content_confirm_reject", model?.code],
          icon: RejectRoundIcon,
          reasonLabel: translate("BG.txt_reason_reject"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("TIA.title_confirm_return", { planType }),
          content: ["content_confirm_return", model?.code],
          icon: ReturnRoundIcon,
          reasonLabel: translate("BG.txt_reason_return"),
        },
      };

      return modalProps[type];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, model?.isAdjust, model?.code]
  );

  const modalProps = useMemo(
    () => mapModelToProps(type, model?.planType),
    [mapModelToProps, type, model?.planType]
  );

  const onChangeText = (text: string) => {
    setReason(text);
  };

  const onSave = () => {
    if (isNil(onApply)) return;

    switch (type) {
      case ConfirmModalType.DELETE:
        onApply(model, reason);
        break;
      case ConfirmModalType.RETURN:
        onApply(model, reason, actionType.RETURN);
        break;
      case ConfirmModalType.REJECT:
        onApply(model, reason, actionType.DECLINED);
        break;
      default:
        onApply(model, reason);
        break;
    }
  };

  const renderReturn = (
    <div className="row d-flex flex-column gap-4 w-100 mt-4">
      <div className="col-lg-12 p-0">
        <FormItem
          message={errorMessage || ""}
          validateStatus={isNil(errorMessage) ? undefined : "error"}
        >
          <TextArea
            isRequired
            showCount
            className="reason-textarea"
            maxLength={MAX_LENGTH_REASON}
            label={modalProps.reasonLabel}
            placeHolder={translate("BG.input_reason")}
            value={reason}
            onChange={onChangeText}
            translate={translate}
            resize="none"
          />
        </FormItem>
      </div>
    </div>
  );

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`TIA.${modalProps?.content[0]}`}
          values={{
            budgetName: modalProps?.content[1],
            code: modalProps?.content[1],
          }}
        />
      }
      loading={isLoading}
      loadingButton={loadingButton}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      className="modal-confirm_temporary-import"
      handleSave={onSave}
      handleCancel={onCancel}
    >
      {/* TextArea */}
      {renderReturn}
    </ModalConfirm>
  );
};

export default ModalActionConfirm;
