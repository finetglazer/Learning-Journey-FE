/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./SignatureSupplierPreview.scss";
import {
  SignatureSupplierMasterContext,
  SignatureSupplierMasterContextModel,
} from "../SignatureSupplierMaster/SignatureSupplierMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const SignatureSupplierPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<SignatureSupplierMasterContextModel>(
    SignatureSupplierMasterContext
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

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
    <>
      <Modal
        open={isOpenPreviewModal}
        title={translate("signatureSuppliers.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="signature-supplier-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("signatureSuppliers.active")
                : translate("signatureSuppliers.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="signature-supplier__status"
          />
          <span className="signature-supplier__name">{model?.name}</span>
          <div className="signature-supplier__code" onClick={copyToClipboard}>
            <span className="signature-supplier__code-value">
              {model?.code}
            </span>
            <div className="signature-supplier__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="signature-supplier__item">
            <span className="signature-supplier__item-label">
              {translate("signatureSuppliers.description")}
            </span>
            <span className="signature-supplier__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignatureSupplierPreview;
