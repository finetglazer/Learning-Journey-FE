import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface SupplierApprovalApproveProps {
  onCancel: () => void;
  onApprove: () => void;
  existMessage: string;
}

export const SupplierApprovalApprove = ({
  onCancel,
  onApprove,
  existMessage,
}: SupplierApprovalApproveProps) => {
  const [translate] = useTranslation();

  return (
    <ModalConfirm
      open
      title={translate("CM.txt_approve")}
      content={
        <>
          <div className="text-danger">{existMessage}</div>
          <div>{translate("SL.message_approve")}</div>
        </>
      }
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={onCancel}
      handleSave={onApprove}
    />
  );
};
