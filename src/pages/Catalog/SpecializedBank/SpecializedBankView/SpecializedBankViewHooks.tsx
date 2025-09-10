import appMessageService from "core/services/common-services/app-message-service";
import { SpecializedBank } from "models/SpecializedBank/SpecializedBank";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import specializedBankRepository from "../SpecializedBankRepository";

export const useSpecializedBankViewHooks = (id: string) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<SpecializedBank>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    specializedBankRepository.getDetail(id).subscribe({
      next: (response: SpecializedBank) => setModel(response),
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
    const textToCopy = model?.code || "";

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notifyToast({
            message: translate("CL.copied_to_clipboard_message"),
          });
        })
        .catch((error) => {
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
