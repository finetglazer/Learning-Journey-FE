import {
  ChevronDown,
  DocumentDownload,
  Download,
  View,
} from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Spin } from "antd";
import type { AxiosResponse } from "axios";
import { FileTemplate, FileTemplateInput } from "core/models/FileTemplate";
import {
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "pages/SignProcess/SignProcessMaster";
import React, { ReactElement } from "react";
import { Button, InputText, TextArea } from "react-components-design-system";
import { Observable } from "rxjs";
import UploadCreatorSignImage from "../components/UploadCreatorSignImage/UploadCreatorSignImage";
import "./FileTemplate.scss";
import useFileTemplateHook from "./FileTemplateHook";

export interface FileTemplateParams {
  queryParams?: unknown;
  template: FileTemplate;
  inputs?: { [key: string]: string | number };
}

export interface FileTemplateProps {
  getListFileTemplates: (id: string) => Observable<FileTemplate[]>;
  previewFileTemplate: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>;
  downloadFileTemplatePdf: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>;
  downloadFileTemplateOriginal: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>;
  // saveFileTemplate?: (
  //   file: Blob,
  //   fileName: string,
  //   fileTemplate: FileTemplate,
  //   creatorSignAttachment?: RequestFormConfigurationContent,
  // ) => void;
  subTitle?: string;
  requestId?: string;
  fileTemplate?: FileTemplate;
}

export default function FileTemplatePage(
  props: FileTemplateProps
): ReactElement {
  const {
    getListFileTemplates,
    previewFileTemplate,
    downloadFileTemplatePdf,
    downloadFileTemplateOriginal,
    // subTitle,
    requestId,
    fileTemplate,
  } = props;

  const { infoAttachmentAndCreatorSign, setInfoAttachmentAndCreatorSign } =
    React.useContext<SignProcessModalContextInt>(SignProcessModalContext);

  const {
    currentfileTemplate,
    fileTemplates,
    currentFile,
    loadingPdf,
    translate,
    handleChangeFileTemplateInputValue,
    handleChangeFileTemplateName,
    handleChangeFileTemplate,
    handlePreviewFileTemplate,
    handleDownloadFileTemplate,
    handleDownloadFileTemplateOriginal,
  } = useFileTemplateHook(
    getListFileTemplates,
    previewFileTemplate,
    downloadFileTemplatePdf,
    downloadFileTemplateOriginal,
    requestId,
    fileTemplate,
    infoAttachmentAndCreatorSign,
    setInfoAttachmentAndCreatorSign
  );

  const listFileTemplates = React.useMemo(() => {
    const idString =
      currentfileTemplate && currentfileTemplate.id
        ? currentfileTemplate.id.toString()
        : null;
    return fileTemplates && fileTemplates.length > 0 ? (
      <Menu onClick={handleChangeFileTemplate} selectedKeys={[idString]}>
        {fileTemplates.map((item: FileTemplate) => {
          return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
        })}
      </Menu>
    ) : (
      <Menu>
        <Menu.Item key={0}>{"Empty"}</Menu.Item>
      </Menu>
    );
  }, [currentfileTemplate, fileTemplates, handleChangeFileTemplate]);

  const leftContent = React.useMemo(() => {
    return (
      <div className="gutter-box">
        <Row
          gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}
          className="m-t--2xs"
        >
          <Col lg={24}>
            <InputText
              type={1}
              label={translate("fileTemplates.name")}
              value={currentfileTemplate.name}
              onChange={handleChangeFileTemplateName}
              className="m-l--3xs"
            />
          </Col>
        </Row>
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 8]}>
          {currentfileTemplate &&
            currentfileTemplate.templateInputs != null &&
            currentfileTemplate.templateInputs.map(
              (fileTemplateInput: FileTemplateInput, index: number) => {
                return (
                  <Col
                    lg={24}
                    key={fileTemplateInput.id}
                    className="m-t--2xs m-l--3xs"
                  >
                    <TextArea
                      type={1}
                      label={fileTemplateInput.code}
                      onChange={handleChangeFileTemplateInputValue(index)}
                      value={
                        fileTemplateInput?.value ||
                        fileTemplateInput?.defaultValue
                      }
                    />
                  </Col>
                );
              }
            )}
        </Row>
      </div>
    );
  }, [
    currentfileTemplate,
    handleChangeFileTemplateInputValue,
    handleChangeFileTemplateName,
    translate,
  ]);

  return (
    <>
      <div className="page-content" style={{ paddingTop: "0px" }}>
        <div className="page page-detail page-detail--full  p-r--sm p-b--lg">
          <div className="w-100 d-flex justify-content-between align-items-center h-40px">
            <div className="page-detail__title">
              {translate("fileTemplates.title")}
            </div>
            <div className="d-flex align-items-center">
              <Dropdown
                dropdownRender={() => listFileTemplates}
                trigger={["click"]}
              >
                <Button
                  type="secondary"
                  className="m-r--xs"
                  size="lg"
                  icon={<ChevronDown size={16} />}
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  {translate("fileTemplates.list")}
                </Button>
              </Dropdown>
              <Button
                type="secondary"
                className="m-r--xs"
                size="lg"
                icon={<View size={16} />}
                onClick={handlePreviewFileTemplate}
              >
                {translate("fileTemplates.preview")}
              </Button>
              <Button
                type="secondary"
                className="m-r--xs"
                size="lg"
                icon={<DocumentDownload size={16} />}
                onClick={handleDownloadFileTemplate}
              >
                {translate("fileTemplates.downloadPDF")}
              </Button>
              <Button
                type="secondary"
                className="m-r--xs"
                size="lg"
                icon={<Download size={16} />}
                onClick={handleDownloadFileTemplateOriginal}
              >
                {translate("fileTemplates.downloadFile")}
              </Button>
            </div>
          </div>
          <div className="w-100 mt-2">
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col className="gutter-row" span={24}>
                <div className="d-flex w-100 justify-content-center align-items-center">
                  {loadingPdf || !currentFile ? (
                    <Spin size="large" tip="Đang tải..." />
                  ) : (
                    <UploadCreatorSignImage
                      pdfBlob={currentFile}
                      leftContent={leftContent}
                      creatorSignAttachment={
                        infoAttachmentAndCreatorSign?.creatorSignAttachment
                      }
                      setCreatorSignAttachment={(attachment) => {
                        setInfoAttachmentAndCreatorSign({
                          ...infoAttachmentAndCreatorSign,
                          creatorSignAttachment: attachment,
                        });
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
