/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";
import {
  SupplierTypeMasterContext,
  SupplierTypeMasterContextModel,
} from "../SupplierTypeMaster/SupplierTypeMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty, isEqual } from "lodash";
import "./SupplierTypePreview.scss";
const SupplierTypePreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<SupplierTypeMasterContextModel>(SupplierTypeMasterContext);

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
        title={translate("supplierType.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="supplierType-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("supplierType.active")
                : translate("supplierType.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="supplierType__status"
          />
          <span className="supplierType__name">{model?.name}</span>
          <div className="supplierType__code" onClick={copyToClipboard}>
            <span className="supplierType__code-value">{model?.code}</span>
            <div className="supplierType__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          {/* <div className="supplierType__item">
            <span className="supplierType__item-label">
              {translate("supplierType.isInternal")}
            </span>
            <img
              src={model?.isInternal ? ActiveSvg : DenySvg}
              alt=""
              width={20}
              height={20}
            />
          </div> */}
          <div className="supplierType__item">
            <span className="supplierType__item-label">
              {translate("supplierType.description")}
            </span>
            <span className="supplierType__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SupplierTypePreview;
