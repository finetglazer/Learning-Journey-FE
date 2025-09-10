/* eslint-disable import/no-unresolved */
import { UploadFile } from "react-components-design-system";
import { getIconFile } from "core/helpers/common";
import { Col, Row } from "antd";
import { useContext } from "react";
import { t } from "i18next";
import { ContractTerminationContextModel } from "models/ContractTermination";
import "./AttachmentsView.scss";
import { RequestAttachment } from "models/Proposal";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { emptyCloudIcon } from "assets/icons";

const AttachmentsView = () => {
  const { model, handleDownloadFileAttached } =
    useContext<ContractTerminationContextModel>(
      ContractTerminationDetailHookContext
    );

  const attachments = model?.attachments?.slice(0, 8) || [];

  return (
    <div className="attachments-view-container">
      {model?.attachments?.length > 0 ? (
        <Row gutter={16}>
          {attachments?.map((file: RequestAttachment, index: number) => {
            return (
              <Col key={index} className="gutter-row" span={6}>
                <UploadFile.FileLoadedContent
                  key={file?.systemFileId}
                  file={{ ...file, id: file.systemFileId }}
                  onClickFile={() => handleDownloadFileAttached(file)}
                  isViewMode
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
      ) : (
        <EmptyInitializeTable
          isSolid={false}
          textButton=""
          disableButton={true}
          content={
            <>{t("contractTermination.contract_termination_empty_system")}.</>
          }
          icon={<img src={emptyCloudIcon} alt="" />}
          onHandleClickAdd={null}
        />
      )}
    </div>
  );
};

export default AttachmentsView;
