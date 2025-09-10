/* eslint-disable import/no-unresolved */
import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { getIconFile } from "core/helpers/common";
import { ConfigField, FieldValue } from "core/services/service-types";
import { RequestAttachment } from "models/Proposal";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext, useState } from "react";
import { UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";

import "./AttachedFile.scss";
import { Authorizers } from "pages/Catalog/LegalEntity/LegalEntityMaster/LegalEntityMasterHooks";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../../LegalEntityDetailHooks";
import { UploadFileCustom } from "components";

type Props = {
  model: Authorizers;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
};

const AttachedFile = ({ model, handleChangeSingleField }: Props) => {
  const [translate] = useTranslation();

  const { handleUploadAttachmentError, handleDownloadFileAttached } =
    useContext<LegalEntityDetail>(LegalEntityDetailContext);
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);
  if (model?.isDetail && !model?.attachments?.length) return null;

  const handleUpdateListAttachments = (listFile: FileModel[]) => {
    const newListFiles = [...(model?.attachmentDocuments || []), ...listFile];
    handleChangeSingleField({
      fieldName: "attachmentDocuments",
    })(newListFiles);
  };

  const handleRemoveFileAttachment = (fileId: string | number) => {
    const listFile = model?.attachmentDocuments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "attachmentDocuments",
    })(listFile);
  };

  return (
    <div className="attached-wrapper">
      <div className="header">
        <div className="title-attached">
          {translate("LE.txt_legal_entity_input_authorized_letter_file")}
          <span className="text-red"> *</span>
        </div>
      </div>
      <div>
        {!model?.isDetail && (
          <UploadFileCustom
            uploadFile={budgetRepository.import}
            updateList={handleUpdateListAttachments}
            isMultiple={false}
            type="dragAndDrop"
            uploadContent="Drag and drop files here or upload"
            textHint={translate("BG.multiple_files_upload")}
            titleButton={translate("BG.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            maximumSize={99999999999}
            setListFileLoading={setFileLoading}
            onUploadError={handleUploadAttachmentError}
          ></UploadFileCustom>
        )}
        {(model?.attachmentDocuments?.length > 0 || !!fileLoading.length) && (
          <div className="flex-file-loaded file-content">
            {fileLoading?.map((file: RequestAttachment, index) => {
              return (
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId, name: file.name }}
                  className={classNames("file-loaded-item-disabled")}
                  isViewMode={true}
                  icon={
                    <img
                      src={LoadFileIcon}
                      alt="gif"
                      width={24}
                      height={24}
                      className="rotate-image"
                    />
                  }
                />
              );
            })}
            {model?.attachmentDocuments?.map(
              (file: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={index}
                    file={{ ...file, id: file.systemFileId }}
                    removeFile={handleRemoveFileAttachment}
                    className={classNames("file-loaded-item", {
                      "file-loaded-item-4": model?.isDetail,
                    })}
                    onClickFile={() => handleDownloadFileAttached(file)}
                    isViewMode={model?.isDetail}
                    icon={
                      <img
                        src={getIconFile(file)}
                        alt="img"
                        width={24}
                        height={24}
                      />
                    }
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachedFile;
