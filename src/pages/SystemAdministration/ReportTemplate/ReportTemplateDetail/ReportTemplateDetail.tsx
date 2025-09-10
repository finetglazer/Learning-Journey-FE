import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ReportTemplateManagementContext,
  ReportTemplateManagementContextProps,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import {
  Button,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";
import { Col, Row, Switch, Upload } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useReportTemplateDetailHook } from "pages/SystemAdministration/ReportTemplate/ReportTemplateDetail/ReportTemplateDetailHook";
import { UploadIcon } from "assets/icons";

const ReportTemplateDetail = () => {
  const [translate] = useTranslation();
  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<ReportTemplateManagementContextProps>(
    ReportTemplateManagementContext
  );
  const [fileList, setFileList] = useState<File[] | Blob[]>([model?.file]);
  const { loading, handleChangeSingleField, handleSave } =
    useReportTemplateDetailHook(
      model,
      dispatchModel,
      handleCloseModal,
      handleLoadList
    );
  const props: any = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      handleChangeSingleField({
        fieldName: "file",
      })(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      handleChangeSingleField({
        fieldName: "file",
      })(file);
      return false;
    },
    fileList: model.file ? [model.file] : [],
  };

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("reportTemplates.update")}`
            : `${translate("reportTemplates.create")}`
        }
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("detail")}
        onCancel={() => handleCloseModal("detail")}
        handleSave={handleSave}
        loading={loading}
        isShowIconBack={false}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
          <Col lg={24} className="m-b--sm d-flex">
            <div className={"label-title m-r--xs"}>
              {translate("reportTemplates.status")}
            </div>
            <Switch
              checked={model?.status}
              onChange={(checked) => {
                handleChangeSingleField({
                  fieldName: "status",
                })(checked);
              }}
              className={"switch_status"}
            />
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("reportTemplates.code")}
                placeHolder={translate("reportTemplates.placeholder.code")}
                value={model?.code}
                onChange={handleChangeSingleField({
                  fieldName: "code",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                isRequired
                maxLength={500}
                label={translate("reportTemplates.name")}
                placeHolder={translate("reportTemplates.placeholder.name")}
                value={model?.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>
          <Col lg={24} className="m-b--xs">
            {model?.path && (
              <InputText
                bgColor="white"
                label={translate("reportTemplates.path")}
                readOnly
                value={model?.path}
              />
            )}
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "file")}
            >
              <Upload accept=".xls, .xlsx" className="w-100" {...props}>
                <Button icon={<UploadIcon />}>
                  {translate("reportTemplates.upload")}
                </Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ReportTemplateDetail;
