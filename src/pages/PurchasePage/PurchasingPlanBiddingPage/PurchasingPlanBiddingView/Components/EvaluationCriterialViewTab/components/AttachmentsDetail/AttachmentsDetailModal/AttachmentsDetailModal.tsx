import { MODAL_WIDTH_800 } from "core/config/consts";
import { attachmentService } from "core/services/page-services/attachment-service";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { Modal, UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "components/GeneralInformationView/GeneralInformationView.module.scss";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";

interface AttachmentsModalProps {
  open: boolean;
  data: RequestAttachment[] | undefined;
  onClose: () => void;
}

const AttachmentsDetailModal = ({
  open,
  data,
  onClose,
}: AttachmentsModalProps) => {
  const [translate] = useTranslation();
  const { handleDownloadFileAttached } = attachmentService.useAttachments();

  return (
    <Modal
      title={translate("settlement.all_attachment_txt")}
      titleButtonCancel={translate("CM.txt_status_close")}
      className={styles["attachments-modal"]}
      size={MODAL_WIDTH_800}
      onClose={onClose}
      handleCancel={onClose}
      open={open}
      isShowIconBack={false}
      isShowButtonApply={false}
      destroyOnClose
    >
      {data?.map((file: RequestAttachment) => (
        <UploadFile.FileLoadedContent
          key={file.systemFileId}
          file={{ ...file, id: file.systemFileId }}
          onClickFile={() => handleDownloadFileAttached(file)}
          icon={
            <img
              src={getIconFile(file)}
              width={ICON_SIZE_LARGE}
              height={ICON_SIZE_LARGE}
              alt=""
            />
          }
          isViewMode
        />
      ))}
    </Modal>
  );
};

export default AttachmentsDetailModal;
