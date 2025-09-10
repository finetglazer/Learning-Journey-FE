import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  APP_OVERVIEW,
  CONTRACT_PRINCIPLE_MASTER_ROUTE,
  CONTRACT_PRINCIPLE_ROUTE,
} from "config/route-const";
import { ERROR_TYPE } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import saveAs from "file-saver";
import { isEqual } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useCallback, useMemo } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";

import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { CPAModalType } from "../../constants";
import { useGetGeneralInformation } from "../Components/hooks/useGetGeneralInformation";

interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

export const useContractPrincipleAppendixViewHook = () => {
  const [translate] = useTranslation();
  const history = useHistory();
  const { contractId, id } = useParams<Parameters>();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, loading, setLoading } = useGetGeneralInformation({
    contractId,
    id,
  });

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_shopping"),
      },
      {
        name: translate("CM.menu_title_contract_principle"),
        path: CONTRACT_PRINCIPLE_ROUTE,
      },
      {
        name: translate("CPA.txt_contract_principle_annex", {
          code: model?.code,
        }),
      },
    ];
  }, [model?.code, translate]);

  const refresh = () => {
    history.push(`${CONTRACT_PRINCIPLE_MASTER_ROUTE}?tab=0&tabKey=1`);
  };

  const handleConfirmModal = (type: CPAModalType) => {
    if (isEqual(type, CPAModalType.Approve)) {
      setLoading(true);
      contractAnnexRepository
        .approve(model?.id)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            refresh();
          },
          error: (error: AxiosError) => {
            if (isEqual(error?.response?.status, HttpStatusCode.BAD_REQUEST)) {
              notifyToast({
                type: ERROR_TYPE,
                message: error.response?.data?.message,
              });
            }
          },
        });
    }
  };

  const handleDownloadFileAttached = useCallback((file?: FileModel) => {
    const type =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type,
        });
        saveAs(blob, file?.name);
      },
      error: (error) => {
        console.error("Error downloading the file:", error);
      },
    });
  }, []);

  return {
    model,
    loading,
    handleConfirmModal,
    // non-context
    translate,
    breadcrumbs,
    handleDownloadFileAttached,
  };
};
