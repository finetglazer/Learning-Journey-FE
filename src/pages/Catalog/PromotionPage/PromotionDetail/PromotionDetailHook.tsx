import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralAction } from "core/services/service-types";
import { isEqual } from "lodash";
import { Promotion } from "models/Promotion";
import React from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { promotionRepository } from "../PromotionRepository";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Attachment } from "models/Attachment";
import saveAs from "file-saver";
export function usePromotionDetailHook(
  model: Promotion,
  dispatchModel: React.Dispatch<GeneralAction<Promotion>>,
  handleCloseModal: (type: "preview" | "detail") => void,
  handleLoadList: () => void
) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleUpdateListFile =
    (attachmentFileType: number) => (listFile: FileModel[]) => {
      const listFileTmp = listFile?.map((file: FileModel) => ({
        ...file,
        attachmentFileType,
      }));
      const newListFiles = [...(model?.attachmentFiles || []), ...listFileTmp];
      handleChangeSingleField({
        fieldName: "attachmentFiles",
      })(newListFiles);
    };

  const handleRemoveFile = (id: string | number) => {
    const listFile = model?.attachmentFiles?.filter(
      (file: Attachment) => file?.systemFileId !== id
    );
    handleChangeSingleField({
      fieldName: "attachmentFiles",
    })(listFile);
  };

  const handleDownloadFileAttached = (file?: Attachment) => {
    if (!file) return;
    promotionRepository.downloadFile(file.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], { type: file?.contentType });

        if (isEqual(file?.contentType, "application/pdf")) {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, "_blank");
        } else {
          saveAs(blob, file.name);
        }
      },
    });
  };

  const handleSave = React.useCallback(() => {
    setLoading(true);
    promotionRepository
      .savePromotion({
        ...model,
      })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleCloseModal("detail");
            handleLoadList();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [
    handleChangeAllField,
    handleCloseModal,
    handleLoadList,
    model,
    notifyToast,
    translate,
  ]);

  return {
    loading,
    setLoading,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleChangeAllField,
    handleUpdateListFile,
    handleRemoveFile,
    handleDownloadFileAttached,
    handleSave,
  };
}
