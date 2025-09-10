import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import saveAs from "file-saver";
import type { AxiosResponse } from "axios";

import useElectronicInvoiceRepository from "../UseElectronicInvoiceRepository";
import { UseElectronicInvoiceDetail } from "models/UseElectronicInvoice";
import appMessageService from "core/services/common-services/app-message-service";

import { listStatusEPro } from "../constants";

export const useUseElectronicInvoiceViewHook = (id: string) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<UseElectronicInvoiceDetail>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    useElectronicInvoiceRepository.getDetail(id).subscribe({
      next: (response: UseElectronicInvoiceDetail) => setModel(response),
      error: () => {
        notifyToast({
          type: "error",
          message: translate("CM.message_system_error"),
        });
      },
      complete: () => setLoading(false),
    });
  }, [id, translate]);

  const handleDownloadFileInvoice = (filePath: string, fileName: string) => {
    useElectronicInvoiceRepository.downloadFile(filePath).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        saveAs(blob, fileName);
      },
    });
  };

  const shortenFileName = (fileName: string): string => {
    if (!fileName) return "";
    const MAX_LENGTH = 25;
    if (fileName.length <= MAX_LENGTH) {
      return fileName;
    }
    const result = fileName.slice(0, MAX_LENGTH);

    return `${result}...`;
  };

  const getStatusEProText = (statusEProId: number): string => {
    const item = listStatusEPro.find(
      (statusType) => statusType.id === statusEProId
    );

    return item?.name || "";
  };

  const getFileNameFromPath = (filePath: string) => {
    if (!filePath) return "";
    return filePath.split("/").at(-1);
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id, getDetail]);

  return {
    model,
    translate,
    isLoading,
    handleDownloadFileInvoice,
    shortenFileName,
    getStatusEProText,
    getFileNameFromPath,
  };
};
