import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { APP_OVERVIEW, CONTRACT_ROUTE } from "config/route-const";
import { ERROR_TYPE } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import saveAs from "file-saver";
import { isEqual } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { useGetGeneralInformation } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useGetGeneralInformation";
import { useCallback, useMemo } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";
import { ContractAnnexModal } from "../constants";
import { contractAnnexRepository } from "../ContractAnnexRepository";

interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

export const useContractAnnexViewHooks = () => {
  const [translate] = useTranslation();
  const history = useHistory();
  const { contractId, id } = useParams<Parameters>();

  const { model, loading, setLoading, handleChangeSingleField } =
    useGetGeneralInformation({
      contractId,
      id,
    });
  const { notifyToast } = appMessageService.useCRUDMessage();

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
        name: translate("CM.menu_title_contract"),
        path: CONTRACT_ROUTE,
      },
      {
        name: translate("CA.txt_contract_annex", { code: model?.code }),
      },
    ];
  }, [model?.code, translate]);

  const refresh = () => {
    history.goBack();
  };

  const handleConfirmModal = (type: ContractAnnexModal) => {
    if (isEqual(type, ContractAnnexModal.Approve)) {
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
    handleChangeSingleField,
    // non-context
    translate,
    breadcrumbs,
    handleDownloadFileAttached,
  };
};
