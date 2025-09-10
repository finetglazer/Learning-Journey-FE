import { AxiosError } from "axios";
import { PROJECT_SETTLEMENT_MASTER_ROUTE } from "config/route-const";
import { ERROR_TYPE } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import isEqual from "lodash/isEqual";
import { OptionBaseModel } from "models/Common/Common";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { useGetGeneralInformation } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetGeneralInformation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { finalize } from "rxjs";
import { ProjectSettlementModal } from "../Components/constant";
import { useCheckState } from "../Components/hooks/useCheckState";
import { useModalConfirm } from "../Components/hooks/useModalConfirm";

interface Parameters {
  originalPurchaseProposalId: string | undefined;
  id: string | undefined;
}

export const useProjectSettlementDetailHook = () => {
  const [translate] = useTranslation();
  const { originalPurchaseProposalId, id } = useParams<Parameters>();
  const [orderFormSelect, setOrderFormSelect] = useState<unknown | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const history = useHistory();
  const [errorsModal, setErrorsModal] = useState<ModalTypeError>({
    type: "NONE",
    errors: [],
  });
  const [modalType, setModalType] = useState<ProjectSettlementModal | null>(
    null
  );

  const { model, loading, dispatch, setLoading } = useGetGeneralInformation({
    originalPurchaseProposalId,
    id,
  });

  const refresh = () => {
    history.goBack();
  };

  const { isLoading, errorMessage, processApi, setErrorMessage } =
    useModalConfirm(refresh);

  const {
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeListField,
  } = fieldService.useField(model, dispatch);

  const { isEditable, state } = useCheckState();

  const onCreate = (isDraft: boolean, callbackFc: () => void) => {
    setLoading(true);
    const projectSettlementAction =
      isEditable ||
      (model?.id && !isEqual(model?.id, "00000000-0000-0000-0000-000000000000"))
        ? "edit"
        : "create";
    let data: ProjectSettlementProposal = {
      isDraft,
      originalPurchaseProposalId: model?.originalPurchaseProposalId,
      projectId: model?.projectId,
      settlementDescription: model?.settlementDescription,
      investmentForm: model?.investmentForm,
      investmentCosts: model?.investmentCosts?.map((investmentCost) => ({
        content: investmentCost?.content,
        note: investmentCost?.note,
      })),
      goodsCategoryCosts: model?.goodsCategoryCosts?.map(
        (goodsCategoryCost) => ({
          goodsCategoryId: goodsCategoryCost?.goodsCategoryId,
          note: goodsCategoryCost?.note,
        })
      ),
      evaluationResult: model?.evaluationResult,
      debts: model?.debts?.map((debt) => ({
        contractId: debt?.contractId,
        note: debt?.note,
      })),
      responsibility: model?.responsibility,
      attachments: model?.attachments,
      projectSettlementAssetItems:
        model?.contractSettlementAsset?.projectSettlementAssets?.flatMap(
          (contract) =>
            contract?.assetItems?.map((assetItem) => ({
              ...(isEditable
                ? {
                    id: assetItem?.id,
                    projectSettlementId: assetItem?.projectSettlementId,
                  }
                : {}),
              assetId: assetItem?.assetId,
              code: assetItem?.code,
              name: assetItem?.name,
              serialNumber: assetItem?.serialNumber,
              originNo: assetItem?.originNo,
              quantity: assetItem?.quantity,
              assetName: assetItem?.assetName,
              depreciationMonths: assetItem?.depreciationMonths,
              goodsId:
                (assetItem?.goods as unknown as OptionBaseModel)?.id ||
                assetItem?.goods,
              branchId:
                (assetItem?.branch as unknown as OptionBaseModel)?.id ||
                assetItem?.branch,
              goodsDescription: assetItem?.goodsDescription,
              goodsNote: assetItem?.goodsNote,
              ownerOrganizationId:
                (assetItem?.ownerOrganization as unknown as OptionBaseModel)
                  ?.id || assetItem?.ownerOrganization,
              ownerUserId:
                (assetItem?.ownerUser as unknown as OptionBaseModel)?.id ||
                assetItem?.ownerUser,
              originalCost: assetItem?.originalCost,
              type: Number(
                (assetItem?.type as unknown as OptionBaseModel)?.code ||
                  assetItem?.type
              ),
              usageStartDate: assetItem?.usageStartDate,
              depreciationStartDate: assetItem?.depreciationStartDate,
              note: assetItem?.note,
              contractId: contract?.contractId,
            }))
        ) || [],
      projectSettlementGoodsItems: model?.projectSettlementGoodsItems.map(
        (goodItem) => {
          return {
            goodsId: goodItem?.goodsId,
            unitId: goodItem?.goodsServiceUnit?.id,
            settlementBeforeTax: goodItem?.settlementBeforeTax,
            settlementTax: goodItem?.settlementTax,
            note: goodItem?.note,
          };
        }
      ),
      isHardValidate: !!(typeof callbackFc === "function"),
    };

    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model, [
      "service_usage_time",
    ]);

    if (
      isEditable ||
      (model?.id && !isEqual(model?.id, "00000000-0000-0000-0000-000000000000"))
    ) {
      data = {
        ...data,
        id: model?.id,
      };
    }

    projectSettlementRepository[projectSettlementAction](data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (res) => {
          notifyToast();
          handleChangeAllField({
            ...model,
            id: res?.id,
            code: res?.code,
          });
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            history.push(PROJECT_SETTLEMENT_MASTER_ROUTE);
          }
        },
        error: (error: AxiosError) => {
          if (
            error.response &&
            isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
          ) {
            if (
              error?.response?.data?.tabErrors?.length > 0 ||
              error?.response?.data?.tabs?.length > 0 ||
              error?.response?.data?.tabs?.errors > 0
            ) {
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
              if (error.response?.data?.message) {
                notifyToast({
                  message: error.response?.data?.message,
                  type: "error",
                });
              }
            }
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  const onClickButton = (type: ProjectSettlementModal) => {
    if (isEqual(type, ProjectSettlementModal.Approve)) {
      setLoading(true);
      projectSettlementRepository
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

      return;
    }
    setModalType(type);
  };

  const onApplyConfirmModal = (id: string, reason: string) => {
    processApi(modalType, id, reason);
  };

  const onCancelConfirmModal = () => {
    setModalType(null);
    setErrorMessage(null);
  };

  return {
    model,
    loading,
    errorsModal,
    orderFormSelect,
    translate,
    onCreate,
    dispatch,
    setLoading,
    setOrderFormSelect,
    handleChangeSingleField,
    handleChangeListField,
    handleChangeDateField,
    handleChangeAllField,
    setErrorsModal,
    state,
    onClickButton,
    modalType,
    isLoadingModal: isLoading,
    errorMessage,
    onApplyConfirmModal,
    onCancelConfirmModal,
  };
};
