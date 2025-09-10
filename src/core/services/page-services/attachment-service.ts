import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import saveAs from "file-saver";
import { isEqual } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import appMessageService from "../common-services/app-message-service";
import { HttpStatusCode } from "../service-types";

export const attachmentService = {
  /**
   *
   * react hook for action attachments
   *
   * @return: { handleUploadAttachmentError, handleDownloadFileAttached}
   *
   * */
  useAttachments: () => {
    const [translate] = useTranslation();
    const { notifyToast } = appMessageService.useCRUDMessage();

    const handleUploadAttachmentError = (error: AxiosError) => {
      if (isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)) {
        notifyToast({
          message: translate("BG.multiple_max_file_size"),
          type: "error",
        });
      } else {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      }
    };

    const handleDownloadFileAttached = (file?: FileModel) => {
      budgetRepository.downloadFile(file?.path).subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, file?.name);
        },
      });
    };

    return {
      handleUploadAttachmentError,
      handleDownloadFileAttached,
    };
  },
};
