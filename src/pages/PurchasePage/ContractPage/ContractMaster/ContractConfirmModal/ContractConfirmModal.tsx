import { useCallback, useMemo, useState } from "react";
import { isNil } from "lodash";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";

import { Contract, ModelConfirmType } from "models/Contract";

import { CancelRoundIcon, RejectRoundIcon, TrashRoundIcon } from "assets/icons";
import { MAX_LENGTH_TEXT_AREA } from "core/config/consts";
import { contractRequestTypeMap } from "pages/PurchasePage/constants";
import { SelectedModal } from "../ContractMasterHook";

interface ModalProps {
  title: string;
  content: string;
  icon: string;
  reasonLabel: string;
}

type ModalConfirmType =
  | ModelConfirmType.DELETE
  | ModelConfirmType.CANCEL
  | ModelConfirmType.CLOSE;

interface ContractConfirmModalProps {
  type: ModalConfirmType;
  model?: Contract;
  isLoading: boolean;
  errorMessage?: string;
  onApply?: (contract: Contract, reason: string) => void;
  onCancel?: () => void;
  setSelectedModal: React.Dispatch<React.SetStateAction<SelectedModal>>;
}

export const ContractConfirmModal = ({
  type,
  model,
  isLoading,
  errorMessage,
  onApply,
  onCancel,
  setSelectedModal,
}: ContractConfirmModalProps) => {
  const [translate] = useTranslation();
  const [reason, setReason] = useState<string>("");

  const contractType = contractRequestTypeMap?.[model?.contractRequestType];

  const mapModalToProps = useCallback(
    (type: ModalConfirmType): ModalProps => {
      const modalProps = {
        [ModelConfirmType.DELETE]: {
          title: translate("CT.modal.confirm.delete_title", { contractType }),
          content: translate("CT.modal.confirm.delete_content", {
            contractType,
            code: model?.code,
          }),
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ModelConfirmType.CANCEL]: {
          title: translate("CT.modal.confirm.cancel_title", { contractType }),
          content: translate("CT.modal.confirm.cancel_content", {
            contractType,
            code: model?.code,
          }),
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ModelConfirmType.CLOSE]: {
          title: translate("CT.modal.confirm.close", { contractType }),
          content: translate("CT.modal.confirm.close_warning", {
            contractType: model?.code,
          }),
          icon: RejectRoundIcon,
          reasonLabel: "",
        },
      };

      return modalProps[type];
    },
    [contractType, model?.code, translate]
  );

  const modalProps = useMemo(
    () => mapModalToProps(type),
    [mapModalToProps, type]
  );

  const onChangeText = (text: string) => {
    const trimmedValue = text.trim();

    setReason(trimmedValue);
    setSelectedModal((previousState) => ({
      ...previousState,
      errorMessage: null,
    }));
  };

  const onSave = () => {
    if (isNil(onApply)) return;

    onApply(model, reason);
  };

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={<Trans i18nKey={modalProps?.content} />}
      maskClosable={false}
      loading={isLoading}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={onCancel}
    >
      {/* TextArea */}
      {type !== ModelConfirmType.CLOSE && (
        <div className="w-100 h-100 m-t--lg">
          <FormItem
            message={errorMessage || ""}
            validateStatus={isNil(errorMessage) ? undefined : "error"}
          >
            <TextArea
              isRequired
              showCount
              maxLength={MAX_LENGTH_TEXT_AREA}
              label={modalProps.reasonLabel}
              placeHolder={translate("BG.input_reason")}
              value={reason}
              onChange={onChangeText}
            />
          </FormItem>
        </div>
      )}
    </ModalConfirm>
  );
};
