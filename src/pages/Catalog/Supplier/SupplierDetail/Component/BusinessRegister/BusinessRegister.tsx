import { LoadFileIcon, UploadIcon } from "assets/icons";
import UploadFileCustom from "components/UploadFileCustom/UploadFileCustom";
import { getIconFile } from "core/helpers/common";

import { isEmpty, isObject, uniqueId } from "lodash";

import { useContext, useState } from "react";
import { FormItem, UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "../AttachmentOther/AttachmentOther.scss";
import { utilService } from "core/services/common-services/util-service";
import classNames from "classnames";
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

export default function BusinessRegister() {
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
      isBusinessRegistration: true,
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

  const businessFiles = model?.attachments?.filter(
    (file: RequestAttachment) => file.isBusinessRegistration === true
  );
  return (
    <div className="attachments">
      <div
        className={classNames({
          "empty-data": isEmpty(businessFiles) && isEmpty(fileLoading),
          "affter-data": !isEmpty(businessFiles) || !isEmpty(fileLoading),
        })}
      >
        <FormItem
          validateObject={utilService.getValidateObj(model, "attachments")}
        >
          <UploadFileCustom
            isMultiple={false}
            type="dragAndDrop"
            textHint={translate("SL.txt_file_size")}
            titleButton={translate("SL.txt_upload_file")}
            icon={<img src={UploadIcon} alt="" />}
            className={classNames("form-upload", {
              error: isObject(utilService.getValidateObj(model, "attachments")),
            })}
            uploadFile={supplierRepository.importFiles}
            setListFileLoading={setFileLoading}
            updateList={handleUpdateList}
            onUploadError={handleUploadAttachmentError}
            maximumSize={MAX_SIZE}
          />
        </FormItem>
      </div>
      {isEmpty(fileLoading) && isEmpty(businessFiles) ? null : (
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
          {businessFiles?.map((file: RequestAttachment) => (
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
