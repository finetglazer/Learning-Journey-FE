/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./TaxPreview.scss";
import {
  TaxMasterContext,
  TaxMasterContextModel,
} from "../TaxMaster/TaxMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const TaxPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<TaxMasterContextModel>(TaxMasterContext);

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
        title={translate("taxs.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="tax-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("taxs.active")
                : translate("taxs.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="tax__status"
          />
          <span className="tax__name">{model?.name}</span>
          <div className="tax__code" onClick={copyToClipboard}>
            <span className="tax__code-value">{model?.code}</span>
            <div className="tax__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>
          <div className="w-100">
            <div className="tax__item-50">
              <span className="tax__item-label">
                {translate("taxs.taxType")}
              </span>
              <span className="tax__item-description">
                {model?.taxTypeName}
              </span>
            </div>
            <div className="tax__item-50 m-l--xs">
              <span className="tax__item-label">{translate("taxs.rate")}</span>
              <span className="tax__item-description">{`${model?.rate} %`}</span>
            </div>
          </div>
          <div className="tax__item-100">
            <span className="tax__item-label">
              {translate("taxs.description")}
            </span>
            <span className="tax__item-description">{model?.description}</span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaxPreview;
