import { LoadFileIcon, UploadIcon } from "assets/icons";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { isEmpty, isEqual, uniqueId } from "lodash";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useState } from "react";
import { UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import styles from "./Attachments.module.scss";
import { UploadFileCustom } from "components";
export interface FileModelExtend extends FileModel {
  systemFileId?: string | number;
}
type ListFile = FileModelExtend[];

const MAX_SIZE = 99999999999;
export const Attachments = () => {
  const [translate] = useTranslation();
  const {
    model,
    isEditable,
    state,
    handleChangeSingleField,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
  } = useReceivingGoodsDetailContext();
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const handleUpdateList = (listFile: ListFile) => {
    const newFiles = [...(model?.attachments || []), ...listFile];

    handleChangeSingleField({
      fieldName: "attachments",
    })(newFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.attachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "attachments",
    })(listFile);
  };

  return (
    <div className={styles["attachments"]}>
      {!isEqual(state, "VIEW") && (
        <UploadFileCustom
          isMultiple={false}
          type="dragAndDrop"
          textHint={translate("BG.multiple_files_upload")}
          titleButton={translate("BG.upload")}
          icon={<img src={UploadIcon} alt="" />}
          className={styles["form-upload"]}
          uploadFile={budgetRepository.import}
          setListFileLoading={setFileLoading}
          updateList={handleUpdateList}
          onUploadError={handleUploadAttachmentError}
          maximumSize={MAX_SIZE}
        />
      )}
      {isEmpty(fileLoading) && isEmpty(model?.attachments) ? null : (
        <div
          className={
            !isEqual(state, "VIEW") ? styles["items"] : styles["items-view"]
          }
        >
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
          {model?.attachments?.map((file: RequestAttachment) => {
            return (
              <UploadFile.FileLoadedContent
                key={file?.systemFileId}
                file={{ ...file, id: file.systemFileId }}
                isViewMode={!isEditable}
                className={
                  !isEqual(state, "VIEW")
                    ? styles["items_file"]
                    : styles["items-view_file"]
                }
                removeFile={handleRemoveFile}
                onClickFile={() => handleDownloadFileAttached(file)}
                icon={
                  <img
                    src={getIconFile(file)}
                    width={ICON_SIZE_LARGE}
                    height={ICON_SIZE_LARGE}
                    alt=""
                  />
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
