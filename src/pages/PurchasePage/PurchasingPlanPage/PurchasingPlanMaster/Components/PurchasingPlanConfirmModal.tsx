import {
  ApproveRoundIcon,
  CancelRoundIcon,
  IcInfo,
  RejectRoundIcon,
  ReturnRoundIcon,
  TrashRoundIcon,
} from "assets/icons";
import { isEqual, isNil, set } from "lodash";
import CommonFilter from "models/CommonFilter";
import { PurchasingPlan, SearchingFilterModel } from "models/PurchasingPlan";
import React, { useCallback, useMemo, useState } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  ModalConfirm,
  Select,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { ModelSelect } from "../PurchasingPlanMasterHook";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";
import { purchasingPlanRepository } from "../../PurchasingPlanRepository";
import { combineTextExtra } from "core/helpers/text";

const MAX_LENGTH_REASON = 500;

interface ModalProps {
  title: string;
  content: string | string[];
  icon: string;
  reasonLabel: string;
}

export interface DataForm {
  email?: string;
  reason?: string;
}

interface PurchasePlanConfirmModalProps {
  type: ConfirmModalType;
  model?: PurchasingPlan;
  isLoading: boolean;
  errorMessage?: { [key: string]: string };
  onApply?: (
    id: PurchasingPlan,
    data?: DataForm,
    callbackFc?: () => void
  ) => void;
  onCancel?: () => void;
  setModelSelected?: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  loadingButton?: boolean;
  isAdjust?: boolean;
  handleOpenSignFormModal?: () => void;
  isRejectCancel?: boolean;
}

export const PurchasingPlanConfirmModal = ({
  type,
  model,
  errorMessage,
  loadingButton,
  onApply,
  onCancel,
  setModelSelected,
  isAdjust = false,
  handleOpenSignFormModal,
  isRejectCancel = false,
}: PurchasePlanConfirmModalProps) => {
  const [translate] = useTranslation();

  const [form, setForm] = useState<DataForm>({
    email: "",
    reason: "",
  });

  const mapModelToProps = useCallback(
    (type: ConfirmModalType, planType: number): ModalProps => {
      const modalProps = {
        [ConfirmModalType.DELETE]: {
          title: isAdjust
            ? translate("PL.title_adjust_confirm_delete", { planType })
            : translate("PL.title_confirm_delete", { planType }),
          content: isAdjust
            ? ["content_confirm_delete_adjust_purchasing_plan", model?.code]
            : ["content_confirm_delete_purchasing_plan"],
          icon: TrashRoundIcon,
          reasonLabel: translate("BG.txt_reason_delete"),
        },
        [ConfirmModalType.CANCEL]: {
          title: isAdjust
            ? translate("PL.title_adjust_confirm_cancel", { planType })
            : translate("PL.title_confirm_cancel", { planType }),
          content: isAdjust
            ? ["content_confirm_adjust_cancel_purchasing_plan", model?.code]
            : ["content_confirm_cancel_purchasing_plan", model?.code],
          icon: CancelRoundIcon,
          reasonLabel: translate("BG.txt_reason_cancel"),
        },
        [ConfirmModalType.RETURN]: {
          title: isAdjust
            ? translate("PL.title_adjust_confirm_return")
            : translate("PL.title_confirm_return"),
          content: isAdjust
            ? ["content_adjust_confirm_return", model?.code]
            : ["content_confirm_return", model?.code],
          icon: ReturnRoundIcon,
          reasonLabel: translate("BG.reason_return"),
        },
        [ConfirmModalType.REJECT]: {
          title: isRejectCancel
            ? translate("PL.title_confirm_reject_cancel")
            : isAdjust
            ? translate("PL.title_adjust_confirm_reject")
            : translate("PL.title_confirm_reject"),
          content: isRejectCancel
            ? ["content_confirm_reject_cancel", model?.code]
            : isAdjust
            ? ["content_adjust_confirm_reject", model?.code]
            : ["content_confirm_reject", model?.code],
          icon: RejectRoundIcon,
          reasonLabel: translate("PM.txt_reason_reject"),
        },
        [ConfirmModalType.SEND_APPROVE]: {
          title: translate("PL.title_confirm_send_approve"),
          content: ["content_confirm_send_approve", model?.code],
          icon: IcInfo,
          reasonLabel: translate("PM.txt_reason_reject"),
        },
        [ConfirmModalType.SEND_RESULT]: {
          title: translate("PL.confirm_result"),
          content: ["confirm_result_content"],
          icon: ApproveRoundIcon,
          reasonLabel: "",
        },
        [ConfirmModalType.RENEGOTIATION]: {
          title: translate("PL.select_supplier.title.modal_select_supplier"),
          content: ["select_supplier.title.modal_select_supplier_content"],
          icon: ReturnRoundIcon,
          reasonLabel: "",
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

  const onChangeForm = useCallback(
    (data: Model | string, id: string) => {
      setForm(set({ ...form }, id, data));
    },
    [form]
  );

  const onSave = () => {
    if (isNil(onApply)) return;
    const data: DataForm = {
      email: form?.email,
      reason: form?.reason,
    };
    onApply(model, data, handleOpenSignFormModal);
  };

  const userListOptions = ConfirmModalType.CANCEL === type && (
    <div className="row d-flex flex-column gap-4 w-100 mt-4">
      <div className="col-lg-12 p-0">
        <FormItem
          message={errorMessage?.user || ""}
          validateStatus={isNil(errorMessage?.user) ? undefined : "error"}
        >
          <Select
            isRequired
            label={translate("PL.user_approve")}
            isEnumerable={false}
            isSmall={false}
            placeHolder={translate("PL.plh_user_approve")}
            onChange={(_, selectedList) => {
              onChangeForm(selectedList.email, "email");
              setModelSelected &&
                setModelSelected((prevState) => {
                  return {
                    ...prevState,
                    errorMessage: {
                      ...prevState?.errorMessage,
                      user: null,
                    },
                  };
                });
            }}
            value={{
              email: form?.email,
            }}
            render={(valueRender) => {
              return combineTextExtra(valueRender?.email, valueRender?.name);
            }}
            classFilter={SearchingFilterModel}
            searchProperty="searchText"
            isSearch={true}
            getList={(TModelFilter) => {
              return purchasingPlanRepository.listMasterUser({
                pageIndex: 1,
                pageSize: 30,
                searchText: TModelFilter?.searchText,
                isActive: true,
                isSupplier: false,
              } as SearchingFilterModel);
            }}
          />
        </FormItem>
      </div>
      <div className="col-lg-12 p-0">
        <FormItem
          message={errorMessage?.reason || ""}
          validateStatus={isNil(errorMessage?.reason) ? undefined : "error"}
        >
          <TextArea
            isRequired
            showCount
            className="reason-textarea"
            maxLength={MAX_LENGTH_REASON}
            label={modalProps.reasonLabel}
            placeHolder={translate("BG.input_reason")}
            value={form?.reason}
            onChange={(data: string) => {
              onChangeForm(data, "reason");
              setModelSelected &&
                setModelSelected((prevState) => {
                  return {
                    ...prevState,
                    errorMessage: {
                      ...prevState?.errorMessage,
                      reason: null,
                    },
                  };
                });
            }}
            translate={translate}
            resize="none"
          />
        </FormItem>
      </div>
    </div>
  );

  const renderReturn = useCallback(() => {
    const isShowReason =
      isEqual(ConfirmModalType.RETURN, type) ||
      isEqual(ConfirmModalType.REJECT, type) ||
      isEqual(ConfirmModalType.DELETE, type) ||
      (isAdjust && isEqual(ConfirmModalType.DELETE, type));

    if (!isShowReason) return;
    return (
      <div className="row d-flex flex-column gap-4 w-100 mt-4">
        <FormItem
          message={errorMessage?.reason || ""}
          validateStatus={isNil(errorMessage?.reason) ? undefined : "error"}
        >
          <TextArea
            isRequired
            showCount
            className="reason-textarea"
            maxLength={MAX_LENGTH_REASON}
            label={modalProps.reasonLabel}
            placeHolder={translate("BG.input_reason")}
            value={form.reason}
            onChange={(data: string) => {
              onChangeForm(data, "reason");
              setModelSelected &&
                setModelSelected((prevState) => {
                  return {
                    ...prevState,
                    errorMessage: {
                      ...prevState?.errorMessage,
                      reason: null,
                    },
                  };
                });
            }}
            translate={translate}
            resize="none"
          />
        </FormItem>
      </div>
    );
  }, [
    errorMessage,
    form.reason,
    isAdjust,
    modalProps?.reasonLabel,
    onChangeForm,
    setModelSelected,
    translate,
    type,
  ]);

  return (
    <ModalConfirm
      open
      title={modalProps?.title}
      content={
        <Trans
          i18nKey={`PL.${modalProps?.content[0]}`}
          values={{
            budgetName: modalProps?.content[1],
            code: modalProps?.content[1],
          }}
        />
      }
      loadingButton={loadingButton}
      icon={<img src={modalProps?.icon} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      className="modal-confirm_purchase-plan"
      handleSave={onSave}
      handleCancel={onCancel}
      maskClosable={false}
    >
      {/* TextArea */}
      {userListOptions}
      {renderReturn()}
    </ModalConfirm>
  );
};
