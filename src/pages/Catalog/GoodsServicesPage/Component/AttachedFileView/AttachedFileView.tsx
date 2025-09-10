/* eslint-disable import/no-unresolved */
import { getIconFile } from "core/helpers/common";
import { UploadFile } from "react-components-design-system";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import EmptyDocuments from "../EmptyDocuments/EmptyDocuments";
import { FileAttachments } from "core/models/File/File";
import type { AxiosResponse } from "axios";
import saveAs from "file-saver";
import { goodsServicesRepository } from "../../GoodsServicesRepository";

type Props = {
  files: FileAttachments[];
  isViewMode: boolean;
  handleDeleteFile: (fileId: string | number) => void;
};
const AttachedFileView = ({ files, isViewMode, handleDeleteFile }: Props) => {
  const handleDownloadFileAttached = (file?: FileAttachments) => {
    if (!file) return;
    goodsServicesRepository.downloadFile(file.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], { type: file?.contentType });
        saveAs(blob, file.name);
      },
    });
  };

  return (
    <>
      {isEmpty(files) ? (
        <EmptyDocuments />
      ) : (
        <Row gutter={[16, 0]} className="w-50">
          {files.map((file: FileAttachments, index: number) => {
            return (
              <Col span={8} key={index}>
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId }}
                  onClickFile={() => handleDownloadFileAttached(file)}
                  showIconDowload={isViewMode ? true : false}
                  removeFile={handleDeleteFile}
                  isViewMode={isViewMode}
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
          })}
        </Row>
      )}
    </>
  );
};

export default AttachedFileView;
