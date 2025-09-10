/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./CurrencyPreview.scss";
import {
  CurrencyMasterContext,
  CurrencyMasterContextModel,
} from "../CurrencyMaster/CurrencyMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const CurrencyPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<CurrencyMasterContextModel>(CurrencyMasterContext);

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
        title={translate("currencies.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="currency-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("currencies.active")
                : translate("currencies.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="currency__status"
          />
          <span className="currency__name">{model?.name}</span>
          <div className="currency__code" onClick={copyToClipboard}>
            <span className="currency__code-value">{model?.code}</span>
            <div className="currency__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CurrencyPreview;
