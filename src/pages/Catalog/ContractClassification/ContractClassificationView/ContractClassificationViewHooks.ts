import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty, isEqual, isNull } from "lodash";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { contractClassificationRepository } from "../ContractClassificationRepository";

export const useContractClassificationViewHooks = (
  open: boolean,
  contractClassificationId: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<ContractClassification | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    contractClassificationRepository
      .getDetail(contractClassificationId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: ContractClassification) => setModel(response),
        error: () => {
          setModel(null);
          notifyToast({
            type: "error",
            message: translate("CM.message_system_error"),
          });
        },
      });
  }, [contractClassificationId, translate]);

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

  useEffect(() => {
    if (isNull(contractClassificationId) || isEqual(open, false)) {
      return;
    }

    getDetail();
  }, [contractClassificationId]);

  return {
    model,
    translate,
    isLoading,
    getDetail,
    copyToClipboard,
  };
};
