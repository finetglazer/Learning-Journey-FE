import { GetOpinionsInfo, LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import UploadFileCustom from "components/UploadFileCustom/UploadFileCustom";

import {
  MAX_LENGTH_255,
  MODAL_WIDTH_600,
  numberConstants,
} from "core/config/consts";
import { getIconFile } from "core/helpers/common";
import { validator } from "core/helpers/validator";

import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { Dayjs } from "dayjs";
import { isEmpty, isEqual, isObject, uniqueId } from "lodash";
import { FileModelExtend } from "models/OpinionCollector";
import { v4 as uuidv4 } from "uuid";

import { useContext, useMemo, useState } from "react";
import {
  Checkbox,
  DateRangePicker,
  FormItem,
  InputText,
  Modal,
  UploadFile,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./ModalAuthorization.scss";
import { SupplierDetailContext } from "pages/Catalog/Supplier/SupplierDetail/SupplierDetailHook";
import { RequestAttachment } from "models/Proposal";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import { SupplierAuthorization } from "models/Supplier/Supplier";
import { Col } from "antd";

type ListFile = FileModelExtend[];
const ICON_SIZE_LARGE = 24;
const MAX_SIZE = 99999999999;

type ModalAuthorizationProps = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: SupplierAuthorization;
};

const NUMBER_REGEX = /^[0-9\s]*$/;

export default function ModalAuthorization({
  open,
  handleCancel,
  recordEdit,
}: ModalAuthorizationProps) {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    handleChangeSingleField: handleChangeSingleFieldMaster,
    handleDownloadFileAttached,
    handleUploadAttachmentError,
  } = useContext(SupplierDetailContext);

  const checkDefault = useMemo(() => {
    if (
      !modelDetail?.supplierAuthorizations ||
      modelDetail?.supplierAuthorizations?.length === 0
    ) {
      return false;
    } else {
      const filter = modelDetail?.supplierAuthorizations?.filter(
        (item: { isRepresentativeDefault: boolean }) => {
          return item?.isRepresentativeDefault;
        }
      );
      return filter?.length > 0;
    }
  }, [modelDetail?.supplierAuthorizations]);

  const { model, dispatch } = detailService.useModel<SupplierAuthorization>(
    SupplierAuthorization,
    {
      ...new SupplierAuthorization(),
      ...recordEdit,
      isRepresentativeDefault:
        !recordEdit &&
        (modelDetail?.supplierAuthorizations?.length === 0 ||
          !modelDetail?.supplierAuthorizations)
          ? true
          : recordEdit?.isRepresentativeDefault
          ? recordEdit?.isRepresentativeDefault
          : false,
      authorizedDate: [
        recordEdit?.authorizedStartDate || undefined,
        recordEdit?.authorizedEndDate || undefined,
      ],
    }
  );

  const {
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

  const validate = () => {
    const requiredFields = [
      "authorizedPerson",
      "authorizedPersonCitizenID",
      "authorizedPersonPosition",

      "authorizedDate",
    ];
    const maxLengthFields = [
      "authorizedPerson",
      "authorizedPersonPosition",
      "authorizationLetter",
    ];
    const errors = {
      ...validator.required({ filedValidate: requiredFields, data: model }),
      ...validator.maxLength({
        filedValidate: maxLengthFields,
        data: model,
        maxLength: MAX_LENGTH_255,
      }),
      ...validator.tabCharacter({
        filedValidate: maxLengthFields,
        data: model,
      }),
      ...validator.tabCharacter({ filedValidate: requiredFields, data: model }),
    };
    if (Object.keys(errors).length > numberConstants.ZERO) {
      handleChangeAllField({ ...model, errors });
      return false;
    }
    return true;
  };

  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);
  const handleUpdateList = (listFile: ListFile) => {
    const newFiles = [
      ...(model?.supplierAuthorizationAttachments || []),
      ...listFile,
    ];
    handleChangeSingleField({
      fieldName: "supplierAuthorizationAttachments",
    })(newFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.supplierAuthorizationAttachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "supplierAuthorizationAttachments",
    })(listFile);
  };

  const handleAddNew = () => {
    if (!validate()) {
      return;
    }

    const updatedContacts = recordEdit
      ? modelDetail?.supplierAuthorizations?.map(
          (authorized: SupplierAuthorization) =>
            isEqual(authorized?.id, recordEdit?.id) ? model : authorized
        )
      : [
          ...(modelDetail?.supplierAuthorizations || []),
          {
            ...model,
            id: uuidv4(),
          },
        ];
    handleChangeSingleFieldMaster({
      fieldName: "supplierAuthorizations",
    })(
      updatedContacts?.map((author: SupplierAuthorization) => {
        return {
          ...author,
          authorizedStartDate:
            author?.authorizedDate && author?.authorizedDate?.length > 0
              ? author?.authorizedDate[0]
              : undefined,
          authorizedEndDate:
            author?.authorizedDate && author?.authorizedDate?.length > 1
              ? author?.authorizedDate[1]
              : undefined,
        };
      })
    );
    handleCancel();
  };

  const [showWarning, setShowWarning] = useState(false);

  const handleChangeCheckbox = (value: boolean) => {
    if (checkDefault) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      handleChangeSingleField({
        fieldName: "isRepresentativeDefault",
      })(value);
    }
  };

  return (
    <Modal
      open={open}
      title={translate("SL.txt_btn_add_authorization")}
      size={MODAL_WIDTH_600}
      handleSave={handleAddNew}
      handleCancel={handleCancel}
      titleButtonCancel={translate("SL.txt_btn_close")}
      titleButtonApply={translate("SL.txt_btn_save")}
      isShowIconBack={false}
      closeIcon
    >
      <div className="modal-authorization__container">
        {showWarning && (
          <Col lg={24} className="m-b--sm">
            <div
              style={{
                height: "60px",
                backgroundColor: "#e6f2fb",
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                color: "#0673c6",
                border: "#0673c6 1px solid",
              }}
            >
              <img src={GetOpinionsInfo} alt="" height={40} width={40} />
              <span>{translate("SL.contactModal.warningDefault")}</span>
            </div>
          </Col>
        )}
        <div className="modal-authorization__form">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "isRepresentativeDefault"
            )}
          >
            <Checkbox
              label={translate("SL.txt_is_representative_default")}
              checked={model?.isRepresentativeDefault}
              onChange={handleChangeCheckbox}
            />
          </FormItem>
        </div>
        <div className="modal-authorization__form">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "authorizedPerson"
            )}
          >
            <InputText
              label={translate("SL.txt_authorized_person")}
              placeHolder={translate("SL.txt_name_authorization")}
              value={model?.authorizedPerson}
              onChange={handleChangeSingleField({
                fieldName: "authorizedPerson",
              })}
              className="modal-authorization__input-text"
              maxLength={MAX_LENGTH_255}
              translate={translate}
              isSmall={false}
              isRequired
            />
          </FormItem>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "authorizedPersonCitizenID"
            )}
          >
            <InputText
              label={translate("SL.txt_cccd_cmnd")}
              placeHolder={translate("SL.txt_change_cccd_cmnd")}
              onChange={handleChangeSingleField({
                fieldName: "authorizedPersonCitizenID",
              })}
              value={model?.authorizedPersonCitizenID}
              translate={translate}
              regexInput={NUMBER_REGEX}
              isSmall={false}
              isRequired
            />
          </FormItem>
          <div className="modal-authorization__form-box">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "authorizedPersonPosition"
              )}
            >
              <InputText
                label={translate("SL.txt_position")}
                placeHolder={translate(
                  "SL.contact_person_position_supplier_placeholder"
                )}
                value={model?.authorizedPersonPosition}
                onChange={handleChangeSingleField({
                  fieldName: "authorizedPersonPosition",
                })}
                className="modal-authorization__input-text"
                maxLength={MAX_LENGTH_255}
                translate={translate}
                isSmall={false}
                isRequired
              />
            </FormItem>

            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "authorizationLetter"
              )}
            >
              <InputText
                label={translate("SL.txt_paper_authorized")}
                placeHolder={translate("SL.txt_change_paper_authorized")}
                value={model?.authorizationLetter}
                onChange={handleChangeSingleField({
                  fieldName: "authorizationLetter",
                })}
                className="modal-authorization__input-text"
                maxLength={MAX_LENGTH_255}
                translate={translate}
                isSmall={false}
              />
            </FormItem>
          </div>
          <FormItem
            validateObject={utilService.getValidateObj(model, "authorizedDate")}
          >
            <DateRangePicker
              value={model?.authorizedDate || ([null, null] as [Dayjs, Dayjs])}
              onChange={handleChangeDateField({
                fieldName: "authorizedDate",
              })}
              className="modal-authorization__datepicker"
              label={translate("SL.txt_start_end_date")}
              dateFormat={["DD/MM/YYYY", "DD/MM/YYYY"]}
              placeholder={[
                translate("SL.txt_change_start_date"),
                translate("SL.txt_change_end_date"),
              ]}
              isSmall={false}
              isRequired
            />
          </FormItem>
          <div className="modal-authorization__upload-file">
            <span className="modal-authorization__upload-file-title">
              {translate("SL.txt_file_paper_authorized")}
            </span>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "supplierAuthorizationAttachments"
              )}
            >
              <UploadFileCustom
                isMultiple={false}
                type="dragAndDrop"
                textHint={translate("SL.txt_file_size")}
                titleButton={translate("SL.txt_upload_file")}
                icon={<img src={UploadIcon} alt="" />}
                className={classNames(
                  "modal-authorization__upload-file-input",
                  {
                    error: isObject(
                      utilService.getValidateObj(
                        model,
                        "supplierAuthorizationAttachments"
                      )
                    ),
                  }
                )}
                uploadFile={supplierRepository.importFiles}
                setListFileLoading={setFileLoading}
                updateList={handleUpdateList}
                onUploadError={handleUploadAttachmentError}
                maximumSize={MAX_SIZE}
              />
            </FormItem>
            {(!isEmpty(fileLoading) ||
              !isEmpty(model?.supplierAuthorizationAttachments)) && (
              <div className="modal-authorization__file-list">
                {fileLoading?.map((file: RequestAttachment) => (
                  <UploadFile.FileLoadedContent
                    key={uniqueId(`${file?.systemFileId}`)}
                    file={{
                      ...file,
                      id: file.systemFileId,
                      name: file.name,
                    }}
                    className="modal-authorization__file-list-item"
                    icon={
                      <img
                        src={LoadFileIcon}
                        width={ICON_SIZE_LARGE}
                        height={ICON_SIZE_LARGE}
                        className="rotate-image"
                        alt=""
                      />
                    }
                    isViewMode
                  />
                ))}
                {model?.supplierAuthorizationAttachments?.map(
                  (file: RequestAttachment) => (
                    <UploadFile.FileLoadedContent
                      key={file?.systemFileId}
                      file={{ ...file, id: file.systemFileId }}
                      className="modal-authorization__file-list-item--view"
                      removeFile={handleRemoveFile}
                      onClickFile={() => handleDownloadFileAttached(file)}
                      icon={
                        <img
                          src={getIconFile(file)}
                          width={ICON_SIZE_LARGE}
                          height={ICON_SIZE_LARGE}
                          alt=""
                        />
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
