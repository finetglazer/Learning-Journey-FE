/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./GoodServiceTypePreview.scss";
import {
  GoodServiceTypeMasterContext,
  GoodServiceTypeMasterContextModel,
} from "../GoodServiceTypeMaster/GoodServiceTypeMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const GoodServiceTypePreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<GoodServiceTypeMasterContextModel>(
    GoodServiceTypeMasterContext
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
        title={translate("goodServiceTypes.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="good-service-type-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("goodServiceTypes.active")
                : translate("goodServiceTypes.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="good-service-type__status"
          />
          <span className="good-service-type__name">{model?.name}</span>
          <div className="good-service-type__code" onClick={copyToClipboard}>
            <span className="good-service-type__code-value">{model?.code}</span>
            <div className="good-service-type__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="good-service-type__item">
            <span className="good-service-type__item-label">
              {translate("goodServiceTypes.description")}
            </span>
            <span className="good-service-type__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GoodServiceTypePreview;
