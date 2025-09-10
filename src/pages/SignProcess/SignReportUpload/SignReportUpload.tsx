import { Col, Row } from "antd";
import React from "react";
import {
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "../SignProcessMaster";
import FileTemplatePage from "./FileTemplate/FileTemplate";
import FileUpload from "./FileUpload/FileUpload";
import "./SignReportUpload.scss";

const SignReportUpload: React.FC = () => {
  const {
    model,
    dispatch,
    repository,
    errorMessage,
    requestId,
    setErrorMessage,
  } = React.useContext<SignProcessModalContextInt>(SignProcessModalContext);

  return (
    <Row style={{ height: "calc(100vh - 240px)" }}>
      <Col span={24} style={{ height: "100%" }}>
        <div className="sign-report">
          <div className="sign-report__wrapper">
            {model.formType === 1 && (
              <div className="dynamic-template-container w-100">
                <FileTemplatePage
                  getListFileTemplates={repository.dynamicTemplateList}
                  previewFileTemplate={repository.dynamicTemplatePreview}
                  downloadFileTemplatePdf={repository.dynamicTemplatePreview}
                  downloadFileTemplateOriginal={
                    repository.dynamicTemplateDownloadOriginal
                  }
                  requestId={requestId}
                  fileTemplate={model.dynamicTemplate}
                />
              </div>
            )}

            {model.formType === 2 && (
              <FileUpload
                uploadFile={repository.uploadFile}
                model={model}
                dispatch={dispatch}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SignReportUpload;
