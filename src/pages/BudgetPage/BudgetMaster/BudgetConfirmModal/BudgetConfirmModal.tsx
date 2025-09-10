import {
  CancelRoundIcon,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { isNil } from "lodash";
import { Budget } from "models/Budget/Budget";
import { useCallback, useMemo, useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";

const MAX_LENGTH_REASON = 500;
const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
}

interface ModalProps {
  title: string;
  content: string[];
  icon: string;
  reasonLabel: string;
}

interface BudgetConfirmModalProps {
  type: ConfirmModalType;
  model?: Budget;
  isLoading: boolean;
  errorMessage?: string;
  onApply?: (budget: Budget, reason: string) => void;
  onCancel?: () => void;
}

export const BudgetConfirmModal = ({
  type,
  model,
  isLoading,
  errorMessage,
  onApply,
  onCancel,
}: BudgetConfirmModalProps) => {
  const [translate] = useTranslation();

  const [reason, setReason] = useState<string>("");

  const getBudgetNameBy = useCallback(
    (type: number): string => {
      let key = "";
      switch (type) {
        case ZERO:
          key = "create_new_budget_plan";
          break;
        case ONE:
          key = "txt_create_adjust";
          break;
        case TWO:
          key = "txt_create_adjust";
          break;
        case THREE:
          key = "txt_create_finalization";
          break;
        default:
          key = "";
          break;
      }

      return translate(`BG.${key}`).toLowerCase();
    },
    [translate]
  );

  const mapModelToProps = useCallback(
    (type: ConfirmModalType, budgetType: number): ModalProps => {
      const budgetName = getBudgetNameBy(budgetType);
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: translate("BG.title_confirm_delete", { budgetName }),
          content: ["content_confirm_delete", budgetName],
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: translate("BG.title_confirm_cancel", { budgetName }),
          content: ["content_confirm_cancel", budgetName],
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ConfirmModalType.REJECT]: {
          title: translate("BG.title_confirm_reject", { budgetName }),
          content: ["content_confirm_reject", budgetName],
          icon: RejectRoundIcon,
          reasonLabel: translate("BG.txt_reason_reject"),
        },
        [ConfirmModalType.RETURN]: {
          title: translate("BG.title_confirm_return", { budgetName }),
          content: ["content_confirm_return", budgetName],
          icon: ReturnRoundIcon,
          reasonLabel: translate("BG.txt_reason_return"),
        },
      };

      return modalProps[type];
    },
    [getBudgetNameBy, translate]
  );

  const modalProps = useMemo(
    () => mapModelToProps(type, model.type),
    [mapModelToProps, model.type, type]
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
          i18nKey={`BG.${modalProps?.content[ZERO]}`}
          values={{ budgetName: modalProps?.content[ONE], code: model?.code }}
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
    </ModalConfirm>
  );
};
