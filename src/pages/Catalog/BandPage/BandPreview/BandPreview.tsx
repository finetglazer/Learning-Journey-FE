/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./BandPreview.scss";
import {
  BandMasterContext,
  BandMasterContextModel,
} from "../BandMaster/BandMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { formatDate } from "core/helpers/date-time";

const BandPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<BandMasterContextModel>(BandMasterContext);

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
        title={translate("bands.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="band-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("bands.active")
                : translate("bands.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="band__status"
          />
          <span className="band__name">{model?.name}</span>
          <div className="band__code" onClick={copyToClipboard}>
            <span className="band__code-value">{model?.code}</span>
            <div className="band__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="band__item">
            <span className="band__item-label">
              {translate("bands.effectiveDate")}
            </span>
            <span className="band__item-description">
              {model?.effectiveDate ? formatDate(model?.effectiveDate) : null}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BandPreview;
