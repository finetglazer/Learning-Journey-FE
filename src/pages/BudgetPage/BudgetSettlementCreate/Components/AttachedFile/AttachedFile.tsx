/* eslint-disable import/no-unresolved */
import {
  FileCSVIcon,
  FileDOCIcon,
  FileImageIcon,
  FileJPEGIcon,
  FileJSIcon,
  FileMoreIcon,
  FilePNGIcon,
  FilePPTIcon,
  FileSVGIcon,
  FileTXTIcon,
  FileXLSIcon,
  FileZIPIcon,
  LoadFileIcon,
  UploadIcon,
} from "assets/icons";
import classNames from "classnames";
import { fileEtx } from "config/const";
import { ConfigField } from "core/services/service-types";
import { gt, isEmpty, isEqual } from "lodash";
import { BudgetSettlement } from "models/Budget/BugetSettlement";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useMemo, useState } from "react";
import { UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./AttachedFile.scss";
import { UploadFileCustom } from "components";

export interface FileModelExtend extends FileModel {
  systemFileId?: string | number;
}

interface AttachedFileProps {
  model: BudgetSettlement;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleDownloadFileAttached: (file?: FileModel) => void;
  handleUploadAttachmentError: (error: unknown) => void;
}

type ListFile = FileModelExtend[];

const MAXIMUM_SIZE = 99999999999;

export const AttachedFile = ({
  model,
  handleChangeSingleField,
  handleDownloadFileAttached,
  handleUploadAttachmentError,
}: AttachedFileProps) => {
  const [translate] = useTranslation();
  const [files, setFiles] = useState<ListFile>([]);

  const iconMapping = useMemo(
    () => ({
      [fileEtx.CSV]: FileCSVIcon,
      [fileEtx.DOC]: FileDOCIcon,
      [fileEtx.DOCX]: FileDOCIcon,
      [fileEtx.JS]: FileJSIcon,
      [fileEtx.PNG]: FilePNGIcon,
      [fileEtx.JPG]: FileImageIcon,
      [fileEtx.JPEG]: FileJPEGIcon,
      [fileEtx.TXT]: FileTXTIcon,
      [fileEtx.XLS]: FileXLSIcon,
      [fileEtx.XLSX]: FileXLSIcon,
      [fileEtx.SVG]: FileSVGIcon,
      [fileEtx.PPT]: FilePPTIcon,
      [fileEtx.ZIP]: FileZIPIcon,
      [fileEtx.RAR]: FileZIPIcon,
    }),
    []
  );

  const handleUpdateList = (listFile: ListFile) => {
    const newFiles = [...(model?.requestAttachments || []), ...listFile];

    handleChangeSingleField({
      fieldName: "requestAttachments",
    })(newFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.requestAttachments?.filter(
      (p: any) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "requestAttachments",
    })(listFile);
  };

  const getIconFile = (file: FileModel) => {
    const extension = file?.name?.split(".")?.pop();
    return iconMapping[extension] || FileMoreIcon;
  };

  return (
    <div className="budget-plan">
      <div className="budget-plan__header">
        <span className="form-title">{translate("BG.attach_files")}</span>
      </div>
      <div className="budget-settlement__attached">
        {isEqual(model?.isDetail, false) ? (
          <UploadFileCustom
            uploadFile={budgetRepository.import}
            updateList={handleUpdateList}
            isMultiple={false}
            type="dragAndDrop"
            uploadContent="Drag and drop files here or upload"
            textHint={translate("BG.multiple_files_upload")}
            className={classNames("budget-settlement-upload-file")}
            titleButton={translate("BG.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            maximumSize={MAXIMUM_SIZE}
            setListFileLoading={setFiles}
            onUploadError={handleUploadAttachmentError}
          />
        ) : null}
        {!isEmpty(model?.requestAttachments) || gt(files.length, 0) ? (
          <div className="flex-file-loaded">
            {files?.map((file, index) => {
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
            {model?.requestAttachments?.map((file, index: number) => {
              return (
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId }}
                  removeFile={handleRemoveFile}
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
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
