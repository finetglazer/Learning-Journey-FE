import { useTranslation } from "react-i18next";
import { attachmentService } from "core/services/page-services/attachment-service";
import { isEmpty, size } from "lodash";
import styles from "components/GeneralInformationView/GeneralInformationView.module.scss";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import { Modal, UploadFile } from "react-components-design-system";
import { getIconFile } from "core/helpers/common";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { BlockContainer } from "components/GeneralInformationView/GeneralInformationView";
import { PropsWithChildren, ReactNode, useState } from "react";
import { RequestAttachment } from "models/Contract";
const MODAL_SIZE = 800;

interface BlockContainerProps extends PropsWithChildren {
  title?: ReactNode;
}
interface AttachmentsProps extends Partial<Pick<BlockContainerProps, "title">> {
  data: RequestAttachment[];
}

function AttachmentsView({ title, data }: AttachmentsProps) {
  const [translate] = useTranslation();
  const { handleDownloadFileAttached } = attachmentService.useAttachments();
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <>
      <BlockContainer
        title={
          <div className="d-flex justify-content-between align-items-center">
            <span>{title || translate("CM.txt_attachments")}</span>
            {!isEmpty(data) && size(data) > 3 && (
              <button
                className={styles["button"]}
                onClick={() => setIsShowModal(true)}
              >
                {translate("CM.txt_show_more")}
              </button>
            )}
          </div>
        }
        className="fs-6"
      >
        {isEmpty(data) ? (
          <EmptyItemTable
            icon={<img width={120} src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_found")}
            containerClassName="flex-column gap-0 p-3"
            className="gap-0"
          />
        ) : (
          <div className={styles["attachments"]}>
            {data?.slice(0, 3)?.map((file: RequestAttachment) => (
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
          </div>
        )}
      </BlockContainer>
      <Modal
        open={isShowModal}
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setIsShowModal(false)}
        title={translate("settlement.all_attachment_txt")}
        size={MODAL_SIZE}
        titleButtonCancel={translate("CM.txt_status_close")}
        isShowButtonApply={false}
        handleCancel={() => {
          setIsShowModal(false);
        }}
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
    </>
  );
}

export default AttachmentsView;
