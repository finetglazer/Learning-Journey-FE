/* eslint-disable import/no-unresolved */
import React, { useContext, useState } from "react";
import {
  FormItem,
  Modal,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { UploadFileType } from "./helper";
import { useTranslation } from "react-i18next";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { RequestAttachment } from "../SettlementFile/SettlementFile";
import { size } from "lodash";
import { utilService } from "core/services/common-services/util-service";
import { UploadFileCustom } from "components";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import classNames from "classnames";
import { LoadFileIcon, UploadIcon } from "assets/icons";
import { getIconFile } from "core/helpers/common";
import useTranslationSettlement from "pages/SettlementPage/useTranslationSettlement";

const WIDTH_SIZE = 800;

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressSave?: (data: UploadFileType) => void;
};

const ModalUploadFile = ({ open, handleCancel, onPressSave }: Props) => {
  const { handleUploadFileError, handleDownloadFile } = useContext(
    SettlementHookContext
  );

  const { model, dispatch } =
    detailService.useModel<UploadFileType>(UploadFileType);

  const [t] = useTranslation();
  const [translate] = useTranslationSettlement();

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(model, dispatch);

  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const handleUpdateListFile = (listFile: FileModel[]) => {
    const newListFiles = [...(model?.listFile || []), ...listFile];
    handleChangeSingleField({
      fieldName: "listFile",
    })(newListFiles);
  };

  const handleRemoveFile = (fileId: string | number) => {
    const listFile = model?.listFile?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "listFile",
    })(listFile);
  };

  const validate = () => {
    if (!model?.note || size(model?.listFile) === 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model.errors,
          note: model?.description
            ? undefined
            : translate("CM.input_require_validation"),
          listFile:
            size(model?.listFile) === 0
              ? translate("CM.input_require_validation")
              : undefined,
        },
      });
      return false;
    }
    const maxLengthFields = ["note"];
    for (const field of maxLengthFields) {
      if (model[field]?.length > 500) {
        return false;
      }
    }
    return true;
  };

  const handleSaveModal = () => {
    if (!validate()) return;
    handleCancel();
    onPressSave?.(model);
  };

  return (
    <Modal
      open={open}
      title={translate("CT.contract_file.add_contract_file")}
      size={WIDTH_SIZE}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleSaveModal}
      isShowIconBack={false}
      handleCancel={handleCancel}
      titleButtonCancel={translate("CM.txt_cancel")}
      titleButtonApply={translate("CM.txt_save")}
    >
      <div className="ct-modal-upload-file">
        <FormItem
          validateObject={utilService.getValidateObj(model, "listFile")}
        >
          <UploadFileCustom
            uploadFile={budgetRepository.import}
            updateList={handleUpdateListFile}
            isMultiple={false}
            type="dragAndDrop"
            uploadContent="Drag and drop files here or upload"
            textHint={translate("BG.multiple_files_upload")}
            className={classNames("proposal-upload-file")}
            titleButton={translate("BG.upload")}
            icon={<img src={UploadIcon} alt="img" />}
            maximumSize={99999999999}
            setListFileLoading={setFileLoading}
            onUploadError={handleUploadFileError}
          />
        </FormItem>

        {(size(model?.listFile) > 0 || !!fileLoading.length) && (
          <div className="flex-file-loaded">
            {fileLoading?.map((file: RequestAttachment, index) => {
              return (
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId, name: file.name }}
                  className={classNames("file-loaded-item-disabled")}
                  isViewMode={true}
                  icon={
                    <img
                      src={LoadFileIcon}
                      alt="gif"
                      width={24}
                      height={24}
                      className="rotate-icon"
                    />
                  }
                />
              );
            })}
            {model?.listFile?.map((file: RequestAttachment, index: number) => {
              return (
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...file, id: file.systemFileId }}
                  removeFile={handleRemoveFile}
                  className={classNames("file-loaded-item", {
                    "file-loaded-item-4": false,
                  })}
                  onClickFile={() => handleDownloadFile(file)}
                  isViewMode={model?.id}
                  icon={
                    <img
                      src={getIconFile(file)}
                      alt="img"
                      width={24}
                      height={24}
                    />
                  }
                />
              );
            })}
          </div>
        )}
        <div className="flex-1">
          <FormItem validateObject={utilService.getValidateObj(model, "note")}>
            <TextArea
              isRequired
              className="mt-3"
              label={translate("settlement.label_description")}
              placeHolder={translate("settlement.plh_document_description")}
              showCount
              maxLength={500}
              resize="none"
              onChange={handleChangeSingleField({
                fieldName: "note",
              })}
              value={model?.note}
              translate={t}
            />
          </FormItem>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUploadFile;
