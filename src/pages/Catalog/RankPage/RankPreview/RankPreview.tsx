/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./RankPreview.scss";
import {
  RankMasterContext,
  RankMasterContextModel,
} from "../RankMaster/RankMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { formatDate } from "core/helpers/date-time";

const RankPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<RankMasterContextModel>(RankMasterContext);

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
        title={translate("ranks.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="rank-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("ranks.active")
                : translate("ranks.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="rank__status"
          />
          <span className="rank__name">{model?.name}</span>
          <div className="rank__code" onClick={copyToClipboard}>
            <span className="rank__code-value">{model?.code}</span>
            <div className="rank__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="rank__item">
            <span className="rank__item-label">
              {translate("ranks.effectiveDate")}
            </span>
            <span className="rank__item-description">
              {model?.effectiveDate ? formatDate(model?.effectiveDate) : null}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RankPreview;
