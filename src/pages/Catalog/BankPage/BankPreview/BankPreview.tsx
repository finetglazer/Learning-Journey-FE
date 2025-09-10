/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./BankPreview.scss";
import {
  BankMasterContext,
  BankMasterContextModel,
} from "../BankMaster/BankMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";

const BankPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<BankMasterContextModel>(BankMasterContext);

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
        title={translate("banks.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="bank-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("banks.active")
                : translate("banks.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="bank__status"
          />
          <span className="bank__name">{model?.name}</span>
          <div className="bank__code" onClick={copyToClipboard}>
            <span className="bank__code-value">{model?.code}</span>
            <div className="bank__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="bank__item">
            <span className="bank__item-label">
              {translate("banks.isInternal")}
            </span>
            <img
              src={model?.isInternal ? ActiveSvg : DenySvg}
              alt=""
              width={20}
              height={20}
            />
          </div>
          <div className="bank__item">
            <span className="bank__item-label">
              {translate("banks.description")}
            </span>
            <span className="bank__item-description">{model?.description}</span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BankPreview;
