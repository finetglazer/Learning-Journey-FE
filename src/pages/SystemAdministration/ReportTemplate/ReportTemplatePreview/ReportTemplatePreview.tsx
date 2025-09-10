import React, { useContext } from "react";
import { Modal, Tag } from "react-components-design-system";
import { isEmpty } from "lodash";
import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import {
  ReportTemplateManagementContext,
  ReportTemplateManagementContextProps,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import { useTranslation } from "react-i18next";
import "./ReportTemplatePreview.scss";

const ReportTemplatePreview = () => {
  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
    notifyToast,
  } = useContext<ReportTemplateManagementContextProps>(
    ReportTemplateManagementContext
  );
  const [translate] = useTranslation();

  const copyToClipboard = () => {
    const textToCopy = model?.code;
    if (isEmpty(textToCopy)) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notifyToast({
          message: translate("CL.copied_to_clipboard_message"),
        });
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <Modal
      open={isOpenPreviewModal}
      title={translate("reportTemplates.preview")}
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={() => handleCloseModal("preview")}
      onCancel={() => handleCloseModal("preview")}
      isShowIconBack={false}
      isShowButtonApply={false}
    >
      <div className="report-template-view-body">
        <Tag
          size="md"
          value={
            model?.status
              ? translate("reportTemplates.active")
              : translate("reportTemplates.inactive")
          }
          status={model?.status ? "SUCCESS" : "DEFAULT"}
          isShowDot={false}
          isShowBorder={true}
          className="report-template__status"
        />
        <span className="report-template__name">{model?.name}</span>
        <div className="report-template__code" onClick={copyToClipboard}>
          <span className="report-template__code-value">{model?.code}</span>
          <div className="report-template__code-icon">
            <img src={CopySvg} alt="CopySvg" />
          </div>
        </div>

        <div className="report-template__item">
          <span className="report-template__item-label">
            {translate("reportTemplates.path")}
          </span>
          <span className="report-template__item-description">
            {model?.path}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ReportTemplatePreview;
