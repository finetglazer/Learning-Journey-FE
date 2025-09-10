/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./CostItemPreview.scss";
import {
  CostItemMasterContext,
  CostItemMasterContextModel,
} from "../CostItemMaster/CostItemMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const CostItemPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<CostItemMasterContextModel>(CostItemMasterContext);

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
        title={translate("costItems.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="cost-item-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("costItems.active")
                : translate("costItems.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="cost-item__status"
          />
          <span className="cost-item__name">{model?.name}</span>
          <div className="cost-item__code" onClick={copyToClipboard}>
            <span className="cost-item__code-value">{model?.code}</span>
            <div className="cost-item__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="business-branch__item">
            <span className="business-branch__item-label">
              {translate("costItems.costType")}
            </span>
            <span className="business-branch__item-description">
              {model?.costType
                ? `${model?.costType?.code}-${model?.costType?.name}`
                : ""}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CostItemPreview;
