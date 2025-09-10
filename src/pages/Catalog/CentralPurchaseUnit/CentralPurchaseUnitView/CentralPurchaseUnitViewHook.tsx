/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import appMessageService from "core/services/common-services/app-message-service";

import { CentralPurchaseUnit } from "models/CentralPurchaseUnit";

import centralPurchaseUnitRepository from "../CentralPurchaseUnitRepository";

export const useCentralPurchaseUnitViewHook = (id: string) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<CentralPurchaseUnit>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    centralPurchaseUnitRepository.getDetail(id).subscribe({
      next: (response: CentralPurchaseUnit) => setModel(response),
      error: () => {
        notifyToast({
          type: "error",
          message: translate("CM.message_system_error"),
        });
      },
      complete: () => setLoading(false),
    });
  }, [id, translate]);

  const copyToClipboard = () => {
    const textToCopy = model?.organization?.code || "";

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notifyToast({
            message: translate("CM.copied_to_clipboard_message"),
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Failed to copy text: ", error);
        });
    }
  };

  useEffect(() => {
    getDetail();
  }, [id, getDetail]);

  return {
    model,
    translate,
    isLoading,
    copyToClipboard,
  };
};
