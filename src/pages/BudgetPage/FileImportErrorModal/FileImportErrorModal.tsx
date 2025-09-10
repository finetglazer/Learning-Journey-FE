import { WarningStrokeIcon } from "assets/icons";
import appMessageService from "core/services/common-services/app-message-service";
import { isArray, isEmpty, isNil, uniqueId } from "lodash";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./FileImportErrorModal.scss";

interface FileImportErrorModalProps {
  sheetErrors?: string | string[];
  onDismiss?: () => void;
}

const MODAL_WIDTH = 600;

export const FileImportErrorModal = ({
  sheetErrors,
  onDismiss,
}: FileImportErrorModalProps) => {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  if (isNil(sheetErrors) || !isArray(sheetErrors) || isEmpty(sheetErrors))
    return null;

  const handleCopyContent = () => {
    const text = sheetErrors
      .join("\n")
      .replace(/<b>/g, "")
      .replace(/<\/b>/g, "");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notifyToast({
          message: translate("CL.copied_to_clipboard_message"),
        });
        onDismiss();
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const handleCancel = () => {
    handleCopyContent();
  };

  return (
    <Modal
      open
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={translate("BG.title_upload_folder_error")}
      titleButtonApply={translate("CM.btn_close")}
      titleButtonCancel={translate("CM.txt_copy_content")}
      handleSave={onDismiss}
      handleCancel={handleCancel}
      handleClickIcon={onDismiss}
    >
      <div>
        {sheetErrors.map((error, index) => (
          <div
            key={uniqueId(index.toString())}
            className="file-import-error-modal__container"
          >
            <img src={WarningStrokeIcon} alt="" />
            <div dangerouslySetInnerHTML={{ __html: error }} />
          </div>
        ))}
      </div>
    </Modal>
  );
};
