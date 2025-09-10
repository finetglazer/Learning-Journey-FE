/* eslint-disable import/no-unresolved */
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { useContext } from "react";
import { UploadFile } from "react-components-design-system";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import EmptyDocuments from "../../../EmptyDocuments/EmptyDocuments";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";

type Props = {
  files: RequestAttachment[];
};
const AttachedFileView = ({ files }: Props) => {
  const { handleDownloadFileAttached } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );

  return (
    <>
      {isEmpty(files) ? (
        <EmptyDocuments isNewVersion />
      ) : (
        <Row gutter={[16, 0]}>
          {files.map((file: RequestAttachment, index: number) => {
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

export default AttachedFileView;
