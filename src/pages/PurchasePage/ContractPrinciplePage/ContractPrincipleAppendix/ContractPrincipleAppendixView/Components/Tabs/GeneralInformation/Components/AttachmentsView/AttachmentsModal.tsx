import { Col } from "antd";
import { WIDTH_800 } from "core/config/consts";
import { getIconFile } from "core/helpers/common";
import { Attachment } from "models/Attachment";
import { Modal, UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";

interface AttachmentsModalProps {
  visible: boolean;
  files: Attachment[];
  handleClose?: () => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
}

export const AttachmentsModal = ({
  visible,
  files,
  handleClose,
  handleDownloadFileAttached,
}: AttachmentsModalProps) => {
  const [translate] = useTranslation();

  return (
    <Modal
      open={visible}
      isShowIconBack={false}
      isShowButtonApply={false}
      destroyOnClose
      size={WIDTH_800}
      title={translate("contractTermination.attachment_all_title")}
      titleButtonApply={""}
      titleButtonCancel={translate("CM.btn_close")}
      onClose={handleClose}
      handleCancel={handleClose}
    >
      <div>
        {files?.map((file) => (
          <Col span={24} key={file?.systemFileId}>
            <UploadFile.FileLoadedContent
              key={file?.systemFileId}
              file={{ ...file, id: file.systemFileId }}
              onClickFile={() => handleDownloadFileAttached(file)}
              isViewMode
              icon={
                <img src={getIconFile(file)} alt="img" width={24} height={24} />
              }
            />
          </Col>
        ))}
      </div>
    </Modal>
  );
};
