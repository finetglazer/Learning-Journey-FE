import { Col, Row } from "antd";
import { LoadFileIcon, UploadIcon } from "assets/icons";
import DefaultAvatar from "assets/images/avatar.jpg";
import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import UploadFileCustom from "components/UploadFileCustom/UploadFileCustom";
import { listFeedbackOpinionStatusEnum } from "config/const";
import { getIconFile } from "core/helpers/common";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import type { TFunction } from "i18next";
import { isEqual } from "lodash";
import { FileModelExtend, OpinionCollector } from "models/OpinionCollector";
import { useCallback, useState } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import {
  FormItem,
  Modal,
  Select,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { of } from "rxjs";
import { formatDateTimeToVietnamTimezone } from "../../OpinionCollectorHook";
import "./FeedbackOpinionModal.scss";

const MODAL_WIDTH = 600;
const TEXT_AREA_MAX_LENGTH = 1000;
const FILE_ICON_SIZE = 24;

const listFeedBackResultType = () => {
  const filteredList = listFeedbackOpinionStatusEnum.filter(
    (item) => item.id >= 1 && item.id <= 2
  );

  return of(filteredList);
};

interface FeedbackOpinionModalProps {
  translate: TFunction<"translation", undefined>;
  isOpen: boolean;
  opinionCollectorModel: OpinionCollector;
  isSendingForm: boolean;
  handleDownloadFileAttached: (file?: FileModelExtend) => void;
  handleSendFeedbackOpinionTicket: () => void;
  handleCloseModal: () => void;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
}

const FeedbackOpinionModal = ({
  translate,
  isOpen,
  opinionCollectorModel,
  isSendingForm,
  handleDownloadFileAttached,
  handleSendFeedbackOpinionTicket,
  handleCloseModal,
  handleChangeSingleField,
  handleChangeSelectField,
}: FeedbackOpinionModalProps) => {
  const [files, setFiles] = useState<FileModelExtend[]>([]);

  const handleChangeFeedbackStatus = useCallback(
    (id: number, value?: Model) => {
      handleChangeSingleField({
        fieldName: "responseContent",
      })(isEqual(value?.code, "SUCCESS") ? value?.name : "");

      handleChangeSelectField({
        fieldName: "status",
      })(id, value);
    },
    [handleChangeSelectField, handleChangeSingleField]
  );

  const handleUpdateListFile = (listFile: FileModelExtend[]) => {
    const newListFiles = [
      ...(opinionCollectorModel?.opinionResponseAttachments || []),
      ...listFile,
    ];
    handleChangeSingleField({
      fieldName: "opinionResponseAttachments",
    })(newListFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = opinionCollectorModel?.opinionResponseAttachments?.filter(
      (file: FileModelExtend) => file?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "opinionResponseAttachments",
    })(listFile);
  };

  return (
    <Modal
      open={isOpen}
      title={translate("OC.feedback_opinion")}
      titleButtonApply={translate("OC.send")}
      titleButtonCancel={translate("OC.cancel")}
      handleSave={handleSendFeedbackOpinionTicket}
      handleCancel={handleCloseModal}
      size={MODAL_WIDTH}
      isShowIconBack={false}
      disableButtonApply={isSendingForm}
      className="feedback_opinion_modal"
    >
      <Row gutter={[16, 16]} className="modal__content">
        <Col span={24}>
          <div className="modal_content_header">
            <div className="user_info">
              <img className="user_avatar" src={DefaultAvatar} alt="avatar" />

              <div className="user_details">
                <div className="d-flex flex-row gap-1">
                  <div className="label_text">{translate("OC.sender")}:</div>
                  <div className="user_name">
                    {opinionCollectorModel?.createUserDetail?.name ||
                      opinionCollectorModel?.createUser}
                  </div>
                </div>
                <div className="email">
                  {opinionCollectorModel?.createUserDetail?.email}
                </div>
              </div>
            </div>

            <div className="time_info">
              <div className="time_item">
                <span className="time_label">{translate("OC.sent_time")}</span>
                <span className="time_value">
                  {formatDateTimeToVietnamTimezone(
                    opinionCollectorModel?.createdDate
                  )}
                </span>
              </div>
              <div className="time_item">
                <span className="time_label">
                  {translate("OC.response_deadline_time")}
                </span>
                <span className="time_value">
                  {formatDateTimeToVietnamTimezone(
                    opinionCollectorModel?.responseDueDate
                  )}
                </span>
              </div>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(
              opinionCollectorModel,
              "status"
            )}
          >
            <Select
              label={translate("OC.feedback_result")}
              placeHolder={translate("OC.select_feedback_result")}
              isRequired
              value={opinionCollectorModel?.status}
              getList={listFeedBackResultType}
              classFilter={ModelFilter}
              render={(item) => item?.name}
              onChange={handleChangeFeedbackStatus}
            />
          </FormItem>
        </Col>

        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(
              opinionCollectorModel,
              "responseContent"
            )}
          >
            <TextArea
              label={translate("OC.feedback_content")}
              placeHolder={translate("OC.plh_opinion_feedback")}
              value={opinionCollectorModel?.responseContent}
              onChange={handleChangeSingleField({
                fieldName: "responseContent",
              })}
              isRequired
              showCount
              maxLength={TEXT_AREA_MAX_LENGTH}
              translate={translate}
              resize="none"
            />
          </FormItem>
        </Col>

        <Col span={24}>
          <UploadFileCustom
            uploadFile={opinionCollectorRepository.importFiles}
            updateList={handleUpdateListFile}
            type="dragAndDrop"
            textHint={translate("OC.multiple_files_upload")}
            titleButton={translate("OC.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            setListFileLoading={setFiles}
            className="feedback_upload_file"
          />
        </Col>

        <Col span={24}>
          {files?.map((file, index) => {
            return (
              <UploadFile.FileLoadedContent
                key={index}
                file={{ ...file, id: file.systemFileId, name: file.name }}
                isViewMode
                showIconDowload={false}
                onClickFile={() => handleDownloadFileAttached}
                icon={
                  <img
                    src={LoadFileIcon}
                    alt="gif"
                    width={FILE_ICON_SIZE}
                    height={FILE_ICON_SIZE}
                  />
                }
              />
            );
          })}
          {opinionCollectorModel?.opinionResponseAttachments?.map(
            (file: FileModelExtend) => {
              return (
                <UploadFile.FileLoadedContent
                  key={file.systemFileId}
                  file={{ ...file, id: file.systemFileId, name: file.name }}
                  removeFile={handleRemoveFile}
                  onClickFile={() => handleDownloadFileAttached(file)}
                  icon={
                    <img
                      src={getIconFile(file)}
                      alt="img"
                      width={FILE_ICON_SIZE}
                      height={FILE_ICON_SIZE}
                    />
                  }
                />
              );
            }
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default FeedbackOpinionModal;
