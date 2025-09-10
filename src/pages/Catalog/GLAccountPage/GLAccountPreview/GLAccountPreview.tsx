/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import {
  GLAccountMasterContext,
  GLAccountMasterContextModel,
} from "../GLAccountMaster/GLAccountMasterHook";
import "./GLAccountPreview.scss";
import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { formatDate } from "core/helpers/date-time";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const GLAccountPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<GLAccountMasterContextModel>(GLAccountMasterContext);

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
        title={translate("glAccounts.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="gl-account-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("glAccounts.active")
                : translate("glAccounts.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="gl-account__status"
          />
          <span className="gl-account__name">{model?.name}</span>
          <div className="good-service-type__code" onClick={copyToClipboard}>
            <span className="good-service-type__code-value">{model?.code}</span>
            <div className="good-service-type__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="w-100">
            <div className="gl-account__item">
              <span className="gl-account__item-label">
                {translate("glAccounts.startDate")}
              </span>
              <span className="gl-account__item-description">
                {formatDate(model?.startDate)}
              </span>
            </div>
            <div className="gl-account__item m-l--xs">
              <span className="gl-account__item-label">
                {translate("glAccounts.endDate")}
              </span>
              <span className="gl-account__item-description">
                {formatDate(model?.endDate)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GLAccountPreview;
