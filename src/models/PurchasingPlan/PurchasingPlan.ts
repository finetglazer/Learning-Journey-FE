import { ModalTypeError } from "core/models/Common/ErrorModal";
import { Observable } from "rxjs";
/* eslint-disable import/no-unresolved */
import { ArgsProps } from "antd/lib/notification";
import { AxiosError } from "axios";
import { WarrantyCalculationTimeEnum } from "config/const";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
} from "core/services/service-types";
import { Dayjs } from "dayjs";
import { type TFunction } from "i18next";
import { Organization } from "models/Organization";
import { FileInfo, RepoStateDetail } from "models/Payment";
import React, { Dispatch, SetStateAction } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import {
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "./PurchasingPlanConstant";

import { OptionBaseModel } from "models/Common/Common";
import { RequestAttachment } from "models/Contract";
import { Account } from "models/Profile";
import { Supplier } from "models/Supplier/Supplier";
import { NextRoundBidRequestBody } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/ModalNextRoundBid/helper";
import { Field, ObjectField } from "react-3layer-decorators";
import {
  BiddingMethod,
  BiddingProcedure,
  ColumnKey,
  CriteriaType,
  EvaluationCriteriaGroup,
  EvaluationCriteriaSummary,
  EvaluationResult,
  EvaluationRole,
  EvaluationSummary,
  OrganizationGeneral,
  PassFlag,
  PersonInChargeModel,
  RespondStatus,
  TechnicalProfile,
  TenderRequest,
  ViewRole,
} from "./PurchasingPlanBidder";
import { IExchangeRateTable } from "./PurchasingPlanCompetitiveOffer";
import { WorkflowCommand } from "models/WorkflowCommand";

export class SupplierContact extends OptionBaseModel {
  public email?: string;
  public phone?: string;
  public isDefault?: boolean;
}

export class PurchasingPlan extends Model {
  id?: string;
  code?: string;
  name?: string;
  costGroup?: ICostGroup;
  createdDate?: Date;
  createUser?: string;
  createUserName?: string;
  total?: number;
  status?: number;
  canAction?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canApproved?: boolean;
  canCreatePurchaseRequestAdjustment?: boolean;
  canViewApprove?: boolean;
  purchasePlanType?: TYPE_PURCHASING_PLAN;
}

export interface ICostGroup {
  id?: string;
  code?: string;
  name?: string;
}
export interface GoodsServicesCategory {
  id: string;
  code: string;
  name: string;
}

export interface SupplierServicesCategory {
  id: string;
  code: string;
  name: string;
}

export type PurchasingPlanModel = {
  model: PurchasingPlanTypeModel;
  dispatchModel: React.Dispatch<GeneralAction<PurchasingPlanTypeModel>>;
  translate: TFunction<"translation", undefined>;
  title?: string;
  breadcrumbs: { name: string; path?: string }[];
  tabRepositories: RepoStateDetail[];
  purchaseRequest?: IPurchaseRequest;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeBoolField?: (config: ConfigField) => (value: boolean) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField?: (value: PurchasingPlanTypeModel) => void;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  handleViewPurchaseProposal?: () => void;
  handleViewOriginPurchaseProposal?: () => void;
  path?: string;
  notifyToast: (args: ArgsProps) => void;
  errorsModal: ModalTypeError;
  setErrorsModal: Dispatch<SetStateAction<ModalTypeError>>;
  handleSave: (isDraft: boolean, isCreate?: boolean) => void;
  handleSaveAndPreview?: (id: string) => void;
  handleValidateSaveDraft?: (isDraft: boolean) => void;
  handleValidateCreate?: (isDraft: boolean) => void;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  isSubmit: boolean;
  setIsSubmit: React.Dispatch<SetStateAction<boolean>>;
  handleUploadAttachmentError: (error: AxiosError) => void;
  handleDownloadFileAttached: (file?: FileModel) => void;
  mappingStatusToProcess?: (status: number) => number;
  tabRepositoriesView?: RepoStateDetail[];
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal: (
    model: PurchasingPlan,
    data: DataForm,
    callbackFc?: () => void
  ) => void;
  handleChangeMultipleSelectField?: (
    config: ConfigField
  ) => (values: Model[]) => void;
  handleApprovePurchasingPlan: (
    id: string,
    body?: BodyApprovePurchasingPlan
  ) => void;
  handleApproveCancellationPurchasingPlan: (
    id: string,
    callBack?: () => void
  ) => void;
  selectSupplierAction?: (model: PurchasingPlanTypeModel) => void;
  isDrawerSupplier: boolean;
  isDrawerQuote: boolean;
  handleClickDrawerSupplier: (status?: boolean) => void;
  setIsDrawerSupplier: React.Dispatch<SetStateAction<boolean>>;
  setIsDrawerQuote: React.Dispatch<SetStateAction<boolean>>;
  quoteAgainAction?: (model: PurchasingPlanTypeModel) => void;
  handleOpenSupplierDrawerByRecord: (record: SupplierModel) => void;
  isOpenModalQuoteAgain: boolean;
  setIsOpenModalQuoteAgain: React.Dispatch<SetStateAction<boolean>>;
  handleSubmitApproval?: (isDraft: boolean, callbackFc?: () => void) => void;
  handleClickDrawerQuote?: (
    id?: QuotationDetailIdType["quotationId"],
    status?: boolean
  ) => void;
  tabKey: string;
  setTabKey: React.Dispatch<SetStateAction<string>>;
  handleValidateSendApproval?: () => void;
  titlePageHeader?: string;
  getPurchasePlanTypeByRouter?: (
    id?: TYPE_PURCHASING_PLAN
  ) => PurchasePlanTypeRouter;
  loadingConfirm: boolean;
  selectedDetailSupplier?: SupplierModel;
  selectedDetailSupplierId?: string;
  setSelectedDetailSupplierId?: React.Dispatch<React.SetStateAction<string>>;
  isOpenModalGetOpinions?: boolean;
  setIsOpenModalGetOpinions?: React.Dispatch<SetStateAction<boolean>>;
  isOpenModalSelectSupplier?: boolean;
  setIsOpenModalSelectSupplier?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDownloadFile?: (file?: FileModel) => void;
  handleUploadFileError?: (error: AxiosError) => void;
  tempSelectSupplier?: SupplierModel;
  setTempSelectSupplier?: React.Dispatch<React.SetStateAction<SupplierModel>>;
  selectSupplier?: (attachments: RequestAttachment[]) => void;
  columnKey?: ColumnKey | string;
  approvalSupplier?: EvaluationResult;
  clarificationHistorySupplier?: SupplierModel;
  setClarificationHistorySupplier?: React.Dispatch<
    SetStateAction<SupplierModel>
  >;
  getClarificationHistorySupplierList?: (
    filter?: ModelFilter
  ) => Observable<Model[]>;
  handleInitialPlan?: (
    isSaveAndPreview?: boolean,
    callBackFunction?: () => void
  ) => void;
  handleConfirmPurchasingPlan?: (data?: EvaluationSummary[]) => void;
  handleConfirmPurchasingPlanUpdateResults?: (
    data?: EvaluationSummary[]
  ) => void;
  editEvaluation?: (isDraft: boolean) => void;
  updateSelectSupplier?: (isDraft: boolean) => void;
  step?: number;
  handleGatherOpinion?: (value: Dayjs) => void;
  tabKeyParams?: string;
  handleSendApprovePurchasingPlan?: (id: string) => void;
  isOpenModalNextRoundBid?: boolean;
  setIsOpenModalNextRoundBid?: React.Dispatch<SetStateAction<boolean>>;
  handleCreateNextRoundBid?: (data: NextRoundBidRequestBody) => void;
  handleApproveEvaluationPurchasingPlan?: (id: string) => void;
  selectedEvaluationResult?: EvaluationResult;
  setSelectedEvaluationResult?: React.Dispatch<
    React.SetStateAction<EvaluationResult>
  >;
  setIsOpenModalAddSupplierQuote?: React.Dispatch<SetStateAction<boolean>>;
  isOpenModalAddSupplierQuote?: boolean;
  handleApplySupplier?: (
    dataSupplier: SupplierModel[],
    model: PurchasingPlanTypeModel
  ) => void;
  isOpenModalSupplierQuote?: boolean;
  setIsOpenModalSupplierQuote?: React.Dispatch<SetStateAction<boolean>>;
  actionQuote?: SupplierQuotationAction;
  setActionQuote?: Dispatch<SetStateAction<SupplierQuotationAction>>;
  isOpenProceedNegotiationModal?: boolean;
  setIsOpenProceedNegotiationModal?: React.Dispatch<SetStateAction<boolean>>;
  isOpenPrioritySupplier?: boolean;
  setIsOpenPrioritySupplier?: React.Dispatch<SetStateAction<boolean>>;
  handleGetListSupplierForNegotiation?: () => Promise<NegotiationSupplier[]>;
  handleSubmitSelectSupplierForNegotiation?: (list: string[]) => Promise<void>;
  handleSubmitConfirmAddingNegotiationRound?: (
    data: ParamsConfirmCreateRound
  ) => Promise<void>;
  handleSubmitCreateNextQuotationRound?: (
    data: ParamsConfirmCreateRound
  ) => Promise<void>;
  handleSubmitSelectSupplierPriority?: (
    data: ParamsSelectSupplierPrioritize
  ) => Promise<void>;
  handleCloseDrawerQuote?: () => void;
  hasMultiLayerDrawer?: boolean;
  setHasMultiLayerDrawer?: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmSummary?: (isDraft: boolean) => void;
  handleSummarizeResult?: () => void;
  stepChooseSupplier?: boolean;
  setStepChooseSupplier?: React.Dispatch<React.SetStateAction<boolean>>;
  handleWaitingApprovalSelectSupplier?: () => void;
  handleValidateSaveForm?: (isDraft: boolean) => void;
  isModalSendApproveOpen?: boolean;
  setIsModalSendApproveOpen?: React.Dispatch<SetStateAction<boolean>>;
  isTechnicalView?: boolean;
  isFinancialView?: boolean;
  isFinancialViewPass?: boolean;
  isFinancialViewScore?: boolean;
  handleGetClarificationDetail?: any;
  sendClarificationResponse?: any;
  sendClarificationRequest?: any;
  handleApprovedPoint?: (id: string) => void;
  handleRequestReMark?: (id: string) => void;
  handleSendPoint?: (id: string) => void;
  getDataSubmit?: (isDraft: boolean) => any;
  handleGoMaster?: () => void;
};

export interface ProfileEvaluation {
  evaluationRound: EvaluationSummary[];
  quotationRequestId: string;
  suppliers?: SupplierModel[];
}

export type SendResultPayload = {
  id?: string;
  quotationRoundId?: string;
  evaluateRequests:
    | {
        supplierId?: string;
        editedPoint?: number;
        editedPassFlag?: PassFlag;
        points:
          | {
              evaluationCriteriaId?: string;
              point?: number;
              passFlag?: PassFlag;
              note?: string;
            }[];
      }[];
};

export type SendResultBiddingPayload = {
  id?: string;
  quotationRoundId?: string;
  evaluateRequests:
    | {
        supplierId?: string;
        editedTechnicalPoint?: number;
        editedTechnicalPassFlag?: PassFlag;
        editedFinancialPoint?: number;
        editedFinancialPassFlag?: PassFlag;
        editedQuotationPoint?: number;
        editedTotalPoint?: number;
        editedTechnicalNote?: string;
        editedFinancialNote?: string;
        editedQuotationNote?: string;
        editedNote?: string;
        points:
          | {
              evaluationCriteriaId?: string;
              point?: number;
              passFlag?: PassFlag;
              note?: string;
            }[];
      }[];
};

export type SaveDraftSelectSupplierPayload = {
  id: string;
  isDraft: boolean;
  supplierSuppliedGoods: GoodsPrice[];
  supplierClosingRates: IExchangeRateTable[];
};

export class PurchasingPlanTypeModel extends Model {
  public id: string;
  public isDetail: boolean;
  public supplier?: SupplierModel;
  public listSupplier: SupplierModel[] = [];
  public listEmailReceiverInformation?: EmailReceiverInformation[] = [];
  public phoneSupplier: string;
  public emailSupplier: string;
  public nameSupplier: string;
  public name: string;
  public purchasePlanType?: PurchasePlanTypeRouter =
    TYPE_PURCHASING_PLAN_OPTIONS[0];
  public note?: string;
  public estimatedDelivery?: string;
  public reason?: string;
  public startDate?: Dayjs;
  public endDate?: Dayjs;
  public purchaseProposalId?: PurchaseProposalModel;
  public purchaseItems: PurchasePlanGoodsServicesModel[] = [];
  public attachments: FileModel[] = [];
  public supplierAttachments: FileModel[] = [];
  public manufacturers?: OptionModel;
  public remainingRequestQuantity?: number;
  public goodsDescriptions?: string;
  public goodsNote?: string;
  public isLoadDataDetail?: boolean;
  public emailRecipients?: EmailReceiverInformation[] = [];
  public quotationSupplier?: QuotationSupplier[];
  public drawerQuotationDetail?: SupplierQuotationDetail;
  public supplierPurchasePlans: SupplierModel[] = [];
  public personInCharge: PersonInChargeModel[] = [];
  public evaluationSummary: EvaluationSummary[] = [];
  public viewRole?: ViewRole;
  public organizationGeneral?: OrganizationGeneral;
  public tenderRequests?: TenderRequest;
  public evaluationCriteriaSummary?: EvaluationCriteriaSummary;
  public pointRate?: number;
  public criteriaType?: OptionModel;
  public approveUserId?: User;
  public offerRequest?: TenderRequest;
  public canGatherOpinion?: boolean;
  public canWaitingForApprove?: boolean;
  public canSendResult?: boolean;
  public profileEvaluation?: ProfileEvaluation;
  public isView?: boolean;
  public evaluationTeam?: EvaluationTeam[];
  public masterSupplierAddQuote?: MasterSupplierAddQuoteModel;
  public masterProceedNegotiation?: MasterSupplierAddQuoteModel;
  public masterPrioritySupplier?: MasterSupplierAddQuoteModel;
  public isEdit?: boolean;
  public offerSummary?: OfferSummary;
  // Thêm các trường mới để lưu trữ dữ liệu làm rõ hồ sơ
  public clarificationDocuments?: ClarificationRecord[] = [];
  public clarificationProposals?: ClarificationRecord[] = [];
  public actionQuote?: number;
}

export class MasterSupplierAddQuoteModel extends Model {
  bidStartDate?: Dayjs;
  bidEndDate?: Dayjs;
  openBidDate?: Dayjs;
  listSupplierAddQuote?: SupplierModel[];
}

export interface EvaluationTeam {
  id: string | undefined;
  user?: Account;
  userId?: string;
  role?: EvaluationRole;
  position?: OptionNoEnumModel;
  organization?: Organization;
  criteriaCount?: number;
  isMe: boolean;
  name?: string;
  code?: string;
  canView?: boolean;
  isActive?: boolean;
  isDraft?: boolean;
  isApproved?: boolean;
}

export interface BusinessDepartment {
  id?: string;
  name?: string;
  code?: string;
  businessUnitId?: string;
  businessUnitCode?: string;
  businessUnitName?: string;
}

export type OptionModel = {
  id: number;
  name: string;
  code?: string;
};

export interface OptionNoEnumModel {
  id: string;
  name: string;
  code?: string;
}

export interface PurchaseProposalModel {
  canView?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canCreatePurchaseRequestAdjustment?: boolean;
  id?: string;
  code?: string;
  name?: string;
  purchaseProposalName?: string;
  purchaseProposalCode?: string;
  purchaseProposalId?: string;
  originalPurchaseRequestCode?: string;
  originalPurchaseRequestName?: string;
  originalPurchaseRequestId?: string;
  originalPurchaseProposalId?: string;
  createUser?: string;
  createUserName?: string;
  description?: string;
  businessDepartment?: BusinessDepartment;
  organization?: OptionModel;
  createdDate?: Dayjs;
  total?: number;
  isReturn?: boolean;
  status?: number;
  currency?: OptionNoEnumModel;
  position?: OptionNoEnumModel;
  supplierPurchasePlans?: SupplierModel[];
  estimatedDelivery?: string;
  reason?: string;
}

export interface IPurchaseRequest extends Model {
  canView?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canCreatePurchaseRequestAdjustment: boolean;
  id: string;
  code: string;
  name: string;
  purchaseProposalCode: string;
  purchaseProposalName: string;
  createUser: string;
  createUserName: string;
  description: string;
  businessDepartment: BusinessDepartment;
  createdDate: string;
  total: number;
  isReturn: boolean;
  status: number;
  originalPurchaseProposalId: string;
  position: OptionNoEnumModel;
}

export interface PurchasePlanGoodsServicesModel {
  id: string;
  goodsId?: string;
  code: string;
  name: string;
  branchId: string;
  unit: OptionNoEnumModel | OptionNoEnumModel;
  category: OptionNoEnumModel;
  remainingRequestQuantity?: number;
  originalQuantity: number;
  registeredQuantity: number;
  unitId?: string;
  unitPrice: number;
  description?: string;
  note?: string;
  manufacturer?: OptionNoEnumModel;
  childrens?: PurchasePlanGoodsServicesModel[];
  renderId?: string;
  purchaseItemId?: string;
  indexBeforeValidate?: number;
  quantity?: number;
  goodsItems?: GoodsItem[];
  totalConvertedAmount?: number;
  convertTotalAmount?: number;
  [key: string]: any;
}

export interface GoodsServicesCategoryResponseModel {
  items: GoodsServicesCategory[];
}

export type GoodServiceByCategoryModel = {
  id?: string;
  code?: string;
  name?: string;
  goodsServicesCategoryId?: string;
  goodsServicesCategoryCode?: string;
  goodsServicesCategoryName?: string;
  children?: PurchasePlanGoodsServicesModel[];
};

export class SupplierModel extends Model {
  public id?: string;
  public code?: string;
  public isActive?: boolean;
  public name?: string;
  public taxCode?: string;
  public type?: string;
  public address?: string;
  public nameSupplier?: string;
  public quoteEmailId?: string;
  public emailReceiverInfo?: EmailReceiverInformation[];
  public supplierContacts?: SupplierContact[];
  public supplierId?: string;
  public email?: string;

  @Field(String) public quoteEmail?: string;
  @Field(String) public quoteName?: string;
  @Field(String) public phoneNumber?: string;

  @ObjectField(SupplierContact)
  public supplierContactSelected?: SupplierContact;
}

export class SupplierPurchasePlansModel extends Model {
  public id?: string;
  public supplierId?: string;
  public name?: string;
  public taxCode?: string;
  public address?: string;
  public type?: string;
  public quoteEmail?: string;
  public quoteName?: string;
  public phoneNumber?: string;
  public emailRecipients?: EmailReceiverInformation[];
}

export class EmailReceiverInformation extends Model {
  public id?: string;
  public email?: string;
  public name?: string;
}

export interface PurchasingPlanRequest {
  id?: string;
  supplierPurchasePlans?: SupplierRequest[];
  isDraft?: boolean;
  isValidate?: boolean;
}

export interface ParamsApproveModel {
  goodsPrices: goodsPricesSubmitModel[];
  quotationRoundId: string;
  quotationId: string;
  currencyId: string;
  exchangeRate: number;
  purchasePlanId: string;
  supplierPurchasePlanId: string;
  isDraft?: boolean;
}

export interface SupplierRequest {
  supplierId?: string;
  name?: string;
  taxCode?: string;
  address?: string;
  type?: string;
  content?: string;
  quoteEmail?: string;
  quoteName?: string;
  phoneNumber?: string;
  emailRecipients?: EmailReceiverInformation[];
}
export interface ListPurchaseRequest {
  id: string;
  code: string;
  name: string;
}

export interface ListPurchaseRequestModel extends Model {
  contain?: string;
}

export interface ListApprovedSupplier {
  id: string;
  code: string;
  name: string;
}

export interface ListApprovedSupplierModel extends Model {
  contain?: string;
}

export interface User {
  name: string;
  id: string;
  email: string;
}

export interface GoodsItem {
  currency?: string;
  purchaseItemId?: string;
  id?: string;
  goodsId?: string;
  code: string;
  name: string;
  unitId?: string;
  manufacturerId?: string;
  quantity: number;
  description: string | null;
  note: string;
  unit: OptionNoEnumModel;
  taxId?: string;
  taxPercent: number;
  taxAmount: number;
  goodUnit?: string;
  exchangeRate: number;
  branch: OptionNoEnumModel;
  tax?: Tax;
  taxConvertedAmount: number;
  totalAmount: number;
  totalConvertedAmount: number;
  amountBeforeTax: number;
  convertedAmountBeforeTax: number;
  originalTotalAmount?: number;
  otherAmount?: number;
  manufactureYear?: number;
  categoryId?: string;
  category: OptionNoEnumModel;
  supplier?: Supplier;
  unitPrice: number;
  branchId?: string;
  originalQuantity?: number;
  registeredQuantity?: number;
  supplyQuantityUser?: number;
  supplyQuantity?: number;
}

export interface OriginalPurchaseRequest {
  id: string;
  code: string;
  name: string;
  purchaseProposalCode: string;
  purchaseProposalName: string;
  purchaseProposalId: string | null;
  originalPurchaseRequestCode: string;
  originalPurchaseRequestName: string;
  originalPurchaseRequestId: string | null;
  originalPurchaseProposalId: string;
  createUser: string;
  createUserName: string;
  description: string;
  businessDepartment: BusinessDepartment;
  position: OptionNoEnumModel;
  createdDate: string;
  total: number;
  isReturn: boolean;
  status: number;
  currency: Currency;
  estimatedDelivery: string;
  reason: string;
  supplierPurchasePlans: SupplierModel[];
}

export interface PurchasingPlanDetailModel {
  suppliersNegotiation: SupplierModel[];
  evaluationTeam?: EvaluationTeam[];
  code: string;
  id: string;
  name: string;
  purchasePlanType: number;
  note: string;
  estimatedDelivery: string;
  reason: string;
  startDate: string;
  endDate: string;
  originalPurchaseRequestId: string;
  createUser: string;
  user: User;
  goodsItems: GoodsItem[];
  supplierPurchasePlans: SupplierModel[];
  attachments: FileModel[];
  categories: OptionNoEnumModel[];
  isDraft: boolean;
  status: number;
  canCreatePurchaseRequestAdjustment: boolean;
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canAction: boolean;
  canApproved?: boolean;
  canViewApprove: boolean;
  userPosition: OptionNoEnumModel;
  userDepartment: BusinessDepartment[];
  originalPurchaseRequest: OriginalPurchaseRequest;
  preCancelStatus?: number;
  organizationGeneral?: OrganizationGeneral;
  userOrganization?: Organization;
  suppliers?: Supplier[];
  tenderRequests: TenderRequest;
  offerSummary: OfferSummary;
  evaluationTeams?: EvaluationRound[];
  evaluationCriteriaSummary?: EvaluationCriteriaSummary;
  clarifications?: any;
  commands?: WorkflowCommand[];
}

export interface OfferSummary {
  offerRequest: OfferRequest[];
  tenderRequests: OfferRequest[];
  attachments: Attachment[];
}

export interface OfferRequest extends TenderRequest {
  type: number;
  purchasePlanId: string;
  quotationRequestId?: string;
  originalPurchasePlanId: string;
  originalPurchasePlanCode: string;
  approvedDate: string; // ISO format date
  releaseDays: number;
  bidStartDays: number;
  bidEndDays: number;
  openBidDays: number;
  evaluateStartDays: number;
  evaluateEndDays: number;
  releaseDate: string;
  bidStartDate: string;
  bidEndDate: string;
  openBidDate: string;
  evaluateStartDate: string;
  evaluateEndDate: string;
  oldReleaseDate: string;
  oldBidStartDate: string;
  oldBidEndDate: string;
  oldOpenBidDate: string;
  oldEvaluateStartDate: string;
  oldEvaluateEndDate: string;
  roundNumber: number;
  roundStartDate: string;
  roundEndDate: string;
  offerRequestProfiles: TechnicalProfile[];
  evaluationCriteriaGroup: EvaluationCriteriaGroup;
  attachments: Attachment[];
  biddingMethod?: BiddingMethod;
  biddingProcedure?: BiddingProcedure;
}

export type AttachmentFileModel = FileModel & {
  purchasePlanAttachmentType: number;
};

interface Currency {
  id: string;
  name: string;
  code: string;
}
export interface ExtensionOfTime {
  id: string;
  extendTime: string;
}

export interface RequestSendEmail {
  tos: string[];
  ccs: string[];
  subject: string;
  textBody: string;
  attachmentFiles: string[];
  supplierPurchasePlanId: string;
}

export interface ParamsUpdateStatus {
  id: string;
  status: number;
}

export interface RequestNextRoundBid {
  id?: string;
  supplierId?: string;
  name?: string;
  taxCode?: string;
  address?: string;
  type?: string;
  quoteEmail?: string;
  quoteName?: string;
  phoneNumber?: string;
  content?: string;
  emailRecipients?: EmailReceiverInformation[];
  purchasePlanId?: string;
  roundStartDate?: string;
  roundEndDate?: string;
}

export interface WarrantyTerms {
  id: string;
  name: string;
  code: string;
}

export interface WarrantyType {
  id: string;
  name: string;
  code: string;
}

export interface Warranty {
  id?: string;
  name?: string;
  supplier?: Supplier;
  supplierName?: string;
  warrantyTypeId?: string;
  warrantyType?: WarrantyType;
  warrantyPeriod?: string;
  warrantyTermsId?: string;
  warrantyTerms?: WarrantyTerms;
  warrantyCalculationTime?: WarrantyCalculationTimeEnum;
  description?: string;
}

export interface Guarantee {
  id?: string;
  name?: string;
  supplier?: Supplier;
  supplierName?: string;
  guaranteeTypeId?: string;
  guaranteeType?: null | GuaranteeType;
  fromDate?: string;
  toDate?: string;
  amount?: number;
  description?: string;
}

export class GuaranteeInformationModel {
  id?: string;
  guaranteeTypeId?: string;
  guaranteeType?: OptionBaseModel;
  fromDate?: string;
  toDate?: string;
  amount?: number;
  description?: string;
}

export interface CommercialTerm {
  commercialTermsId?: string;
  commercialTerms?: {
    id?: string;
    name?: string;
    code?: string;
  };
  description?: string;
}

export interface ContractTerm {
  id?: string;
  name?: string;
  code?: string;
}

export interface Quotation {
  quotationId?: string;
  code?: string;
  effectivePeriod?: string;
  submissionPeriod?: string;
  exchangeRate?: number;
  currency?: string;
  totalAmount?: number;
  totalConvertedAmount?: number;
  warranties?: Warranty[];
  guarantees?: Guarantee[];
  commercialTerms?: CommercialTerm[];
  contractTerms?: ContractTerm[];
}

export interface QuotationRoundDetail {
  roundNumber?: number;
  code?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  quotations?: Quotation[];
  quotationRequestId?: string;
  isRenew?: boolean;
  supplierPurchasePlanIds?: string[];
  isApproval?: null | boolean;
  total?: number;
}

export interface SupplierPurchasingPlanDetails {
  id?: string;
  supplierId?: string;
  supplierEmail?: string;
  name?: string;
  taxCode?: string;
  address?: null | string;
  type?: string;
  emailSendCount?: number;
  quoteEmail?: null | string;
  quoteName?: null | string;
  phoneNumber?: null | string;
  content?: string;
  emailRecipients?: EmailReceiverInformation[];
  quotationRoundDetail?: QuotationRoundDetail;
}

export type QuotationDetailIdType = {
  purchasePlanId?: string;
  quotationId?: string;
};

export interface SupplierPurchasePlan {
  id: string;
  supplierId?: string;
  supplierEmail?: string;
  name?: string;
  taxCode?: string;
  address?: string;
  type?: string;
  emailSendCount?: number;
  quoteEmail?: string;
  quoteName?: string;
  phoneNumber?: string;
  content?: string;
  emailRecipients?: EmailRecipient[];
  quotationRoundDetail?: QuotationRoundDetail;
}

export interface EmailRecipient {
  email?: string;
  name?: string;
}

export interface GoodsDetail {
  id: string;
  goodsCode?: string;
  name?: string;
  manufacturer?: string;
  unit?: string;
  quantity?: number;
  supplyQuantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  taxType?: string;
  taxName?: string;
  taxRate?: number;
  taxCode?: string;
  taxAmount?: number;
  otherCost?: number;
  totalConvertedAmount?: number;
  currency?: string;
  note?: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
}

export interface Attachment {
  systemFileId: string;
  name?: string;
  contentType?: string;
  size?: number;
  path?: string;
}

export interface Tax {
  id?: string;
  rate?: number;
  name?: string;
}

export interface GuaranteeType {
  id: string;
  name?: string;
  code?: string;
}

export interface CommercialTermDetails {
  id: string;
  name?: string;
  code?: string;
}

export interface ContractPurchasePlan {
  warranties?: Warranty[];
  guarantees?: Guarantee[];
  commercialTerms?: CommercialTerm[];
  contractTerms?: ContractTerm[];
}

export interface AttachmentWithType extends Attachment {
  purchasePlanAttachmentType?: number;
}

export interface SupplierQuotationDetail {
  code?: string;
  supplierPurchasePlans?: SupplierPurchasePlan[];
  goodsItems?: GoodsItem[];
  contractPurchasePlan?: ContractPurchasePlan;
  categories?: OptionNoEnumModel[];
  attachments?: AttachmentWithType[];
}

export interface GoodsPrice extends Model {
  id?: string;
  supplyQuantity?: number;
  taxAmount?: number;
  taxId?: string;
  price?: number;
  otherCost?: number;
  amount?: number | null;
  totalAmount?: number | null;
  totalConvertedAmount?: number | null;
  description?: string;
  note?: string;
  goodsItemId?: string;
  quotationId?: string;
  supplierId?: string;
  buyQuantity?: number;
}

export interface BiddingQuotation {
  quotationRoundId?: string;
  currencyId?: string;
  exchangeRate?: number;
  goodsPrices?: GoodsPrice[];
}

export interface SupplierPurchase {
  id?: string;
  supplierId?: string;
  name?: string;
  taxCode?: string;
  address?: string | null;
  type?: string;
  emailSendCount?: number;
  quoteEmail?: string | null;
  quoteName?: string | null;
  phoneNumber?: string | null;
  content?: string;
  emailRecipients?: string | null;
  quotationRoundDetail?: string | null;
}

export interface QuotationRound extends Model {
  supplierPurchase?: SupplierPurchase;
  quotations?: BiddingQuotation;
  isApproval?: boolean;
  quotationRoundName?: string;
  quotationRoundId?: string;
}

export interface QuotationSupplier extends Model {
  supplierId?: string;
  name?: string;
  quotationRounds?: QuotationRound[];
}

export interface GoodPriceByCategory extends GoodsPrice {
  isTotal?: boolean;
  children?: GoodsPrice[];
}
export interface GroupByCategory {
  id?: string;
  renderId?: string;
  category?: OptionNoEnumModel;
  children?: GoodsPrice[];
  amount?: number;
  totalAmount?: number;
  totalConvertedAmount?: number;
  totalTax?: number;
  totalOtherCost?: number;
}

export type goodsPricesSubmitModel = {
  id?: string;
  supplyQuantity?: number;
  supplyQuantityUser?: number;
  taxAmountQuotation?: number;
  quantity?: number;
  taxAmount?: number;
  taxId?: string;
  price?: number;
  otherCost?: number;
  description?: string;
  goodsItemId?: string;
  goodsId?: string;
  unitId?: string;
  manufacturerId?: string;
  contractGoodsItemId?: string;
};

export class PurchasePlanTypeRouter extends Model {
  id?: TYPE_PURCHASING_PLAN;
  name?: string;
  pathEdit?: string;
  pathView?: string;
  code?: string;

  constructor(data?: PurchasePlanTypeRouter) {
    super();
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.code = data.code;
      this.pathEdit = data.pathEdit;
      this.pathView = data.pathView;
    }
  }
}

export class BodyApprovePurchasingPlan extends Model {
  public goodItems?: GoodsItem;
  public isDraft?: boolean;
  public purchasePlanId?: string;
  public purchasePlanType?: TYPE_PURCHASING_PLAN;
  public supplierPurchasePlans?: SupplierModel[];
}

export class BodyApprovePrincipleSupplier extends Model {
  public purchasePlanId?: string;
  public purchasePlanType?: TYPE_PURCHASING_PLAN;
  public supplierPurchasePlans?: SupplierModel[];
  public isDraft?: boolean;
}

export enum InformationSectionKey {
  REQUEST_GENERAL,
  PURCHASE_REQUIREMENTS_BASED_ON,
  PLAN_SERVICES_INFORMATION,
  INVITATION_BIDDING,
  SUPPLIER_INFORMATION,
  BIDDING_PACKAGE_INFORMATION,
  TECHNICAL_PROFILE,
  FINANCIAL_PROFILE,
  FINANCIAL_EVALUATION_CRITERIA,
  ATTACHMENT,
  COMMENT,
  SELECT_SUPPLIER,
  GOOD_SERVICES,
  EXCHANGE_RATE_TABLE,
  COMMERCIAL_TERMS,
  GUARANTIES_SECTION,
  WARRANTIES_SECTION,
  SELECT_SUPPLIER_INFORMATION,
  DETAIL_SUPPLIER,
  ACTUAL_OFFER_INFORMATION,
  GOOD_SERVICE_QUOTATION,
  GOOD_SERVICE_INFO_CONVERTED,
}

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"
  | "danger"
  | "link"
  | "icon-primary"
  | "icon-secondary"
  | "icon-ghost"
  | "icon-primary-circle";

export type SupplierDataResponse = {
  data: SupplierModel;
};

export type EvaluationResultsBody = {
  id: string;
  criteriaType?: number;
  editedPoint?: number;
  editedConvertPoint?: number;
  editedPassFlag?: PassFlag;
};

export type OpinionTopicFinancial = {
  opinionResponseAttachments: RequestAttachment[];
  responseContent: string;
  responseTime: string;
  respondent: Account;
};

export type HandleChangeAllField = (data: any) => void;

export type ParamsChangeItemTable = {
  fieldName?: string;
  value?: FieldValue;
  objectValue?: FieldValue;
  id?: string;
  fieldNameError?: string;
};

export enum SupplierQuotationAction {
  AddSupplierQuotation = "addSupplierQuotation", //Thêm NCC chào giá
  AddNegotiationRound = "addNegotiationRound", //Thêm vòng đàm phán
  proceedNegotiation = "proceedNegotiation", //Tiến hành đàm phán
  prioritizeSupplier = "prioritizeSupplier", //Ưu tiên NCC
}

export type ParamsSubmitSelectSupplierForNegotiation = {
  purchasePlanId: string;
  supplierPurchasePlanIds: string[];
};

export type NegotiationSupplier = {
  supplierPurchasePlanId: string;
  supplierId: string;
  supplierEmail: string;
  name: string;
  taxCode: string;
  address: string;
  type: string;
  quoteEmail: string;
  quoteName: string;
  phoneNumber: string;
  emailRecipients: EmailRecipient[];
};

export type RenderTabProps = {
  key: string;
  title: string;
  component: React.ReactNode;
};

export interface SupplierRound {
  roundNumber: number;
  startDate: string;
  endDate: string;
  type: string | null;
  supplierPurchasePlans: SupplierPurchasePlan[];
}

export enum NegotiationRoundType {
  CreateRound = 0, // thêm nhà cung cấp chào giá vòng tiếp theo
  NegotiationRound = 1, // thêm vòng đàm phán
}

export type ParamsConfirmAddingNegotiationRound = {
  roundStartDate: string;
  roundEndDate: string;
  supplierIds: string[];
  type: NegotiationRoundType;
};

export type ParamsConfirmCreateRound = {
  purchasePlanId: string;
  roundStartDate: string;
  roundEndDate: string;
  roundOpenDate?: string;
  evaluateStartDate?: string;
  evaluateEndDate?: string;
  suppliers: SupplierQuote[];
  type: NegotiationRoundType;
  releaseDate?: string;
  biddingProcedure?: number;
};

export interface SupplierQuote {
  supplierId: string; // UUID
  quoteEmail: string;
  quoteName: string;
  emailRecipients: EmailRecipient[];
}

export type ParamsSelectSupplierPrioritize = {
  id: string;
  supplierId: string;
  isPriority: boolean;
};

export interface EvaluationRound {
  roundNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  evaluationTeamDetails: EvaluationTeam[];
  type?: number;
  user?: Account;
  role?: EvaluationRole;
  position?: OptionNoEnumModel;
  organization?: Organization;
  criteriaCount?: number;
}

export type ErrorMap = Record<number, Record<string, any>>;

export enum typeNegotiation {
  Bid = 0,
  Negotiate = 1,
}
export const listTypesNegotiation = [
  {
    id: typeNegotiation.Bid,
    name: "CM.round_price_offer",
  },
  {
    id: typeNegotiation.Negotiate,
    name: "CM.round_negotiation",
  },
];

export enum ClarificationRespondStatus {
  Responded, //Đã phản hồi
  NoRespond, //Chưa phản hồi
}

export const listClarificationRespondStatus = [
  {
    id: ClarificationRespondStatus.Responded,
    name: "CM.responded",
  },
  {
    id: ClarificationRespondStatus.NoRespond,
    name: "CM.no_respond",
  },
];

export enum ClarificationDocumentType {
  BID_HISTORY = "BID_HISTORY", // lịch sử làm rõ
  BIDDING_DOCUMENT = "BIDDING_DOCUMENT", // Làm rõ hồ sơ mời thầu
  BID_PROPOSAL = "BID_PROPOSAL", // Làm rõ hồ sơ dự thầu
}

export class NextRoundSupplierModel extends Model {
  @Field(String) public purchasePlanId: string | undefined;
  @Field(String) public releaseDate: Dayjs | undefined;
  @Field(String) public roundStartDate: Dayjs | undefined;
  @Field(String) public roundEndDate: Dayjs | undefined;
  @Field(String) public roundOpenDate: Dayjs | undefined;
  @Field(String) public evaluateStartDate: Dayjs | undefined;
  @Field(String) public evaluateEndDate: Dayjs | undefined;
  @Field(String) public suppliers: Supplier[];
  @Field(String) public type: number | undefined;

  // BiddingProcedure
}

interface UserDetail extends User {
  fullName: string;
  phoneNumber: string | null;
  departmentId: string;
  organizationId: string;
  positionId: string;
  supplierId: string | null;
  position: OptionNoEnumModel;
  organization: Organization;
  userName: string;
  code: string;
}

// Định nghĩa interface cho dữ liệu làm rõ hồ sơ
export interface ClarificationRecord {
  id: string;
  type: ClarificationType; //loai hồ sơ mời thầu hoặc dự thầus
  classification: CriteriaType; // Loại làm rõ
  supplier: SupplierModel; // Nhà cung cấp phản hồi
  supplierId?: string; // ID nhà cung cấp
  createdDate: string; // ngày tạo yêu cầu
  title: string; // tiêu đề yêu cầu
  responseDate: string; // ngày phản hồi
  createUser: string; // Người tạo yêu cầu
  status: RespondStatus; // Trạng thái phản hồi
  user: UserDetail; // Người tạo yêu cầu
  isResponded: boolean; // Trạng thái đã phản hồi hay chưa
  canResponse: boolean;
}

interface Respondent {
  content: string;
  createdDate: string;
  createUser: string;
  attachments: FileInfo;
}

export interface ClarificationDetailModel {
  id: string;
  supplierId: string;
  supplier: SupplierModel;
  classification: ClarificationType;
  title: string;
  content: string;
  createUser: string;
  createdDate: string;
  status: RespondStatus;
  user: UserDetail;
  response?: Respondent;
  attachments: FileInfo[];
  canResponse: boolean;
}

export interface ClarificationResponseBody {
  clarificationRequestId?: string;
  content: string;
  attachments: FileInfo[];
}

export const listCriteriaType = [
  {
    id: CriteriaType.TechnicalCompetence,
    name: "PL.txt_technical",
  },
  {
    id: CriteriaType.Finance,
    name: "PL.txt_financial",
  },
];

export interface ClarificationDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentItem?: ClarificationRecord;
  onSave: (data: ClarificationRecord) => void;
  isView?: boolean;
  suppliersData?: Model[]; // Danh sách nhà cung cấp
  currentUser?: {
    // Thông tin người dùng hiện tại
    name: string;
    id: string;
  };
}

// Định nghĩa kiểu dữ liệu cho các quy tắc validation
export interface TextValidationRule {
  maxLength?: number;
  regex?: RegExp;
  isRequired: boolean;
}

export interface BasicValidationRule {
  isRequired: boolean;
}

export enum ClarificationType {
  BiddingDocument, //Hồ sơ mời thầu
  BidSubmission, //Hồ sơ dự thầu
}

export type ValidationRule = TextValidationRule | BasicValidationRule;

/**
 * Interface mô tả cấu trúc request làm rõ
 */
export interface QuotationClarificationRequest {
  type: ClarificationType;
  quotationRequestId: string;
  supplierId: string;
  classification: CriteriaType;
  title: string;
  content: string;
  attachments: Attachment[];
}
