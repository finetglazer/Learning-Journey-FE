import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { isEqual, isNil } from "lodash";
import { ContractRequestType } from "models/Settlement";
import { ConfirmModalType } from "core/helpers/enum";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { ContractTerminationModel } from "models/ContractTermination";
import { ModelSelect } from "models/ContractLiquidation";

const MAX_LENGTH_REASON = 500;

interface PurchaseRequestConfirmModalProps {
  type: ConfirmModalType;
  model?: ContractTerminationModel | any;
  isLoading: boolean;
  loadingButton: boolean;
  errorMessage?: string;
  onApply?: (model: ContractTerminationModel | any, reason?: string) => void;
  onCancel?: () => void;
  setModelSelected?: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
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

  const isContract = isEqual(
    model?.contactOrderInfo?.contractRequestType ??
      model?.contract?.contractRequestType,
    ContractRequestType.Contract
  );

  const mapModelToProps = useCallback(
    (type: ConfirmModalType): ModalProps => {
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("contractTermination.title_confirm_delete", {
            typeContract: isContract
              ? translate("settlement.title_contract")
              : translate("settlement.content_purchase_order"),
          }),
          content: ["content_confirm_delete", model?.code],
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("contractTermination.title_confirm_cancel", {
            typeContract: isContract
              ? translate("settlement.title_contract")
              : translate("settlement.content_purchase_order"),
          }),
          content: ["content_confirm_cancel", model?.code],
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("contractTermination.title_confirm_return", {
            typeContract: isContract
              ? translate("settlement.title_contract")
              : translate("settlement.content_purchase_order"),
          }),
          content: ["content_confirm_return", model?.code],
          icon: ReturnRoundIcon,
          reasonLabel: translate("PM.txt_reason_return"),
        },
        [ConfirmModalType.REJECT]: {
          title: translate("contractTermination.title_confirm_reject", {
            typeContract: isContract
              ? translate("settlement.title_contract")
              : translate("settlement.content_purchase_order"),
          }),
          content: ["content_confirm_reject", model?.code],
          icon: RejectRoundIcon,
          reasonLabel: translate("PM.txt_reason_reject"),
        },
      };

      return modalProps[type];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, model?.code]
  );

  const modalProps = useMemo(
    () => mapModelToProps(type),
    [mapModelToProps, type]
  );

  const onChangeText = (text: string) => {
    const contentReason = text.trim();
    setReason(contentReason);
  };

  // const onSave = () => {
  //   if (isNil(onApply)) return;

  //   switch (type) {
  //     case ConfirmModalType.DELETE:
  //       onApply(model, reason);
  //       break;
  //     case ConfirmModalType.RETURN:
  //       onApply(model, reason);
  //       break;
  //     case ConfirmModalType.REJECT:
  //       onApply(model, reason);
  //       break;
  //     default:
  //       onApply(model, reason);
  //       break;
  //   }
  // };

  const onSave = () => {
    if (!isNil(onApply)) {
      onApply(model, reason);
    }
  };

  const renderReturn = useMemo(() => {
    return (
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
  }, [errorMessage, modalProps.reasonLabel, reason, translate]);

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`contractTermination.${modalProps?.content[0]}`}
          values={{
            budgetName: modalProps?.content[1],
            code: modalProps?.content[1],
            typeContract: isContract
              ? translate("settlement.title_contract")
              : translate("settlement.content_purchase_order"),
          }}
        />
      }
      loading={isLoading}
      loadingButton={loadingButton}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      className="modal-confirm_settlement_contract"
      handleSave={onSave}
      handleCancel={onCancel}
    >
      {/* TextArea */}
      {renderReturn}
    </ModalConfirm>
  );
};

export default ModalActionConfirm;
