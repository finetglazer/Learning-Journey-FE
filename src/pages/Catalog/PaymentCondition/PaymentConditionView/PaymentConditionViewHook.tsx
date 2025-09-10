import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import appMessageService from "core/services/common-services/app-message-service";

import { PaymentCondition } from "models/PaymentCondition";

import paymentConditionRepository from "../PaymentConditionRepository";

export const usePaymentConditionViewHook = (id: string) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<PaymentCondition>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    paymentConditionRepository.getDetail(id).subscribe({
      next: (response: PaymentCondition) => setModel(response),
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
            message: translate("CM.copied_to_clipboard_message"),
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
