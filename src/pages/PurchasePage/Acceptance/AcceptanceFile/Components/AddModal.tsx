/* eslint-disable import/no-unresolved */
import { LoadFileIcon, UploadCloudIcon } from "assets/icons";
import { UploadFileCustom } from "components";
import { MAX_LENGTH_TEXT_AREA } from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEmpty, isEqual } from "lodash";
import { Attachment } from "models/Attachment";
import { DocumentGroup } from "models/DocumentGroup";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext, useState } from "react";
import {
  FormItem,
  Modal,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import styles from "../AcceptanceFile.module.scss";
import {
  AcceptanceFileContext,
  AcceptanceFileContextType,
} from "../AcceptanceFileHooks";

const MAX_FILE_SIZE = 99999999999;

interface AddModelProps {
  modalTitle?: string;
}

export const AddModel = ({ modalTitle }: AddModelProps) => {
  const [translate] = useTranslation();
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const { model, dispatch } =
    detailService.useModel<DocumentGroup>(DocumentGroup);

  const {
    handleDownloadFileAttached,
    handleUploadAttachmentError,
    setModalType,
    handleAddMore,
  } = useContext<AcceptanceFileContextType>(AcceptanceFileContext);

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  const handleUpdateList = (listFile: FileModel[]) => {
    const newFiles = [...(model.attachments || []), ...listFile];

    handleChangeSingleField({ fieldName: "attachments" })(newFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.attachments?.filter(
      (file: Attachment) => !isEqual(file?.systemFileId, fileId)
    );

    handleChangeSingleField({ fieldName: "attachments" })(listFile);
  };

  const handleOnSave = () => {
    handleAddMore(model, dispatch);
  };

  const handleOnCancel = () => {
    setModalType("NONE");
  };

  return (
    <Modal
      open
      isShowIconBack={false}
      title={modalTitle || translate("AC.title_add_new_acceptance_file")}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.txt_save")}
      handleSave={handleOnSave}
      handleCancel={handleOnCancel}
    >
      <div className={styles["add-modal__wrapper"]}>
        {/* Upload file */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "attachments")}
        >
          <div className={styles["button"]}>
            <div className={styles["control"]}>
              <UploadFileCustom
                isMultiple={false}
                className={styles["upload-file"]}
                textHint={translate("BG.multiple_files_upload")}
                titleButton={translate("BG.upload")}
                icon={<img src={UploadCloudIcon} alt="img" />}
                maximumSize={MAX_FILE_SIZE}
                uploadFile={budgetRepository.import}
                setListFileLoading={setFileLoading}
                updateList={handleUpdateList}
                onUploadError={handleUploadAttachmentError}
              />
            </div>
            {isEmpty(fileLoading) && isEmpty(model?.attachments) ? null : (
              <div className={styles["files-items"]}>
                {fileLoading.map((file: Attachment, index) => (
                  <UploadFile.FileLoadedContent
                    key={index}
                    className={styles["file-loaded-item"]}
                    file={{ ...file, id: file?.systemFileId, name: file.name }}
                    isViewMode={true}
                    icon={
                      <img
                        src={LoadFileIcon}
                        alt="gif"
                        width={ICON_SIZE_LARGE}
                        height={ICON_SIZE_LARGE}
                        className="rotate-image"
                      />
                    }
                  />
                ))}
                {model?.attachments?.map((file: Attachment, index) => {
                  return (
                    <UploadFile.FileLoadedContent
                      key={index}
                      className={styles["file-loaded-item"]}
                      file={{ ...file, id: file.systemFileId }}
                      removeFile={handleRemoveFile}
                      onClickFile={() =>
                        handleDownloadFileAttached(file as DocumentGroup)
                      }
                      icon={
                        <img
                          src={getIconFile(file)}
                          alt="img"
                          width={ICON_SIZE_LARGE}
                          height={ICON_SIZE_LARGE}
                        />
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </FormItem>
        {/* Description */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            isRequired
            showCount
            label={translate("AC.table_description")}
            placeHolder={translate("AC.placeholder_input_description_file")}
            resize="none"
            maxLength={MAX_LENGTH_TEXT_AREA}
            value={model?.description}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
