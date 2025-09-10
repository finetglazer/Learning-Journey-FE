import { Col, Row } from "antd";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { getIconFile } from "core/helpers/common";
import { isEmpty } from "lodash";
import { Attachment } from "models/Attachment";
import { UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

interface AttachmentsViewProps {
  files: Attachment[];
  handleDownloadFileAttached?: (file?: FileModel) => void;
}

export const AttachmentsView = ({
  files,
  handleDownloadFileAttached,
}: AttachmentsViewProps) => {
  if (isEmpty(files)) {
    return <CloudyEmpty />;
  }

  return (
    <Row gutter={[16, 8]}>
      {files?.map((file) => {
        return (
          <Col span={6} key={file?.systemFileId}>
            <UploadFile.FileLoadedContent
              key={file?.systemFileId}
              file={{ ...file, id: file.systemFileId }}
              onClickFile={() => handleDownloadFileAttached(file)}
              isViewMode
              icon={
                <img src={getIconFile(file)} alt="img" width={24} height={24} />
              }
            />
          </Col>
        );
      })}
    </Row>
  );
};
