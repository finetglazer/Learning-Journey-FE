import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./UploadErrorModal.scss";

interface UploadErrorModalProps {
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  handleCancel?: () => void;
}

const MODAL_WIDTH = 600;

export const UploadErrorModal = ({
  isOpen,
  errors,
  handleCancel,
}: UploadErrorModalProps) => {
  const [translate] = useTranslation();

  return (
    <Modal
      open={isOpen}
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={translate("BG.title_upload_folder_error")}
      titleButtonApply={translate("CM.btn_close")}
      titleButtonCancel={translate("CM.txt_copy_content")}
      visibleFooter={false}
      handleClickIcon={handleCancel}
    >
      <div className="upload-error-modal__container">
        {Object.entries(errors).map(([key, value], index) => (
          <div key={key} className="error-file-item">
            {translate("CM.file") + ` ${index + 1}: `} {value?.toString()}
          </div>
        ))}
      </div>
    </Modal>
  );
};
