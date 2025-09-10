/* eslint-disable import/no-unresolved */
import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { getIconFile } from "core/helpers/common";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext, useState } from "react";
import { UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./AttachedFile.scss";
import { IcArrowDown } from "assets/icons";
import { RequestAttachment } from "models/Proposal";
import { UploadFileCustom } from "components";

const AttachedFile = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const {
    model,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    handleRemoveFileAttachment,
    handleUpdateListAttachments,
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  if (model?.isDetail && !model?.attachments?.length) return null;

  return (
    <div className="attached-purchase-create-wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("BG.attach_files")}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="proposal__attached">
          {!model?.isDetail && (
            <UploadFileCustom
              uploadFile={budgetRepository.import}
              updateList={handleUpdateListAttachments}
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
          {(model?.attachments?.length > 0 || !!fileLoading.length) && (
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
                        className="rotate-image"
                      />
                    }
                  />
                );
              })}
              {model?.attachments?.map(
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
      )}
    </div>
  );
};

export default AttachedFile;
