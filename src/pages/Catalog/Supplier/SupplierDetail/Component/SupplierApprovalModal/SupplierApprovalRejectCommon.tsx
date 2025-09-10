import { MAX_LENGTH_500 } from "core/config/consts";
import { isEmpty } from "lodash";
import { useState } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface SupplierApprovalRejectCommonProps {
  loading?: boolean;
  errorMessage?: string;
  onReject: (reason?: string) => void;
  onCancel: () => void;
}

export const SupplierApprovalRejectCommon = ({
  loading,
  onCancel,
  onReject,
  errorMessage,
}: SupplierApprovalRejectCommonProps) => {
  const [translate] = useTranslation();
  const [reason, setReason] = useState<string | null>(null);

  return (
    <ModalConfirm
      open
      loading={loading}
      title={translate("CM.txt_rejected")}
      content={translate("SL.message_reject")}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={onCancel}
      handleSave={() => onReject(reason)}
    >
      <div className="w-100 h-100 m-t--lg">
        <FormItem
          validateObject={{
            validateStatus: isEmpty(errorMessage) ? "" : "error",
            message: errorMessage,
          }}
        >
          <TextArea
            placeHolder={translate("SL.placeholder_reason")}
            label={translate("CM.txt_reason_cancel")}
            maxLength={MAX_LENGTH_500}
            resize="none"
            onChange={(reason) => setReason(reason)}
            isRequired
            showCount
          />
        </FormItem>
      </div>
    </ModalConfirm>
  );
};
