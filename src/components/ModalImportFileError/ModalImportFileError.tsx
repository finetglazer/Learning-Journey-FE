import appMessageService from "core/services/common-services/app-message-service";
import { isArray } from "lodash";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import ErrorMessages from "./ErrorMessages";
import "./ErrorMessages.scss";

interface ModalImportFileErrorProperties {
  errors: string | string[];
  onClose: () => void;
}

const MODAL_WIDTH = 600;
const NEWLINE = "\n";

const removeBoldTags = (error: string) => {
  return error.replace(/<\/?b>/g, "");
};

const ModalImportFileError = ({
  errors,
  onClose,
}: ModalImportFileErrorProperties) => {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const errorList = isArray(errors) ? errors : [errors];

  const handleCopyErrors = () => {
    const formatErrors = errorList.map(removeBoldTags).join(NEWLINE);
    navigator.clipboard
      .writeText(formatErrors)
      .then(() => {
        notifyToast({
          message: translate("CM.message_copied_to_clipboard"),
        });
        onClose();
      })
      .catch((error) => {
        notifyToast({
          message: error,
        });
      });
  };

  return (
    <Modal
      open
      size={MODAL_WIDTH}
      isShowIconBack={false}
      title={translate("CM.title_import_file_error")}
      titleButtonApply={translate("CM.btn_close")}
      titleButtonCancel={translate("CM.txt_copy_content")}
      handleSave={onClose}
      handleCancel={handleCopyErrors}
      handleClickIcon={onClose}
    >
      <ErrorMessages errorList={errorList} />
    </Modal>
  );
};

export default ModalImportFileError;
