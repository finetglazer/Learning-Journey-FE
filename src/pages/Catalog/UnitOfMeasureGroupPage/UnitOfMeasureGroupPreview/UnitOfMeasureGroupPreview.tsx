/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, StandardTable, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./UnitOfMeasureGroupPreview.scss";
import {
  UnitOfMeasureGroupMasterContext,
  UnitOfMeasureGroupMasterContextModel,
} from "../UnitOfMeasureGroupMaster/UnitOfMeasureGroupMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import useUnitOfMeasureGroupContentHook from "../UnitOfMeasureGroupDetail/UnitOfMeasureGroupDetailHook/UnitOfMeasureGroupContentHook";

const UnitOfMeasureGroupPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<UnitOfMeasureGroupMasterContextModel>(
    UnitOfMeasureGroupMasterContext
  );

  const { uomGroupContents, uomGroupContentColumns } =
    useUnitOfMeasureGroupContentHook(model, undefined, "view");

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
        title={translate("unitOfMeasureGroups.preview")}
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
                ? translate("unitOfMeasureGroups.active")
                : translate("unitOfMeasureGroups.inactive")
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
              {translate("unitOfMeasureGroups.unitOfMeasure")}
            </span>
            <span className="unit-of-measure__item-description">
              {model?.unitOfMeasureName}
            </span>
          </div>
          <div className="unit-of-measure__item">
            <StandardTable
              rowKey="id"
              isDragable
              columns={uomGroupContentColumns?.filter((col) => {
                return col?.key !== "action";
              })}
              dataSource={uomGroupContents}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnitOfMeasureGroupPreview;
