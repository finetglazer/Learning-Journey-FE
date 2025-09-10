import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty } from "lodash";
import { CostDriver } from "models/CostDriver/CostDriver";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import costDriverRepository from "../CostDriverRepository";
import { finalize } from "rxjs";

export const useCostDriverViewHooks = (costDriverId: string) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<CostDriver | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    costDriverRepository
      .getDetail(costDriverId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: CostDriver) => setModel(response),
        error: () => {
          notifyToast({
            type: "error",
            message: translate("CM.message_system_error"),
          });
        },
      });
  }, [costDriverId, translate]);

  const copyToClipboard = () => {
    const textToCopy = model?.code;
    if (isEmpty(textToCopy)) return;

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
  };

  useLayoutEffect(() => {
    if (costDriverId) {
      getDetail();
    }
  }, [costDriverId]);

  return {
    model,
    translate,
    isLoading,
    copyToClipboard,
    getDetail,
  };
};
