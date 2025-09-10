/* eslint-disable import/no-unresolved */
import { Col, Row, Switch } from "antd";
import { LoadFileIcon, UploadIcon } from "assets/icons";
import { LoadingCM, UploadFileCustom } from "components";
import { utilService } from "core/services/common-services/util-service";
import React, { useContext } from "react";
import {
  DatePicker,
  EnumSelect,
  FormItem,
  InputNumber,
  InputText,
  Modal,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { getIconFile } from "core/helpers/common";
import dayjs from "dayjs";
import { Attachment } from "models/Attachment";
import { getListPromotionType, listPromotionType } from "../PromotionConstant";
import {
  PromotionMasterContext,
  PromotionMasterContextModel,
} from "../PromotionMaster/PromotionMasterHook";
import { promotionRepository } from "../PromotionRepository";
import "./PromotionDetail.scss";
import { usePromotionDetailHook } from "./PromotionDetailHook";

interface AttachmentLoading {
  files: Attachment[];
  type: number;
}
const FILE_ICON_SIZE = 24;

const PromotionDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<PromotionMasterContextModel>(PromotionMasterContext);

  const {
    loading,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
    handleUpdateListFile,
    handleRemoveFile,
    handleDownloadFileAttached,
    handleChangeAllField,
  } = usePromotionDetailHook(
    model,
    dispatchModel,
    handleCloseModal,
    handleLoadList
  );
  const [attachmentLoading, setAttachmentLoading] =
    React.useState<AttachmentLoading>();

  const handleSetAttachmentLoading = (files: Attachment[], type: number) => {
    setAttachmentLoading({
      files,
      type,
    });
  };

  const attachmentFiles = React.useMemo(() => {
    const listFileType0 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 0
    );
    const listFileType1 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 1
    );
    const listFileType2 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 2
    );
    const listFileType3 = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.attachmentFileType === 3
    );
    return {
      listFileType0,
      listFileType1,
      listFileType2,
      listFileType3,
    };
  }, [model?.attachmentFiles]);

  const returnUploadFileAndAttachment = React.useCallback(
    (type: number, listFile: Attachment[]) => {
      return (
        <Col span={24}>
          <div className="title-detail">
            {translate(`promotions.uploadFilePromotionType${type}`)}
          </div>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "attachmentFiles"
            )}
          >
            <UploadFileCustom
              uploadFile={promotionRepository.importFiles}
              updateList={handleUpdateListFile(type)}
              type="dragAndDrop"
              textHint={translate("promotions.multiple_files_upload")}
              titleButton={translate("promotions.upload")}
              icon={<img src={UploadIcon} alt="img" />}
              className="feedback_upload_file"
              setListFileLoading={(files) =>
                handleSetAttachmentLoading(files, type)
              }
            />
          </FormItem>

          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            {attachmentLoading?.type === type &&
              attachmentLoading?.files &&
              attachmentLoading?.files?.map((file, index) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={index}
                    file={{ ...file, id: file.systemFileId, name: file.name }}
                    isViewMode
                    showIconDowload={false}
                    onClickFile={() => handleDownloadFileAttached}
                    className={index % 2 === 0 ? "w-50 p-r--2xs" : "w-50"}
                    icon={
                      <img
                        src={LoadFileIcon}
                        alt="gif"
                        width={FILE_ICON_SIZE}
                        height={FILE_ICON_SIZE}
                      />
                    }
                  />
                );
              })}
            {listFile?.length > 0 &&
              listFile?.map((file: Attachment, index) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={file.systemFileId}
                    file={{
                      ...file,
                      id: file.systemFileId,
                      name: file.path?.split("/").pop(),
                    }}
                    removeFile={handleRemoveFile}
                    onClickFile={() => handleDownloadFileAttached(file)}
                    className={index % 2 === 0 ? "w-50 p-r--2xs" : "w-50"}
                    icon={
                      <img
                        src={getIconFile({
                          ...file,
                          name: file.path?.split("/").pop(),
                        })}
                        alt="img"
                        width={FILE_ICON_SIZE}
                        height={FILE_ICON_SIZE}
                      />
                    }
                  />
                );
              })}
          </div>
        </Col>
      );
    },
    [
      attachmentLoading?.files,
      attachmentLoading?.type,
      handleDownloadFileAttached,
      handleRemoveFile,
      handleUpdateListFile,
      model,
      translate,
    ]
  );

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("promotions.update")}`
            : `${translate("promotions.create")}`
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
              {translate("promotions.status")}
            </div>
            <Switch
              checked={model.isActive}
              onChange={(checked) => {
                handleChangeSingleField({
                  fieldName: "isActive",
                })(checked);
              }}
              className={"switch_status"}
            />
            <span className="m-l--xs">{translate("promotions.active")}</span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("promotions.code")}
                placeHolder={translate("promotions.placeholder.code")}
                value={model.code}
                onChange={handleChangeSingleField({
                  fieldName: "code",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                isRequired
                maxLength={500}
                label={translate("promotions.name")}
                placeHolder={translate("promotions.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs ">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "promotionType"
              )}
            >
              <EnumSelect
                isRequired
                label={translate("promotions.promotionType")}
                placeHolder={translate("promotions.placeholder.promotionType")}
                type={1}
                getList={getListPromotionType}
                value={
                  typeof model?.promotionType === "number"
                    ? {
                        id: Number(model?.promotionType),
                        name: listPromotionType[Number(model?.promotionType)]
                          ?.name,
                      }
                    : null
                }
                onChange={(id) => {
                  handleChangeAllField({
                    ...model,
                    promotionType: Number(id),
                    attachmentFiles: [],
                  });
                }}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "startDate")}
            >
              <DatePicker
                label={translate("promotions.startDate")}
                value={
                  model.startDate ? dayjs(model.startDate).utc(true) : null
                }
                placeholder={translate("promotions.placeholder.startDate")}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "startDate",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "endDate")}
            >
              <DatePicker
                label={translate("promotions.endDate")}
                value={model.endDate ? dayjs(model.endDate).utc(true) : null}
                placeholder={translate("promotions.placeholder.endDate")}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "endDate",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs ">
            <FormItem
              validateObject={utilService.getValidateObj(model, "budget")}
            >
              <InputNumber
                label={translate("promotions.budget")}
                placeHolder={translate("promotions.placeholder.budget")}
                value={model.budget}
                onChange={handleChangeSingleField({
                  fieldName: "budget",
                })}
                decimalDigit={4}
                numberType={"DECIMAL"}
              />
            </FormItem>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("promotions.description")}
                placeHolder={translate("promotions.placeholder.description")}
                value={model.description}
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
                showCount
                translate={translate}
              />
            </FormItem>
          </Col>
          {model?.promotionType === 0 || !model?.promotionType ? (
            returnUploadFileAndAttachment(0, attachmentFiles?.listFileType0)
          ) : (
            <>
              {returnUploadFileAndAttachment(1, attachmentFiles?.listFileType1)}
              {returnUploadFileAndAttachment(2, attachmentFiles?.listFileType2)}
              {returnUploadFileAndAttachment(3, attachmentFiles?.listFileType3)}
            </>
          )}
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default PromotionDetail;
