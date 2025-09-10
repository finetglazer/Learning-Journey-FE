/* eslint-disable import/no-unresolved */
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import {
  APP_OVERVIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
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
import type { Dayjs } from "dayjs";
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
  isNumber,
  isUndefined,
} from "lodash";
import {
  childText,
  ConfirmModalType,
  DEFAULT_ERROR_MODAL_TYPE,
  PURCHASING_PLAN_BIDDING_METHOD,
  PURCHASING_PLAN_BIDDING_PROCEDURE,
  PURCHASING_PLAN_STATUS,
  TYPE_OF_ATTACHMENTS,
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  ClarificationResponseBody,
  ConvertibleGoodsItems,
  CriteriaType,
  EmailRecipient,
  EvaluationCriteriaGroup,
  EvaluationCriteriaGroupClass,
  EvaluationMethod,
  EvaluationResult,
  EvaluationRole,
  EvaluationSummary,
  EvaluationTeam,
  IPurchaseRequest,
  ParamsConfirmCreateRound,
  PersonInChargeModel,
  PurchasePlanGoodsServicesModel,
  PurchasePlanTypeRouter,
  PurchasingPlan,
  PurchasingPlanModel,
  PurchasingPlanRequest,
  PurchasingPlanTypeModel,
  SendResultBiddingPayload,
  SupplierContact,
  SupplierModel,
  SupplierQuotationAction,
  TabKeyBidder,
  TechnicalProfile,
  TenderProfileType,
  TenderRequest,
  TenderRequestType,
  ViewRole,
} from "models/PurchasingPlan";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import {
  EModal,
  LIST_EVALUATION_METHOD,
  LIST_ROLE_EVALUATION,
  listPurchasingPlanStatusEnum,
  PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS,
  TOPIC_TYPE,
} from "config/const";
import { numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { RequestAttachment } from "models/Contract";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useAppSelector } from "rtk/useRedux";
import BidDocumentEvaluationTab from "../PurchasingPlanBiddingView/BidDocumentEvaluationTab/BidDocumentEvaluationTab";
import EvaluationCriterialViewTab from "../PurchasingPlanBiddingView/Components/EvaluationCriterialViewTab/EvaluationCriterialView";
import { NextRoundBidRequestBody } from "../PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/ModalNextRoundBid/helper";
import ReviewSummary from "../PurchasingPlanBiddingView/Components/ReviewSummaryTab/ReviewSummaryTab";
import useRepositoriesStepTabHookView from "../PurchasingPlanBiddingView/Components/useRepositoriesStepTabHookView/useRepositoriesStepTabHookView";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import ClarifyDocumentsTab from "./ClarifyDocumentsTab/ClarifyDocumentsTab";
import styles from "../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/useRepositoriesStepTabHook/useRepositoriesStepTabHook.module.scss";
import { systemConfigurationRepository } from "core/repositories/SystemConfigurationRepository";
import SelectSupplierTab from "./SelectSupplierTab/SelectSupplierTab";
import { GoodServiceByCategory } from "models/PurchaseRequest";

export const PurchasingPlanBiddingDetailHookContext =
  createContext<PurchasingPlanModel>({
    model: new PurchasingPlanTypeModel(),
    dispatchModel: null,
    translate: null,
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
    editEvaluation: null,
    updateSelectSupplier: null,
    handleGatherOpinion: null,
    handleSendApprovePurchasingPlan: null,
    handleCreateNextRoundBid: null,
    handleApproveEvaluationPurchasingPlan: null,
    selectedEvaluationResult: new EvaluationResult(),
    setSelectedEvaluationResult: null,
    isModalSendApproveOpen: null,
    setIsModalSendApproveOpen: null,
    isTechnicalView: false,
    isFinancialView: false,
    isFinancialViewPass: false,
    isFinancialViewScore: false,
    handleValidateSaveForm: null,
    handleGetClarificationDetail: null,
    sendClarificationResponse: null,
    sendClarificationRequest: null,
    handleConfirmSummary: null,
    handleSummarizeResult: null,
    stepChooseSupplier: null,
    setStepChooseSupplier: null,
    handleWaitingApprovalSelectSupplier: null,
    handleCloseDrawerQuote: null,
    hasMultiLayerDrawer: false,
    setHasMultiLayerDrawer: null,
    // Thêm các property mới
    handleApplySupplier: null,
    handleSubmitConfirmAddingNegotiationRound: null,
    handleSubmitCreateNextQuotationRound: null,
    isOpenModalNextRoundBid: false,
    setIsOpenModalNextRoundBid: null,
    isOpenModalAddSupplierQuote: false,
    setIsOpenModalAddSupplierQuote: null,
    isOpenModalSupplierQuote: false,
    setIsOpenModalSupplierQuote: null,
    actionQuote: null,
    setActionQuote: null,
    // Thêm các property mới
    isOpenProceedNegotiationModal: false,
    setIsOpenProceedNegotiationModal: null,
    isOpenPrioritySupplier: false,
    setIsOpenPrioritySupplier: null,
    handleGetListSupplierForNegotiation: null,
    handleSubmitSelectSupplierForNegotiation: null,
    handleSubmitSelectSupplierPriority: null,
    handleRequestReMark: null,
    handleApprovedPoint: null,
    handleSendPoint: null,
  });

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";
const TAB_KEY = "tabKey";

export function usePurchasingPlanBiddingDetailHook(isDetail?: boolean) {
  const location = useLocation();
  const { id: idDetail } = useParams<{ id: string }>();
  const purchaseRequest = location.state as IPurchaseRequest;

  const queryParams = new URLSearchParams(location.search);

  const tabKeyParams = queryParams.get(TAB_KEY);
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : TabKeyBidder.GenerationInfo
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
  const [isModalSendApproveOpen, setIsModalSendApproveOpen] = useState(false);

  const [hasMultiLayerDrawer, setHasMultiLayerDrawer] = useState(false);
  const [selectedEvaluationResult, setSelectedEvaluationResult] =
    useState<EvaluationResult>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModalQuoteAgain, setIsOpenModalQuoteAgain] =
    useState<boolean>(false);

  const [isOpenModalSelectSupplier, setIsOpenModalSelectSupplier] =
    useState<boolean>(false);

  const [isOpenModalGetOpinions, setIsOpenModalGetOpinions] =
    useState<boolean>(false);

  const [isOpenModalNextRoundBid, setIsOpenModalNextRoundBid] =
    useState<boolean>(false);

  const [isOpenModalAddSupplierQuote, setIsOpenModalAddSupplierQuote] =
    useState(false);

  const [isOpenModalSupplierQuote, setIsOpenModalSupplierQuote] =
    useState<boolean>(false);

  const [actionQuote, setActionQuote] = useState<SupplierQuotationAction>(null);

  const [isOpenProceedNegotiationModal, setIsOpenProceedNegotiationModal] =
    useState(false);

  const [isOpenPrioritySupplier, setIsOpenPrioritySupplier] = useState(false);

  const [clarificationHistorySupplier, setClarificationHistorySupplier] =
    useState(null);

  const [tempSelectSupplier, setTempSelectSupplier] =
    useState<SupplierModel>(undefined);

  const [selectedDetailSupplierId, setSelectedDetailSupplierId] = useState("");
  const [step, setStep] = useState<PURCHASING_PLAN_STATUS>(0);
  const pathname = history.location.pathname;
  const profile = useAppSelector((state) => state.profile);

  const handleClickDrawerSupplier = (status?: boolean) => {
    setIsDrawerSupplier(() => {
      const newStatus = status ?? false; // Nếu không truyền `status`, mặc định là `false`
      if (newStatus) {
        setIsDrawerQuote(false);
      }
      return newStatus;
    });
  };

  const handleCloseDrawerQuote = () => {
    setSelectedEvaluationResult(null);
    setIsDrawerQuote(false);
    if (!hasMultiLayerDrawer) document.body.style.overflow = "unset";
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

  const titlePageHeader = useMemo(
    () =>
      isDetail
        ? isEmpty(model?.idDetail)
          ? translate("PL.purchasing_plan_title_create")
          : `${translate("PL.purchase_plan")} ${model?.code}`
        : isEmpty(model?.id)
        ? translate("PL.purchasing_plan_title_create")
        : `${translate("PL.purchase_plan")} ${model?.code}`,
    [isDetail, model?.code, model?.id, model?.idDetail, translate]
  );

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

  const shouldShowApprovalHistoryTab = useMemo(
    () => !isUndefined(idDetail),
    [idDetail]
  );

  const shouldShowBidDocumentEvaluationTab =
    model?.isEvaluator &&
    model?.status &&
    ![
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.DRAFT,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_WAITING_FOR_APPROVE,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED,
    ].includes(model?.status);

  const showStatusSelectSupplier =
    model?.status &&
    [
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.APPROVED,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_APPROVE,
    ].includes(model.status);

  // Đánh giá hồ sơ
  const bidDocumentEvaluationTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.DocumentEvaluation,
        tabTitle: (
          <TabName
            text={translate("PL.document_evaluation")}
            isShowIconError={model.errorTabs?.includes(4)}
          />
        ),
        children: <BidDocumentEvaluationTab />,
      },
    ],
    [model?.errorTabs, translate]
  );

  const shouldShowReviewSummaryTab =
    model?.viewRole !== ViewRole.TechnicalEvaluator;

  const reviewSummaryTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.ReviewSummary,
        tabTitle: (
          <TabName
            text={translate("PL.txt_review_summary")}
            isShowIconError={model.errorTabs?.includes(2)}
          />
        ),
        children: <ReviewSummary />,
      },
    ],
    [model?.errorTabs, translate]
  );

  const selectSupplierTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.SelectSupplier,
        tabTitle: (
          <TabName
            text={translate("PL.select_supplier_step_text")}
            isShowIconError={model.errorTabs?.includes(6)}
          />
        ),
        children: <SelectSupplierTab />,
      },
    ],
    [model?.errorTabs, translate]
  );

  const isViewWaitingApprove =
    queryParams.get("isViewWaitingApprove") === "true";
  const isViewBid = true;

  const criteriaEvaluateTab = useMemo(
    () => [
      {
        tabKey: TabKeyBidder.CriteriaEvaluate,
        tabTitle: (
          <TabName
            text={translate("PL.txt_evaluation_criteria_tab")}
            isShowIconError={model.errorTabs?.includes(9)}
          />
        ),
        children: <EvaluationCriterialViewTab />,
      },
    ],
    [model?.errorTabs, translate]
  );

  /**
   * Kiểm tra xem tab làm rõ hồ sơ có nên được hiển thị không
   * @param status Trạng thái hiện tại của kế hoạch mua sắm
   * @returns true nếu tab làm rõ hồ sơ nên được hiển thị, false nếu không
   */
  const checkShowClarifyDocumentsTab = useCallback(
    (status: PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS): boolean => {
      const SHOW_CLARIFY_DOCUMENTS_STATUSES = [
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BID, // 9 - Chào thầu
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE, // 13 - Chờ mở hồ sơ
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE, // 12 - Mở hồ sơ
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING, // 10 - Chấm thầu
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.END_OF_BIDDING, // 20 - KT chấm thầu
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATE, // 18 - Đàm phán
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING, // 19 - Đang đàm phán
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER, // 7 - Chọn NCC
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_APPROVE, // 1 - Chờ duyệt
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.APPROVED, // 2 - Đã duyệt
        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_PUBLISHED, // 16 - Phát hành HS
      ];

      return SHOW_CLARIFY_DOCUMENTS_STATUSES.includes(status);
    },
    []
  );

  const clarifyDocumentsTab = useMemo(
    () =>
      [
        checkShowClarifyDocumentsTab(model?.status) && {
          tabKey: TabKeyBidder.ClarificationDocuments,
          tabTitle: (
            <TabName
              text={translate("PL.txt_clarify_the_records")}
              isShowIconError={null}
            />
          ),
          children: (
            <div className={styles["scroll"]}>
              <ClarifyDocumentsTab />
            </div>
          ),
        },
      ]?.filter(Boolean),
    [translate, checkShowClarifyDocumentsTab, model?.status]
  );

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

  const handleChangeGoodsServices = useCallback(
    async (purchaseProposalId: string) => {
      const data = await lastValueFrom(
        purchasingPlanRepository.getGoodServiceGroup({
          id: purchaseProposalId,
          purchasePlanId: idDetail,
          pageIndex: 1,
          pageSize: 99999999,
          purchasePlanType: TYPE_PURCHASING_PLAN.BIDDING,
        })
      );
      return flattenPurchaseItems(data?.data?.items);
    },
    [idDetail]
  );

  const flattenPurchaseItems = (
    data: PurchasePlanGoodsServicesModel[]
  ): PurchasePlanGoodsServicesModel[] => {
    const result = data?.reduce((acc, item) => {
      if (item?.childrens) {
        return [
          ...acc,
          ...(item?.childrens?.map((child) => ({
            ...child,
            quantity: child?.remainingRequestQuantity || 0,
          })) ?? []),
        ];
      }
      return [
        ...acc,
        {
          ...item,
          quantity: item?.remainingRequestQuantity || 0,
        },
      ];
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

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeListField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);

  const handleInitTenderRequest = useCallback(
    (data: TenderRequest) => {
      handleChangeSingleField({
        fieldName: "biddingMethodType",
      })(
        PURCHASING_PLAN_BIDDING_METHOD.find(
          (item) => item.id === data.biddingMethod
        )
      );
      handleChangeSingleField({
        fieldName: "biddingProcedureType",
      })(
        PURCHASING_PLAN_BIDDING_PROCEDURE.find(
          (item) => item.id === data.biddingProcedure
        )
      );
    },
    [handleChangeSingleField]
  );

  const isEdit =
    isEqual(
      PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
      location?.pathname?.split("/")?.slice(0, -1)?.join("/")
    ) && !isEmpty(idDetail);

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

  const handleInitialPlan = useCallback(async () => {
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

    Object.assign(model, {
      tenderRequests: {
        purchasePlanId: idDetail,
        originalPurchasePlanId: model?.originalPurchasePlanId,
        releaseDays: null,
        bidStartDays: null,
        bidEndDays: null,
        openBidDays: null,
        evaluateStartDays: null,
        evaluateEndDays: null,
        technicalProfile: [],
        financialProfile: [],
      },
      purchasePlanType: getPurchasePlanTypeByRouter(),
    });

    if (!isEmpty(idDetail)) {
      setLoading(true);
      purchasingPlanRepository
        ?.getPlanDetail(idDetail, isDetail, isViewWaitingApprove, isViewBid)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (data) => {
            if (!data)
              return handleChangeAllField({
                ...model,
                errorTabs: [],
              });

            const evaluationCriteriaGroups =
              data?.evaluationCriteriaSummary?.evaluationCriteriaGroups;

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
              ...data,
              preCancelStatus: data.preCancelStatus,
              isView: true,
              idDetail: idDetail,
              isDetail: isDetail,
              code: data.code,
              status: data.status,
              id: data.id,
              purchasePlanType: getPurchasePlanTypeByRouter(
                data.purchasePlanType
              ),
              startDate: dayjs(data.startDate),
              endDate: dayjs(data.endDate),
              purchaseItems: data.goodsItems.map((item) => {
                if (!item) return null;
                return {
                  ...item,
                  remainingRequestQuantity: item.quantity,
                  branchId: item.branch?.id || "",
                  originalQuantity: item.originalTotalAmount || 0,
                  registeredQuantity: item.registeredQuantity || 0,
                  manufacturer: item.branch,
                  id: item.purchaseItemId,
                };
              }),
              attachments: (data.attachments as AttachmentFileModel[])?.filter(
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
              initUserOrganization: {
                user: profile.account,
                userPosition: profile.position,
                organizationGeneral: profile.organization,
              },
              userOrganization: data.userOrganization,
              tenderRequests: isDetail
                ? data?.offerSummary?.offerRequest
                : data?.offerSummary?.offerRequest?.[0],
              tenderRequestAttachments: data?.offerSummary?.attachments,
              evaluationTeams:
                !isDetail &&
                data?.evaluationTeams &&
                isArray(data?.evaluationTeams)
                  ? data?.evaluationTeams?.[0]?.evaluationTeamDetails?.map(
                      (item: EvaluationTeam) => ({
                        ...item,
                      })
                    )
                  : data?.evaluationTeams,
              evaluationTeam:
                data?.evaluationTeams &&
                isArray(data?.evaluationTeams) &&
                data?.evaluationTeams?.[0]?.evaluationTeamDetails?.map(
                  (item: EvaluationTeam) => ({
                    ...item,
                    role: LIST_ROLE_EVALUATION.find(
                      (role) => role.id === item?.role
                    ),
                  })
                ),
              isEdit: isEdit,
              evaluationCriteriaAttachments:
                data?.evaluationCriteriaSummary?.attachments,
              evaluationPassFail: evaluationPassFail?.evaluationCriterias,
              evaluationScore: evaluationScore?.evaluationCriterias,
              evaluationScoretechnicalWeight: evaluationScore?.technicalWeight,
              evaluationFinancial: evaluationFinancial?.evaluationCriterias,
              evaluationPointRateFinancial:
                evaluationFinancial?.financialWeight,
              clarifications: data?.clarifications || [],
              supplierGenerals: data?.supplierPurchasePlans?.map(
                (item: SupplierModel) => ({
                  ...item,
                  id: item?.supplierId,
                  emailReceiverInfo: item?.emailRecipients?.map(
                    (item: EmailRecipient) => ({
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
              quotationRequestId: data?.tenderRequests?.quotationRequestId,
              evaluationMethodFinancial: LIST_EVALUATION_METHOD.find(
                (item) => item.id === evaluationFinancial?.evaluationMethod
              ),
              masterPrioritySupplier: {
                listSupplierAddQuote: data?.suppliersNegotiation || [],
              },
            };

            handleChangeAllField({
              ...model,
              ...dataPassToDetail,
              errorTabs: [],
            });
            handleInitTenderRequest(data.offerSummary?.offerRequest?.[0]);
          },
        });
    } else {
      // Khi tạo mới, init organizationGeneral với personInChargeInfos default
      const defaultPersonInChargeInfos = createDefaultPersonInChargeFromProfile(
        profile,
        dataConfigSystem
      );
      handleChangeAllField({
        ...model,
        organizationGeneral: {
          ...model.organizationGeneral,
          personInChargeInfos: defaultPersonInChargeInfos,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleChangeAllField,
    idDetail,
    isDetail,
    profile,
    createDefaultPersonInChargeFromProfile,
  ]);

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

  const approvalHistoryTab = useMemo(
    () => [
      {
        tabKey: "7",
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

  const { tabRepositories: baseRepository } = useRepositoriesStepTabHook(
    model?.errorTabs,
    idDetail,
    step
  );

  const { tabRepositoriesView: baseRepositoryView } =
    useRepositoriesStepTabHookView({
      idDetail,
      step,
      pathname,
    });

  const tabRepositories = useMemo(() => {
    return baseRepository
      ? [
          ...baseRepository,
          ...(shouldShowBidDocumentEvaluationTab
            ? bidDocumentEvaluationTab
            : []),
          ...(showStatusSelectSupplier ? selectSupplierTab : []),
          ...clarifyDocumentsTab,
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepository;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseRepository,
    shouldShowBidDocumentEvaluationTab,
    showStatusSelectSupplier,
    bidDocumentEvaluationTab,
    shouldShowApprovalHistoryTab,
    approvalHistoryTab,
    clarifyDocumentsTab,
  ]);

  const tabRepositoriesView = useMemo(() => {
    return baseRepositoryView
      ? [
          ...baseRepositoryView,
          ...criteriaEvaluateTab,
          ...(shouldShowBidDocumentEvaluationTab
            ? bidDocumentEvaluationTab
            : []),
          ...(showStatusSelectSupplier ? selectSupplierTab : []),
          ...(shouldShowReviewSummaryTab ? reviewSummaryTab : []),
          ...clarifyDocumentsTab,
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepositoryView;
  }, [
    baseRepositoryView,
    criteriaEvaluateTab,
    shouldShowBidDocumentEvaluationTab,
    bidDocumentEvaluationTab,
    showStatusSelectSupplier,
    selectSupplierTab,
    shouldShowReviewSummaryTab,
    reviewSummaryTab,
    clarifyDocumentsTab,
    shouldShowApprovalHistoryTab,
    approvalHistoryTab,
  ]);

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
      const locationPathName = model?.id
        ? history.location?.pathname?.split("/")?.slice(0, -1)?.join("/")
        : history.location.pathname;

      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) =>
          el?.pathEdit === locationPathName || el?.pathView === locationPathName
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return new PurchasePlanTypeRouter(itemPurchasePlanType);
    },
    [history.location.pathname, model?.id]
  );

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

  const selectSupplier = useCallback(
    (attachments: RequestAttachment[]) => {
      purchasingPlanRepository
        .selectSupplierForPlan(model?.id, tempSelectSupplier?.id, attachments)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            handleInitialPlan();
          },
          error: (error: AxiosError) => {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          },
        });
    },
    [model?.id, tempSelectSupplier?.id]
  );

  const getDataSubmit = useCallback(
    (isDraft: boolean) => {
      if (!model) return;

      const evaluationPassFailTable = {
        evaluationMethod: EvaluationMethod.PassFail,
        criteriaType: CriteriaType.TechnicalCompetence,
      };

      if (model?.evaluationPassFail?.length > 0) {
        const idFollowAPI =
          model?.evaluationCriteriaSummary?.evaluationCriteriaGroups?.[0]?.id;
        Object.assign(evaluationPassFailTable, {
          evaluationCriterias: model.evaluationPassFail,
          id: idFollowAPI,
        });
      }

      const evaluationScoreTable = {
        evaluationMethod: EvaluationMethod.Scoring,
        criteriaType: CriteriaType.TechnicalCompetence,
        technicalWeight: model?.evaluationScoretechnicalWeight,
      };

      if (model?.evaluationScore?.length > 0) {
        const idFollowAPI =
          model?.evaluationCriteriaSummary?.evaluationCriteriaGroups?.[1]?.id;
        Object.assign(evaluationScoreTable, {
          evaluationCriterias: model.evaluationScore,
          id: idFollowAPI,
        });
      }
      const evaluationFinancialTable = {
        criteriaType: CriteriaType.Finance,
        evaluationMethod:
          model?.evaluationMethodFinancial?.id ?? EvaluationMethod.PassFail,
        financialWeight: model.evaluationPointRateFinancial,
      };
      if (model?.evaluationFinancial?.length > 0) {
        const idFollowAPI =
          model?.evaluationCriteriaSummary?.evaluationCriteriaGroups?.[2]?.id;
        Object.assign(evaluationFinancialTable, {
          evaluationCriterias: model.evaluationFinancial,
          id: idFollowAPI,
        });
      }

      let evaluationRoles = [];
      if (model?.evaluationRoles?.length > 0) {
        evaluationRoles = model?.evaluationRoles?.map(
          (item: EvaluationRole) => {
            let role = item.role;
            if (!isNumber(role)) {
              role = role?.id;
            }
            const id = uuidValidate(item?.id as string) ? item.id : undefined;
            return {
              ...item,
              role,
              id,
            };
          }
        );
      }

      const tenderRequests = { ...model?.tenderRequests };
      if (tenderRequests?.technicalProfile) {
        Object.assign(tenderRequests, {
          technicalProfile: tenderRequests.technicalProfile.map((item) => ({
            ...new TechnicalProfile(item),
            id: uuidValidate(item.id) ? item.id : undefined,
            profileName: isEmpty(item.profileName) ? null : item.profileName,
            quotationRequestId: item.quotationRequestId?.includes(childText)
              ? undefined
              : item.quotationRequestId,
          })),
        });
      }
      if (tenderRequests?.financialProfile) {
        Object.assign(tenderRequests, {
          financialProfile: tenderRequests.financialProfile.map((item) => ({
            ...new TechnicalProfile({
              ...item,
              tenderProfileType: TenderProfileType.FinancialProfile,
            }),
            id: uuidValidate(item.id) ? item.id : undefined,
            quotationRequestId: item.quotationRequestId?.includes(childText)
              ? undefined
              : item.quotationRequestId,
          })),
        });
      }

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

      const goodsItems = getGoodsItems(model.purchaseItems);
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
        evaluationCriteriaSummary: {
          evaluationCriteriaGroups: [
            new EvaluationCriteriaGroupClass(evaluationPassFailTable),
            new EvaluationCriteriaGroupClass(evaluationScoreTable),
            new EvaluationCriteriaGroupClass(evaluationFinancialTable),
          ],
          evaluationCriteriaBaseFlag: new EvaluationCriteriaGroupClass(
            evaluationPassFailTable
          ),
          evaluationCriteriaBasePoint: new EvaluationCriteriaGroupClass(
            evaluationScoreTable
          ),
          evaluationCriteriaFinanceType: new EvaluationCriteriaGroupClass(
            evaluationFinancialTable
          ),
          evaluationRoles,
          attachments: model?.evaluationCriteriaAttachments,
        },
        approveUserId: model.approveUserId?.id,
        supplierGenerals: model?.supplierGenerals?.map(
          (item: SupplierModel) => {
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
          }
        ),
        tenderRequests: {
          ...tenderRequests,
          tenderRequestType: TenderRequestType.Bidding,
          biddingMethod: model.biddingMethodType?.id,
          biddingProcedure: model.biddingProcedureType?.id,
          tenderRequestAttachments: model?.tenderRequestAttachments,
        },
        evaluationTeams: model?.evaluationTeam?.map((item: EvaluationTeam) => {
          return {
            userId: item.user?.id,
            criteriaCount: item.criteriaCount,
            role: item?.role?.id,
            isActive: true,
          };
        }),
        supplierPurchasePlans,
      };
      return dataForm;
    },
    [getGoodsItems, getPurchasePlanTypeByRouter, idDetail, model]
  );

  const handleValidateError = useCallback(
    (error: AxiosError, newModel: PurchasingPlanTypeModel) => {
      setLoading(false);
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
      const dataSubmit = getDataSubmit(isDraft);
      setLoading(true);
      return await handleValidateForm(dataSubmit);
    },
    [getDataSubmit, handleValidateForm]
  );

  // Thêm hàm để lấy danh sách nhà cung cấp cho đàm phán
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
  }, [
    idDetail,
    handleChangeSingleField,
    model?.masterProceedNegotiation,
    notifyToast,
  ]);

  // Thêm hàm để submit select supplier for negotiation
  const handleSubmitSelectSupplierForNegotiation = useCallback(
    async (list: string[]) => {
      setLoading(true);
      const params = {
        purchasePlanId: idDetail,
        supplierPurchasePlanIds: list,
      };
      try {
        await lastValueFrom(
          purchasingPlanRepository.submitSelectSupplierForNegotiation(params)
        );
        setLoading(false);
        handleInitialPlan();
        notifyToast();
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError<any>;
        notifyToast({
          type: "error",
          message: axiosError?.response?.data?.message,
        });
      }
    },
    [idDetail, handleInitialPlan, notifyToast]
  );

  // Thêm hàm để submit select supplier priority
  const handleSubmitSelectSupplierPriority = useCallback(
    async (data: any) => {
      setLoading(true);
      try {
        await lastValueFrom(
          purchasingPlanRepository.selectSupplierForNegotiation(data)
        );
        setLoading(false);
        handleInitialPlan();
        notifyToast();
      } catch (error) {
        setLoading(false);
        handleValidateError(error as AxiosError<any>, model);
      }
    },
    [handleInitialPlan, handleValidateError, model, notifyToast]
  );

  const handleSave = (isDraft: boolean, isCreate?: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    handleSubmitForm(dataSubmit, isCreate);
    setIsSubmit(false);
  };

  const hasKeyWithValue = (obj: object, key: string) =>
    has(obj, key) && !isNil(get(obj, key));

  const handleSubmitForm = useCallback(
    (body: PurchasingPlanRequest, isCreate?: boolean) => {
      setLoading(true);
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      const repoCreateOrEdit = isEmpty(idDetail)
        ? purchasingPlanRepository.createPurchasingPlanRequestDT
        : purchasingPlanRepository.updatePurchasingPlanRequestDT;

      repoCreateOrEdit(body)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            if (body.isDraft || !!isCreate) {
              notifyToast();
              handleGoMaster();
              return;
            }

            if (!body.isDraft && !isCreate) {
              history.push(`${PURCHASING_PLAN_BIDDING_VIEW_ROUTE}/${res?.id}`);
              handleInitialPlan();
              return;
            }
          },
          error: (error: AxiosError) => {
            console.log(
              "object :>> ",
              hasKeyWithValue(error?.response?.data?.errors, "approveUserId")
            );
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
            setIsModalSendApproveOpen(false);
            handleValidateError(error, {
              ...newModel,
              approveUserId: null,
            });
          },
        });
    },
    [
      handleChangeAllField,
      handleGoMaster,
      handleInitialPlan,
      handleValidateError,
      history,
      idDetail,
      model,
      notifyToast,
    ]
  );

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const handleHideModal = (
    shouldGoToMaster: boolean,
    searchParams?: string
  ) => {
    if (shouldGoToMaster) handleGoMaster(searchParams);
    notifyToast();
    setModelSelected(null);
  };

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

  const getEvaluateRequests = (lastedEvaluationRound: EvaluationSummary) => {
    const evaluateRequests: SendResultBiddingPayload["evaluateRequests"] = [];

    lastedEvaluationRound?.evaluationResults?.forEach((evaluationResult) => {
      evaluationResult?.evaluationGroupResult.forEach(
        (evaluationGroupItemResult) => {
          evaluateRequests.push({
            supplierId: evaluationResult?.supplier?.id,
            editedTechnicalPoint: evaluationResult?.summaryTechnicalPoint,
            editedTechnicalPassFlag: evaluationResult?.summaryTechnicalPassFlag,
            editedFinancialPoint: evaluationResult?.summaryFinancialPoint,
            editedFinancialPassFlag: evaluationResult?.summaryFinancialPassFlag,
            editedQuotationPoint: evaluationResult?.summaryQuotationPoint,
            editedTotalPoint: evaluationResult?.summaryPoint,
            editedFinancialNote: evaluationResult?.summaryFinancialNote,
            editedQuotationNote: evaluationResult?.summaryQuotationNote,
            editedNote: evaluationResult?.summaryNote,
            editedTechnicalNote:
              evaluationGroupItemResult?.evaluationMethod ===
              EvaluationMethod.PassFail
                ? evaluationResult?.summaryTechnicalPassFlagNote
                : evaluationResult?.summaryTechnicalPointNote,

            points: evaluationGroupItemResult?.evaluationItemResult.map(
              (itemItem) => {
                return {
                  evaluationCriteriaId: itemItem?.evaluationCriteriaId,
                  point: itemItem?.point,
                  passFlag: itemItem?.passFlag,
                  note: itemItem?.note,
                };
              }
            ),
          });
        }
      );
    });

    return evaluateRequests;
  };

  const getSendResultPayload = useCallback((): SendResultBiddingPayload => {
    const profileEvaluation = model?.profileEvaluation;
    const lastedEvaluationRound = profileEvaluation?.evaluationRound?.[0];

    if (isEmpty(lastedEvaluationRound)) return;

    return {
      id: isEqual(modelSelected?.type, ConfirmModalType.RENEGOTIATION)
        ? idDetail
        : profileEvaluation?.quotationRequestId,
      quotationRoundId: lastedEvaluationRound?.id,
      evaluateRequests: getEvaluateRequests(lastedEvaluationRound),
    };
  }, [idDetail, model?.profileEvaluation, modelSelected?.type]);

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
          purchasingPlanRepository.sendResultBidding(getSendResultPayload()),
      ],
    ]);

    if (!mapActionByModelType.has(modelSelected?.type)) return;
    setLoadingConfirm(true);
    const repoByType = mapActionByModelType.get(modelSelected.type);
    const shouldGoToMaster =
      modelSelected?.type !== ConfirmModalType.SEND_RESULT;

    repoByType()
      .pipe(finalize(() => setLoadingConfirm(false)))
      .subscribe({
        next: () => {
          handleHideModal(
            shouldGoToMaster,
            modelSelected?.type === ConfirmModalType.REJECT ? "tab=2" : ""
          );
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

  const handleApproveEvaluationPurchasingPlan = (id: string) => {
    setLoading(true);
    purchasingPlanRepository
      .approvePurchasingPlanBid(id)
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

  const handleSendApprovePurchasingPlan = (id: string) => {
    setLoading(true);
    purchasingPlanRepository
      .sendApprovePurchasingPlan(id)
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

  const editEvaluation = useCallback(
    (isDraft?: boolean) => {
      const dataEdit = {
        id: model?.profileEvaluation?.quotationRequestId,
        quotationRoundId: model?.evaluationSummary?.[0]?.id,
        evaluateRequests: [] as any,
      };

      model?.evaluationSummary?.forEach((item) => {
        item?.evaluationResults?.forEach((itemChild) => {
          itemChild?.evaluationGroupResult?.forEach((itemChildGroup) => {
            dataEdit.evaluateRequests.push({
              supplierId: itemChild?.supplierId,
              summaryTechnicalPoint: itemChildGroup?.summaryTechnicalPoint,
              summaryTechnicalPassFlag:
                itemChildGroup?.summaryTechnicalPassFlag,
              summaryFinancialPoint: itemChildGroup?.summaryFinancialPoint,
              summaryFinancialPassFlag:
                itemChildGroup?.summaryFinancialPassFlag,
              summaryTechnicalNote: itemChildGroup?.summaryTechnicalNote,
              summaryFinancialNote: itemChildGroup?.summaryFinancialNote,
              summaryQuotationPoint: itemChildGroup?.summaryQuotationPoint,
              summaryQuotationNote: itemChildGroup?.summaryQuotationNote,
              summaryPoint: itemChildGroup?.summaryPoint,
              summaryNote: itemChildGroup?.summaryNote,
            });
          });
        });
      });

      const body = {
        ...dataEdit,
        isDraft: isDraft,
      };

      purchasingPlanRepository
        .postEvaluationConfirmResult(body)
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
    },
    [handleInitialPlan, notifyToast]
  );

  const updateSelectSupplier = useCallback(
    (isDraft?: boolean) => {
      const exchangeRate =
        model?.selectSupplier?.exchangeRates?.[0]?.exchangeRate;
      const goodsGroups =
        model?.selectSupplier?.supplierSelectedGoodsItems?.map(
          (item: GoodServiceByCategory) => {
            return {
              goodsItemIds: [item.id],
              convertibleGoodsItems: item.convertibleGoodsItems.map(
                (el: ConvertibleGoodsItems) => {
                  if (!el) return {};
                  return {
                    id: uuidValidate(el.id) ? el.id : undefined,
                    goodsId: el.goodsId ? el.goodsId : el.id,
                    code: el.code,
                    name: el.name,
                    description: el.description || "",
                    unitId: el.unit?.id,
                    quantity: el.quantity,
                    price: el.price,
                    totalAmountBeforeTax: el.totalAmountBeforeTax,
                    taxId: el.tax?.id,
                    taxAmount: el.taxAmount,
                    totalAmount: el.totalAmount,
                    convertTotalAmount: el.convertTotalAmount,
                    branchId: el.branch?.id,
                    note: el.note,
                  };
                }
              ),
            };
          }
        );
      const supplierPurchasePlanId =
        model?.selectSupplier?.exchangeRates?.[0]?.supplierId;
      const body = {
        goodsGroups,
        supplierPurchasePlanId,
        isDraft,
        exchangeRate,
        purchasePlanId: model?.id,
      };

      purchasingPlanRepository
        .updateSelectSupplier(body)
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
    },
    [
      handleInitialPlan,
      model?.selectSupplier?.exchangeRates,
      model?.selectSupplier?.supplierSelectedGoodsItems,
      notifyToast,
    ]
  );

  const handleConfirmPurchasingPlan = (data: EvaluationSummary[]) => {
    const dataBody = data
      ?.flatMap((item) => item.evaluationResults)
      ?.map((item) => {
        return {
          id: item.id,
          editedPoint: item.evaluationPoint,
          editedConvertPoint: item.convertPoint,
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
          handleInitialPlan();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleGatherOpinion = (value?: Dayjs) => {
    setLoading(true);
    purchasingPlanRepository
      .gatherOpinion({
        quotationRequestId: model?.profileEvaluation?.quotationRequestId,
        gatherOpinionEndDate: dayjs(value).toDate().toISOString(),
      })
      .subscribe({
        next: () => {
          handleGetOpinions(value);
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setLoading(false);
        },
      });
  };

  const handleSummarizeResult = () => {
    const quotationRoundId = {
      quotationRoundId: model?.evaluationSummary?.[0]?.id,
      type: 1, // 0 = CHCT, 1 = Đấu thầu
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
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const handleGetOpinions = (responseDueDate?: Dayjs) => {
    const body = {
      title: translate("PL.txt_modal_title_get_opinions"),
      responseBys: model?.evaluationCriteriaSummary?.evaluationRoles
        ?.filter((item) => Number(item?.role) === 1)
        ?.map((i) => i?.user?.id),
      responseDueDate: responseDueDate
        ? dayjs(responseDueDate).toDate().toISOString()
        : undefined,
      isRequired: true,
      topicId: model?.id,
      topicType: TOPIC_TYPE.TOPIC_FINANCIAL,
    };

    opinionCollectorRepository
      .createOpinionCollector(body)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const handleCreateNextRoundBid = (data: NextRoundBidRequestBody) => {
    purchasingPlanRepository
      .createNextRound(model?.id, data)
      .pipe(finalize(() => setLoading(false)))
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
  };

  const [modal, setModal] = useState<EModal>(null);
  const prevModal = useRef<EModal>(null);

  const handleCreateNextQuotationRound = () => {
    setModal(EModal.CREATE_NEXT_QUOTATION_ROUND);
  };

  const handleConfirmNextNegotiationRound = () => {
    setModal(EModal.CONFIRM_NEXT_NEGOTIATION_ROUND);
  };

  const handleConfirmSelectFinalSupplier = () => {
    setModal(EModal.CONFIRM_SELECT_FINAL_SUPPLIER);
  };

  const handleSelectSupplier = () => {
    prevModal.current = modal;
    setModal(EModal.SELECT_SUPPLIER);
  };

  const handleCloseModal = () => {
    prevModal.current = null;
    setModal(null);
  };

  const handleCancelSelectSupplier = () => {
    setModal(prevModal.current);
    prevModal.current = null;
  };

  const handleSelectedSupplier = (suppliers: SupplierModel[]) => {
    setModal(prevModal.current);
    prevModal.current = null;
  };

  const isTechnicalView = [
    ViewRole.TechnicalLeader,
    ViewRole.TechnicalEvaluator,
  ].includes(model?.viewRole);

  const isFinancialView = [
    ViewRole.FinancialLeader,
    ViewRole.FinancialEvaluator,
  ].includes(model?.viewRole);

  const isFinancialViewPass =
    isFinancialView &&
    model?.profileEvaluation?.evaluationRound?.[0]?.evaluationResults?.[0]
      ?.financialEvaluationMethod === EvaluationMethod.PassFail;
  const isFinancialViewScore =
    isFinancialView &&
    model?.profileEvaluation?.evaluationRound?.[0]?.evaluationResults?.[0]
      ?.financialEvaluationMethod === EvaluationMethod.Scoring;

  const handleGetClarificationDetail = useCallback(async (id: string) => {
    setLoading(true);

    try {
      // Sử dụng lastValueFrom để chuyển Observable thành Promise
      const response = await lastValueFrom(
        purchasingPlanRepository
          .getClarificationDetail(id)
          .pipe(finalize(() => setLoading(false)))
      );

      return response; // Trả về dữ liệu để sử dụng tiếp
    } catch (error) {
      setLoading(false);
      // Xử lý error
      notifyToast({
        type: "error",
        message: error.response?.data?.message,
      });
    }
  }, []);

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

  // Thêm hàm handleSubmitConfirmAddingNegotiationRound
  const handleSubmitConfirmAddingNegotiationRound = async (
    data: ParamsConfirmCreateRound
  ) => {
    setLoading(true);
    // Tạo newModel để truyền vào handleValidateError
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    try {
      const result = await lastValueFrom(
        purchasingPlanRepository.submitConfirmAddingNegotiationRoundBiding(
          data,
          idDetail
        )
      );

      if (result) {
        setLoading(false);
        setIsOpenModalAddSupplierQuote(false);
        handleInitialPlan();
        notifyToast();
      }
    } catch (error) {
      setLoading(false);
      handleValidateError(error as AxiosError<any>, newModel);
    }
  };

  // Thêm hàm handleSubmitCreateNextQuotationRound
  const handleSubmitCreateNextQuotationRound = async (
    data: ParamsConfirmCreateRound
  ) => {
    // Tạo newModel để truyền vào handleValidateError
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    setLoading(true);
    try {
      const result = await lastValueFrom(
        purchasingPlanRepository.submitConfirmAddingNegotiationRoundBiding(
          data,
          idDetail
        )
      );
      if (result) {
        notifyToast();
        setLoading(false);
        setIsOpenModalAddSupplierQuote(false);
        handleInitialPlan();
      }
    } catch (error) {
      setLoading(false);
      handleValidateError(error as AxiosError<any>, newModel);
    }
  };

  const sendClarificationResponse = useCallback(
    async (body: ClarificationResponseBody, id: string) => {
      setLoading(true);

      try {
        // Sử dụng lastValueFrom để chuyển Observable thành Promise
        const result = await lastValueFrom(
          purchasingPlanRepository
            .sendClarificationResponse(body, id)
            .pipe(finalize(() => setLoading(false)))
        );

        notifyToast();
        handleInitialPlan(); // Refresh data after successful response
        return result;
      } catch (error) {
        setLoading(false);
        // Xử lý error
        notifyToast({
          type: "error",
          message: error.response?.data?.message,
        });
      }
    },
    [handleInitialPlan, notifyToast]
  );

  const sendClarificationRequest = useCallback(
    async (data: any) => {
      setLoading(true);

      try {
        // Sử dụng lastValueFrom để chuyển Observable thành Promise
        const result = await lastValueFrom(
          purchasingPlanRepository
            .sendClarificationRequest(data)
            .pipe(finalize(() => setLoading(false)))
        );

        notifyToast();
        handleInitialPlan(); // Refresh data after successful request
        return result;
      } catch (error) {
        setLoading(false);
        // Xử lý error
        notifyToast({
          type: "error",
          message: error.response?.data?.message,
        });
        throw error; // Re-throw error để component có thể xử lý thêm nếu cần
      }
    },
    [handleInitialPlan, notifyToast]
  );

  useEffect(() => {
    handleInitialPlan();
  }, []);

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
  }, [model?.preCancelStatus, model?.status]);

  useEffect(() => {
    if (isEmpty(idDetail) || model?.isSelectPurchaseProposalId) {
      handleChangeGoodsServices(model?.purchaseProposalId?.id).then((res) => {
        const listPurchaseItems = res?.map((item) => ({
          ...item,
          purchaseItemId: item?.id,
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
    const initializeWithPurchaseRequest = async () => {
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

          if (profile) {
            Object.assign(model, {
              user: profile.account,
              userPosition: profile.position,
              userOrganization: [profile.organization],
              organizationGeneral: profile.organization,
            });
          }

          const defaultPersonInChargeInfos =
            createDefaultPersonInChargeFromProfile(profile, dataConfigSystem);

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
          console.error("Error initializing with purchase request:", error);
        }
      }
    };

    initializeWithPurchaseRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    purchaseRequest,
    createDefaultPersonInChargeFromProfile,
    getSystemConfiguration,
  ]);

  const handleApprovedPoint = (id: string) => {
    purchasingPlanRepository.approvedPoint(id).subscribe({
      next: () => {
        notifyToast();
        handleInitialPlan();
      },
      error: handleError,
    });
  };

  const handleRequestReMark = (id: string) => {
    purchasingPlanRepository.requestReMark(id).subscribe({
      next: () => {
        notifyToast();
        handleInitialPlan();
      },
      error: handleError,
    });
  };

  const handleSendPoint = (id: string) => {
    purchasingPlanRepository.sendPoint(id).subscribe({
      next: () => {
        notifyToast();
        handleInitialPlan();
      },
      error: handleError,
    });
  };

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
    tempSelectSupplier,
    setTempSelectSupplier,
    selectSupplier,
    approvalSupplier,
    clarificationHistorySupplier,
    setClarificationHistorySupplier,
    getClarificationHistorySupplierList,
    handleInitialPlan,
    handleConfirmPurchasingPlan,
    editEvaluation,
    updateSelectSupplier,
    handleSummarizeResult,
    handleGatherOpinion,
    isOpenModalNextRoundBid,
    setIsOpenModalNextRoundBid,
    tabKeyParams,
    handleSendApprovePurchasingPlan,
    handleCreateNextRoundBid,
    handleApproveEvaluationPurchasingPlan,
    isModalSendApproveOpen,
    setIsModalSendApproveOpen,
    isTechnicalView,
    isFinancialView,
    isFinancialViewPass,
    isFinancialViewScore,
    handleValidateSaveForm,
    handleGetClarificationDetail,
    sendClarificationResponse,
    sendClarificationRequest,
    hasMultiLayerDrawer,
    setHasMultiLayerDrawer,
    handleCloseDrawerQuote,
    selectedEvaluationResult,
    setSelectedEvaluationResult,
    handleApplySupplier,
    handleSubmitConfirmAddingNegotiationRound,
    handleSubmitCreateNextQuotationRound,
    // Thêm các state và hàm còn thiếu
    isOpenModalAddSupplierQuote,
    setIsOpenModalAddSupplierQuote,
    setActionQuote,
    actionQuote,
    setIsOpenModalSupplierQuote,
    isOpenModalSupplierQuote,
    // Thêm các value mới
    isOpenProceedNegotiationModal,
    setIsOpenProceedNegotiationModal,
    isOpenPrioritySupplier,
    setIsOpenPrioritySupplier,
    handleGetListSupplierForNegotiation,
    handleSubmitSelectSupplierForNegotiation,
    handleSubmitSelectSupplierPriority,
    handleRequestReMark,
    handleApprovedPoint,
    handleSendPoint,
  };

  return {
    modal,
    handleCloseModal,
    handleSelectSupplier,
    handleCancelSelectSupplier,
    handleCreateNextQuotationRound,
    handleConfirmSelectFinalSupplier,
    handleConfirmNextNegotiationRound,
    handleSelectedSupplier,

    ...valuesContext,
  };
}
