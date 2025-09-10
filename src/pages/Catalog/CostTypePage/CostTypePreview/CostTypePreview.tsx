/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./CostTypePreview.scss";
import {
  CostTypeMasterContext,
  CostTypeMasterContextModel,
} from "../CostTypeMaster/CostTypeMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const CostTypePreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<CostTypeMasterContextModel>(CostTypeMasterContext);

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
        title={translate("costTypes.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="cost-type-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("costTypes.active")
                : translate("costTypes.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="cost-type__status"
          />
          <span className="cost-type__name">{model?.name}</span>
          <div className="cost-type__code" onClick={copyToClipboard}>
            <span className="cost-type__code-value">{model?.code}</span>
            <div className="cost-type__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CostTypePreview;
