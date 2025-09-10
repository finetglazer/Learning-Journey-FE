/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./GoodsServicesCategoryPreview.scss";
import {
  GoodsServicesCategoryMasterContext,
  GoodsServicesCategoryMasterContextModel,
} from "../GoodsServicesCategoryMaster/GoodsServicesCategoryMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";

const GoodsServicesCategoryPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    handleClosePreviewModal,
    detailModel: model,
  } = useContext<GoodsServicesCategoryMasterContextModel>(
    GoodsServicesCategoryMasterContext
  );

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
        title={translate("goodsServiceCategories.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={handleClosePreviewModal}
        onCancel={handleClosePreviewModal}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="good-services-category-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("goodsServiceCategories.active")
                : translate("goodsServiceCategories.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="good-services-category__status"
          />
          <span className="good-services-category__name">{model?.name}</span>
          <div
            className="good-services-category__code"
            onClick={copyToClipboard}
          >
            <span className="good-services-category__code-value">
              {model?.code}
            </span>
            <div className="good-services-category__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>
          <div className="good-services-category__item">
            <span className="good-services-category__item-label">
              {translate("goodsServiceCategories.parent")}
            </span>
            <span className="good-services-category__item-description">
              {model?.parentId
                ? `${model?.parentCode}-${model?.parentName}`
                : ""}
            </span>
          </div>

          <div className="good-services-category__item">
            <span className="good-services-category__item-label">
              {translate("goodsServiceCategories.description")}
            </span>
            <span className="good-services-category__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GoodsServicesCategoryPreview;
