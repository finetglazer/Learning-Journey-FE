import { AxiosError } from "axios";
import { ERROR_TYPE } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEqual } from "lodash";
import { useCallback, useState } from "react";
import { finalize } from "rxjs";
import { ProjectSettlementModal } from "../constant";

const REASON = "reason";

export const useModalConfirm = (callback?: () => void) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const processApi = useCallback(
    (type: ProjectSettlementModal, id: string, reason: string) => {
      let method;
      switch (type) {
        case ProjectSettlementModal.Cancel:
          method = projectSettlementRepository.cancel;
          break;
        case ProjectSettlementModal.Delete:
          method = projectSettlementRepository.delete;
          break;
        case ProjectSettlementModal.Reject:
          method = projectSettlementRepository.reject;
          break;
        case ProjectSettlementModal.Return:
          method = projectSettlementRepository.return;
          break;
        default:
          return;
      }

      setLoading(true);
      method(id, reason)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            setErrorMessage(null);
            if (callback) {
              callback();
            }
          },
          error: (error: AxiosError) => {
            if (isEqual(error?.response?.status, HttpStatusCode.BAD_REQUEST)) {
              const type = error?.response?.data?.type;
              if (type === ErrorType.VALIDATE) {
                setErrorMessage(error.response?.data?.errors[REASON]);
              } else {
                notifyToast({
                  type: ERROR_TYPE,
                  message: error.response?.data?.message,
                });
              }
            }
          },
        });
    },
    [callback, notifyToast]
  );

  return {
    isLoading,
    errorMessage,
    processApi,
    setErrorMessage,
  };
};
