/* eslint-disable import/no-unresolved */
import { Col, Row } from "antd";
import { getIconFile } from "core/helpers/common";
import { attachmentService } from "core/services/page-services/attachment-service";
import { isEmpty } from "lodash";
import { Attachment } from "models/Attachment";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { UploadFile } from "react-components-design-system";

type Props = {
  files: Attachment[];
};
const AttachedDocument = ({ files }: Props) => {
  const { handleDownloadFileAttached } = attachmentService.useAttachments();

  return (
    <>
      {isEmpty(files) ? (
        <EmptyDocuments isNewVersion />
      ) : (
        <Row gutter={[16, 0]}>
          {files.map((file: Attachment, index: number) => {
            return (
              <Col span={8} key={index}>
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId }}
                  onClickFile={() => handleDownloadFileAttached(file)}
                  isViewMode={true}
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

export default AttachedDocument;
