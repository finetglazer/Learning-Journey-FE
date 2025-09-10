import { Tooltip } from "antd";
import { emptyCloudIcon } from "assets/icons";
import classNames from "classnames";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { MODAL_WIDTH_800 } from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { attachmentService } from "core/services/page-services/attachment-service";
import { gt, isEmpty } from "lodash";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Modal, UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./GeneralInformationView.module.scss";

interface TicketProps extends PropsWithChildren {
  code: string;
  description: string;
  note: string;
  link: string;
  ticketClassName?: string;
}

function Ticket({
  code,
  description,
  note,
  link,
  ticketClassName,
}: TicketProps) {
  return (
    <div className={classNames(styles["ticket"], ticketClassName)}>
      <Tooltip title={code}>
        <Link
          className={classNames(styles["code"], "line-clamp-1")}
          target="_blank"
          to={link}
        >
          {code}
        </Link>
      </Tooltip>
      <Tooltip title={description}>
        <div className={classNames(styles["description"], "line-clamp-3")}>
          {description}
        </div>
      </Tooltip>
      <Tooltip title={note}>
        <div className={classNames(styles["note"], "line-clamp-1")}>{note}</div>
      </Tooltip>
    </div>
  );
}

interface BlockContainerProps extends PropsWithChildren {
  title?: ReactNode;
  className?: string;
}

function BlockContainer({ title, children, className }: BlockContainerProps) {
  return (
    <div className={styles["block-container"]}>
      {title && (
        <div className={classNames(styles["title"], className)}>{title}</div>
      )}
      {children}
    </div>
  );
}

interface ItemContentProps {
  label: string;
  content: ReactNode;
}

function ItemContent({ label, content }: ItemContentProps) {
  return (
    <div className={styles["item-content"]}>
      <div className={styles["item-content__label"]}>{label}</div>
      <div className={styles["item-content__content"]}>{content}</div>
    </div>
  );
}
interface AttachmentsModalProps {
  open: boolean;
  data: RequestAttachment[];
  onClose: () => void;
}

function AttachmentsModal({ open, data, onClose }: AttachmentsModalProps) {
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
}

interface AttachmentsProps
  extends Partial<Pick<BlockContainerProps, "title" | "className">> {
  data: RequestAttachment[];
}

function Attachments({ title, data, className }: AttachmentsProps) {
  const [translate] = useTranslation();
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const { handleDownloadFileAttached } = attachmentService.useAttachments();

  return (
    <>
      <BlockContainer
        title={
          <div className="d-flex justify-content-between align-items-center">
            <span>{title || translate("CM.txt_attachments")}</span>
            {gt(data?.length, 3) && (
              <button
                className={styles["button"]}
                onClick={() => setIsShowMore(true)}
              >
                {translate("CM.txt_show_more")}
              </button>
            )}
          </div>
        }
        className={className}
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
      <AttachmentsModal
        data={data}
        onClose={() => setIsShowMore(false)}
        open={isShowMore}
      />
    </>
  );
}

interface GeneralInformationViewLayoutProps {
  children?: ReactNode;
  contentLeft?: ReactNode;
}

export default function GeneralInformationViewLayout({
  children,
  contentLeft,
}: GeneralInformationViewLayoutProps) {
  return (
    <div className={styles["general-information"]}>
      <div className={styles["content__left"]}>{contentLeft}</div>
      <div className={styles["content__right"]}>{children}</div>
    </div>
  );
}

export { Attachments, BlockContainer, ItemContent, Ticket };
