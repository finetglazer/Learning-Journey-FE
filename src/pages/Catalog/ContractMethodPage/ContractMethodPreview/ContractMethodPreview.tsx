/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./ContractMethodPreview.scss";
import {
  ContractMethodMasterContext,
  ContractMethodMasterContextModel,
} from "../ContractMethodMaster/ContractMethodMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const ContractMethodPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<ContractMethodMasterContextModel>(ContractMethodMasterContext);

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
        title={translate("contractMethods.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.close")}
        handleSave={() => handleCloseModal("preview")}
        handleCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonCancel={false}
      >
        <div className="contract-type-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("contractMethods.active")
                : translate("contractMethods.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="contract-type__status"
          />
          <span className="contract-type__name">{model?.name}</span>
          <div className="contract-type__code" onClick={copyToClipboard}>
            <span className="contract-type__code-value">{model?.code}</span>
            <div className="contract-type__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="contract-type__item">
            <span className="contract-type__item-label">
              {translate("contractMethods.description")}
            </span>
            <p className="contract-type__item-description">
              {model?.description}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContractMethodPreview;
