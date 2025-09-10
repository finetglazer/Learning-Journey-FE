/* eslint-disable import/no-unresolved */
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import React, { useContext } from "react";
import { UploadFile } from "react-components-design-system";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

type Props = {
  files: RequestAttachment[];
};
const AttachedFileView = ({ files }: Props) => {
  const { handleDownloadFileAttached } = useContext(
    PurchasingPlanPrincipleDetailHookContext
  );

  return (
    <>
      {isEmpty(files) ? (
        <EmptyDocuments />
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
