/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";
import {
  SupplierCategoryConfigMasterContext,
  SupplierCategoryConfigMasterContextModel,
} from "../SupplierCategoryConfigMaster/SupplierCategoryConfigMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty } from "lodash";
import "./SupplierCategoryConfigPreview.scss";
import { formatNumber } from "core/helpers/number";
const SupplierCategoryConfigPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<SupplierCategoryConfigMasterContextModel>(
    SupplierCategoryConfigMasterContext
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
        title={translate("supplierCategoryConfigs.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="supplier-category-config-view-body">
          <span className="supplier-category-config__name">{model?.name}</span>
          <div
            className="supplier-category-config__code"
            onClick={copyToClipboard}
          >
            <span className="supplier-category-config__code-value">
              {model?.code}
            </span>
            <div className="supplier-category-config__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="supplier-category-config__item">
            <span className="supplier-category-config__item-label">
              {translate("supplierCategoryConfigs.score")}
            </span>
            <span className="supplier-category-config__item-description">
              {`${formatNumber(model?.minScore)} - ${formatNumber(
                model?.maxScore
              )}`}
            </span>
          </div>

          <div className="supplier-category-config__item">
            <span className="supplier-category-config__item-label">
              {translate("supplierCategoryConfigs.description")}
            </span>
            <span className="supplier-category-config__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SupplierCategoryConfigPreview;
