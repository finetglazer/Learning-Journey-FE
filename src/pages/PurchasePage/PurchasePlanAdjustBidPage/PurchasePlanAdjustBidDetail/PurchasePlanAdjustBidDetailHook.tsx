import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { get, isBoolean, isEmpty, isEqual, omit, uniqueId } from "lodash";
import React, { createContext, useCallback, useMemo, useState } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { finalize, lastValueFrom, tap } from "rxjs";
import { validate as uuidValidate } from "uuid";

import {
  LIST_EVALUATION_METHOD,
  LIST_ROLE_EVALUATION,
  listPurchasingPlanStatusEnum,
  PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS,
} from "config/const";
import {
  APP_OVERVIEW,
  PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
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
  CriteriaType,
  EmailReceiverInformation,
  EvaluationCriteria,
  EvaluationCriteriaClass,
  EvaluationCriteriaGroup,
  EvaluationMethod,
  EvaluationTeam,
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
  TenderProfileType,
} from "models/PurchasingPlan";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
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
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import PurchasePlanAdjustBidGeneralInfoTab from "./GeneralInfoTab/GeneralInfoTab";
import { convertUTCTimeToVietnamTimezone } from "core/helpers/date-time";

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

export const PurchasePlanAdjustBidDetailHookContext =
  createContext<PurchasePlanAdjustBidDetailHookContextProps>({
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

export function usePurchasePlanAdjustBidDetailHook() {
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
    PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE
  );

  const isViewPage = useMemo(
    () => location.pathname.includes(PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE),
    [location.pathname]
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
      if (error?.response && error.response.status === 400) {
        if (error.response?.data?.type === "Validate") {
          handleChangeAllField({
            ...newModel,
            errors: error.response?.data?.errors,
            errorTabs: error.response?.data?.tabs,
          });
          setErrorsModal({
            type: "SUBMIT_FAIL",
            errors: error.response?.data?.tabErrors || [],
          });
          return;
        }

        if (error.response?.data?.type === "Bad Request") {
          handleChangeAllField({
            ...newModel,
            errorTabs: error.response?.data?.tabs,
          });
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
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
                response.goodsItems = response.goodsItems.map(
                  (item: GoodsPrice) => ({
                    ...item,
                    id: item?.id ? item.id : null,
                  })
                );
              }
              const evaluationCriteriaGroups =
                response?.evaluationCriteriaSummary?.evaluationCriteriaGroups;

              const evaluationTeamDetails = response?.evaluationTeams?.[
                response?.evaluationTeams?.length - 1
              ]?.evaluationTeamDetails?.map((el: EvaluationTeam) => {
                const role = LIST_ROLE_EVALUATION.find(
                  (item) => item.id === el.role
                );

                return {
                  ...el,
                  role,
                  isActive: isBoolean(el?.isActive) ? el.isActive : false,
                };
              });

              if (
                !isEmpty(evaluationCriteriaGroups) &&
                response.status !==
                  PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED
              ) {
                evaluationCriteriaGroups?.forEach((item) => {
                  item?.evaluationCriterias?.forEach((evaluationCriteria) => {
                    if (!evaluationCriteria?.criteria) {
                      const evaluationUser = evaluationCriteria?.user;
                      const minimumPointScales = {
                        id: "1",
                        score: evaluationCriteria?.minimumPointScale,
                      };
                      const maximumPointScales = {
                        id: "1",
                        score: evaluationCriteria?.maximumPointScale,
                      };
                      const description = {
                        id: "1",
                        name: evaluationCriteria?.description,
                      };
                      evaluationCriteria.criteria = {
                        name: evaluationCriteria?.name,
                        note: evaluationCriteria?.note,
                        descriptionSelected: description,
                        evaluationUserSelected: evaluationUser,
                        minimumPointScaleSelected: minimumPointScales,
                        maximumPointScaleSelected: maximumPointScales,
                      };
                    }
                  });
                });
              }

              let tenderRequests = response?.tenderRequests;
              if (
                response?.offerSummary?.tenderRequests?.[0]?.roundNumber > 1
              ) {
                tenderRequests = response?.offerSummary?.tenderRequests?.[0];
              }

              tenderRequests = {
                ...tenderRequests,
                releaseDate: tenderRequests?.releaseDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.releaseDate
                    ).toISOString()
                  : undefined,
                bidStartDate: tenderRequests?.bidStartDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.bidStartDate
                    ).toISOString()
                  : undefined,
                bidEndDate: tenderRequests?.bidEndDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.bidEndDate
                    ).toISOString()
                  : undefined,
                openBidDate: tenderRequests?.openBidDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.openBidDate
                    ).toISOString()
                  : undefined,
                evaluateStartDate: tenderRequests?.evaluateStartDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.evaluateStartDate
                    ).toISOString()
                  : undefined,
                evaluateEndDate: tenderRequests?.evaluateEndDate
                  ? convertUTCTimeToVietnamTimezone(
                      tenderRequests.evaluateEndDate
                    ).toISOString()
                  : undefined,
              };

              let tenderRequestOld = response?.tenderRequestOld;
              tenderRequestOld = {
                ...tenderRequestOld,
                releaseDate:
                  tenderRequestOld?.releaseDate ??
                  tenderRequestOld?.oldReleaseDate,
                bidStartDate:
                  tenderRequestOld?.bidStartDate ??
                  tenderRequestOld?.oldBidStartDate,
                bidEndDate:
                  tenderRequestOld?.bidEndDate ??
                  tenderRequestOld?.oldBidEndDate,
                openBidDate:
                  tenderRequestOld?.openBidDate ??
                  tenderRequestOld?.oldOpenBidDate,
                evaluateStartDate:
                  tenderRequestOld?.evaluateStartDate ??
                  tenderRequestOld?.oldEvaluateStartDate,
                evaluateEndDate:
                  tenderRequestOld?.evaluateEndDate ??
                  tenderRequestOld?.oldEvaluateEndDate,
              };

              const evaluationCriterias =
                response?.tenderRequests?.evaluationCriteriaGroup
                  ?.evaluationCriterias || [];

              if (response?.tenderRequests?.evaluationCriteriaGroup) {
                response.tenderRequests.evaluationCriteriaGroup.evaluationCriterias =
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
                    const description = {
                      description: evaluationCriteria?.description,
                      id: "1",
                    };
                    return {
                      id: evaluationCriteria?.name ?? "1",
                      rowKeyId: uniqueId("evaluation_criteria"),
                      name: evaluationCriteria?.name,
                      note: evaluationCriteria?.note,
                      isDefault: Boolean(evaluationCriteria?.isDefault),
                      criteriaItemSelected: description,
                      evaluationUserSelected: evaluationUser,
                      minimumPointScaleSelected: minimumPointScales,
                      maximumPointScaleSelected: maximumPointScales,
                      criteriaItems: [
                        {
                          ...description,
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

              const evaluationPassFail = getAssessmentObj(
                evaluationCriteriaGroups,
                CriteriaType.TechnicalCompetence,
                EvaluationMethod.PassFail
              );

              const evaluationScore = getAssessmentObj(
                evaluationCriteriaGroups,
                CriteriaType.TechnicalCompetence,
                EvaluationMethod.Scoring
              );

              const evaluationFinancial = getAssessmentObj(
                evaluationCriteriaGroups,
                CriteriaType.Finance
              );

              const dataPassToDetail = {
                ...response,
                evaluationCriteriaAttachments:
                  response?.evaluationCriteriaSummary?.attachments,
                evaluationPassFail: evaluationPassFail?.evaluationCriterias,
                evaluationScore: evaluationScore?.evaluationCriterias,
                evaluationScoretechnicalWeight:
                  evaluationScore?.technicalWeight,
                evaluationFinancial: evaluationFinancial?.evaluationCriterias,
                evaluationMethodFinancial: {
                  id: evaluationFinancial?.evaluationMethod,
                  name: LIST_EVALUATION_METHOD.find(
                    (el) => el.id === evaluationFinancial?.evaluationMethod
                  )?.name,
                },
                evaluationPointRateFinancial:
                  evaluationFinancial?.financialWeight,
              };

              handleChangeAllField({
                ...dataPassToDetail,
                evaluationTeamDetails,
                tenderRequests,
                tenderRequestOld,
              });
            }
          },
        });
    },
    [
      handleChangeAllField,
      idDetail,
      isCreatePage,
      isViewPage,
      isViewWaitingApprove,
    ]
  );

  const processAfterFeedbackSubmission = useCallback(() => {
    if (
      isEqual(
        model?.status,
        get(listPurchasingPlanStatusEnum, `[${numberConstants.ONE}].id`)
      )
    ) {
      handleGetDataDetail(idDetail);
    }
  }, [handleGetDataDetail, idDetail, model?.status]);

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
            processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            model={model}
          />
        ),
      },
    ],
    [
      idDetail,
      model,
      opinionId,
      opinionType,
      processAfterFeedbackSubmission,
      translate,
    ]
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
      children: <PurchasePlanAdjustBidGeneralInfoTab />,
    },
    ...approvalHistoryTab,
  ];

  const handleSave = (isDraft = false) => {
    const updatedModel: PurchasePlanBidModel = {
      ...model,
      isDraft,
    };
    handleSubmitForm(updatedModel);
    setIsSubmit(false);
  };

  const getAssessmentObj = (
    evaluationCriteriaGroups: EvaluationCriteriaGroup[],
    criteriaType: CriteriaType,
    evaluationMethod?: EvaluationMethod
  ): EvaluationCriteriaGroup => {
    if (isEmpty(evaluationCriteriaGroups)) return;

    return evaluationCriteriaGroups?.find((item: EvaluationCriteriaGroup) => {
      if (!evaluationMethod && criteriaType === CriteriaType.Finance) {
        return item?.criteriaType === criteriaType;
      }

      return (
        item?.criteriaType === criteriaType &&
        item?.evaluationMethod === evaluationMethod
      );
    });
  };

  const getDataSave = useCallback(
    (body: PurchasePlanBidModel) => {
      body.type = 1;

      let supplierPurchasePlans: SupplierPurchasePlanModel[] =
        body.supplierPurchasePlans || [];
      const SupplierPurchasePlansNewest =
        body.roundSuppliers?.[0]?.supplierPurchasePlans;

      if (
        isCreatePage &&
        !isEmpty(SupplierPurchasePlansNewest) &&
        isEmpty(supplierPurchasePlans)
      ) {
        supplierPurchasePlans = SupplierPurchasePlansNewest;
      }

      supplierPurchasePlans = supplierPurchasePlans?.map((el) => ({
        supplierId: el.supplierId,
        quoteId: el.quoteId ? el.quoteId : el?.supplierContactSelected?.id,
        quoteName: el.quoteName,
        quoteEmail: el.quoteEmail,
        phoneNumber: el.phoneNumber,
        emailRecipients: el.emailRecipients,
      }));

      const tenderRequests = {
        ...body.tenderRequests,
        releaseDate: body.tenderRequests?.releaseDate
          ? body.tenderRequests.releaseDate
          : undefined,
        bidStartDate: body.tenderRequests?.bidStartDate
          ? body.tenderRequests.bidStartDate
          : undefined,
        bidEndDate: body.tenderRequests?.bidEndDate
          ? body.tenderRequests.bidEndDate
          : undefined,
        openBidDate: body.tenderRequests?.openBidDate
          ? body.tenderRequests.openBidDate
          : undefined,
        evaluateStartDate: body.tenderRequests?.evaluateStartDate
          ? body.tenderRequests.evaluateStartDate
          : undefined,
        evaluateEndDate: body.tenderRequests?.evaluateEndDate
          ? body.tenderRequests.evaluateEndDate
          : undefined,
        technicalProfile: body.tenderRequests.technicalProfile.map((el) => ({
          ...el,
          id: uuidValidate(el.id) ? el.id : undefined,
          quotationRequestId: uuidValidate(el.quotationRequestId)
            ? el.quotationRequestId
            : undefined,
          tenderProfileType: TenderProfileType.TechnicalProfile,
        })),
        financialProfile: body.tenderRequests.financialProfile.map((el) => ({
          ...el,
          id: uuidValidate(el.id) ? el.id : undefined,
          quotationRequestId: uuidValidate(el.quotationRequestId)
            ? el.quotationRequestId
            : undefined,
          tenderProfileType: TenderProfileType.FinancialProfile,
        })),
      };

      const evaluationTeams = body.evaluationTeamDetails?.map(
        (el: EvaluationTeam) => {
          if (!el) return;
          return omit(
            {
              ...el,
              id: uuidValidate(el.id) ? el.id : undefined,
              userId: el.user?.id,
              role: el.role?.id,
              isApproved: isEmpty(body.id) ? !body.isDraft : true,
            },
            ["user"]
          );
        }
      );

      const data = {
        id: idDetail,
        approveUserId: body.approveUserId,
        reasonForAdjustment: body.reasonForAdjustment,
        originalPurchaseRequestId: body.originalPurchaseRequestId,
        isDraft: body.isDraft,
        adjustmentDescription: body.adjustmentDescription,
        originalPurchasePlanId: body.originalPurchasePlanId,
        status: body.status,
        type: PurchasePlanType.Adjustment,
        purchasePlanType: body.purchasePlanType,
        goodsItems: body.goodsItems,
        organizationGeneral: body.organizationGeneral,
        tenderRequests,
        supplierPurchasePlans: isEmpty(supplierPurchasePlans)
          ? undefined
          : supplierPurchasePlans,
        evaluationTeams,
        evaluationCriteriaSummary: {
          evaluationCriteriaBaseFlag: {
            evaluationMethod: EvaluationMethod.PassFail,
            criteriaType: CriteriaType.TechnicalCompetence,
            evaluationCriterias: body.evaluationPassFail?.map(
              (el: EvaluationCriteria) =>
                omit(new EvaluationCriteriaClass(el), [
                  "criteria",
                  "criteriaItems",
                ])
            ),
          },
          evaluationCriteriaBasePoint: {
            evaluationMethod: EvaluationMethod.Scoring,
            criteriaType: CriteriaType.TechnicalCompetence,
            technicalWeight: body.evaluationScoretechnicalWeight,
            evaluationCriterias: body.evaluationScore?.map(
              (el: EvaluationCriteria) =>
                omit(new EvaluationCriteriaClass(el), [
                  "criteria",
                  "criteriaItems",
                ])
            ),
          },
          evaluationCriteriaFinanceType: {
            evaluationMethod: body.evaluationMethodFinancial?.id,
            criteriaType: CriteriaType.Finance,
            financialWeight: body.evaluationPointRateFinancial,
            evaluationCriterias: body.evaluationFinancial?.map(
              (el: EvaluationCriteria) =>
                omit(new EvaluationCriteriaClass(el), [
                  "criteria",
                  "criteriaItems",
                ])
            ),
          },
        },
      };
      return data;
    },
    [idDetail, isCreatePage]
  );

  const handleSubmitForm = useCallback(
    (body: PurchasePlanBidModel) => {
      if (!body) return;
      setLoading(true);
      const data = getDataSave(body);

      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);

      const repoCreateOrEdit = isEmpty(body.id)
        ? purchasingPlanRepository.createPurchasingPlanRequestDT
        : purchasingPlanRepository.updatePurchasingPlanRequestDT;

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
    },
    [getDataSave, model, notifyToast, handleGoMaster, handleValidateError]
  );

  const handleValidateForm = useCallback(
    async (body: PurchasingPlanRequest) => {
      // Tạo model mới để dùng khi validate lỗi
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      try {
        setLoading(false);
        const res = await lastValueFrom(
          purchasingPlanRepository.validatePurchasingPlanRequestDT({
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
      const dataSubmit = getDataSave({ ...model, isDraft });
      setLoading(true);
      return await handleValidateForm(dataSubmit);
    },
    [getDataSave, handleValidateForm, model]
  );

  React.useEffect(() => {
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

  const valuesContext: PurchasePlanAdjustBidDetailHookContextProps = {
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
