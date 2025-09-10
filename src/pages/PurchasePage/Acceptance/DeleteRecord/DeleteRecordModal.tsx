import { TrashRoundIcon } from "assets/icons";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface DeleteRecordModalProps {
  open: boolean;
  loading: boolean;
  title?: string;
  content?: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const DeleteRecordModal = ({
  open,
  loading,
  title,
  content,
  handleConfirm,
  handleCancel,
}: DeleteRecordModalProps) => {
  const [translate] = useTranslation();

  return (
    <ModalConfirm
      open={open}
      loading={loading}
      maskClosable={false}
      icon={<img src={TrashRoundIcon} alt="" />}
      title={title || translate("CM.title_confirm_delete_record")}
      content={content || translate("CM.message_confirm_delete_record")}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={handleConfirm}
      handleCancel={handleCancel}
    />
  );
};
