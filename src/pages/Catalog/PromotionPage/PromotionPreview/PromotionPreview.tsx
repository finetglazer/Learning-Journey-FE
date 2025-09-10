/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag, UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import React, { useContext } from "react";

import "./PromotionPreview.scss";
import {
  PromotionMasterContext,
  PromotionMasterContextModel,
} from "../PromotionMaster/PromotionMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { formatDate } from "core/helpers/date-time";
import { listPromotionType } from "../PromotionConstant";
import { formatNumber } from "core/helpers/number";
// import React from "react"; // Removed duplicate import
import { Attachment } from "models/Attachment";
import { Col, Row } from "antd";
import { getIconFile } from "core/helpers/common";
import saveAs from "file-saver";
import type { AxiosResponse } from "axios";
import { promotionRepository } from "../PromotionRepository";

const PromotionPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<PromotionMasterContextModel>(PromotionMasterContext);

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

  const handleDownloadFileAttached = (file?: Attachment) => {
    if (!file) return;
    promotionRepository.downloadFile(file.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], { type: file?.contentType });

        if (isEqual(file?.contentType, "application/pdf")) {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, "_blank");
        } else {
          saveAs(blob, file.name);
        }
      },
    });
  };

  const attachmentFiles = React.useMemo(() => {
    const listFileType0 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 0
    );
    const listFileType1 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 1
    );
    const listFileType2 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 2
    );
    const listFileType3 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 3
    );
    return {
      listFileType0,
      listFileType1,
      listFileType2,
      listFileType3,
    };
  }, [model?.attachmentFiles]);

  const returnUploadFileAndAttachment = React.useCallback(
    (type: number, listFile: Attachment[]) => {
      return (
        <>
          {listFile?.length > 0 ? (
            <div className="title-detail m-b--sm m-t--sm">
              {translate(`promotions.uploadFilePromotionType${type}`)}
            </div>
          ) : null}

          <Row gutter={[24, 0]}>
            {listFile?.length > 0 &&
              listFile.map((file: Attachment, index: number) => {
                return (
                  <Col span={12} key={index}>
                    <UploadFile.FileLoadedContent
                      key={index}
                      file={{
                        ...file,
                        id: file.systemFileId,
                        name: file.path?.split("/").pop(),
                      }}
                      onClickFile={() => handleDownloadFileAttached(file)}
                      showIconDowload
                      isViewMode={true}
                      icon={
                        <img
                          src={getIconFile({
                            ...file,
                            name: file.path?.split("/").pop(),
                          })}
                          alt="img"
                          width={24}
                          height={24}
                        />
                      }
                    />
                  </Col>
                );
              })}
          </Row>
        </>
      );
    },
    [translate]
  );

  return (
    <>
      <Modal
        open={isOpenPreviewModal}
        title={translate("promotions.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="promotion-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("promotions.active")
                : translate("promotions.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="promotion__status"
          />
          <span className="promotion__name">{model?.name}</span>
          <div className="promotion__code" onClick={copyToClipboard}>
            <span className="promotion__code-value">{model?.code}</span>
            <div className="promotion__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="d-flex w-100">
            <div className="promotion__item">
              <span className="promotion__item-label">
                {translate("promotions.promotionType")}
              </span>
              <span className="promotion__item-description">
                {listPromotionType[model.promotionType]?.name}
              </span>
            </div>

            <div className="promotion__item">
              <span className="promotion__item-label">
                {translate("promotions.budget")}
              </span>
              <span className="promotion__item-description">
                {formatNumber(model?.budget)}
              </span>
            </div>
          </div>

          <div className="d-flex w-100">
            <div className="promotion__item">
              <span className="promotion__item-label">
                {translate("promotions.startDate")}
              </span>
              <span className="promotion__item-description">
                {formatDate(model?.startDate)}
              </span>
            </div>

            <div className="promotion__item">
              <span className="promotion__item-label">
                {translate("promotions.endDate")}
              </span>
              <span className="promotion__item-description">
                {formatDate(model?.endDate)}
              </span>
            </div>
          </div>

          <div className="w-100">
            <div className="promotion__item">
              <span className="promotion__item-label">
                {translate("promotions.description")}
              </span>
              <span className="promotion__item-description">
                {model?.description}
              </span>
            </div>
          </div>
          <div className="w-100">
            {model?.promotionType === 0 || !model?.promotionType ? (
              returnUploadFileAndAttachment(0, attachmentFiles?.listFileType0)
            ) : (
              <>
                {returnUploadFileAndAttachment(
                  1,
                  attachmentFiles?.listFileType1
                )}
                {returnUploadFileAndAttachment(
                  2,
                  attachmentFiles?.listFileType2
                )}
                {returnUploadFileAndAttachment(
                  3,
                  attachmentFiles?.listFileType3
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PromotionPreview;
