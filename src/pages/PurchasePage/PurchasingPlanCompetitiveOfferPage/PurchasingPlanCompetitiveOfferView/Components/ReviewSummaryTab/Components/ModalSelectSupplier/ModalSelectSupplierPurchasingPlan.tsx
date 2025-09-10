/* eslint-disable import/no-unresolved */
import { LoadFileIcon, UploadIcon } from "assets/icons";
import classNames from "classnames";
import { UploadFileCustom } from "components";
import { getIconFile } from "core/helpers/common";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { size } from "lodash";
import { RequestAttachment } from "models/Contract";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext, useState } from "react";
import { Model } from "react-3layer-common";
import { FormItem, Modal, UploadFile } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./ModalSelectSupplierPurchasingPlan.scss";

class UploadFileType extends Model {
  listFile: RequestAttachment[];
}

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressSave?: (data: UploadFileType) => void;
};

const ModalSelectSupplierPurchasingPlan = ({
  open,
  handleCancel,
  onPressSave,
}: Props) => {
  const {
    model: modelMaster,
    tempSelectSupplier,
    handleUploadFileError,
    handleDownloadFile,
    ...contextValue
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const { model, dispatch } =
    detailService.useModel<UploadFileType>(UploadFileType);

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(model, dispatch);

  const [translate] = useTranslation();

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
    if (size(model?.listFile) === 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model.errors,
          listFile:
            size(model?.listFile) === 0
              ? translate("CM.input_require_validation")
              : undefined,
        },
      });
      return false;
    }
    return true;
  };

  const handleSaveModal = () => {
    if (!validate()) return;
    handleCancel();
    onPressSave?.(model);
    contextValue.selectSupplier(model?.listFile);
  };

  return (
    <Modal
      open={open}
      title={translate("PL.review_summary.confirm_select_supplier")}
      size={600}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleSaveModal}
      isShowIconBack={false}
      handleCancel={handleCancel}
      titleButtonCancel={translate("CT.contract_file.cancel")}
      titleButtonApply={translate("PL.btn_confirm")}
    >
      <div className="pl-modal-upload-file">
        <div>
          <span>
            {translate("PL.review_summary.title_confirm_select_supplier")}
          </span>{" "}
          <span className="fw-semibold">{tempSelectSupplier?.name}</span>{" "}
          <span>{translate("PL.review_summary.for_purchasing_plan")}</span>{" "}
          <span className="fw-semibold">{modelMaster?.code}</span>
        </div>
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
                  //   isViewMode={model?.isDetail}
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
      </div>
    </Modal>
  );
};

export default ModalSelectSupplierPurchasingPlan;
