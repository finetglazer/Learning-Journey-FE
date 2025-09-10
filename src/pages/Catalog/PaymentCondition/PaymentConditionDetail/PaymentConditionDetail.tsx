import { Switch } from "antd";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { usePaymentConditionDetailHook } from "./PaymentConditionDetailHook";
import { TEXT_AREA_MAX_LENGTH } from "../../constants";

export interface PaymentConditionDetailProps {
  paymentConditionId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const PaymentConditionDetail = ({
  paymentConditionId,
  dismiss,
}: PaymentConditionDetailProps) => {
  const {
    translate,
    isLoading,
    model,
    title,
    handleChangeSingleField,
    handleChangeBoolField,
    onSave,
  } = usePaymentConditionDetailHook(dismiss, paymentConditionId);

  const StatusView = () => {
    return (
      <div className="d-flex flex-row gap-2">
        <span className="status-style">{translate("CM.txt_status")}</span>
        <Switch
          className="switch__custom"
          value={model.isActive}
          onChange={handleChangeBoolField({
            fieldName: "isActive",
          })}
        />
        <span className="active-style">
          {translate("CM.txt_status_active")}
        </span>
      </div>
    );
  };

  return (
    <Modal
      open
      loading={isLoading}
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={title}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={dismiss}
    >
      <div className="d-flex size-full flex-column gap-3">
        {/* Status */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "isActive")}
        >
          <StatusView />
        </FormItem>

        {/* Code */}
        <FormItem validateObject={utilService.getValidateObj(model, "code")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("PC.txt_payment_condition_code")}
            placeHolder={translate(
              "PC.placeholder_select_payment_condition_code"
            )}
            value={model?.code}
            onChange={handleChangeSingleField({
              fieldName: "code",
            })}
          />
        </FormItem>

        {/* Name */}
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("PC.txt_payment_condition_name")}
            placeHolder={translate(
              "PC.placeholder_type_payment_condition_name"
            )}
            value={model?.name}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
          />
        </FormItem>

        {/* Description */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            isRequired
            label={translate("PC.txt_payment_condition_description")}
            placeHolder={translate(
              "PC.placeholder_type_payment_condition_description"
            )}
            value={model?.description}
            showCount
            resize="none"
            maxLength={TEXT_AREA_MAX_LENGTH}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            translate={translate}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
