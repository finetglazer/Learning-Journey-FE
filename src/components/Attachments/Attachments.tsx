import { LoadFileIcon, UploadIcon } from "assets/icons";
import { UploadFileCustom } from "components";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { isEmpty, uniqueId } from "lodash";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import styles from "./Attachments.module.scss";
import { useAttachmentsHooks } from "./useAttachmentsHooks";

export interface FileModelExtend extends FileModel {
  systemFileId?: string | number;
}

type ListFile = FileModelExtend[];

const MAX_SIZE = 99999999999;

interface AttachmentsProps {
  handleUpdate: (listFile: ListFile) => void;
  attachments: RequestAttachment[] | undefined;
  isDetail?: boolean;
  uploadIcon?: string;
  parentClassName?: string;
}

function Attachments({
  attachments,
  handleUpdate,
  isDetail,
  uploadIcon = UploadIcon,
  parentClassName,
}: AttachmentsProps) {
  const [translate] = useTranslation();

  const {
    fileLoading,
    setFileLoading,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
  } = useAttachmentsHooks();

  const handleUpdateList = (listFile: ListFile) => {
    const newFiles = [...(attachments || []), ...listFile];
    handleUpdate(newFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = attachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleUpdate(listFile);
  };

  return (
    <div className={`${styles["attachments"]} ${parentClassName}`}>
      <UploadFileCustom
        type="dragAndDrop"
        textHint={translate("BG.multiple_files_upload")}
        titleButton={translate("BG.upload")}
        icon={<img src={uploadIcon} alt="" />}
        maximumSize={MAX_SIZE}
        className={styles["form-upload"]}
        uploadFile={budgetRepository.import}
        setListFileLoading={setFileLoading}
        updateList={handleUpdateList}
        onUploadError={handleUploadAttachmentError}
        isMultiple={false}
        disabled={isDetail || fileLoading?.length > 0}
      />

      {(!isEmpty(attachments) || !isEmpty(fileLoading)) && (
        <div className={styles["items"]}>
          {fileLoading?.map((file: RequestAttachment) => {
            return (
              <UploadFile.FileLoadedContent
                key={uniqueId(`${file?.systemFileId}`)}
                file={{ ...file, id: file.systemFileId, name: file.name }}
                className={styles["items_file"]}
                icon={
                  <img
                    src={LoadFileIcon}
                    width={ICON_SIZE_LARGE}
                    height={ICON_SIZE_LARGE}
                    className="rotate-image"
                    alt=""
                  />
                }
                isViewMode
              />
            );
          })}
          {attachments?.map((file: RequestAttachment) => {
            return (
              <UploadFile.FileLoadedContent
                key={file?.systemFileId}
                file={{ ...file, id: file.systemFileId }}
                icon={
                  <img
                    src={getIconFile(file)}
                    width={ICON_SIZE_LARGE}
                    height={ICON_SIZE_LARGE}
                    alt=""
                  />
                }
                className={styles["items_file"]}
                removeFile={handleRemoveFile}
                onClickFile={() => handleDownloadFileAttached(file)}
                isViewMode={isDetail}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Attachments;
