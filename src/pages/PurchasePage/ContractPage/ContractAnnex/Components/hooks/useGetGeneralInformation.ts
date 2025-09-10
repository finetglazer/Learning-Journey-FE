import { CONTRACT_ROUTE_MASTER } from "config/route-const";
import { numberConstants } from "core/config/consts";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEmpty, isEqual, isNil } from "lodash";
import { ContractAnnex, ContractWarranty } from "models/ContractAnnex";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
interface GetContractAnnexInformationParams {
  contractId: string | undefined;
  id: string | undefined;
}

export const useGetGeneralInformation = ({
  contractId,
  id,
}: GetContractAnnexInformationParams) => {
  const { model, dispatch } =
    detailService.useModel<ContractAnnex>(ContractAnnex);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();
  const [translate] = useTranslation();

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  const isViewMode = useCallback(() => {
    type Params = { isView?: boolean };
    const isView = location?.state as Params;
    const isViewFromQuery = new URLSearchParams(location.search).get("isView");

    if (!isNil(isView?.isView || !!isViewFromQuery)) {
      return isView?.isView || !!isViewFromQuery;
    }

    return false;
  }, [location.search, location?.state]);

  const getByContractInformation = useCallback(() => {
    setLoading(true);
    contractAnnexRepository
      .getGeneralByContractInformation(contractId)
      .subscribe({
        next: (response: ContractAnnex) => {
          const { contractInfo } = response;
          const newData: ContractAnnex = {
            ...response,
            contractInfo: {
              ...contractInfo,
              managerPerson: {
                email: contractInfo?.managerEmail,
                name: contractInfo?.managerName,
                id: contractInfo?.managerId,
              },
              managerOrganization: {
                id: contractInfo?.managerOrganizationId,
                name: contractInfo?.managerOrganizationName,
              },
            },

            supplierInfo: {
              ...response?.supplierInfo,
              supplierPayment: {
                ...response?.supplierInfo?.supplierPayment,
                bankAccountNoValue: {
                  id: response?.supplierInfo?.supplierPayment?.id,
                  name: response?.supplierInfo?.supplierPayment?.bankAccountNo,
                },
              },
            },
            // Received
            received: {
              id: response?.receivedType,
              name: isEqual(response?.receivedType, numberConstants.ZERO)
                ? translate("CA.txt_received_type_0")
                : translate("CA.txt_received_type_1"),
            },
            receivedDepartment: isEmpty(response?.receiverInfos)
              ? undefined
              : {
                  id: response?.receiverInfos[numberConstants.ZERO]
                    ?.organizationId,
                  name: response?.receiverInfos[numberConstants.ZERO]
                    ?.organizationName,
                },
            receivedPerson: isEmpty(response?.receiverInfos)
              ? undefined
              : {
                  id: response?.receiverInfos[numberConstants.ZERO]?.personId,
                  name: response?.receiverInfos[numberConstants.ZERO]?.person,
                },
            receivedPhoneNumber: isEmpty(response?.receiverInfos)
              ? undefined
              : response?.receiverInfos[numberConstants.ZERO]?.phone,
            receiverInfos:
              isEqual(response?.receivedType, numberConstants.ZERO) &&
              isEmpty(response?.receiverInfos)
                ? [
                    {
                      id: crypto.randomUUID(),
                      shippingDate: undefined,
                      address: "",
                      note: "",
                    },
                  ]
                : response?.receiverInfos,
            contractAppendixWarranties:
              response?.contractAppendixWarranties?.map(
                (item: ContractWarranty) => ({
                  ...item,
                  warrantyCalculationTime: isEqual(
                    item?.warrantyCalculationTime?.id,
                    numberConstants.ZERO
                  )
                    ? {
                        id: numberConstants.ZERO,
                        name: translate("CT.actual_receipt_date"),
                      }
                    : {
                        id: numberConstants.ONE,
                        name: translate("CT.commissioning_date"),
                      },
                })
              ),
          };
          dispatch({
            type: GeneralActionEnum.SET,
            payload: newData,
          });
        },
        error: () => {
          history.push(CONTRACT_ROUTE_MASTER);
        },
        complete: () => setLoading(false),
      });
  }, [contractId, dispatch, history, translate]);

  const getContractAnnexDetail = useCallback(() => {
    const isView = isViewMode();
    setLoading(true);
    contractAnnexRepository.getContractAnnexDetail(id, isView).subscribe({
      next: (response: ProjectSettlementProposal) => {
        const { contractInfo } = response;
        const newData = {
          ...response,
          contractInfo: {
            ...contractInfo,
            managerPerson: {
              email: contractInfo?.managerEmail,
              name: contractInfo?.managerName,
              id: contractInfo?.managerId,
            },
            managerOrganization: {
              id: contractInfo?.managerOrganizationId,
              name: contractInfo?.managerOrganizationName,
            },
          },

          supplierInfo: {
            ...response?.supplierInfo,
            supplierPayment: {
              ...response?.supplierInfo?.supplierPayment,
              bankAccountNoValue: {
                id: response?.supplierInfo?.supplierPayment?.id,
                name: response?.supplierInfo?.supplierPayment?.bankAccountNo,
              },
            },
          },
          // Received
          received: {
            id: response?.receivedType,
            name: isEqual(response?.receivedType, numberConstants.ZERO)
              ? translate("CA.txt_received_type_0")
              : translate("CA.txt_received_type_1"),
          },
          receivedDepartment: isEmpty(response?.receiverInfos)
            ? undefined
            : {
                id: response?.receiverInfos[numberConstants.ZERO]
                  ?.organizationId,
                name: response?.receiverInfos[numberConstants.ZERO]
                  ?.organizationName,
              },
          receivedPerson: isEmpty(response?.receiverInfos)
            ? undefined
            : {
                id: response?.receiverInfos[numberConstants.ZERO]?.personId,
                name: response?.receiverInfos[numberConstants.ZERO]?.person,
              },
          receivedPhoneNumber: isEmpty(response?.receiverInfos)
            ? undefined
            : response?.receiverInfos[numberConstants.ZERO]?.phone,
          receiverInfos:
            isEqual(response?.receivedType, numberConstants.ZERO) &&
            isEmpty(response?.receiverInfos)
              ? [
                  {
                    id: new Date().toISOString(),
                    shippingDate: undefined,
                    address: "",
                    note: "",
                  },
                ]
              : response?.receiverInfos,
          contractAppendixWarranties: response?.contractAppendixWarranties?.map(
            (item: ContractWarranty) => ({
              ...item,
              warrantyCalculationTime: isEqual(
                item?.warrantyCalculationTime?.id,
                numberConstants.ZERO
              )
                ? {
                    id: numberConstants.ZERO,
                    name: translate("CT.actual_receipt_date"),
                  }
                : {
                    id: numberConstants.ONE,
                    name: translate("CT.commissioning_date"),
                  },
            })
          ),
        };

        dispatch({
          type: GeneralActionEnum.SET,
          payload: newData,
        });
      },
      error: () => {
        history.push(CONTRACT_ROUTE_MASTER);
      },
      complete: () => setLoading(false),
    });
  }, [isViewMode, id, dispatch, history]);

  useEffect(() => {
    if (contractId) {
      getByContractInformation();
      return;
    }

    if (id) {
      getContractAnnexDetail();
      return;
    }
  }, [id, contractId, getByContractInformation, getContractAnnexDetail]);

  return {
    model,
    loading,
    dispatch,
    setLoading,
    handleChangeSingleField,
  };
};
