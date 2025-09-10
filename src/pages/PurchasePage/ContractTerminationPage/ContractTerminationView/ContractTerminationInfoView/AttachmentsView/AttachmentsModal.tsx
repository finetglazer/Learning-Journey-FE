/* eslint-disable import/no-unresolved */
import { Col } from "antd";
import { getIconFile } from "core/helpers/common";
import { t } from "i18next";
import { Modal, UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

import "./AttachmentsView.scss";
import { RequestAttachment } from "models/Proposal";

const WIDTH_SIZE = 800;

interface AttachmentsModalProps {
  handleClose: () => void;
  isOpen: boolean;
  attachments: any;
  handleDownloadFileAttached: (file?: FileModel) => void;
}

const AttachmentsModal = ({
  handleClose,
  isOpen,
  attachments,
  handleDownloadFileAttached,
}: AttachmentsModalProps) => {
  return (
    <Modal
      open={isOpen}
      isShowIconBack={false}
      destroyOnClose
      onClose={handleClose}
      titleButtonApply={""}
      titleButtonCancel={t("TIA.btn_close")}
      title={t("contractTermination.attachment_all_title")}
      size={WIDTH_SIZE}
      handleCancel={handleClose}
      isShowButtonApply={false}
    >
      <div className="attachment-model-content">
        {attachments?.map((file: RequestAttachment, index: number) => {
          return (
            <Col key={index} className="gutter-row" span={24}>
              <UploadFile.FileLoadedContent
                key={file?.systemFileId}
                file={{ ...file, id: file.systemFileId }}
                onClickFile={() => handleDownloadFileAttached(file)}
                isViewMode
                icon={
                  <img
                    src={getIconFile(file)}
                    alt="img"
                    width={24}
                    height={24}
                  />
                }
              />
            </Col>
          );
        })}
      </div>
    </Modal>
  );
};

export default AttachmentsModal;
