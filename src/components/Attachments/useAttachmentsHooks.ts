import { attachmentService } from "core/services/page-services/attachment-service";
import { useState } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export const useAttachmentsHooks = () => {
  const [fileLoading, setFileLoading] = useState<FileModel[]>([]);

  const { handleUploadAttachmentError, handleDownloadFileAttached } =
    attachmentService.useAttachments();

  return {
    fileLoading,
    setFileLoading,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
  };
};
