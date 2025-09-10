import { Col, Row } from "antd";
import styles from "components/Attachments/Attachments.module.scss";
import { useAttachmentsHooks } from "components/Attachments/useAttachmentsHooks";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { UploadFile } from "react-components-design-system";

interface AttachmentsDetailProps {
  attachments: RequestAttachment[] | undefined;
}

const AttachmentsDetail = ({ attachments }: AttachmentsDetailProps) => {
  const { handleDownloadFileAttached } = useAttachmentsHooks();

  return (
    <div>
      <Row gutter={16}>
        {attachments?.slice(0, 8).map((file) => (
          <Col key={file.id} span={6}>
            <UploadFile.FileLoadedContent
              key={file?.systemFileId}
              file={{ ...file, id: file.systemFileId }}
              icon={
                <img
                  src={getIconFile(file)}
                  width={ICON_SIZE_LARGE}
                  height={ICON_SIZE_LARGE}
                  alt=""
                />
              }
              className={styles["items_file"]}
              onClickFile={() => handleDownloadFileAttached(file)}
              isViewMode={true}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AttachmentsDetail;
