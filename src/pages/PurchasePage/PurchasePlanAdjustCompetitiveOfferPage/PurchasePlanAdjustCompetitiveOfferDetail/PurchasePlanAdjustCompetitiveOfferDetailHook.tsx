import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { saveAs } from "file-saver";
import { isEmpty, isEqual, uniqueId } from "lodash";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { finalize, lastValueFrom, tap } from "rxjs";

import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";
import {
  APP_OVERVIEW,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
import { convertUTCTimeToVietnamTimezone } from "core/helpers/date-time";
import appMessageService from "core/services/common-services/app-message-service";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  HttpStatusCode,
  NETWORK_ERROR_MESSAGE,
} from "core/services/service-types";
import type { History } from "history";
import {
  EmailReceiverInformation,
  EvaluationCriteriaModelBase,
  GoodsPrice,
  goodsPricesSubmitModel,
  IPurchaseRequest,
  ParamsApproveModel,
  PurchasePlanBidModel,
  PurchasePlanType,
  PurchasingPlan,
  PurchasingPlanRequest,
  SupplierModel,
  SupplierPurchasePlanModel,
} from "models/PurchasingPlan";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import {
  ConfirmModalType,
  PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS,
  PURCHASING_PLAN_STATUS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { budgetRepository } from "../../../BudgetPage/BudgetRepository";
import PurchasePlanAdjustCompetitiveOfferGeneralInfoTab from "../Components/GeneralInfoTab/GeneralInfoTab";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";

export interface ModalType {
  type:
    | "CREATE"
    | "UPDATE"
    | "DETAIL"
    | "DELETE"
    | "IMPORT_FAIL"
    | "SUBMIT_FAIL"
    | "NONE";
  id?: string;
  errors?: string[];
}

export enum DRAWER {
  INFORMATION,
  QUOTE,
}

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

export const PurchasePlanAdjustCompetitiveOfferDetailHookContext =
  createContext<PurchasePlanAdjustCompetitiveOfferDetailHookContextProps>({
    model: new PurchasePlanBidModel(),
    dispatchModel: null,
    translate: null,
    breadcrumbs: [],
    tabRepositories: [],
    handleChangeSelectField: null,
    handleChangeSingleField: null,
    handleChangeDateField: null,
    handleChangeAllField: null,
    handleViewPurchaseProposal: null,
    handleViewOriginPurchaseProposal: null,
    notifyToast: null,
    errorsModal: DEFAULT_ERROR_MODAL_TYPE,
    setErrorsModal: null,
    handleSave: null,
    handleValidateCreate: null,
    loading: false,
    setLoading: null,
    isSubmit: false,
    setIsSubmit: null,
    handleUploadAttachmentError: null,
    handleDownloadFileAttached: null,
    mappingStatusToProcess: null,
    modelSelected: null,
    setModelSelected: null,
    handleApplyButtonInConfirmModal: null,
    handleChangeMultipleSelectField: null,
    handleApprovePurchasingPlan: null,
    handleApproveCancellationPurchasingPlan: null,
    selectSupplierAction: null,
    isDrawerSupplier: false,
    isDrawerQuote: false,
    handleClickDrawerSupplier: null,
    handleClickDrawerQuote: null,
    setIsDrawerSupplier: null,
    setIsDrawerQuote: null,
    quoteAgainAction: null,
    handleOpenSupplierDrawerByRecord: null,
    isOpenModalQuoteAgain: false,
    setIsOpenModalQuoteAgain: null,
    handleSubmitApproval: null,
    tabKey: "0",
    setTabKey: null,
    titlePageHeader: "",
    getPurchasePlanTypeByRouter: null,
    selectedDetailSupplier: null,
    selectedDetailSupplierId: null,
    setSelectedDetailSupplierId: null,
    purchaseRequest: null,
    loadingConfirm: false,
    handleValidateSaveForm: null,
  });

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

export function usePurchasePlanAdjustCompetitiveOfferDetailHook(
  isDetail = false
) {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();
  const location = useLocation();
  const { id: idDetail } = useParams<{ id: string }>();
  const purchaseRequest = location.state as IPurchaseRequest;
  const history: History = useHistory();
  const originalPurchasePlanData = location.state as IPurchaseRequest;
  const originalPurchasePlanId =
    originalPurchasePlanData?.originalPurchasePlanId;

  const queryParams = new URLSearchParams(location.search);

  const tabKeyParams = queryParams.get("tabKey");
  const isViewWaitingApprove =
    queryParams.get("isViewWaitingApprove") === "true";
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);

  const isDetailPage = location.pathname.includes(
    PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE
  );
  const isViewPage = location.pathname.includes(
    PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE
  );
  const isCreatePage = isDetailPage && !idDetail;

  // States
  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isDrawerSupplier, setIsDrawerSupplier] = useState<boolean>(false);
  const [isDrawerQuote, setIsDrawerQuote] = useState<boolean>(false);
  const [isOpenModalQuoteAgain, setIsOpenModalQuoteAgain] =
    useState<boolean>(false);
  const [selectedDetailSupplierId, setSelectedDetailSupplierId] = useState("");
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PurchasePlanBidModel>(PurchasePlanBidModel);

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);

  const titlePageHeader = useMemo(() => {
    return isCreatePage
      ? translate("PPA.create_new_adjust_purchase_plan")
      : `${translate("PPA.adjust_purchase_plan")} ${model?.code || ""}`;
  }, [isCreatePage, model?.code, translate]);

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CM.menu_title_purchasing_plan"),
      path: PURCHASING_PLAN_MASTER_ROUTE,
    },
    {
      name: titlePageHeader,
    },
  ];

  const approvalHistoryTab = useMemo(
    () => [
      {
        tabKey: "2",
        tabTitle: (
          <TabName
            text={translate("CM.txt_approval_history")}
            isShowIconError={model.errorTabs?.includes(2)}
          />
        ),
        children: (
          <ApprovalHistoryTab
            topicId={idDetail}
            opinionType={opinionType}
            opinionId={opinionId}
            status={model?.status}
            model={model}
          />
        ),
      },
    ],
    [idDetail, model, opinionId, opinionType, translate]
  );

  const tabRepositories = [
    {
      tabKey: "0",
      tabTitle: (
        <TabName
          text={translate("PL.purchasing_plan_general_information_tab")}
          isShowIconError={model.errorTabs?.includes(0)}
        />
      ),
      children: (
        <PurchasePlanAdjustCompetitiveOfferGeneralInfoTab isDetail={isDetail} />
      ),
    },
    ...(!isCreatePage ? approvalHistoryTab : []),
  ];

  const selectedDetailSupplier = model?.supplierPrincipleContracts?.find(
    (item: SupplierModel) => item?.id === selectedDetailSupplierId
  );

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (
      isEqual(error?.response?.status, HttpStatusCode?.PAYLOAD_TOO_LARGE) ||
      isEqual(error?.message, NETWORK_ERROR_MESSAGE)
    ) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const handleGoMaster = React.useCallback(() => {
    history.push(`${PURCHASING_PLAN_MASTER_ROUTE}?tabKey=2`);
  }, [history]);

  const handleValidateError = useCallback(
    (error: AxiosError, newModel: PurchasePlanBidModel) => {
      setErrorsModal({
        type: "SUBMIT_FAIL",
        errors: error.response?.data?.tabErrors || [],
      });
      if (error?.response && error.response.status === 400) {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error.response?.data?.tabErrors || [],
        });

        if (error.response?.data?.type === "Validate") {
          handleChangeAllField({
            ...newModel,
            errors: error.response?.data?.errors,
            errorTabs: error.response?.data?.tabs,
          });
          return;
        }

        if (error.response?.data?.type === "Bad Request") {
          handleChangeAllField({
            ...newModel,
            errorTabs: error.response?.data?.tabs,
          });
          return;
        }
        return;
      }
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    },
    [handleChangeAllField, notifyToast]
  );

  const mappingStatusToProcess = useCallback((status: number) => {
    const statusMap = new Map([
      [
        PURCHASING_PLAN_STATUS.DRAFT,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.DRAFT,
      ],
      [
        PURCHASING_PLAN_STATUS.SELECT_SUPPLIER,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.SELECT_SUPPLIER,
      ],
      [
        PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.SELECTED_SUPPLIER,
      ],
    ]);

    if (statusMap.has(status)) {
      return statusMap.get(status);
    }
    return PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.DRAFT;
  }, []);

  const handleGetDataDetail = useCallback(
    (purchasePlanId: string) => {
      if (!purchasePlanId) return;
      setLoading(true);

      purchasingPlanRepository
        ?.getPurchasePlanAdjustBidDetail(
          purchasePlanId,
          isViewPage,
          isViewWaitingApprove
        )
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response) {
              if (isCreatePage) {
                response.originalPurchasePlanId = response?.id;
              }
              response.id = idDetail;
              if (!isEmpty(response.goodsItems)) {
                response.goodsItems = response.goodsItems.map((item: any) => ({
                  ...item,
                  id: undefined,
                }));
              }
              const evaluationCriterias =
                response?.offerRequest?.evaluationCriteriaGroup
                  ?.evaluationCriterias || [];
              const status = model?.status;

              let supplierPurchasePlans: SupplierPurchasePlanModel[] =
                (status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING
                  ? response?.suppliersNegotiation
                  : response?.supplierPurchasePlans) || [];

              const SupplierPurchasePlansNewest =
                response?.roundSuppliers?.[0]?.supplierPurchasePlans;

              if (
                isCreatePage &&
                status !==
                  PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING &&
                !isEmpty(SupplierPurchasePlansNewest)
              ) {
                supplierPurchasePlans = SupplierPurchasePlansNewest;
              }

              response.supplierPurchasePlans = supplierPurchasePlans?.map(
                (supplierPurchasePlan) => {
                  const emailRecipients =
                    supplierPurchasePlan?.emailRecipients?.map(
                      (emailRecipient: EmailReceiverInformation) => ({
                        ...emailRecipient,
                        id: uniqueId(),
                      })
                    );
                  return {
                    ...supplierPurchasePlan,
                    supplierContactSelected:
                      supplierPurchasePlan?.supplierContacts?.find(
                        (supplierContact) =>
                          supplierContact?.id === supplierPurchasePlan?.quoteId
                      ),
                    emailRecipients,
                  };
                }
              );
              let offerRequest = response?.offerRequest;
              const offerRequestNewest =
                response?.offerSummary?.offerRequest?.[0];

              if (isCreatePage && !isEmpty(offerRequestNewest)) {
                offerRequest = offerRequestNewest;
              }

              response.offerRequest = {
                ...offerRequest,
                releaseDate: offerRequest?.releaseDate
                  ? convertUTCTimeToVietnamTimezone(
                      offerRequest.releaseDate
                    ).toISOString()
                  : undefined,
                bidStartDate: offerRequest?.bidStartDate
                  ? convertUTCTimeToVietnamTimezone(
                      offerRequest.bidStartDate
                    ).toISOString()
                  : undefined,
                bidEndDate: offerRequest?.bidEndDate
                  ? convertUTCTimeToVietnamTimezone(
                      offerRequest.bidEndDate
                    ).toISOString()
                  : undefined,
                openBidDate: offerRequest?.openBidDate
                  ? convertUTCTimeToVietnamTimezone(
                      offerRequest.openBidDate
                    ).toISOString()
                  : undefined,
              };

              if (isCreatePage) {
                const offerRequestOld = response?.offerRequestOld;
                response.offerRequestOld = {
                  ...offerRequestOld,
                  releaseDate:
                    offerRequestOld?.releaseDate ?? offerRequest?.releaseDate,
                  bidStartDate:
                    offerRequestOld?.bidStartDate ?? offerRequest?.bidStartDate,
                  bidEndDate:
                    offerRequestOld?.bidEndDate ?? offerRequest?.bidEndDate,
                  openBidDate:
                    offerRequestOld?.openBidDate ?? offerRequest?.openBidDate,
                };
              }

              if (response?.offerRequest?.evaluationCriteriaGroup) {
                response.offerRequest.evaluationCriteriaGroup.evaluationCriterias =
                  evaluationCriterias?.map((evaluationCriteria) => {
                    const evaluationUser = evaluationCriteria?.user;
                    const minimumPointScales = {
                      id: "1",
                      score: evaluationCriteria?.minimumPointScale,
                    };
                    const maximumPointScales = {
                      id: "1",
                      score: evaluationCriteria?.maximumPointScale,
                    };
                    const technicalRequirement = {
                      technicalRequirement:
                        evaluationCriteria?.technicalRequirement,
                      id: "1",
                    };
                    return {
                      id: evaluationCriteria?.name ?? "1",
                      rowKeyId: uniqueId("evaluation_criteria"),
                      name: evaluationCriteria?.name,
                      note: evaluationCriteria?.note,
                      isDefault: Boolean(evaluationCriteria?.isDefault),
                      criteriaItemSelected: technicalRequirement,
                      evaluationUserSelected: evaluationUser,
                      minimumPointScaleSelected: minimumPointScales,
                      maximumPointScaleSelected: maximumPointScales,
                      criteriaItems: [
                        {
                          ...technicalRequirement,
                          evaluationUserId: evaluationCriteria?.user?.id,
                          maximumPointScales: [
                            {
                              ...maximumPointScales,
                              minimumPointScales: [
                                {
                                  ...minimumPointScales,
                                  evaluationUser,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    };
                  });
              }

              handleChangeAllField(response);
            }
          },
        });
    },
    [handleChangeAllField, idDetail, isCreatePage, isViewPage]
  );

  const getDataSave = useCallback(
    (isDraft = false) => {
      const offerRequest = model?.offerRequest;
      const supplierPurchasePlans = model?.supplierPurchasePlans?.map(
        (supplierPurchasePlan) => {
          const emailRecipients = supplierPurchasePlan?.emailRecipients?.map(
            (item: any) => ({
              email: item?.email,
              name: item?.name,
            })
          );
          return {
            supplierId: supplierPurchasePlan?.supplierId ?? undefined,
            quoteId: supplierPurchasePlan?.quoteId
              ? supplierPurchasePlan.quoteId
              : undefined,
            quoteName: supplierPurchasePlan?.quoteName ?? undefined,
            quoteEmail: supplierPurchasePlan?.quoteEmail ?? undefined,
            phoneNumber: supplierPurchasePlan?.phoneNumber ?? undefined,
            emailRecipients: isEmpty(emailRecipients)
              ? undefined
              : emailRecipients,
          };
        }
      );
      const evaluationCriteriaGroup = offerRequest?.evaluationCriteriaGroup;
      const evaluationCriterias =
        offerRequest?.evaluationCriteriaGroup?.evaluationCriterias?.map(
          (evaluationCriteria: EvaluationCriteriaModelBase) => {
            const evaluationCriteriaInfo = evaluationCriteria;
            return {
              name: evaluationCriteria?.name ?? undefined,
              technicalRequirement:
                evaluationCriteriaInfo?.criteriaItemSelected
                  ?.technicalRequirement ?? undefined,
              maximumPointScale:
                evaluationCriteriaInfo?.maximumPointScaleSelected?.score ??
                undefined,
              minimumPointScale:
                evaluationCriteriaInfo?.minimumPointScaleSelected?.score ??
                undefined,
              note: evaluationCriteria?.note ?? undefined,
              isDefault: Boolean(evaluationCriteria?.isDefault),
              evaluationUserId:
                evaluationCriteriaInfo?.evaluationUserSelected?.id ?? undefined,
            };
          }
        );

      const data = {
        id: idDetail,
        approveUserId: model?.approveUserId ?? undefined,
        reasonForAdjustment: model?.reasonForAdjustment ?? undefined,
        originalPurchaseRequestId:
          model?.originalPurchaseRequestId ?? undefined,
        isDraft,
        adjustmentDescription: model?.adjustmentDescription ?? "",
        originalPurchasePlanId: model?.originalPurchasePlanId ?? undefined,
        status: model?.status ?? undefined,
        type: PurchasePlanType.Adjustment,
        purchasePlanType: model?.purchasePlanType ?? undefined,
        offerRequest: {
          releaseDate: offerRequest?.releaseDate ?? undefined,
          bidStartDate: offerRequest?.bidStartDate ?? undefined,
          bidEndDate: offerRequest?.bidEndDate ?? undefined,
          openBidDate: offerRequest?.openBidDate ?? undefined,
          evaluationCriteriaGroup: {
            ...evaluationCriteriaGroup,
            evaluationCriterias,
          },
        },
        supplierPurchasePlans: isEmpty(supplierPurchasePlans)
          ? undefined
          : supplierPurchasePlans,
      } as PurchasingPlanRequest;

      return data;
    },
    [
      idDetail,
      model?.adjustmentDescription,
      model?.approveUserId,
      model?.offerRequest,
      model?.originalPurchasePlanId,
      model?.originalPurchaseRequestId,
      model?.purchasePlanType,
      model?.reasonForAdjustment,
      model?.status,
      model?.supplierPurchasePlans,
    ]
  );

  const handleSave = (isDraft = false) => {
    if (loading) return;

    setLoading(true);

    const updatedModel: PurchasePlanBidModel = {
      ...model,
      isDraft,
    };

    const data = getDataSave(isDraft);

    const repoCreateOrEdit = isEmpty(idDetail)
      ? purchasingPlanRepository.createPurchasingPlanRequestCHCT
      : purchasingPlanRepository.updatePurchasingPlanRequestCHCT;

    const newModel = convertDataToHaveIndexBeforeValidate(
      updatedModel,
      [],
      updatedModel
    );
    repoCreateOrEdit(data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, newModel);
        },
      });
    setIsSubmit(false);
  };

  const handleValidateForm = useCallback(
    async (body: PurchasingPlanRequest) => {
      // Tạo model mới để dùng khi validate lỗi
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      try {
        setLoading(false);
        const res = await lastValueFrom(
          purchasingPlanRepository.validatePurchasingPlanRequestCHCT({
            ...body,
            isValidate: true,
          })
        );
        if (res) {
          return true;
        }
      } catch (err: any) {
        handleValidateError(err, {
          ...newModel,
          approveUserId: null,
        });
        setLoading(false);
        return false;
      }
    },
    [handleValidateError, model]
  );

  const handleValidateSaveForm = useCallback(
    async (isDraft: boolean) => {
      const dataSubmit = getDataSave(isDraft);
      setLoading(true);
      return await handleValidateForm(dataSubmit);
    },
    [getDataSave, handleValidateForm]
  );

  const handleValidateCreate = () => {
    setLoading(true);
    const updatedModel: PurchasePlanBidModel = {
      ...model,
      isDraft: false,
    };
    handleSubmitFormValidate(updatedModel);
  };

  const handleSubmitFormValidate = useCallback(
    (body: PurchasePlanBidModel) => {
      body.type = 1;
      const sanitizedBody = {
        ...body,
        evaluationCriteriaSummary: {
          ...body.evaluationCriteriaSummary,
          evaluationCriteriaGroups:
            body.evaluationCriteriaSummary?.evaluationCriteriaGroups?.map(
              (group) => ({
                ...group,
                evaluationCriterias: group?.evaluationCriterias?.map(
                  (criteria) =>
                    ({
                      ...criteria,
                      id: undefined,
                    } as any)
                ),
              })
            ),
        },
      };
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);

      const repoCreateOrEdit = isEmpty(model?.id)
        ? purchasingPlanRepository.createPurchasingPlanRequest
        : purchasingPlanRepository.updatePurchasingPlanRequest;

      repoCreateOrEdit(sanitizedBody)
        .pipe(finalize(() => setLoading(false)))

        .subscribe({
          next: (res) => {
            history.push(
              `${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE}/${res?.id}`
            );
            handleGoMaster();
          },
          error: (error) => {
            handleValidateError(error, newModel);
          },
        });
    },
    [handleGoMaster, handleValidateError, history, model]
  );

  useEffect(() => {
    if (isDetailPage || isViewPage) {
      handleGetDataDetail(originalPurchasePlanId || idDetail);
      return;
    }
  }, [
    handleGetDataDetail,
    idDetail,
    isDetailPage,
    isViewPage,
    originalPurchasePlanId,
  ]);

  const getDataSubmitApproval = (model: PurchasePlanBidModel) => {
    const goodPricesSubmit = model?.goodPrices?.map((item: GoodsPrice) => {
      const itemSubmit: goodsPricesSubmitModel = {
        id: item?.id,
        supplyQuantity: item?.supplyQuantity,
        taxAmount: item?.taxAmount,
        taxId: item?.taxId,
        price: item?.price,
        otherCost: item?.otherCost,
        goodsItemId: item?.goodsItemId,
        description: item?.description,
      };
      return itemSubmit;
    });

    return {
      goodsPrices: goodPricesSubmit,
      quotationRoundId: model?.currentBiddingRound?.quotationRoundId,
      quotationId: model?.currentBiddingRound?.quotations?.quotationId,
      currencyId: model?.currentBiddingRound?.quotations?.currency?.id,
      exchangeRate: model?.biddingExchangeRate,
      purchasePlanId: model?.idDetail,
      supplierPurchasePlanId: model?.biddingSupplier?.id,
    };
  };

  const handleSubmitApproval = useCallback(
    (isDraft: boolean) => {
      setLoading(true);
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      const body: ParamsApproveModel = getDataSubmitApproval(model);
      purchasingPlanRepository
        .submitApproval({
          ...body,
          isDraft: isDraft,
        })
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            handleGoMaster();
          },
          error: (error: AxiosError) => {
            handleValidateError(error, newModel);
          },
        });
    },
    [handleGoMaster, handleValidateError, model, notifyToast]
  );

  const cancelPurchasingPlan = (id: string, data: DataForm) => {
    setLoading(true);
    purchasingPlanRepository
      .cancelPurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  // Delete single budget
  const deletePurchasingPlan = (id: string, data: DataForm) => {
    setLoading(true);
    purchasingPlanRepository
      .deletePurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors,
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    } else {
      notifyToast({
        type: "error",
        message: error?.response?.data?.message,
      });
    }
  };

  const handleOpenModalSendApprove = () => {
    setModelSelected({
      type: ConfirmModalType.SEND_APPROVE,
      model: {
        id: model.id,
        code: model.code,
        name: model.name,
      },
    });
  };

  const handleValidateSendApproval = () => {
    setLoading(true);
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    const body: ParamsApproveModel = getDataSubmitApproval(model);
    purchasingPlanRepository
      .validateSendApproval(body)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleOpenModalSendApprove();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, newModel);
        },
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: PurchasingPlan,
    data: DataForm
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.DELETE:
        setLoading(true);
        deletePurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.CANCEL:
        setLoading(true);
        cancelPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.RETURN:
        setLoading(true);
        handleReturnPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.REJECT:
        setLoading(true);
        handleRejectPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.SEND_APPROVE:
        handleSubmitApproval(false);
        break;
      default:
        break;
    }
  };

  const handleApprovePurchasingPlan = (id: string) => {
    setLoading(true);
    purchasingPlanRepository
      .approvePurchasingPlan(id)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: handleError,
      });
  };

  const handleApproveCancellationPurchasingPlan = (id: string) => {
    purchasingPlanRepository
      .approveCancellationPurchasingPlan(id)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: handleError,
      });
  };

  const handleReturnPurchasingPlan = (id: string, data: DataForm) => {
    purchasingPlanRepository
      .returnPurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const handleRejectPurchasingPlan = (id: string, data: DataForm) => {
    purchasingPlanRepository
      .rejectPurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const valuesContext: PurchasePlanAdjustCompetitiveOfferDetailHookContextProps =
    {
      purchasePlanId: model?.originalPurchasePlanId || originalPurchasePlanId,
      isCreatePage,
      isDetailPage,
      isViewPage,
      model,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeDateField,
      handleChangeAllField,
      dispatchModel,
      tabRepositories,
      breadcrumbs,
      translate,
      notifyToast,
      handleSave,
      errorsModal,
      setErrorsModal,
      loading,
      setLoading,
      isSubmit,
      setIsSubmit,
      handleUploadAttachmentError,
      handleDownloadFileAttached,
      mappingStatusToProcess,
      modelSelected,
      setModelSelected,
      handleChangeMultipleSelectField,
      isDrawerSupplier,
      isDrawerQuote,
      setIsDrawerSupplier,
      setIsDrawerQuote,
      isOpenModalQuoteAgain,
      setIsOpenModalQuoteAgain,
      tabKey,
      setTabKey,
      titlePageHeader,
      selectedDetailSupplier,
      selectedDetailSupplierId,
      setSelectedDetailSupplierId,
      purchaseRequest,
      handleValidateCreate,
      handleSubmitApproval,
      handleValidateSendApproval,
      handleApplyButtonInConfirmModal,
      handleApprovePurchasingPlan,
      handleApproveCancellationPurchasingPlan,
      handleValidateSaveForm,
    };

  return {
    ...valuesContext,
  };
}
