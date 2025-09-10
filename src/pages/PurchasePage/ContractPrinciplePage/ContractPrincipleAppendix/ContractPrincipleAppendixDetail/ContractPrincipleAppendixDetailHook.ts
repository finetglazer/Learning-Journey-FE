import { AxiosError } from "axios";
import { numberConstants } from "core/config/consts";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import appMessageService from "core/services/common-services/app-message-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEmpty, isEqual, isNil } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useCheckPageState } from "../../Components/hooks/useCheckPageState";
import { useGetGeneralInformation } from "../Components/hooks/useGetGeneralInformation";
import { useListenAdjustData } from "../Components/hooks/useListenAdjustData";

import { CONTRACT_PRINCIPLE_MASTER_ROUTE } from "config/route-const";
import { ErrorType } from "core/helpers/handle-error";
import { HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { finalize } from "rxjs";
interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

const TAB_KEY = "tabKey";

export const useContractPrincipleAppendixDetailHook = () => {
  const [translate] = useTranslation();
  const history = useHistory();
  const { contractId, id } = useParams<Parameters>();
  const [errorsModal, setErrorsModal] = useState<ModalTypeError>({
    type: "NONE",
    errors: [],
  });
  const { model, loading, dispatch, setLoading } = useGetGeneralInformation({
    contractId,
    id,
  });

  useListenAdjustData(model, dispatch);

  const { isEditable } = useCheckPageState();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeListField,
  } = fieldService.useField<ContractAnnex>(model, dispatch);

  const onSave = useCallback(
    (params: { isDraft: boolean }) => {
      setLoading(true);

      // Convert Data
      let data = {
        isDraft: params.isDraft,
        contractId: model?.contractId,
        contractAppendixNo: model?.contractAppendixNo,
        isAdjustedContractInfo: model?.isAdjustedContractInfo,
        isAdjustedLegalInfo: model?.isAdjustedLegalInfo,
        isAdjustedSupplierInfo: model?.isAdjustedSupplierInfo,
        isAdjustedGoodsItem: model?.isAdjustedGoodsItem,
        isAdjustedReceiveInfo: model?.isAdjustedReceiveInfo,
        name: model?.name,
        appendixDate: isNil(model?.appendixDate)
          ? undefined
          : dayjs(model?.appendixDate)?.toISOString(),
        adjustmentType: model?.adjustmentTypeValue?.id,
        // Contract info
        effectiveDate: model?.contractInfo?.effectiveDate,
        endDate: model?.contractInfo?.endDate,
        manager: model?.contractInfo?.managerPerson?.email,
        managerOrganizationId: model?.contractInfo?.managerOrganization?.id,
        applicableOrganizationId:
          model?.contractInfo?.applicableOrganization?.id,
        applicableBranchId: model?.contractInfo?.applicableBranch?.id,
        applicableUnitId: model?.contractInfo?.applicableUnit?.id,
        // Legal info
        legalName: model?.legalInfo?.name,
        legalAddress: model?.legalInfo?.address,
        // Supplier
        supplierName: model?.supplierInfo?.supplierName,
        supplierAddress: model?.supplierInfo?.supplierAddress,
        isByProcuration: model?.supplierInfo?.isByProcuration,
        supplierAgentPerson: model?.supplierInfo?.supplierAgentPerson,
        supplierAgentPersonPosition:
          model?.supplierInfo?.supplierAgentPersonPosition,
        supplierProcuration: model?.supplierInfo?.supplierProcuration,
        supplierContactPerson: model?.supplierInfo?.supplierContactPerson,
        supplierEmail: model?.supplierInfo?.supplierEmail,
        supplierPhone: model?.supplierInfo?.supplierPhone,
        supplierPaymentId: model?.supplierInfo?.supplierPayment?.id,
        // Attachments
        attachments: model?.attachments,
        // documents group
        documentGroups: model?.documentGroups,
        // contract terms
        contractTerms: model?.contractTerms?.map((contractTerm) => ({
          name: contractTerm?.name,
          description: contractTerm?.description,
        })),
        contractAppendixClassification: numberConstants.ONE,
        originalPurchaseProposalId: model?.originalPurchaseProposalId,
        isPrinciple: true,
      };

      const action = isEditable ? "edit" : "create";
      // Map data handle error in table
      const newModel = convertDataToHaveIndexBeforeValidate(
        model,
        ["contractAppendixPaymentSchedules"],
        model,
        ["service_usage_time"]
      );

      if (isEditable) {
        data = {
          ...data,
          id: model?.id,
        };
      }

      contractAnnexRepository[action](data)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            history.push(
              `${CONTRACT_PRINCIPLE_MASTER_ROUTE}?tab=0&${TAB_KEY}=${numberConstants.ONE}`
            );
          },
          error: (error: AxiosError) => {
            if (
              error.response &&
              isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
            ) {
              if (!isEmpty(error?.response?.data?.tabErrors)) {
                setErrorsModal({
                  type: "SUBMIT_FAIL",
                  errors: error?.response?.data?.tabErrors || [],
                });
              }
              if (isEqual(error.response?.data?.type, ErrorType.VALIDATE)) {
                handleChangeAllField({
                  ...newModel,
                  errors: error.response?.data?.errors,
                  errorTabs: error.response?.data?.tabs,
                });
              } else if (
                isEqual(error.response?.data?.type, ErrorType.BAD_REQUEST)
              ) {
                handleChangeAllField({
                  ...newModel,
                  errorTabs: error.response?.data?.tabs,
                });
              }

              if (
                isEqual(error.response?.data?.type, ErrorType.BAD_REQUEST) &&
                !isEmpty(error.response?.data?.message)
              ) {
                notifyToast({
                  message: error.response?.data?.message,
                  type: "error",
                });
              }
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
          },
        });
    },
    [model, isEditable, notifyToast, history, setLoading, handleChangeAllField]
  );

  return {
    model,
    loading,
    dispatch,
    setLoading,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeListField,
    errorsModal,
    // non-context
    translate,
    onSave,
    setErrorsModal,
  };
};
