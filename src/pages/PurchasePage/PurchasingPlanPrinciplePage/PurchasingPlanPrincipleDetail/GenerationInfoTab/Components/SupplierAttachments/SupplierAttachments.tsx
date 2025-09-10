/* eslint-disable import/no-unresolved */
import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext, useState } from "react";
import { UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./SupplierAttachments.scss";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { UploadFileCustom } from "components";

const SupplierAttachments = () => {
  const [translate] = useTranslation();
  const {
    model,
    handleChangeSingleField,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const handleUpdateList = (listFile: FileModel[]) => {
    const newListFiles = [...(model?.supplierAttachments || []), ...listFile];
    handleChangeSingleField({
      fieldName: "supplierAttachments",
    })(newListFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.supplierAttachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "supplierAttachments",
    })(listFile);
  };

  if (model?.isDetail && !model?.supplierAttachments?.length) return null;

  return (
    <div className="attached-purchase-create-wrapper_pl">
      <div className="proposal__attached">
        {!model?.isDetail && (
          <UploadFileCustom
            uploadFile={budgetRepository.import}
            updateList={handleUpdateList}
            isMultiple={false}
            type="dragAndDrop"
            uploadContent="Drag and drop files here or upload"
            textHint={translate("BG.multiple_files_upload")}
            className={classNames("proposal-upload-file")}
            titleButton={translate("BG.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            maximumSize={99999999999}
            setListFileLoading={setFileLoading}
            onUploadError={handleUploadAttachmentError}
          />
        )}
        {(model?.supplierAttachments?.length > 0 || !!fileLoading.length) && (
          <div className="flex-file-loaded">
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
                      className="rotate-icon"
                    />
                  }
                />
              );
            })}
            {model?.supplierAttachments?.map(
              (file: RequestAttachment, index: number) => {
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
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierAttachments;
