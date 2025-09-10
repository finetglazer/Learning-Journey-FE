/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./ContractTermPreview.scss";
import {
  ContractTermMasterContext,
  ContractTermMasterContextModel,
} from "../ContractTermMaster/ContractTermMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const ContractTermPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<ContractTermMasterContextModel>(ContractTermMasterContext);

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
        title={translate("contractTerms.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        handleSave={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonCancel={false}
      >
        <div className="contract-term-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("contractTerms.active")
                : translate("contractTerms.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="contract-term__status"
          />
          <span className="contract-term__name">{model?.name}</span>
          <div className="contract-term__code" onClick={copyToClipboard}>
            <span className="contract-term__code-value">{model?.code}</span>
            <div className="contract-term__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="contract-term__item">
            <span className="contract-term__item-label">
              {translate("contractTerms.description")}
            </span>
            <span className="contract-term__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContractTermPreview;
