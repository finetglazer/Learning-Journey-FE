import { AxiosError } from "axios";
import { CalculationValue } from "config/const";
import { CONTRACT_ROUTE_MASTER } from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import appMessageService from "core/services/common-services/app-message-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNumber, isObject } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { PaymentSchedules } from "models/Contract/Contract";
import { ContractAnnex } from "models/ContractAnnex";
import { useGetGeneralInformation } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useGetGeneralInformation";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";
import { useCheckStateContractAnnex } from "../Components/hooks/useCheckStateContractAnnex";
import { useGroupGoodServicesByCategory } from "../Components/hooks/useGroupGoodServicesByCategory";
import { useListenAdjustData } from "../Components/hooks/useListenAdjustData";
import { contractAnnexRepository } from "../ContractAnnexRepository";

interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

const TAB_KEY = "tabKey";

export const useContractAnnexDetail = () => {
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

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { isEditable } = useCheckStateContractAnnex();

  // Listen to the changes in the data
  useListenAdjustData(model, dispatch);

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeListField,
  } = fieldService.useField<ContractAnnex>(model, dispatch);

  const isDatetime = useCallback((value: string) => {
    return dayjs(value).isValid();
  }, []);

  const currency = useMemo(
    () => model?.contractInfo?.currency,
    [model?.contractInfo?.currency]
  );

  const { handleGroupGoodServicesByCategory } =
    useGroupGoodServicesByCategory(currency);

  const onSave = useCallback(
    ({
      isDraft,
      callbackFc,
    }: {
      isDraft: boolean;
      callbackFc?: () => void;
    }) => {
      setLoading(true);
      let calculationValue: number = model?.calculationValue;
      if (isObject(calculationValue)) {
        calculationValue = (calculationValue as OptionBaseModel)
          ?.id as unknown as number;
      }
      const receiverInfo = isEmpty(model?.receiverInfos)
        ? undefined
        : model?.receiverInfos?.[numberConstants.ZERO];

      const { updateOrderList } = handleGroupGoodServicesByCategory(
        model?.contractAppendixGoodsItems
      );

      // Convert Data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = {
        isDraft: isDraft,
        contractId: model?.contractId,
        contractAppendixNo: model?.contractAppendixNo,
        isAdjustedContractInfo: model?.isAdjustedContractInfo,
        isAdjustedLegalInfo: model?.isAdjustedLegalInfo,
        isAdjustedSupplierInfo: model?.isAdjustedSupplierInfo,
        isAdjustedGoodsItem: model?.isAdjustedGoodsItem,
        isAdjustedReceiveInfo: model?.isAdjustedReceiveInfo,
        isAdjustedAttachment: model?.isAdjustedAttachment,
        name: model?.name,
        // Contract info
        endDate: model?.contractInfo?.endDate,
        manager: model?.contractInfo?.managerPerson?.email,
        managerOrganizationId: model?.contractInfo?.managerOrganization?.id,
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
        originalPurchaseProposalId: model?.originalPurchaseProposalId,
        //  Goods Items
        contractAppendixGoodsItems: updateOrderList?.map((goodsItems) => ({
          goodsId: goodsItems?.id?.split("_")?.[0],
          branchId: goodsItems?.goodBranch?.id,
          unitId: goodsItems?.goodUnit?.id,
          quantity: goodsItems?.quantity ?? undefined,
          unitPrice: goodsItems?.unitPrice,
          taxId: goodsItems?.taxModel?.id,
          taxAmount: goodsItems?.taxAmount,
          description: goodsItems?.description ?? undefined,
          currencyRate: goodsItems?.currencyRate,
          note: goodsItems?.note ?? undefined,
          contractGoodsItemId: goodsItems?.contractGoodsItemId ?? undefined,
          purchaseItemId: goodsItems?.purchaseItemId ?? undefined,
          contractId: model?.contractId,
          receiverInfos: goodsItems?.receiverInfos?.map((item) => {
            return {
              id: item?.id,
              shippingDate: isEmpty(item?.shippingDate)
                ? undefined
                : item?.shippingDate,
              address: item?.address,
              note: item?.note,
              quantity: item.quantity,
              organizationId: item?.organizationId,
              organizationName: item?.organizationName,
              personId: item?.personId,
              person:
                item?.personEmail && item?.person
                  ? `${item?.personEmail} - ${item?.person}`
                  : item?.person,
              phone: item?.phone,
            };
          }),
        })),
        // Receiving info
        receivedType: model?.received?.id,
        receiverInfos: {
          id: isDatetime(receiverInfo?.id) ? undefined : receiverInfo?.id,
          quantity: receiverInfo?.quantity,
          organizationId: model?.receivedDepartment?.id,
          organizationName: model?.receivedDepartment?.name,
          personId: model?.receivedPerson?.id,
          person: model?.receivedPerson?.name,
          phone: model?.receivedPhoneNumber,
          receiverItems: model?.receiverInfos?.map((item) => {
            return {
              id: isDatetime(item?.id) ? undefined : item?.id,
              address: item?.address,
              note: item?.note,
              shippingDate: isEmpty(item?.shippingDate)
                ? undefined
                : item?.shippingDate,
            };
          }),
        },
        contractAppendixGuarantees: model?.contractAppendixGuarantees?.map(
          (item) => {
            return {
              guaranteeTypeId: item?.guaranteeType?.id,
              fromDate: item?.fromDate,
              toDate: item?.toDate,
              amount: item?.amount,
              description: item?.description,
            };
          }
        ),
        contractAppendixWarranties: model?.contractAppendixWarranties?.map(
          (item) => {
            return {
              warrantyTypeId: item?.warrantyType?.id,
              warrantyPeriod: item?.warrantyPeriod,
              warrantyTermsId: item?.warrantyTerm?.id,
              warrantyCalculationTime: item?.warrantyCalculationTime?.id,
              description: item?.description,
            };
          }
        ),

        contractTerms: model?.contractTerms?.map((contractTerm) => ({
          name: contractTerm?.name,
          description: contractTerm?.description,
        })),
        calculationValue,
        contractAppendixPaymentSchedules:
          model?.contractAppendixPaymentSchedules?.map((item) => {
            const paymentTimeType =
              item?.paymentTimeType?.id ?? item?.paymentTimeType;
            const suggestionType =
              item?.suggestionType?.id ?? item?.suggestionType;
            const paymentDay = item?.paymentDay?.id ?? item?.paymentDay;
            const paymentMilestoneType =
              item?.paymentMilestoneType?.id ?? item?.paymentMilestoneType;
            const months = item?.months
              ?.map((month) => month?.id || month)
              .filter(Boolean);

            const paymentSchedule = {
              paymentBatch: item?.paymentBatch ?? undefined,
              suggestionType: isNumber(Number(suggestionType))
                ? suggestionType
                : undefined,
              percent: undefined,
              amount: item?.amount ?? undefined,
              paymentTerm: undefined,
              paymentTimeType: isNumber(Number(paymentTimeType))
                ? paymentTimeType
                : undefined,
              paymentDay: isNumber(Number(paymentDay)) ? paymentDay : undefined,
              paymentMilestoneType: isNumber(Number(paymentMilestoneType))
                ? paymentMilestoneType
                : undefined,
              months: isEmpty(months) ? undefined : months,
              paymentCondition: item?.paymentCondition || undefined,
              referenceDocument: item?.referenceDocument || undefined,
              description: item?.description || undefined,
            } as unknown as PaymentSchedules;

            if (calculationValue === CalculationValue.PAYMENT_TERM) {
              paymentSchedule.paymentTerm = item?.paymentTerm || undefined;
            }

            if (calculationValue === CalculationValue.PERCENTAGE_RATE) {
              paymentSchedule.percent = item?.percent || undefined;
            }

            return paymentSchedule;
          }),
        attachments: model?.attachments,
        // documents group
        documentGroups: model?.documentGroups,
      };
      const action = isEditable || model?.id ? "edit" : "create";
      // Map data handle error in table
      const newModel = convertDataToHaveIndexBeforeValidate(
        model,
        ["contractAppendixPaymentSchedules"],
        model,
        ["service_usage_time"]
      );

      if (isEditable || model?.id) {
        data = {
          ...data,
          id: model?.id,
        };
      }
      data.isHardValidate = !!(typeof callbackFc === "function");

      contractAnnexRepository[action](data)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response: any) => {
            notifyToast();
            handleChangeAllField({
              ...model,
              id: response?.id,
              code: response?.code,
            });
            // nếu có callbackFc thì không out ra khỏi detail
            if (typeof callbackFc === "function") {
              callbackFc();
            } else {
              history.push(
                `${CONTRACT_ROUTE_MASTER}?${TAB_KEY}=${numberConstants.TWO}`
              );
            }
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
    [
      model,
      isEditable,
      notifyToast,
      history,
      setLoading,
      handleChangeAllField,
      isDatetime,
    ]
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
