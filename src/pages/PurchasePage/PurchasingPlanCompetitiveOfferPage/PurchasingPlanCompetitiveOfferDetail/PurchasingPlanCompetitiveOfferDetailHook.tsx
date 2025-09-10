/* eslint-disable import/no-unresolved */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  APP_OVERVIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
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
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import type { History } from "history";
import {
  get,
  has,
  isArray,
  isEmpty,
  isEqual,
  isNil,
  isUndefined,
  size,
} from "lodash";
import {
  childText,
  ConfirmModalType,
  DEFAULT_ERROR_MODAL_TYPE,
  PURCHASING_PLAN_STATUS,
  TYPE_OF_ATTACHMENTS,
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Model, ModelFilter } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { finalize, lastValueFrom, Observable, of, tap } from "rxjs";
import { budgetRepository } from "../../../BudgetPage/BudgetRepository";
import useRepositoriesStepTabHook from "./useRepositoriesStepTabHook/useRepositoriesStepTabHook";
import {
  AttachmentFileModel,
  ColumnKey,
  CriteriaType,
  EditEvaluation,
  EvaluationCriteriaGroupClass,
  EvaluationItemResult,
  EvaluationMethod,
  EvaluationResult,
  EvaluationTeam,
  GoodsPrice,
  IPurchaseRequest,
  ParamsConfirmCreateRound,
  ParamsSelectSupplierPrioritize,
  ParamsSubmitSelectSupplierForNegotiation,
  PersonInChargeModel,
  PurchasePlanGoodsServicesModel,
  PurchasePlanTypeRouter,
  PurchasingPlan,
  PurchasingPlanModel,
  PurchasingPlanRequest,
  PurchasingPlanTypeModel,
  SendResultPayload,
  SupplierContact,
  SupplierModel,
  SupplierQuotationAction,
  TabKeyBidder,
  TechnicalProfile,
  TenderProfileType,
  TenderRequestType,
  ViewRole,
} from "models/PurchasingPlan";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { v4 as uuidv4 } from "uuid";

import { ModalTypeError } from "core/models/Common/ErrorModal";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";

import TabName from "components/TabName/TabName";
import { trimText } from "core/helpers/text";
import { useAppSelector } from "rtk/useRedux";
import useRepositoriesStepTabHookView from "../PurchasingPlanCompetitiveOfferView/Components/useRepositoriesStepTabHookView/useRepositoriesStepTabHookView";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import BidDocumentEvaluationTab from "../PurchasingPlanCompetitiveOfferView/Components/BidDocumentEvaluationTab/BidDocumentEvaluationTab";
import ReviewSummaryTab from "../PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/ReviewSummaryTab";
import { Breadcrumbs } from "models/ContractAdjustment";
import {
  listPurchasingPlanStatusEnum,
  PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS,
} from "config/const";
import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import { systemConfigurationRepository } from "core/repositories/SystemConfigurationRepository";

export const PurchasingPlanCompetitiveOfferDetailHookContext =
  createContext<PurchasingPlanModel>({
    model: new PurchasingPlanTypeModel(),
    dispatchModel: null,
    translate: undefined,
    breadcrumbs: [],
    tabRepositories: [],
    handleChangeSelectField: null,
    handleChangeSingleField: null,
    handleChangeDateField: null,
    handleChangeAllField: null,
    handleChangeBoolField: null,
    handleChangeListField: null,
    handleViewPurchaseProposal: null,
    handleViewOriginPurchaseProposal: null,
    path: null,
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
    tabRepositoriesView: null,
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
    setIsDrawerSupplier: null,
    setIsDrawerQuote: null,
    quoteAgainAction: null,
    handleOpenSupplierDrawerByRecord: null,
    isOpenModalQuoteAgain: false,
    setIsOpenModalQuoteAgain: null,
    tabKey: "0",
    setTabKey: null,
    titlePageHeader: "",
    getPurchasePlanTypeByRouter: null,
    selectedDetailSupplier: null,
    selectedDetailSupplierId: null,
    setSelectedDetailSupplierId: null,
    purchaseRequest: null,
    loadingConfirm: false,
    isOpenModalGetOpinions: false,
    setIsOpenModalGetOpinions: null,
    isOpenModalSelectSupplier: false,
    setIsOpenModalSelectSupplier: null,
    selectSupplier: null,
    approvalSupplier: null,
    handleInitialPlan: null,
    handleConfirmPurchasingPlan: null,
    handleSaveAndPreview: null,
    handleValidateSaveDraft: null,
    handleConfirmPurchasingPlanUpdateResults: null,
    editEvaluation: null,
    selectedEvaluationResult: null,
    setSelectedEvaluationResult: null,
    actionQuote: null,
    setActionQuote: null,
    isOpenProceedNegotiationModal: null,
    setIsOpenProceedNegotiationModal: null,
    isOpenPrioritySupplier: null,
    setIsOpenPrioritySupplier: null,
    handleGetListSupplierForNegotiation: null,
    handleSubmitSelectSupplierForNegotiation: null,
    handleSubmitConfirmAddingNegotiationRound: null,
    handleSubmitCreateNextQuotationRound: null,
    handleSubmitSelectSupplierPriority: null,
    handleCloseDrawerQuote: null,
    hasMultiLayerDrawer: false,
    setHasMultiLayerDrawer: null,
    handleConfirmSummary: null,
    handleSummarizeResult: null,
    stepChooseSupplier: false,
    setStepChooseSupplier: null,
    handleWaitingApprovalSelectSupplier: null,
    handleValidateSaveForm: null,
  });

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

export function usePurchasingPlanCompetitiveOfferDetailHook(
  isDetail?: boolean
) {
  const location = useLocation();
  const { id: idDetail } = useParams<{ id: string }>();
  const purchaseRequest = location.state as IPurchaseRequest;
  const [isOpenModalNextRoundBid, setIsOpenModalNextRoundBid] =
    useState<boolean>(false);
  const [isOpenModalAddSupplierQuote, setIsOpenModalAddSupplierQuote] =
    useState(false);

  const [isOpenModalSupplierQuote, setIsOpenModalSupplierQuote] =
    useState(false);

  const [isOpenProceedNegotiationModal, setIsOpenProceedNegotiationModal] =
    useState(false);

  const [isOpenPrioritySupplier, setIsOpenPrioritySupplier] = useState(false);

  const [actionQuote, setActionQuote] = useState<SupplierQuotationAction>(null);

  const queryParams = new URLSearchParams(location.search);

  const tabKeyParams = queryParams.get("tabkey");

  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);

  const [translate] = useTranslation();
  const history: History = useHistory();
  const [errorsModal, setErrorsModal] = useState<ModalTypeError>(
    DEFAULT_ERROR_MODAL_TYPE
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isDrawerSupplier, setIsDrawerSupplier] = useState<boolean>(false);
  const [isDrawerQuote, setIsDrawerQuote] = useState<boolean>(false);
  const [selectedEvaluationResult, setSelectedEvaluationResult] =
    useState<EvaluationResult>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModalQuoteAgain, setIsOpenModalQuoteAgain] =
    useState<boolean>(false);

  const [isOpenModalSelectSupplier, setIsOpenModalSelectSupplier] =
    useState<boolean>(false);

  const [isOpenModalGetOpinions, setIsOpenModalGetOpinions] =
    useState<boolean>(false);
  const [clarificationHistorySupplier, setClarificationHistorySupplier] =
    useState(null);

  const [selectedDetailSupplierId, setSelectedDetailSupplierId] = useState("");
  const [step, setStep] = useState<number>(0);
  const [hasMultiLayerDrawer, setHasMultiLayerDrawer] = useState(false);
  const [stepChooseSupplier, setStepChooseSupplier] = useState(false);

  const pathname = history.location.pathname;
  const profile = useAppSelector((state) => state.profile);
  const { account, position, organization } = profile;

  // Helper function để tạo personInChargeInfos default từ profile
  const createDefaultPersonInChargeFromProfile = useCallback(
    (profile: any, systemConfig: any) => {
      const newPerson = new PersonInChargeModel();
      newPerson.id = uuidv4();
      newPerson.picId = profile.account.id;
      newPerson.email = profile.account.email || "";
      newPerson.phoneNumber = profile.account.phoneNumber || "";
      newPerson.role = profile.position?.name || "";

      // Set organization info - ưu tiên systemConfig nếu có, fallback về profile.organization
      if (systemConfig) {
        newPerson.name = systemConfig.businessName || "";
        newPerson.taxCode = systemConfig.businessTaxCode || "";
        newPerson.address = systemConfig.businessAddress || "";
      } else if (profile.organization) {
        newPerson.name = profile.organization.name || "";
        newPerson.taxCode = profile.organization.taxCode || "";
        newPerson.address = profile.organization.address || "";
      }

      newPerson.pic = {
        id: profile.account.id,
        name:
          profile.account?.displayName ||
          profile.account?.username ||
          profile.account?.name,
        email: profile.account.email,
        phoneNumber: profile.account.phoneNumber,
        position: {
          name: profile.position?.name,
        } as PersonInChargeModel,
      };

      return [newPerson];
    },
    []
  );

  const handleClickDrawerSupplier = (status?: boolean) => {
    setIsDrawerSupplier(() => {
      const newStatus = status ?? false; // Nếu không truyền `status`, mặc định là `false`
      if (newStatus) {
        setIsDrawerQuote(false);
      }
      return newStatus;
    });
  };

  const handleOpenSupplierDrawerByRecord = (record: SupplierModel) => {
    handleChangeSingleField({ fieldName: "supplierDrawerDetail" })(record);
    if (isDrawerQuote) {
      setIsDrawerQuote(false);
    }
    setIsDrawerSupplier(true);
  };

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PurchasingPlanTypeModel>(PurchasingPlanTypeModel);

  const approvalSupplier = useMemo(() => {
    return model?.evaluationSummary?.[0]?.evaluationResults?.find(
      (item) => item?.isApproval
    );
  }, [model]);
  const getClarificationHistorySupplierList = (
    filter?: ModelFilter
  ): Observable<Model[]> => {
    const searchText = filter?.name;
    const trimmedText = trimText(searchText);
    const suppliers = model?.profileEvaluation?.suppliers || [];

    if (!isEmpty(trimmedText)) {
      return of(
        suppliers?.filter((item: SupplierModel) =>
          item.name.toLowerCase().includes(trimmedText.toLowerCase())
        )
      );
    }

    return of(suppliers);
  };

  // Helper function để lấy system configuration
  const getSystemConfiguration = useCallback(async () => {
    try {
      const res =
        (await lastValueFrom(systemConfigurationRepository.detail())) || {};
      if (res) {
        const { data } = res as AxiosResponse<{
          businessAddress: string;
          businessName: string;
          businessTaxCode: string;
        }>;
        if (!data) return null;
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch system configuration:", error);
    }
    return null;
  }, []);

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_shopping"),
    },
    {
      name: translate("CM.menu_title_purchasing_plan"),
      path: PURCHASING_PLAN_MASTER_ROUTE,
    },
    {
      name: "",
    },
  ];

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  const updateLastBreadcrumb = (name: string) => {
    setBreadcrumbs((prevState) => {
      const newBreadcrumbs = [...prevState];
      newBreadcrumbs[size(prevState) - 1] = { name };
      return newBreadcrumbs;
    });
  };

  const isViewWaitingApprove =
    queryParams.get("isViewWaitingApprove") === "true";

  const handleChangeGoodsServices = useCallback(
    async (purchaseProposalId: string) => {
      const data = await lastValueFrom(
        purchasingPlanRepository.getGoodServiceGroup({
          id: purchaseProposalId,
          purchasePlanId: idDetail,
          pageIndex: 1,
          pageSize: 99999999,
          purchasePlanType: TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING,
        })
      );
      return flattenPurchaseItems(data?.data?.items);
    },
    [idDetail]
  );

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeListField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);
  const searchParams = new URLSearchParams(location.search);
  const isPerform = searchParams.get("isPerform") === "true";

  const isEdit =
    isEqual(
      PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
      location?.pathname?.split("/")?.slice(0, -1)?.join("/")
    ) && !isEmpty(idDetail);

  const isView =
    isEqual(
      PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
      location?.pathname?.split("/")?.slice(0, -1)?.join("/")
    ) && !isEmpty(idDetail);

  const handleInitialPlan = useCallback(
    async (isSaveAndPreview = false, callBackFunction?: () => void) => {
      const dataConfigSystem = await getSystemConfiguration();
      Object.assign(model, {
        configSystem: dataConfigSystem,
      });

      if (profile) {
        Object.assign(model, {
          user: profile.account,
          userPosition: profile.position,
          userOrganization: [profile.organization],
          organizationGeneral: profile.organization,
        });
      }

      if (isEmpty(idDetail)) {
        // Khi tạo mới, init organizationGeneral với personInChargeInfos default

        Object.assign(model, {
          evaluationTeams: [
            {
              user: {
                ...account,
                position,
                organization,
              },
              criteriaCount: 0,
              id: account?.id,
              isMe: true,
            },
          ],
        });
      }

      Object.assign(model, {
        offerRequest: {
          purchasePlanId: idDetail,
          originalPurchasePlanId: model?.originalPurchasePlanId,
          bidStartDays: null,
          bidEndDays: null,
          openBidDays: null,
          evaluateStartDays: null,
          evaluateEndDays: null,
          offerRequestProfiles: [],
        },
      });

      if (!isEmpty(idDetail)) {
        setLoading(true);
        purchasingPlanRepository
          ?.getPlanDetail(
            idDetail,
            isDetail,
            isViewWaitingApprove,
            false,
            isPerform,
            isSaveAndPreview
          )
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (data) => {
              if (!data)
                return handleChangeAllField({
                  ...model,
                  errorTabs: [],
                });

              const evaluationTeams =
                data?.evaluationTeams && isArray(data?.evaluationTeams)
                  ? data?.evaluationTeams?.[0]?.evaluationTeamDetails?.map(
                      (item: EvaluationTeam) => ({
                        ...item,
                        isMe: isEqual(item?.user?.id, account?.id),
                      })
                    )
                  : [];

              const dataPassToDetail = {
                ...data,
                preCancelStatus: data.preCancelStatus,
                isView: isView,
                isEdit: isEdit,
                idDetail: idDetail,
                code: data.code,
                status: data.status,
                id: data.id,
                purchasePlanType: TYPE_PURCHASING_PLAN_OPTIONS.find(
                  (option) => option?.id === data.purchasePlanType
                ),
                startDate: dayjs(data.startDate),
                endDate: dayjs(data.endDate),
                purchaseItems: data.goodsItems.map((item) => {
                  return {
                    ...item,
                    quantity: item?.quantity,
                    branchId: item?.branch?.id || "",
                    originalQuantity: item?.originalTotalAmount || 0,
                    registeredQuantity: item?.registeredQuantity || 0,
                    manufacturer: item?.branch,
                    purchaseItemId: item?.id,
                    id: `${uuidv4()}${childText}`,
                  };
                }),
                attachments: (
                  data.attachments as AttachmentFileModel[]
                )?.filter(
                  (item: AttachmentFileModel) =>
                    item?.purchasePlanAttachmentType ===
                    TYPE_OF_ATTACHMENTS?.ATTACHMENT
                ),
                supplierAttachments: (
                  data.attachments as AttachmentFileModel[]
                )?.filter(
                  (item: AttachmentFileModel) =>
                    item?.purchasePlanAttachmentType ===
                    TYPE_OF_ATTACHMENTS?.SUPPLIER_ATTACHMENT
                ),
                userPosition: data.userPosition,
                userDepartment: data.userDepartment,
                purchaseProposalId: {
                  ...data.originalPurchaseRequest,
                  createdDate: dayjs(data.originalPurchaseRequest?.createdDate),
                  purchaseProposalCode:
                    data.originalPurchaseRequest?.purchaseProposalCode,
                  purchaseProposalName:
                    data.originalPurchaseRequest?.purchaseProposalName,
                  createUserName: data.originalPurchaseRequest?.createUserName,
                  createUser: data.originalPurchaseRequest?.createUser,
                  name: data.originalPurchaseRequest?.name,
                  code: data.originalPurchaseRequest?.code,
                  id: data.originalPurchaseRequest?.id,
                  originalPurchaseProposalId:
                    data.originalPurchaseRequest?.originalPurchaseProposalId,
                  currency: data.originalPurchaseRequest?.currency,
                  businessDepartment:
                    data.originalPurchaseRequest?.businessDepartment,
                  position: data.originalPurchaseRequest?.position,
                },
                organizationGeneral: data.organizationGeneral,
                userOrganization: data.userOrganization,
                initUserOrganization: {
                  user: profile.account,
                  userPosition: profile.position,
                  organizationGeneral: profile.organization,
                },
                evaluationTeams,
                supplierGenerals: data?.supplierPurchasePlans?.map(
                  (item: SupplierModel) => ({
                    ...item,
                    id: item?.supplierId,
                    emailReceiverInfo: item?.emailRecipients?.map(
                      (item: any) => ({
                        ...item,
                        id: uuidv4(),
                      })
                    ),
                    supplierType: {
                      id: item?.supplierId,
                      name: item?.type,
                    },
                  })
                ),
                evaluationCriteriaGroup: (data as any)?.offerRequest
                  ?.evaluationCriteriaGroup?.evaluationCriterias,
                offerSummary: data?.offerSummary,
                masterPrioritySupplier: {
                  listSupplierAddQuote: data?.suppliersNegotiation || [],
                },
                attachmentsOfferRequest: (data as any)?.offerRequest
                  ?.attachments,
                evaluationMethod: (data as any)?.offerRequest
                  ?.evaluationCriteriaGroup?.evaluationMethod,
                financialWeight: (data as any)?.offerRequest
                  ?.evaluationCriteriaGroup?.financialWeight,
                technicalWeight: (data as any)?.offerRequest
                  ?.evaluationCriteriaGroup?.technicalWeight,
              };

              handleChangeAllField({
                ...model,
                ...dataPassToDetail,
                errorTabs: [],
              });
              setClarificationHistorySupplier(data?.suppliers?.[0]);
              if (callBackFunction) {
                callBackFunction();
              }
            },
            error: (error: AxiosError) => {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            },
          });
      } else {
        const defaultPersonInChargeInfos =
          createDefaultPersonInChargeFromProfile(profile, dataConfigSystem);
        handleChangeAllField({
          ...model,
          organizationGeneral: {
            ...model.organizationGeneral,
            personInChargeInfos: defaultPersonInChargeInfos,
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      account,
      handleChangeAllField,
      idDetail,
      isDetail,
      isEdit,
      isPerform,
      isView,
      isViewWaitingApprove,
      notifyToast,
      organization,
      position,
      profile,
      createDefaultPersonInChargeFromProfile,
    ]
  );

  const handleInitPurchasePlan = useCallback(
    async (data: PurchasingPlan) => {
      if (isEmpty(data?.code)) {
        return { purchaseProposal: [], purchaseItems: [] };
      }
      const purchaseItems = await handleChangeGoodsServices(data?.id);
      const listPurchaseItems = purchaseItems?.map((item) => ({
        ...item,
        purchaseItemId: item?.id,
        id: `${uuidv4()}${childText}`,
      }));
      const res = await lastValueFrom(
        purchasingPlanRepository.getProposalPurchase({
          search: data?.code,
          pageIndex: 1,
          pageSize: 10,
          purchasePlanId: isEmpty(idDetail) ? undefined : idDetail,
        })
      );
      return {
        purchaseProposal: res?.data?.items,
        purchaseItems: listPurchaseItems,
      };
    },
    [handleChangeGoodsServices, idDetail]
  );

  const processAfterFeedbackSubmission = useCallback(() => {
    if (
      isEqual(
        model?.status,
        get(listPurchasingPlanStatusEnum, `[${numberConstants.ONE}].id`)
      )
    ) {
      handleInitialPlan();
    }
  }, [handleInitialPlan, model?.status]);

  const { tabRepositories: baseRepository } = useRepositoriesStepTabHook(
    model?.errorTabs,
    idDetail,
    step
  );

  const shouldShowBidDocumentEvaluationTab =
    model?.status &&
    ![
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.DRAFT,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_WAITING_FOR_APPROVE,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED,
    ].includes(model?.status) &&
    model?.viewRole === ViewRole.Evaluator;

  const bidDocumentEvaluationTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.DocumentEvaluation,
        tabTitle: (
          <TabName
            text={translate("PL.document_evaluation")}
            isShowIconError={model.errorTabs?.includes(3)}
          />
        ),
        children: <BidDocumentEvaluationTab />,
      },
    ],
    [model.errorTabs, translate]
  );

  const shouldShowReviewSummaryTab =
    model?.status &&
    ![
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.DRAFT,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_WAITING_FOR_APPROVE,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED,
    ].includes(model?.status);

  const reviewSummaryTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.ReviewSummary,
        tabTitle: (
          <TabName
            text={translate("PL.txt_review_summary")}
            isShowIconError={model.errorTabs?.includes(4)}
          />
        ),
        children: <ReviewSummaryTab />,
      },
    ],
    [model.errorTabs, translate]
  );

  const { tabRepositoriesView: baseRepositoryView } =
    useRepositoriesStepTabHookView({
      idDetail,
      step,
      pathname,
      tabKeyError: model?.errorTabs,
    });

  const approvalHistoryTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.ApprovalHistory,
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
            processAfterFeedbackSubmission={processAfterFeedbackSubmission}
          />
        ),
      },
    ],
    [idDetail, model, opinionId, opinionType, translate]
  );

  const shouldShowApprovalHistoryTab = useMemo(
    () => !isUndefined(idDetail),
    [idDetail]
  );
  const tabRepositories = useMemo(() => {
    return baseRepository
      ? [
          ...baseRepository,
          ...(shouldShowBidDocumentEvaluationTab
            ? bidDocumentEvaluationTab
            : []),
          ...(shouldShowReviewSummaryTab ? reviewSummaryTab : []),
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepository;
  }, [
    approvalHistoryTab,
    baseRepository,
    bidDocumentEvaluationTab,
    reviewSummaryTab,
    shouldShowApprovalHistoryTab,
    shouldShowBidDocumentEvaluationTab,
    shouldShowReviewSummaryTab,
  ]);

  const tabRepositoriesView = useMemo(() => {
    return baseRepositoryView
      ? [
          ...baseRepositoryView,
          ...(shouldShowBidDocumentEvaluationTab
            ? bidDocumentEvaluationTab
            : []),
          ...(shouldShowReviewSummaryTab ? reviewSummaryTab : []),
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepositoryView;
  }, [
    approvalHistoryTab,
    baseRepositoryView,
    bidDocumentEvaluationTab,
    reviewSummaryTab,
    shouldShowApprovalHistoryTab,
    shouldShowBidDocumentEvaluationTab,
    shouldShowReviewSummaryTab,
  ]);

  const selectedDetailSupplier = model?.supplierPrincipleContracts?.find(
    (item: SupplierModel) => item?.id === selectedDetailSupplierId
  );

  const handleViewOriginPurchaseProposal = useCallback(() => {
    window.open(
      `${PROPOSAL_DETAIL_ROUTE}/${model.purchaseProposalId?.originalPurchaseProposalId}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.originalPurchaseProposalId]);

  const handleViewPurchaseProposal = useCallback(() => {
    window.open(
      `${PURCHASE_REQUEST_VIEW_ROUTE}/${model.purchaseProposalId?.id}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.id]);

  const flattenPurchaseItems = (
    data: PurchasePlanGoodsServicesModel[]
  ): PurchasePlanGoodsServicesModel[] => {
    const result = data?.reduce((acc, item) => {
      if (item?.childrens) {
        return [...acc, ...(item?.childrens ?? [])];
      }
      return [...acc, item];
    }, [] as PurchasePlanGoodsServicesModel[]);
    return result;
  };

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

  const handleGoMaster = React.useCallback(
    (searchParams?: string) => {
      history.push({
        pathname: PURCHASING_PLAN_MASTER_ROUTE,
        search: searchParams ? `?${searchParams}` : "",
      });
    },
    [history]
  );

  const getPurchasePlanTypeByRouter = useCallback(
    (id?: TYPE_PURCHASING_PLAN) => {
      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) => el.pathEdit === history.location.pathname
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return new PurchasePlanTypeRouter(itemPurchasePlanType);
    },
    [history.location.pathname]
  );

  const titlePageHeader = useMemo(() => {
    return isEmpty(model?.id)
      ? translate("PL.purchasing_plan_title_create")
      : `${translate("PL.purchase_plan")} ${model?.code}`;
  }, [model?.code, model?.id, translate]);

  const getGoodsItems = useCallback(
    (purchaseItems: PurchasePlanGoodsServicesModel[]) => {
      const groupedByCategoryId = purchaseItems?.reduce(
        (acc: Record<string, PurchasePlanGoodsServicesModel[]>, item) => {
          const catId = item?.category?.id || "";
          if (!acc[catId]) {
            acc[catId] = [];
          }
          acc[catId].push(item);
          return acc;
        },
        {} as Record<string, PurchasePlanGoodsServicesModel[]>
      );

      const flattenedList = Object.values(groupedByCategoryId).flat();

      return flattenedList?.map((item) => {
        const purchaseItemId = item.id.includes(childText)
          ? item.id.slice(0, item.id.indexOf(childText))
          : item.id;
        return {
          goodsId: item?.goodsId,
          code: item?.code,
          name: item?.name,
          unitId: item?.unitId,
          manufacturerId: item?.manufacturer?.id,
          quantity: item?.quantity,
          description: item?.description,
          note: item?.note,
          unit: item?.unit,
          purchaseItemId,
        };
      });
    },
    []
  );

  const getDataSubmit = useCallback(
    (isDraft: boolean) => {
      if (!model) return;

      let evaluationCriteriaGroup = new EvaluationCriteriaGroupClass({
        evaluationMethod: EvaluationMethod.PassFail,
        criteriaType: CriteriaType.OfferRequest,
      });

      if (model?.evaluationCriteriaGroup?.length > 0) {
        evaluationCriteriaGroup = new EvaluationCriteriaGroupClass({
          evaluationCriterias: model?.evaluationCriteriaGroup,
          criteriaType: CriteriaType.OfferRequest,
          pointRate:
            model?.[
              `${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.POINT_RATE}`
            ],
          technicalWeight:
            model?.[
              `${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.TECHNICAL_WEIGHT}`
            ] ?? model?.technicalWeight,
          financialWeight:
            model?.[
              `${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.FINANCIAL_WEIGHT}`
            ] ?? model?.financialWeight,
          evaluationMethod:
            model?.[
              `${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.EVALUATION_METHOD}`
            ]?.id ?? model?.evaluationMethod,
        });
      }

      const offerRequest = { ...model?.offerRequest };
      if (offerRequest?.offerRequestProfiles) {
        Object.assign(offerRequest, {
          offerRequestProfiles: offerRequest?.offerRequestProfiles.map(
            (item: TechnicalProfile) => ({
              ...new TechnicalProfile(item),
              profileName: isEmpty(item.profileName) ? null : item.profileName,
              id: item.id?.includes(childText) ? undefined : item.id,
              tenderProfileType: TenderProfileType.OfferRequestProfile,
              quotationRequestId: item.quotationRequestId?.includes(childText)
                ? undefined
                : item.quotationRequestId,
            })
          ),
        });
      }

      const goodsItems = getGoodsItems(model.purchaseItems);

      const supplierPurchasePlans = model?.supplierGenerals?.map(
        (item: SupplierModel) => {
          return {
            supplierId: item?.id,
            quoteName: item?.quoteName,
            quoteEmail: item?.quoteEmail,
            emailRecipients: item?.emailReceiverInfo?.map((item) => {
              return {
                email: item?.email,
                name: item?.name,
              };
            }),
          };
        }
      );

      const dataForm = {
        id: idDetail,
        isDraft: isDraft,
        attachments: model.attachments,
        name: model.name,
        purchasePlanType:
          getPurchasePlanTypeByRouter().id || model.purchasePlanType?.id,
        note: model.note,
        estimatedDelivery: model.estimatedDelivery,
        reason: model.reason,
        startDate:
          !isEmpty(model.startDate) && dayjs(model.startDate).isValid()
            ? dayjs(model.startDate).format()
            : undefined,
        endDate:
          !isEmpty(model.endDate) && dayjs(model.endDate).isValid()
            ? dayjs(model.endDate).format()
            : undefined,
        originalPurchaseRequestId: model.purchaseProposalId?.id,
        goodsItems,
        supplierPurchasePlans,
        organizationGeneral: {
          organizationId: model.userOrganization?.[0]?.id,
          personInChargeInfos:
            model.organizationGeneral?.personInChargeInfos?.map(
              (item: PersonInChargeModel) => {
                let id = `${item.id}`.includes("New") ? undefined : item.id;
                if (isEmpty(id)) {
                  id = undefined;
                }

                return {
                  picId: item.picId,
                  email: item.email,
                  phoneNumber: item.phoneNumber,
                  role: item.role,
                };
              }
            ),
        },
        approveUserId: model.approveUserId?.id,
        supplierGenerals: model.supplierGenerals?.map((item: SupplierModel) => {
          const result = {
            id: item.id,
            supplierId: item.supplierId,
          };

          if (item.personInChargeInfos?.[0]?.pic) {
            Object.assign(result, {
              personInChargeInfos: [
                {
                  picId: item.personInChargeInfos[0].pic.id,
                  name: item.personInChargeInfos[0].pic.name,
                  email: item.personInChargeInfos[0].pic.email,
                  phoneNumber: item.personInChargeInfos[0].pic.phoneNumber,
                },
              ],
            });
          }
          return result;
        }),
        offerRequest: {
          ...offerRequest,
          evaluationCriteriaGroup: evaluationCriteriaGroup,
          tenderRequestType: TenderRequestType.CompetitiveOffer,
          biddingMethod: model.biddingMethodType?.id,
          biddingProcedure: model.biddingProcedureType?.id,
          attachments: model?.attachmentsOfferRequest,
        },
        evaluationTeams: model?.evaluationTeams?.map((item: EvaluationTeam) => {
          return {
            userId: item.user?.id,
            criteriaCount: item.criteriaCount,
          };
        }),
      };
      return dataForm;
    },
    [getGoodsItems, getPurchasePlanTypeByRouter, idDetail, model]
  );

  const handleValidateCreate = (isDraft: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    setLoading(true);
    handleSubmitForm(dataSubmit);
  };

  const hasKeyWithValue = (obj: object, key: string) =>
    has(obj, key) && !isNil(get(obj, key));

  const handleValidateError = useCallback(
    (error: AxiosError, newModel: PurchasingPlanTypeModel) => {
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

  const handleSave = (isDraft: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    handleSubmitForm(dataSubmit);
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
      const dataSubmit = getDataSubmit(isDraft);
      setLoading(true);
      return await handleValidateForm(dataSubmit);
    },
    [getDataSubmit, handleValidateForm]
  );

  const handleSubmitForm = useCallback(
    (body: PurchasingPlanRequest) => {
      setLoading(true);

      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      const repoCreateOrEdit = isEmpty(idDetail)
        ? purchasingPlanRepository.createPurchasingPlanRequestCHCT
        : purchasingPlanRepository.updatePurchasingPlanRequestCHCT;

      repoCreateOrEdit(body)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            notifyToast();
            handleGoMaster();
          },
          error: (error: AxiosError) => {
            if (
              hasKeyWithValue(error?.response?.data?.errors, "approveUserId")
            ) {
              handleChangeAllField({
                ...newModel,
                errors: error.response?.data?.errors,
                errorTabs: error.response?.data?.tabs,
              });
              return;
            }
            setIsSubmit(false);
            handleValidateError(error, {
              ...newModel,
              approveUserId: null,
            });
          },
        });
    },
    [handleGoMaster, handleValidateError, idDetail, model]
  );

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const handleError = useCallback(
    (error: AxiosError) => {
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
    },
    [notifyToast]
  );

  const handleHideModal = (
    shouldGoToMaster: boolean,
    shouldRefetchDetailData?: boolean
  ) => {
    const searchParams =
      modelSelected?.type === ConfirmModalType.REJECT ? "tab=2" : "";
    if (shouldGoToMaster) handleGoMaster(searchParams);
    notifyToast();
    setModelSelected(null);

    if (modelSelected?.type === ConfirmModalType.RENEGOTIATION) {
      handleInitialPlan();
      history.replace({
        pathname: `${PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE}/${idDetail}`,
        search: `?tabkey=${5}`,
      });
    }

    if (shouldRefetchDetailData) handleInitialPlan();
  };

  const handleApplyButtonInConfirmModal = (
    model: PurchasingPlan,
    data: DataForm
  ) => {
    // Base on ConfirmModalType to call API and handle Apply button
    const mapActionByModelType = new Map([
      [
        ConfirmModalType.DELETE,
        () => purchasingPlanRepository.deletePurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.CANCEL,
        () => purchasingPlanRepository.cancelPurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.RETURN,
        () => purchasingPlanRepository.returnPurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.REJECT,
        () => purchasingPlanRepository.rejectPurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.SEND_RESULT,
        () =>
          purchasingPlanRepository.sendResultPurchasingPlan(
            getSendResultPayload()
          ),
      ],
      [
        ConfirmModalType.RENEGOTIATION,
        () =>
          purchasingPlanRepository.renegotiationSupplier(
            getSendResultPayload()
          ),
      ],
    ]);

    if (!mapActionByModelType.has(modelSelected?.type)) return;
    setLoadingConfirm(true);
    const repoByType = mapActionByModelType.get(modelSelected.type);
    const shouldGoToMaster =
      modelSelected?.type !== ConfirmModalType.SEND_RESULT &&
      modelSelected?.type !== ConfirmModalType.RENEGOTIATION;

    const shouldRefetchDetailData =
      modelSelected?.type === ConfirmModalType.SEND_RESULT;

    repoByType()
      .pipe(finalize(() => setLoadingConfirm(false)))
      .subscribe({
        next: () => {
          handleHideModal(shouldGoToMaster, shouldRefetchDetailData);
        },
        error: handleError,
      });
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

  const handleApproveCancellationPurchasingPlan = useCallback(
    (id: string) => {
      purchasingPlanRepository
        .approveCancellationPurchasingPlan(id)
        .pipe(
          tap(() => setLoading(true)),
          finalize(() => setLoading(false))
        )
        .subscribe({
          next: () => {
            notifyToast();
            handleGoMaster("");
          },
          error: handleError,
        });
    },
    [handleError, handleGoMaster, notifyToast]
  );

  const handleUploadFileError = (error: AxiosError) => {
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

  const handleDownloadFile = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const editEvaluation = useCallback((data: EditEvaluation) => {
    purchasingPlanRepository
      .editEvaluatePurchase(data)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleInitialPlan();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  }, []);

  const handleConfirmPurchasingPlan = () => {
    const dataBody = model?.evaluationSummary
      .flatMap((item) => item.evaluationResults)
      ?.map((item) => {
        return {
          id: item.id,
          editedPoint: item.evaluationPoint,
          editedConvertPoint: item.convertPoint,
          editedPassFlag: item.passFlag,
        };
      });
    purchasingPlanRepository
      .updateResults({
        evaluationResults: dataBody,
      })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleValidateSaveDraft = (isDraft: boolean) => {
    // Save draft logic here
    const supplierSuppliedGoods = model?.selectSupplier?.supplierGoodsItems
      .map((item: GoodsPrice) => {
        if (!item) return;
        if (item.goodsItems.length > 1) {
          return item.goodsItems.map((el: GoodsPrice) => ({
            supplierId: el.supplier?.id,
            quotationId: el.quotationId,
            buyQuantity: el.buyQuantity,
            taxAmount: el.taxAmount,
            goodsItemId: el.id,
          }));
        }

        return {
          supplierId: item.goodsItems?.[0]?.supplier?.id,
          quotationId: item.goodsItems?.[0]?.quotationId,
          buyQuantity: item.goodsItems?.[0]?.buyQuantity,
          taxAmount: item.goodsItems?.[0]?.taxAmount,
          goodsItemId: item.goodsItems?.[0]?.id,
        };
      })
      .flat()
      .filter((item: GoodsPrice) => Boolean(!isEmpty(item.supplierId)));

    const supplierClosingRates = model?.selectSupplier?.exchangeRates
      .map((item: GoodsPrice) => {
        if (!item || item?.currency === VND_CURRENCY_UNIT) return;
        if (item) {
          return {
            currency: item.currency,
            supplierPurchasePlanId: item.supplierId,
            closingRate: item.closingRate || undefined,
          };
        }
      })
      .filter((item: GoodsPrice) =>
        item ? Boolean(!isEmpty(item?.supplierPurchasePlanId)) : Boolean(item)
      );

    setLoading(true);
    purchasingPlanRepository
      .validateSaveDraft({
        id: model?.idDetail,
        isDraft,
        supplierSuppliedGoods,
        supplierClosingRates,
      })
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();

          if (isDraft) {
            handleGoMaster();
            return;
          }
          setStepChooseSupplier(true);
          handleInitialPlan(true);
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleWaitingApprovalSelectSupplier = () => {
    setLoading(true);
    purchasingPlanRepository
      .waitingForApprovalSelectSupplier(model?.idDetail)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
          setStepChooseSupplier(false);
        },
        error: handleError,
      });
  };

  const handleConfirmPurchasingPlanUpdateResults = () => {
    const dataBody = model?.evaluationSummary
      .flatMap((item) => item.evaluationResults)
      ?.map((item) => {
        return {
          id: item.id,
          editedQuotationPoint: item.editedQuotationPoint,
          editedConvertPoint: item.editedConvertPoint,
          editedPassFlag: item.editedPassFlag,
        };
      });
    purchasingPlanRepository
      .updateResults({
        evaluationResults: dataBody,
      })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleApplySupplier = (
    dataSupplier: SupplierModel[],
    model: PurchasingPlanTypeModel
  ) => {
    const dataApply = dataSupplier?.map((item) => {
      const supplierContacts =
        item?.supplierContacts?.filter((item) => item?.isDefault) || [];
      const supplierContact: SupplierContact = supplierContacts?.[0] || {};
      return {
        ...item,
        quoteName: supplierContact?.name,
        quoteEmail: supplierContact?.email,
        phoneNumber: supplierContact?.phone,
      };
    });

    handleChangeAllField({
      ...model,
      masterSupplierAddQuote: {
        ...model?.masterSupplierAddQuote,
        listSupplierAddQuote: dataApply,
      },
      errors: {
        ...model?.errors,
        suppliers: null,
      },
    });

    setIsOpenModalSupplierQuote(false);
  };

  const getSendResultPayload = useCallback((): SendResultPayload => {
    const profileEvaluation = model?.profileEvaluation;
    const lastedEvaluationRound = profileEvaluation?.evaluationRound?.[0];

    if (isEmpty(lastedEvaluationRound)) return;

    return {
      id: isEqual(modelSelected?.type, ConfirmModalType.RENEGOTIATION)
        ? idDetail
        : profileEvaluation?.quotationRequestId,
      quotationRoundId: lastedEvaluationRound?.id,
      evaluateRequests: lastedEvaluationRound?.evaluationResults?.map(
        (item) => {
          return {
            supplierId: item?.supplier?.id,
            editedPoint: item?.editedPoint,
            editedPassFlag: item?.editedPassFlag,
            points: item?.evaluationGroupResult?.[0]?.evaluationItemResult?.map(
              (itemChild) => {
                return {
                  evaluationCriteriaId: itemChild?.evaluationCriteriaId,
                  point: itemChild?.point,
                  passFlag: itemChild?.passFlag,
                  note: itemChild?.note,
                };
              }
            ),
          };
        }
      ),
    };
  }, [model?.profileEvaluation, modelSelected]);

  const handleGetListSupplierForNegotiation = useCallback(async () => {
    try {
      const listSupplier = await lastValueFrom(
        purchasingPlanRepository.getListSupplierForNegotiation(idDetail)
      );

      const masterProceedNegotiation = {
        listSupplierAddQuote: listSupplier?.map((item: SupplierModel) => ({
          ...item,
          emailReceiverInfo: item?.emailRecipients?.map((item: any) => ({
            ...item,
            id: uuidv4(),
          })),
          supplierType: {
            id: item?.supplierId,
            name: item?.type,
          },
        })),
      };

      handleChangeSingleField({ fieldName: "masterProceedNegotiation" })({
        ...model?.masterProceedNegotiation,
        ...masterProceedNegotiation,
      });

      return listSupplier;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      notifyToast({
        type: "error",
        message: axiosError?.response?.data?.message,
      });
    }
  }, [idDetail]);

  const handleSubmitSelectSupplierForNegotiation = useCallback(
    async (list: string[]) => {
      setLoading(true);
      const params: ParamsSubmitSelectSupplierForNegotiation = {
        purchasePlanId: idDetail,
        supplierPurchasePlanIds: list,
      };
      try {
        await lastValueFrom(
          purchasingPlanRepository.submitSelectSupplierForNegotiation(params)
        );
        setLoading(false);
        handleInitialPlan();
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError<any>;
        notifyToast({
          type: "error",
          message: axiosError?.response?.data?.message,
        });
      }
    },
    [idDetail]
  );

  //thêm vòng đám phán
  const handleSubmitConfirmAddingNegotiationRound = useCallback(
    async (data: ParamsConfirmCreateRound) => {
      setLoading(true);
      try {
        await lastValueFrom(
          purchasingPlanRepository.submitConfirmAddingNegotiationRound(
            data,
            idDetail
          )
        );
        setLoading(false);
        setIsOpenModalAddSupplierQuote(false);
        handleInitialPlan();
      } catch (error) {
        setLoading(false);
        handleValidateErrorModal(error as AxiosError<any>, model);
      }
    },
    [handleGoMaster, handleValidateError, idDetail, model]
  );

  // chào giá vòng tiếp theo
  const handleSubmitCreateNextQuotationRound = useCallback(
    async (data: ParamsConfirmCreateRound) => {
      setLoading(true);
      try {
        await lastValueFrom(
          purchasingPlanRepository.submitCreateNextQuotationRound(
            data,
            idDetail
          )
        );
        setLoading(false);
        setIsOpenModalAddSupplierQuote(false);
        handleInitialPlan();
      } catch (error) {
        setLoading(false);
        handleValidateErrorModal(error as AxiosError<any>, model);
      }
    },
    [handleGoMaster, handleValidateError, idDetail, model]
  );

  const handleValidateErrorModal = useCallback(
    (error: AxiosError, newModel: PurchasingPlanTypeModel) => {
      if (error?.response && error.response.status === 400) {
        if (error.response?.data?.type === "Validate") {
          handleChangeAllField({
            ...newModel,
            errors: error.response?.data?.errors,
          });
          return;
        }
        if (error.response?.data?.type === "Bad Request") {
          handleChangeAllField({
            ...newModel,
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

  //chọn nhà cung cấp ưu tiên đàm phán
  const handleSubmitSelectSupplierPriority = useCallback(
    async (data: ParamsSelectSupplierPrioritize) => {
      setLoading(true);
      try {
        await lastValueFrom(
          purchasingPlanRepository.selectSupplierForNegotiation(data)
        );
        setLoading(false);
        handleInitialPlan();
        history.replace({
          pathname: `${PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE}/${idDetail}`,
          search: `?isPerform=true&tabkey=${TabKeyBidder.SelectSupplier}`,
        });
      } catch (error) {
        setLoading(false);
        handleValidateError(error as AxiosError<any>, model);
      }
    },
    [handleGoMaster, handleValidateError, idDetail, model]
  );

  const handleCloseDrawerQuote = () => {
    setSelectedEvaluationResult(null);
    setIsDrawerQuote(false);
    if (!hasMultiLayerDrawer) document.body.style.overflow = "unset";
  };

  const handleSummarizeResult = () => {
    const quotationRoundId = {
      quotationRoundId: model?.evaluationSummary?.[0]?.id,
    };
    purchasingPlanRepository
      .postEvaluationSummarizeResult(quotationRoundId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleInitialPlan();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleConfirmSummary = (isDraft?: boolean) => {
    const quotationRound = model?.evaluationSummary?.flatMap((summary) =>
      summary.evaluationResults
        ?.filter((result: EvaluationResult) => result?.isEdited)
        ?.flatMap((result: EvaluationResult) =>
          result?.evaluationGroupResult?.map((group) => {
            const groupData = group as any;
            return {
              supplierId: result?.supplierId,
              summaryTechnicalPoint: groupData?.summaryTechnicalPoint,
              summaryTechnicalPassFlag: groupData?.summaryTechnicalPassFlag,
              summaryTechnicalNote: groupData?.summaryTechnicalNote,
              summaryQuotationPoint: groupData?.summaryQuotationPoint,
              summaryQuotationNote: groupData?.summaryQuotationNote,
              summaryPoint: groupData?.summaryPoint,
              summaryNote: groupData?.summaryNote,
              summaryPoints: group?.evaluationItemResult?.map(
                (itemChild: EvaluationItemResult) => {
                  return {
                    evaluationCriteriaId: itemChild?.evaluationCriteriaId,
                    summaryPoint: itemChild?.summaryPoint,
                    summaryPassFlag: itemChild?.summaryPassFlag,
                    summaryNote: itemChild?.summaryNote,
                  };
                }
              ),
            };
          })
        )
    );

    const body = {
      id: model?.offerRequest?.quotationRequestId,
      isDraft: isDraft,
      quotationRoundId: model?.evaluationSummary?.[0]?.id,
      evaluateRequests: quotationRound,
    };
    purchasingPlanRepository
      .postEvaluationConfirmResult(body)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleInitialPlan();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  useEffect(() => {
    handleInitialPlan();
  }, []);

  useEffect(() => {
    if (isEmpty(idDetail) || model?.isSelectPurchaseProposalId) {
      handleChangeGoodsServices(model?.purchaseProposalId?.id).then((res) => {
        const listPurchaseItems = res?.map((item) => ({
          ...item,
          purchaseItemId: item?.id,
          quantity: item?.remainingRequestQuantity,
          id: `${uuidv4()}${childText}`,
        }));
        handleChangeSingleField({
          fieldName: "purchaseItems",
        })(listPurchaseItems);
      });
    }
  }, [
    handleChangeGoodsServices,
    handleChangeSingleField,
    idDetail,
    model?.isSelectPurchaseProposalId,
    model?.purchaseProposalId?.id,
  ]);

  useEffect(() => {
    const initializePurchasePlan = async () => {
      if (!isEmpty(purchaseRequest) && isEmpty(idDetail)) {
        try {
          const dataConfigSystem = await getSystemConfiguration();

          const data = purchaseRequest?.purchaseRequest;
          const res = await handleInitPurchasePlan(data);
          const { purchaseProposal, purchaseItems } = res;

          const listPurchaseItems = purchaseItems.map((item) => ({
            ...item,
            id: `${uuidv4()}${childText}`,
          }));
          const purchaseProposalId = purchaseProposal[0];

          Object.assign(model, {
            configSystem: dataConfigSystem,
          });

          const defaultPersonInChargeInfos =
            createDefaultPersonInChargeFromProfile(profile, dataConfigSystem);

          if (profile) {
            Object.assign(model, {
              user: profile.account,
              userPosition: profile.position,
              userOrganization: [profile.organization],
              organizationGeneral: profile.organization,
            });
          }

          handleChangeAllField({
            ...model,
            note: data?.name,
            name: data?.name,
            estimatedDelivery: isEmpty(data?.estimatedDelivery)
              ? undefined
              : data?.estimatedDelivery,
            reason: isEmpty(data?.reason) ? undefined : data?.reason,
            purchaseProposalId: isEmpty(purchaseProposalId)
              ? undefined
              : purchaseProposalId,
            listSupplier: data?.supplier ? [data?.supplier] : [],
            purchaseItems: listPurchaseItems,
            purchasePlanType: getPurchasePlanTypeByRouter(),
            organizationGeneral: {
              ...model?.organizationGeneral,
              personInChargeInfos: defaultPersonInChargeInfos,
            },
          });
        } catch (error) {
          console.error("Error initializing purchase plan:", error);
          // Handle error appropriately (e.g., show notification, set error state)
        }
      }
    };

    initializePurchasePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    purchaseRequest,
    getPurchasePlanTypeByRouter,
    idDetail,
    handleInitPurchasePlan,
    handleChangeAllField,
    handleChangeSingleField,
    createDefaultPersonInChargeFromProfile,
  ]);

  useEffect(() => {
    if (
      isEqual(model?.status, PURCHASING_PLAN_STATUS.WAITING_CANCEL) ||
      isEqual(model?.status, PURCHASING_PLAN_STATUS.CANCELLED) ||
      isEqual(model?.status, PURCHASING_PLAN_STATUS.DECLINED)
    ) {
      setStep(model?.preCancelStatus);
    } else {
      setStep(model?.status);
    }

    if (
      isEqual(model?.status, PURCHASING_PLAN_STATUS.APPROVED) ||
      isEqual(model?.status, PURCHASING_PLAN_STATUS.WAITING_FOR_APPROVAL) ||
      model?.user?.id !== profile?.account?.id
    ) {
      setStepChooseSupplier(true);
    }
  }, [
    model?.preCancelStatus,
    model?.status,
    model?.user?.id,
    profile?.account?.id,
  ]);

  useEffect(() => {
    setTabKey(tabKeyParams ? tabKeyParams : "0");
  }, [tabKeyParams]);

  useEffect(() => {
    let breadcrumbName = "";
    if (isEmpty(idDetail)) {
      breadcrumbName = translate("PL.purchasing_plan_title_create");
    } else {
      breadcrumbName = `${translate(
        "report.purchase.purchase_plan_detail.filter.txt_purchase_plan"
      )} ${model?.code}`;
    }

    updateLastBreadcrumb(breadcrumbName);
  }, [model?.code]);

  const valuesContext: PurchasingPlanModel = {
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeListField,
    handleViewPurchaseProposal,
    handleViewOriginPurchaseProposal,
    dispatchModel,
    tabRepositories,
    tabRepositoriesView,
    breadcrumbs,
    translate,
    path: pathname,
    notifyToast,
    handleSave,
    errorsModal,
    setErrorsModal,
    handleValidateCreate,
    loading,
    setLoading,
    isSubmit,
    setIsSubmit,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    handleApplyButtonInConfirmModal,
    modelSelected,
    setModelSelected,
    handleChangeMultipleSelectField,
    handleApprovePurchasingPlan,
    handleApproveCancellationPurchasingPlan,
    isDrawerSupplier,
    isDrawerQuote,
    handleClickDrawerSupplier,
    setIsDrawerSupplier,
    setIsDrawerQuote,
    handleOpenSupplierDrawerByRecord,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    tabKey,
    setTabKey,
    titlePageHeader,
    getPurchasePlanTypeByRouter,
    selectedDetailSupplier,
    selectedDetailSupplierId,
    setSelectedDetailSupplierId,
    purchaseRequest,
    loadingConfirm,
    isOpenModalGetOpinions,
    setIsOpenModalGetOpinions,
    isOpenModalSelectSupplier,
    setIsOpenModalSelectSupplier,
    handleDownloadFile,
    handleUploadFileError,
    approvalSupplier,
    clarificationHistorySupplier,
    setClarificationHistorySupplier,
    getClarificationHistorySupplierList,
    handleInitialPlan,
    handleConfirmPurchasingPlan,
    handleValidateSaveDraft,
    editEvaluation,
    handleConfirmPurchasingPlanUpdateResults,
    selectedEvaluationResult,
    setSelectedEvaluationResult,
    isOpenModalNextRoundBid,
    setIsOpenModalNextRoundBid,
    isOpenModalAddSupplierQuote,
    setIsOpenModalAddSupplierQuote,
    handleApplySupplier,
    isOpenModalSupplierQuote,
    setIsOpenModalSupplierQuote,
    actionQuote,
    setActionQuote,
    isOpenProceedNegotiationModal,
    setIsOpenProceedNegotiationModal,
    setIsOpenPrioritySupplier,
    isOpenPrioritySupplier,
    handleGetListSupplierForNegotiation,
    handleSubmitSelectSupplierForNegotiation,
    handleSubmitConfirmAddingNegotiationRound,
    handleSubmitCreateNextQuotationRound,
    handleSubmitSelectSupplierPriority,
    handleCloseDrawerQuote,
    hasMultiLayerDrawer,
    setHasMultiLayerDrawer,
    handleConfirmSummary,
    handleSummarizeResult,
    stepChooseSupplier,
    setStepChooseSupplier,
    handleWaitingApprovalSelectSupplier,
    handleValidateSaveForm,
  };

  return {
    ...valuesContext,
  };
}
