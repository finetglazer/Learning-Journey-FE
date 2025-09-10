import ErrorMessages from "components/ModalImportFileError/ErrorMessages";
import { isArray } from "lodash";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ModalSubmitError.scss";

interface ModalSubmitErrorProperties {
  errors: string | string[];
  onClose: () => void;
  title?: string;
}

const MODAL_WIDTH = 600;

const ModalSubmitError = (props: ModalSubmitErrorProperties) => {
  const [translate] = useTranslation();
  const {
    errors,
    onClose,
    title = `${translate("CM.title_submit_error")}`,
  } = props;

  const errorList = isArray(errors) ? errors : [errors];

  return (
    <Modal
      open
      size={MODAL_WIDTH}
      isShowIconBack={false}
      title={title}
      titleButtonApply={translate("CM.btn_close")}
      handleSave={onClose}
      handleClickIcon={onClose}
      isShowButtonCancel={false}
      wrapClassName="modal-submit-error-wrap"
    >
      <ErrorMessages errorList={errorList} />
    </Modal>
  );
};

export default ModalSubmitError;
