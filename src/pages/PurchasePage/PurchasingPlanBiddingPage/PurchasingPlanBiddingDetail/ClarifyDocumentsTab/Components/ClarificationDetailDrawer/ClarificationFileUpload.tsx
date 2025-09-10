import React, { useState, useCallback } from "react";
import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getIconFile } from "core/helpers/common";
import { UploadFileCustom } from "components";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { isEqual } from "lodash";
import { HttpStatusCode } from "core/services/service-types";
import appMessageService from "core/services/common-services/app-message-service";
import type { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { Col, Row } from "antd";
export interface ClarificationFile {
  systemFileId: string;
  name: string;
  contentType?: string;
  size?: number;
  path?: string;
}

interface ClarificationFileUploadProps {
  files: ClarificationFile[];
  onChangeFiles: (files: ClarificationFile[]) => void;
  isView?: boolean;
}

export const ClarificationFileUpload: React.FC<
  ClarificationFileUploadProps
> = ({ files = [], onChangeFiles, isView = false }) => {
  const [translate] = useTranslation();
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  // Hàm xử lý khi có file mới được tải lên
  const handleUpdateList = useCallback(
    (listFile: FileModel[]) => {
      const newListFiles = [...files, ...listFile];
      onChangeFiles(newListFiles as any[]);
    },
    [files, onChangeFiles]
  );

  // Hàm xử lý khi xóa file
  const handleRemoveFile = useCallback(
    (fileId: string | number) => {
      const listFile = files.filter(
        (p: ClarificationFile) => p?.systemFileId !== fileId
      );
      onChangeFiles(listFile);
    },
    [files, onChangeFiles]
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

  // Xử lý lỗi upload
  const handleUploadAttachmentError = useCallback((error: any) => {
    if (isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  }, []);

  // Hàm download file
  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  return (
    <div className="clarification-attached-files">
      <div className="files-upload-container">
        {!isView && (
          <UploadFileCustom
            uploadFile={budgetRepository.import}
            updateList={handleUpdateList}
            isMultiple={true}
            type="dragAndDrop"
            uploadContent={translate("PL.txt_drag_drop_upload")}
            textHint={translate("BG.multiple_files_upload")}
            className={classNames("clarification-upload-file")}
            titleButton={translate("PM.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            maximumSize={25 * 1024 * 1024} // 25MB in bytes
            setListFileLoading={setFileLoading}
            onUploadError={handleUploadAttachmentError}
          />
        )}
        {(files?.length > 0 || !!fileLoading.length) && (
          <div className="mt-3">
            {/* Hiển thị files đã upload */}
            <Row gutter={[8, 8]} className="file-loaded-list">
              {files?.map((file: ClarificationFile, index: number) => (
                <Col span={8} key={`file-${index}`}>
                  <UploadFile.FileLoadedContent
                    key={`file-${index}`}
                    file={{ ...file, id: file.systemFileId }}
                    removeFile={handleRemoveFile}
                    className={classNames("file-loaded-item w-100", {
                      "file-loaded-item-view": isView,
                    })}
                    onClickFile={() => handleDownloadFileAttached(file)}
                    isViewMode={isView}
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
              ))}
              {/* Hiển thị files đang loading */}
              {fileLoading?.map((file: any, index) => (
                <Col span={8} key={`file-${index}`}>
                  <div className="w-100">
                    <UploadFile.FileLoadedContent
                      key={`loading-${index}`}
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
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};
