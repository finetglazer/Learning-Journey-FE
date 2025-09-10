/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./UnitOfMeasurePreview.scss";
import {
  UnitOfMeasureMasterContext,
  UnitOfMeasureMasterContextModel,
} from "../UnitOfMeasureMaster/UnitOfMeasureMasterHook";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const UnitOfMeasurePreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<UnitOfMeasureMasterContextModel>(UnitOfMeasureMasterContext);

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
        title={translate("unitOfMeasures.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="unit-of-measure-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("unitOfMeasures.active")
                : translate("unitOfMeasures.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="unit-of-measure__status"
          />
          <span className="unit-of-measure__name">{model?.name}</span>
          <div className="unit-of-measure__code" onClick={copyToClipboard}>
            <span className="unit-of-measure__code-value">{model?.code}</span>
            <div className="unit-of-measure__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="unit-of-measure__item">
            <span className="unit-of-measure__item-label">
              {translate("unitOfMeasures.isDecimal")}
            </span>
            <img
              src={model?.isDecimal ? ActiveSvg : DenySvg}
              alt=""
              width={20}
              height={20}
            />
          </div>

          <div className="unit-of-measure__item">
            <span className="unit-of-measure__item-label">
              {translate("unitOfMeasures.description")}
            </span>
            <span className="unit-of-measure__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnitOfMeasurePreview;
