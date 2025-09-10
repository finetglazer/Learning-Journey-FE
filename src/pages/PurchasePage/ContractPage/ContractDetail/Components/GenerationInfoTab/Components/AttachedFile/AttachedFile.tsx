import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { getIconFile } from "core/helpers/common";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useContext, useState } from "react";
import { UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./AttachedFile.scss";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ContractDetailModel } from "models/Contract";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { FileModelExtend } from "models/OpinionCollector";
import { RequestAttachment } from "models/Proposal";
import { Col, Row } from "antd";
import { UploadFileCustom } from "components";

const ContractDetailAttachedFile = () => {
  const [translate] = useTranslation();
  const {
    model,
    isDetail,
    handleChangeSingleField,
    handleUploadFileError,
    handleDownloadFileAttached,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);
  const [fileLoading, setFileLoading] = useState<FileModelExtend[]>([]);

  const handleUpdateList = (listFile: FileModelExtend[]) => {
    const newListFiles = [...(model?.attachments || []), ...listFile];
    handleChangeSingleField({
      fieldName: "attachments",
    })(newListFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.attachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "attachments",
    })(listFile);
  };

  if (isDetail && !model?.attachments?.length) return null;

  return (
    <div className="contract-detail-attached-file">
      <CollapseCard title={translate("CT.create_contract.attachments")}>
        <div className="contract__attached">
          {!isDetail && (
            <UploadFileCustom
              uploadFile={budgetRepository.import}
              updateList={handleUpdateList}
              isMultiple={false}
              type="dragAndDrop"
              uploadContent="Drag and drop files here or upload"
              textHint={translate("BG.multiple_files_upload")}
              className={classNames("contract-upload-file")}
              titleButton={translate("BG.upload")}
              icon={<img src={UploadIcon} alt="img" />}
              maximumSize={99999999999}
              setListFileLoading={setFileLoading}
              onUploadError={handleUploadFileError}
            />
          )}
          {(model?.attachments?.length > 0 || !!fileLoading.length) && (
            <Row gutter={16}>
              {fileLoading?.map((file: RequestAttachment, index) => {
                return (
                  <Col span={6} key={index}>
                    <UploadFile.FileLoadedContent
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
                  </Col>
                );
              })}
              {model?.attachments?.map(
                (file: RequestAttachment, index: number) => {
                  return (
                    <Col span={6} key={index}>
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
                    </Col>
                  );
                }
              )}
            </Row>
          )}
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractDetailAttachedFile;
