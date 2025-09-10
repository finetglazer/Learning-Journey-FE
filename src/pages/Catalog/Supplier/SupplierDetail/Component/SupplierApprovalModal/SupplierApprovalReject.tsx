import { MAX_LENGTH_500 } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { Supplier } from "models/Supplier/Supplier";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface SupplierApprovalRejectProps {
  onCancel: () => void;
  onReject: () => void;
  model: Supplier;
  onChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
}

export const SupplierApprovalReject = ({
  onCancel,
  onReject,
  onChangeSingleField,
  model,
}: SupplierApprovalRejectProps) => {
  const [translate] = useTranslation();

  return (
    <ModalConfirm
      open
      title={translate("CM.txt_rejected")}
      content={translate("SL.message_reject")}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={onCancel}
      handleSave={onReject}
    >
      <div className="w-100 h-100 m-t--lg">
        <FormItem validateObject={utilService.getValidateObj(model, "reason")}>
          <TextArea
            placeHolder={translate("SL.placeholder_reason")}
            label={translate("CM.txt_reason_cancel")}
            maxLength={MAX_LENGTH_500}
            onChange={onChangeSingleField({
              fieldName: "reason",
            })}
            resize="none"
            isRequired
            showCount
          />
        </FormItem>
      </div>
    </ModalConfirm>
  );
};
