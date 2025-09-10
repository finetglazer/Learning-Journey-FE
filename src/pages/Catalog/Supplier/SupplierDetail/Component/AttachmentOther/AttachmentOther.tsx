import { LoadFileIcon, UploadIcon } from "assets/icons";
import UploadFileCustom from "components/UploadFileCustom/UploadFileCustom";
import { getIconFile } from "core/helpers/common";
import { isEmpty, uniqueId } from "lodash";
import { useContext, useState } from "react";
import { UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./AttachmentOther.scss";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import { RequestAttachment } from "models/Proposal";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";

export interface FileModelExtend extends FileModel {
  systemFileId?: string | number;
  isBusinessRegistration?: boolean;
}
type ListFile = FileModelExtend[];
const ICON_SIZE_LARGE = 24;
const MAX_SIZE = 99999999999;

export default function AttachmentOther() {
  const [translate] = useTranslation();
  const {
    model,
    handleChangeSingleField,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
  } = useContext(SupplierDetailContext);

  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const handleUpdateList = (listFile: ListFile) => {
    const newFiles = listFile.map((file) => ({
      ...file,
      systemFileId: file.systemFileId,
      isBusinessRegistration: false,
    }));
    const updatedFiles = [...(model?.attachments || []), ...newFiles];

    handleChangeSingleField({
      fieldName: "attachments",
    })(updatedFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.attachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "attachments",
    })(listFile);
  };

  const otherFiles = model?.attachments?.filter(
    (file: RequestAttachment) => file.isBusinessRegistration === false
  );
  return (
    <div className="attachments">
      <UploadFileCustom
        isMultiple={false}
        type="dragAndDrop"
        textHint={translate("SL.txt_file_size")}
        titleButton={translate("SL.txt_upload_file")}
        icon={<img src={UploadIcon} alt="" />}
        className="form-upload"
        uploadFile={supplierRepository.importFiles}
        setListFileLoading={setFileLoading}
        updateList={handleUpdateList}
        onUploadError={handleUploadAttachmentError}
        maximumSize={MAX_SIZE}
      />
      {isEmpty(fileLoading) && isEmpty(otherFiles) ? null : (
        <div className="items">
          {fileLoading?.map((file: RequestAttachment) => (
            <UploadFile.FileLoadedContent
              key={uniqueId(`${file?.systemFileId}`)}
              file={{ ...file, id: file.systemFileId, name: file.name }}
              className="items_file"
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
          ))}
          {otherFiles?.map((file: RequestAttachment) => (
            <UploadFile.FileLoadedContent
              key={file?.systemFileId}
              file={{ ...file, id: file.systemFileId }}
              className="items-view_file"
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
          ))}
        </div>
      )}
    </div>
  );
}
