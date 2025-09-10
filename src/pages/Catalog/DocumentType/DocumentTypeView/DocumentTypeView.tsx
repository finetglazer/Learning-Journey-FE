import { isEqual } from "lodash";
import { Modal, Tag } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { useDocumentTypeDetailHooks } from "../DocumentTypeDetail/DocumentTypeDetailHooks";
import "./DocumentTypeView.scss";

interface DocumentTypeDetailProps {
  documentTypeId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const DocumentTypeView = ({
  documentTypeId,
  dismiss,
}: DocumentTypeDetailProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useDocumentTypeDetailHooks(dismiss, documentTypeId);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";
    return (
      <div className="document-type__main-section">
        {/* Status */}
        <div>
          <Tag
            size="md"
            value={value}
            status={statusValue}
            isShowDot={false}
            isShowBorder
          />
        </div>

        {/* Name */}
        <span className="text-name">{model?.name}</span>

        {/* Code */}
        <div className="code-container" onClick={copyToClipboard}>
          <span className="text-code">{model?.code}</span>
          <img src={CopySvg} alt="" />
        </div>
      </div>
    );
  };

  return (
    <Modal
      open
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("DT.txt_view_detail_document_type")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className="document-type__wrapper">
        <MainSection />
      </div>
    </Modal>
  );
};
