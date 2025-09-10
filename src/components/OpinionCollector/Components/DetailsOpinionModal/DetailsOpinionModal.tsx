import DefaultAvatar from "assets/images/avatar.jpg";
import { listFeedbackOpinionStatusEnum } from "config/const";
import { getIconFile } from "core/helpers/common";
import type { TFunction } from "i18next";
import { isEmpty, isEqual } from "lodash";
import {
  FileModelExtend,
  OpinionCollector,
  OpinionResponse,
} from "models/OpinionCollector";
import { Fragment, useMemo } from "react";
import { Model } from "react-3layer-common";
import { Modal, Tag, UploadFile } from "react-components-design-system";
import {
  formatDateTimeToVietnamTimezone,
  getTagStatus,
} from "../../OpinionCollectorHook";
import "./DetailsOpinionModal.scss";

const MODAL_WIDTH = 600;
const FILE_ICON_SIZE = 20;

const getTagName = (status?: Model): string | undefined => {
  const statusItem = listFeedbackOpinionStatusEnum.find((item) =>
    isEqual(item.id, status)
  );

  return statusItem ? statusItem.name : undefined;
};

interface DetailsOpinionModalProps {
  isOpen: boolean;
  isLoadingModal: boolean;
  opinionCollectorModel: OpinionCollector;
  translate: TFunction<"translation", undefined>;
  handleCloseModal: () => void;
  handleDownloadFileAttached: (file?: FileModelExtend) => void;
}

const DetailsOpinionModal = ({
  isOpen,
  opinionCollectorModel,
  isLoadingModal,
  handleDownloadFileAttached,
  handleCloseModal,
  translate,
}: DetailsOpinionModalProps) => {
  const opinionInformation = useMemo(
    () => opinionCollectorModel?.opinion,
    [opinionCollectorModel.opinion]
  );
  const opinionResponses = useMemo(
    () => opinionCollectorModel?.opinionResponses,
    [opinionCollectorModel.opinionResponses]
  );

  const handleFileClicked = (file?: FileModelExtend) => {
    if (!file) return;

    const fileUrl = file.url || "";

    if (fileUrl.endsWith(".pdf")) {
      window.open(fileUrl, "_blank");
    } else {
      handleDownloadFileAttached(file);
    }
  };

  const renderRequestHeader = () => (
    <div className="request_header">
      <div className="request_information">
        <div className="user_info">
          <img className="user_avatar" src={DefaultAvatar} alt="avatar" />

          <div className="user_details">
            <div className="d-flex flex-row gap-1">
              <div className="label_text">{translate("OC.sender")}: </div>
              <div className="user_name">
                {opinionCollectorModel?.opinion?.createUserDetail?.name}
              </div>
            </div>
            <div className="email">
              {opinionCollectorModel?.opinion?.createUserDetail?.email}
            </div>
          </div>
        </div>

        <div className="time_info">
          <div className="time_item">
            <span className="time_label">{translate("OC.sent_time")}</span>
            <span className="time_value">
              {formatDateTimeToVietnamTimezone(opinionInformation?.createdDate)}
            </span>
          </div>
          <div className="time_item">
            <span className="time_label">
              {translate("OC.response_deadline_time")}
            </span>
            <span className="time_value">
              {formatDateTimeToVietnamTimezone(
                opinionInformation?.responseDueDate
              )}
            </span>
          </div>
        </div>
      </div>

      <span className="request_title">{opinionInformation?.title}</span>
    </div>
  );

  const renderResponderInformation = () => (
    <div className="responder_information">
      <div className="user_info">
        <img className="user_avatar" src={DefaultAvatar} alt="avatar" />

        <div className="user_details">
          <div className="d-flex gap-1">
            <div className="label_text">{translate("OC.responder_label")}:</div>
            <div className="user_name">
              {opinionInformation?.opinionResponse?.createUserFullName ||
                opinionInformation?.responseByDetail?.name}
            </div>
          </div>
          <div className="email">
            {opinionCollectorModel?.opinion?.responseByDetail?.email}
          </div>
        </div>
      </div>

      <Tag
        size="md"
        value={opinionInformation?.responseStatusText}
        status={getTagStatus(opinionInformation?.responseStatus)}
        isShowBorder={true}
        isShowDot={false}
      />
    </div>
  );

  const renderSingleResponse = (responseDetail: OpinionResponse) => (
    <div className="detail_response">
      <span className="response_content">
        {responseDetail?.responseContent}
      </span>
      <div className="response_status">
        <span className="date_text">
          {formatDateTimeToVietnamTimezone(responseDetail?.createdDate)}
        </span>
        <Tag
          size="sm"
          value={getTagName(responseDetail?.status)}
          status={getTagStatus(responseDetail?.status)}
          isShowDot
          isShowBorder={false}
          backgroundColor="white"
        />
      </div>
      <div className="attachments">
        {!isEmpty(responseDetail?.opinionResponseAttachments) &&
          responseDetail?.opinionResponseAttachments?.map(
            (file: FileModelExtend) => (
              <UploadFile.FileLoadedContent
                key={file.systemFileId}
                onClickFile={() => handleFileClicked(file)}
                file={{
                  ...file,
                  id: file.systemFileId,
                  name: file.name,
                }}
                isViewMode
                icon={
                  <img
                    src={getIconFile(file)}
                    alt="img"
                    width={FILE_ICON_SIZE}
                    height={FILE_ICON_SIZE}
                  />
                }
                className="file_item"
                showIconArrowSquareOut
                showIconDowload={false}
              />
            )
          )}
      </div>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      title={translate("OC.detail_opinion")}
      titleButtonApply={translate("CM.btn_close")}
      handleSave={handleCloseModal}
      handleCancel={handleCloseModal}
      size={MODAL_WIDTH}
      isShowIconBack={false}
      isShowButtonCancel={false}
      loading={isLoadingModal}
      className="detail_opinion_modal"
    >
      <div className="modal_content_container">
        {renderRequestHeader()}
        {renderResponderInformation()}

        {!isEmpty(opinionResponses) &&
          opinionResponses?.map((responseDetail: OpinionResponse) => (
            <Fragment key={responseDetail.opinionId}>
              {renderSingleResponse(responseDetail)}
            </Fragment>
          ))}
      </div>
    </Modal>
  );
};

export default DetailsOpinionModal;
