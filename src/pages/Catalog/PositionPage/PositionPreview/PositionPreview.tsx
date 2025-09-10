/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./PositionPreview.scss";
import {
  PositionMasterContext,
  PositionMasterContextModel,
} from "../PositionMaster/PositionMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { formatDate } from "core/helpers/date-time";

const PositionPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<PositionMasterContextModel>(PositionMasterContext);

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
        title={translate("positions.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="position-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("positions.active")
                : translate("positions.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="position__status"
          />
          <span className="position__name">{model?.name}</span>
          <div className="position__code" onClick={copyToClipboard}>
            <span className="position__code-value">{model?.code}</span>
            <div className="position__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="position__item">
            <span className="position__item-label">
              {translate("positions.effectiveDate")}
            </span>
            <span className="position__item-description">
              {model?.effectiveDate ? formatDate(model?.effectiveDate) : null}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PositionPreview;
