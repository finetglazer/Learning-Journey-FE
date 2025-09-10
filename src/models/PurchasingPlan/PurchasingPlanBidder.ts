import { isEmpty } from "lodash";
import { User } from "models/AppUser";
import { Attachment } from "models/Attachment";
import { OptionBaseModel } from "models/Common/Common";
import { ContractTerm, RequestAttachment, Warranty } from "models/Contract";
import { Account } from "models/Profile";
import { Model } from "react-3layer-common";
import { Field, ObjectField, ObjectList } from "react-3layer-decorators";
import { Unit } from "../ContractAdjustment";
import { Organization } from "./../Organization/Organization";
import {
  GoodsItem,
  GuaranteeInformationModel,
  OfferRequest,
  OptionNoEnumModel,
  SupplierModel,
} from "./PurchasingPlan";
import { childText } from "./PurchasingPlanConstant";
import { validate as uuidValidate } from "uuid";
import { GoodService } from "models/Proposal/GoodService";
import { Tax } from "models/Tax";

export enum ColumnKey {
  ID = "id",
  NAME = "name",
  TAX_CODE = "taxCode",
  TAX = "tax",
  AMOUNT_BEFORE_TAX = "amountBeforeTax",
  CONVERT_AMOUNT_BEFORE_TAX = "convertedAmountBeforeTax",
  TAX_AMOUNT = "taxAmount",
  TAX_CONVERT_AMOUNT = "taxConvertedAmount",
  TAX_TYPE = "taxType",
  TYPE = "type",
  CODE = "code",
  ADDRESS = "address",
  PERSON_IN_CHARGE = "personInChargeInfos",
  PIC = "pic",
  PERSON_IN_CHARGE_ID = "picId",
  ORGANIZATION_GENERAL = "organizationGeneral",
  EMAIL = "email",
  PHONE = "phone",
  PHONE_NUMBER = "phoneNumber",
  ROLE = "role",
  SUPPLIER = "supplier",
  POSITION = "position",
  SUPPLIER_NAME = "supplierName",
  SUPPLIER_CODE = "supplierCode",
  SUPPLIER_TYPE = "supplierType",
  ORGANIZATION = "organization",
  RELEASE_DAYS = "releaseDays",
  BID_START_DAYS = "bidStartDays",
  BID_END_DAYS = "bidEndDays",
  OPEN_BID_DAYS = "openBidDays",
  EVALUATE_START_DAYS = "evaluateStartDays",
  EVALUATE_END_DAYS = "evaluateEndDays",
  PROFILE_NAME = "profileName",
  IS_REQUIRED = "isRequired",
  HAS_SOFT_COPY = "hasSoftCopy",
  HAS_HARD_COPY = "hasHardCopy",
  NUMBER_OF_HARD_COPIES = "numberOfHardCopies",
  ATTACHMENTS = "attachments",
  QUOTATION_SUBMISSION_ATTACHMENTS = "quotationSubmissionAttachments",
  TENDER_PROFILE_TYPE = "tenderProfileType",
  POINT = "point",
  NOTE = "note",
  TECHNICAL_PROFILE = "technicalProfile",
  FINANCIAL_PROFILE = "financialProfile",
  TECHNICAL_REQUIREMENT = "technicalRequirement",
  CRITERIA_NOTE = "criteriaNote",
  USER = "user",
  MAX_POINT_SCALE = "maximumPointScale",
  MIN_POINT_SCALE = "minimumPointScale",
  EVALUATION_USER = "evaluationUser",
  INDEX = "index",
  PASS_FLAG = "passFlag",
  OFFER_REQUEST_PROFILES = "offerRequestProfiles",
  POINT_RATE = "pointRate",
  EVALUATION_METHOD = "enumMethod",
  ACTION = "action",
  TENDER_REQUESTS = "tenderRequests",
  TENDER_REQUEST_OLD = "tenderRequestOld",
  OFFER_REQUEST = "offerRequest",
  OFFER_REQUEST_OLD = "offerRequestOld",
  EVALUATION_CRITERIA_GROUP = "evaluationCriteriaGroup",
  IS_IMPERATIVE = "isImperative",
  SUBMITTED_DATE = "submittedDate",
  QUOTATION_ID = "quotationId",
  QUOTATION_CODE = "quotationCode",
  QUOTATION_NAME = "quoteName",
  QUOTATION_RATE = "quoteRate",
  TECHNICAL_WEIGHT = "technicalWeight",
  FINANCIAL_WEIGHT = "financialWeight",
  TECHNICAL_POINT = "technicalPoint",
  FINANCIAL_POINT = "financePoint",
  ORIGINAL_CURRENCY_TOTAL = "originalCurrencyTotal",
  TOTAL_AMOUNT = "totalAmount",
  TOTAL_CONVERT_AMOUNT = "totalConvertedAmount",
  TOTAL_AMOUNT_BEFORE_TAX = "totalAmountBeforeTax",
  CONVERT_TOTAL_AMOUNT = "convertTotalAmount",
  CURRENCY = "currency",
  CURRENCY_CODE = "currencyCode",
  CURRENCY_TYPE = "currencyType",
  CONVERTED_CURRENCY_TOTAL = "totalConvertAmount",
  CLOSING_RATE = "closingRate",
  AMOUNT = "amount",
  DURATION = "duration",
  DESCRIPTION = "description",
  TOTAL = "total",
  GUARANTEE_TYPE = "guaranteeType",
  WARRANTY_TERMS = "warrantyTerms",
  WARRANTY_TYPE = "warrantyType",
  WARRANTY_PERIOD = "warrantyPeriod",
  WARRANTY_CALCULATION_TIME = "warrantyCalculationTime",
  EXCHANGE_RATE = "exchangeRate",
  SHORT_NAME = "shortName",
  QUANTITY = "quantity",
  BUY_QUANTITY = "buyQuantity",
  CRITERIA_COUNT = "criteriaCount",
  CRITERIA = "criteria",
  STATUS = "status",
  IS_ACTIVE = "isActive",
  EVALUATION_TEAM = "evaluationTeam",
  EVALUATION_TEAM_DETAILS = "evaluationTeamDetails",
  QUOTATION_POINT = "quotationPoint",
  UNIT = "unit",
  PRICE = "price",
  BRANCH = "branch",
  UNIT_OF_MEASURE = "unitOfMeasure",
  MANUFACTURER = "manufacturer",
}

export class PersonInChargeModel extends Model {
  public id?: string;
  public picId?: string;
  public personInCharge?: string;
  public pic?: PersonInChargeModel;
  public email?: string;
  public phone?: string;
  public role?: string;
  public name?: string;
  public address?: string;
  public taxCode?: string;

  constructor(data?: PersonInChargeModel) {
    super();
    this.id = "";
    this.personInCharge = "";
    this.email = "";
    this.phone = "";
    this.role = "";
    this.name = "";
    this.address = "";
    this.taxCode = "";
    this.picId = "";

    if (data) {
      Object.assign(this, data);
    }
  }
}

export class BidderInformationModel {
  public organization?: Organization;
  public personInChargeList?: PersonInChargeModel[];
}

export class SupplierEvaluation extends Model {
  id: string;
  name: string;
  code: string;
  point: string;
}

export enum ViewRole {
  TechnicalLeader, // "Tổ trưởng tổ kỹ thuật"
  TechnicalEvaluator, //  "Thành viên tổ kỹ thuật"
  FinancialEvaluator, // "Thành viên tổ tài chính",
  Buyer, // "Buyer",
  Evaluator, //"Người đánh giá",
  None, // "Không có vai trò",
  FinancialLeader, // "Tổ trưởng tổ tài chính",
  ProjectDirector, // "Giám đốc dự án",
}

export enum EvaluationMethod {
  Scoring, // Chấm điểm
  PassFail, // Chấm đạt/Không đạt
}

export enum EvaluationUserRoleEnum {
  TechnicalEvaluator,
  FinancialEvaluator,
  TechnicalLeader,
  FinancialLeader,
  ProjectDirector,
}

export interface EvaluationSummary {
  id: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  viewRole: ViewRole;
  evaluationResults: EvaluationResult[];
  type: RoundTechnicalReviewType;
  isFinancialEvaluationCompleted: boolean;
  isTechnicalEvaluationCompleted: boolean;
  isResultConfirmed?: boolean;
  isResultSummarized?: boolean;
}

export interface Quotation {
  code?: string;
  description?: string;
  note?: string;
  currency?: {
    id?: string;
    code?: string;
    rate?: number;
  };
  supplierInfo?: {
    taxCode: string;
    name: string;
    address: string;
    contactEmail: string;
    quotaionValidity: string;
    deliveryTime: string;
    createdDate: string;
    note: string;
    description: string;
  };
  quotationInfo?: GoodsItem[];
  contractTerms?: ContractTerm[];
  warranties?: Warranty[];
  guarantees?: GuaranteeInformationModel[];
  quotationDocuments?: Attachment[];
}

export class EvaluationResult extends Model {
  id: string;
  canView?: boolean;
  canEvaluate?: boolean;
  canEdit?: boolean;
  supplierId: string;
  supplier: SupplierModel;
  maximumPoint?: number;
  minimumPoint?: number;
  evaluationPoint?: number;
  currency?: string;
  convertPoint?: number;
  quotationCode: string;
  quotationId: string;
  technicalPoint?: number;
  quotationPoint?: number;
  technicalPassFlag?: PassFlag;
  summaryPoint: number;
  totalAmount: number;
  rank?: number;
  status: EvaluationResultsStatus | DocumentEvaluationStatus;
  evaluationGroupResult?: EvaluationGroupResult[];
  isApproval?: boolean;
  purchasePlanAttachments?: RequestAttachment[];
  buyerEvaluationResult?: BuyerEvaluationResult;
  quotationSupplierProfiles?: FinancialProfile[];
  totalConvertAmount: number;
  technicalStatus: number;
  financialStatus: number;
  summaryTechnicalPassFlag: number;
  summaryTechnicalPoint: number;
  summaryFinancialPassFlag: number;
  summaryFinancialPoint: number;
  summaryQuotationPoint: number;
  evaluationMethod: number;
  technicalCompetencyProfiles: TechnicalProfile[];
  financialProfiles: FinancialProfile[];
  quotation: Quotation;
}
export interface BuyerEvaluationResult {
  financialConvertPoint: number;
  financialStatus: EvaluationResultsStatus;
  technicalConvertPoint: number;
  technicalPoint: number;
  technicalStatus: EvaluationResultsStatus;
  totalAmount: number;
  totalConvertPoint: number;
}

export enum EvaluationResultsStatus {
  Reviewing, //  "Đang chấm",
  Reviewed, // "Đã chấm",
  GatherOpinion, //  "Lấy ý kiến",
  WaitingForApproval, // "Chờ duyệt",
  Completed, // "Hoàn thành"
  AwaitingGrading, // "Chờ chấm"
}

export enum DocumentEvaluationStatus {
  Reviewing = 0, //  "Đang chấm"
  Reviewed = 1, // "Đã chấm"
  GatherOpinion = 5, //  "Chờ chấm" (Name matches backend implementation)
}

export interface EvaluationGroupResult {
  id: string;
  evaluationMethod: number;
  pointRate?: number;
  criteriaType: CriteriaType;
  editedPoint?: number;
  startedPoint?: number;
  evaluationItemResult: EvaluationItemResult[];
  passFlag?: PassFlag;
  startPoint?: number;
  editedPassFlag?: PassFlag;
  editedQuotationPoint?: number;
  financialWeight?: number;
  technicalWeight?: number;
  summaryTechnicalPassFlag: PassFlag;
  summaryTechnicalPoint: number;
  summaryFinancialPassFlag: PassFlag;
  summaryFinancialPoint: number;
  summaryQuotationPoint: number;
  summaryQuotationNote: string;
  summaryFinancialNote: string;
  summaryTechnicalNote: string;
  summaryPoint: number;
  summaryNote: string;
}

export enum CriteriaType {
  TechnicalCompetence, // Kỹ thuật
  Finance, // Tài chính
  OfferRequest, // Hồ sơ chào hàng
}

export enum CriteriaPurchasingPlanCompetitiveOfferType {
  EvaluationCriteria = 2,
  EvaluateQuotes = 3,
}

export enum EvaluationCriteriaType {
  TechnicalCriteria,
  FinancialCriteria,
}

export enum EvaluationMethodType {
  PointBased,
  FlagBased,
}

export enum TechnicalCompetenceType {
  TechnicalScore,
  TechnicalCriteriaMet,
}

export interface EvaluationCriteria extends Model {
  criteriaItems?: CriteriaItemModel[];
  id?: string;
  rowKeyId?: string;
  name?: string;
  email?: string;
  criteria?: {
    name?: string;
    technicalRequirement?: string;
    note?: string;
    technicalRequirementSelected?: OptionBaseModel;
    descriptionSelected?: OptionBaseModel;
    maximumPointScaleSelected?: OptionBaseModel;
    minimumPointScaleSelected?: OptionBaseModel;
    maximumPointScales?: OptionBaseModel[];
    minimumPointScales?: OptionBaseModel[];
  };
  technicalRequirement?: string;
  minimumPointScale?: number;
  maximumPointScale?: number;
  maximumPointScales?: OptionBaseModel[];
  minimumPointScales?: OptionBaseModel[];
  user?: Account;
  evaluationUser?: Account[];
  evaluationUserId?: string;
  note?: string;
  pointRate?: number;
  evaluationMethod?: EvaluationMethod;
  isDefault?: boolean;
}

export class EvaluationCriteriaClass implements EvaluationCriteria {
  id?: string;
  name?: string;
  email?: string;
  criteria?: {
    name?: string;
    technicalRequirement?: string;
    note?: string;
  };
  technicalRequirement?: string;
  minimumPointScale?: number;
  maximumPointScale?: number;
  user?: Account;
  evaluationUser?: Account[];
  evaluationUserId?: string;
  note?: string;
  pointRate?: number;
  evaluationMethod?: EvaluationMethod;
  technicalWeight?: number;
  financialWeight?: number;

  constructor(data?: EvaluationCriteria) {
    this.id = undefined;
    this.note = "";
    this.name = "";
    this.email = "";
    this.technicalRequirement = "";
    this.maximumPointScale = undefined;
    this.minimumPointScale = undefined;

    if (!data) return;
    Object.assign(this, data);

    let id = undefined;
    if (data.id) {
      id = data.id.includes(childText) ? undefined : data.id;
    }
    this.id = id;

    if (data.criteria) {
      this.maximumPointScale = data.criteria?.maximumPointScaleSelected?.score;
      this.minimumPointScale = data.criteria?.minimumPointScaleSelected?.score;
    }
  }
}

export interface EvaluationItemResult {
  id?: string;
  evaluationCriteriaId?: string;
  evaluationCriteria?: EvaluationCriteria;
  point?: number;
  isDefaultCriteria?: boolean;
  passFlag?: PassFlag;
  minimumPointScale?: number;
  maximumPointScale?: number;
  evaluationUserId?: string;
  evaluationUser?: Account;
  name?: string;
  isQuotation?: boolean;
  isTotalRow?: boolean; // Mark the total score row
  note?: string;
  summaryNote?: string;
  summaryPassFlag?: PassFlag;
  summaryPoint?: number;
  isDefault?: boolean;
  isNumberScore?: boolean;
}

export interface TechnicalCompetencyProfile {
  name?: string;
  isImperative?: boolean;
  submittedDate?: string;
  attachments?: RequestAttachment[];
  note?: string;
  quotationId?: string;
}
export interface FinancialProfile {
  name?: string;
  isImperative?: boolean;
  submittedDate?: string;
  attachments?: RequestAttachment[];
  note?: string;
  quotationId?: string;
  quotationCode?: string;
}

export enum PassFlag {
  Passed,
  NotPassed,
}

export enum DocumentClarificationType {
  BiddingDocument, // Hồ sơ mời thầu
  BidSubmission, // Hồ sơ dự thầu
}

export enum RespondStatus {
  Responded,
  NoRespond,
}

export enum PurchasePlanAdjustBidRoleList {
  TechnicalTeamLeader,
  FinancialTeamLeader,
  ProjectDirector,
}

export interface EvaluationRoles {
  id?: string;
  user?: {
    name?: string;
    id?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    departmentId?: string;
    organizationId?: string;
    positionId?: string;
  };
  role?: PurchasePlanAdjustBidRoleList;
  roleData?: Model;
  note?: string;
}

export interface SupplierGenerals {
  id?: string;
  supplierId?: string;
  supplier?: {
    id?: string;
    name?: string;
    code?: string;
    taxCode?: string;
    type?: string;
    address?: string;
    agentPerson?: string;
    agentPersonPosition?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    supplierContacts?: {
      id?: string;
      name?: string;
      phone?: string;
      email?: string;
      position?: string;
    }[];
    supplierPayments?: {
      id?: string;
      name?: string;
      code?: string;
      isActive?: boolean;
      currency?: {
        id?: string;
        name?: string;
        code?: string;
        symbol?: string;
      };
      bank?: {
        id?: string;
        name?: string;
        code?: string;
        isActive?: boolean;
        isInternal?: boolean;
      };
      bankAccountNo?: string;
      bankAccountName?: string;
    }[];
  };
  taxCode?: string;
  address?: string;
  personInChargeInfos?: {
    id?: string;
    picId?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
  }[];
  supplierContacts?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    position?: string;
  }[];
  quoteId?: string;
}

export interface EvaluationCriteriaGroup {
  evaluationMethod?: EvaluationMethod | TechnicalCompetenceType;
  pointRate?: number;
  financialWeight?: number;
  technicalWeight?: number;
  criteriaType?: number;
  evaluationCriterias?: EvaluationCriteria[] | EvaluationCriteriaModelBase[];
  note?: string;
  id?: string;
}

export class SupplierContactModel extends OptionBaseModel {
  public email?: string;
  public phone?: string;
  public isDefault?: boolean;
}

export class SupplierPurchasePlanModel extends OptionBaseModel {
  @Field(String) public supplierId?: string;
  @Field(String) public supplierEmail?: string;
  @Field(String) public taxCode?: string;
  @Field(String) public address?: string;
  @Field(String) public type?: string;
  @Field(String) public quoteId?: string;
  @Field(String) public quoteEmail?: string;
  @Field(String) public quoteName?: string;
  @Field(String) public phoneNumber?: string;
  @ObjectList(SupplierContactModel)
  public supplierContacts?: SupplierContactModel[];

  @ObjectField(SupplierContactModel)
  public supplierContactSelected?: SupplierContactModel;
}

export class PurchasePlanBidModel extends Model {
  approveUser: Account;
  id?: string;
  originalPurchasePlanId?: string;
  code?: string;
  name?: string;
  purchasePlanType?: number;
  originalPurchaseRequestId?: string;
  purchaseRequestCode?: string;
  purchaseRequestName?: string;
  purchaseProposalCode?: string;
  purchaseProposalName?: string;
  tenderPackageCode?: string;
  tenderPackageName?: string;
  tenderPackageCreatedBy?: string;
  tenderRequests?: TenderRequest;
  supplierGenerals?: SupplierGenerals[];
  @ObjectList(SupplierPurchasePlanModel)
  public supplierPurchasePlans?: SupplierPurchasePlanModel[];
  evaluationCriteriaSummary?: {
    evaluationCriteriaGroups?: EvaluationCriteriaGroup[];
    evaluationRoles?: EvaluationRoles[];
    attachments?: {
      systemFileId?: string;
      name?: string;
      contentType?: string;
      size?: number;
      path?: string;
    }[];
  };
  isDraft?: boolean;
  offerRequest?: OfferRequest;
}

export interface OrganizationGeneral {
  organizationId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  personInChargeInfos?: PersonInChargeModel[];
  organization?: Organization;
}

export enum BiddingMethod {
  OpenTender = 1,
  RestrictedTender,
}

export enum BiddingProcedure {
  OneTenderDocument = 1,
  TwoTenderDocument,
}

export enum TenderProfileType {
  TechnicalProfile, // Yêu cầu hồ sơ kỹ thuật
  FinancialProfile, // Yêu cầu hồ sơ tài chính
  OfferRequestProfile, // Yêu cầu hồ sơ chào hàng
}

export enum TenderRequestType {
  Bidding = 1, // Đấu thầu
  CompetitiveOffer = 2, // Chào hàng cạnh tranh,
}

export enum PurchasePlanType {
  Original,
  Adjustment,
}

export class TechnicalProfile extends Model {
  id?: string;
  profileName?: string;
  isRequired?: boolean;
  hasSoftCopy?: boolean;
  hasHardCopy?: boolean;
  note?: string;
  quotationRequestId?: string;
  numberOfHardCopies?: number;
  attachments?: {
    systemFileId?: string;
    name?: string;
    contentType?: string;
    size?: number;
    path?: string;
  }[];
  tenderProfileType?: TenderProfileType;

  constructor(data?: TechnicalProfile) {
    super();

    this.id = "0";
    this.quotationRequestId = null;
    this.profileName = "";
    this.isRequired = false;
    this.hasSoftCopy = false;
    this.hasHardCopy = false;
    this.note = "";
    this.numberOfHardCopies = null;
    this.attachments = [];
    this.tenderProfileType = TenderProfileType.TechnicalProfile;

    if (!data) return;
    Object.assign(this, {
      ...data,
      [ColumnKey.NUMBER_OF_HARD_COPIES]: data.hasHardCopy
        ? data[ColumnKey.NUMBER_OF_HARD_COPIES]
        : null,
    });
  }
}

export interface TenderRequest {
  quotationRequestId?: string;
  purchasePlanId?: string;
  originalPurchasePlanId?: string;
  approvedDate?: string;
  releaseDays?: number;
  bidStartDays?: number;
  bidEndDays?: number;
  openBidDays?: number;
  evaluateStartDays?: number;
  evaluateEndDays?: number;
  releaseDate?: string;
  bidStartDate?: string;
  bidEndDate?: string;
  openBidDate?: string;
  evaluateStartDate?: string;
  evaluateEndDate?: string;
  biddingMethod?: BiddingMethod;
  biddingProcedure?: BiddingProcedure;
  tenderRequestType?: TenderRequestType | number;
  technicalProfile?: TechnicalProfile[];
  financialProfile?: TechnicalProfile[];
  offerRequestProfiles?: TechnicalProfile[];
  attachments?: {
    systemFileId?: string;
    name?: string;
    contentType?: string;
    size?: number;
    path?: string;
  }[];
  offerRequest?: EvaluationCriteriaSummary;
  evaluationCriteriaGroup?: EvaluationCriteriaGroup;
  tenderRequestAttachments?: {
    systemFileId?: string;
    name?: string;
    contentType?: string;
    size?: number;
    path?: string;
  }[];
  oldReleaseDate?: string;
  oldBidEndDate?: string;
  oldBidStartDate?: string;
  oldEvaluateEndDate?: string;
  oldEvaluateStartDate?: string;
  oldOpenBidDate?: string;
}

export function getValueInModel<K extends keyof Model>(
  model: Model,
  key: K
): Model[K] {
  return model?.[key];
}

export class ClarificationRequestModel extends Model {}

export enum RoundTechnicalReviewType {
  Bid,
  Negotiate,
}

export enum TabKeyBidder {
  GenerationInfo = "0",
  SupplierInfo = "1",
  EvaluationTeamInformation = "2",
  RequestForBid = "3",
  DocumentEvaluation = "4",
  ReviewSummary = "5",
  SelectSupplier = "6",
  ApprovalHistory = "7",
  ClarificationDocuments = "8",
  CriteriaEvaluate = "9",
}

export class EditEvaluateRequest extends Model {
  evaluationCriteriaId?: string;
  quotationRoundId?: string;
  supplierId?: string;
  point?: number;
  passFlag?: number;
}

export class EditEvaluation extends Model {
  id?: string;
  evaluateRequests?: EditEvaluateRequest[];
}

export class SendApproveAdjust extends Model {
  user?: Account;
  reasonForAdjustment: string;
}

export interface EvaluationCriteriaSummary {
  evaluationCriteriaGroups?: EvaluationCriteriaGroup[];
  evaluationCriteriaGroup?: EvaluationCriteriaGroup;
  evaluationRoles?: EvaluationRole[];
  attachments?: Attachment[];
}

export interface EvaluationRole {
  id?: string | EvaluationUserRoleEnum;
  user?: User;
  role?: Model;
  name?: string;
  note?: string;
}

export class EvaluationCriteriaGroupClass implements EvaluationCriteriaGroup {
  evaluationMethod?: EvaluationMethod | TechnicalCompetenceType;
  pointRate?: number;
  criteriaType?: CriteriaType;
  evaluationCriterias?: EvaluationCriteria[];
  note?: string;
  id?: string;
  criteria?: EvaluationCriteriaGroup;

  constructor(data?: EvaluationCriteriaGroup) {
    this.id = undefined;
    this.evaluationMethod = EvaluationMethod.PassFail;
    this.pointRate = undefined;
    this.criteriaType = CriteriaType.TechnicalCompetence;
    this.evaluationCriterias = [];
    this.note = "";

    if (!data) return;
    Object.assign(this, data);
    this.id = uuidValidate(data.id) ? data.id : undefined;
    if (!isEmpty(data.evaluationCriterias)) {
      this.evaluationCriterias = data.evaluationCriterias?.map(
        (item: EvaluationCriteria) => new EvaluationCriteriaClass(item)
      );
    }
  }
}

export class LastRoundSupplier extends Model {
  id?: string;
  name?: string;
  taxCode?: string;
  evaluationPoint?: number;
  convertPoint?: number;
}

export class BidderInformationType extends Model {
  id: string | number;
  name: string;
  taxCode: string;
  code?: string;
  address: string;
  personInChargeInfos?: PersonInChargeModel[];
  email?: string;
  phoneNumber?: string;
  role?: string;
  pic?: PersonInChargeModel;
  position?: Unit;
}

export class PointScaleModel extends OptionBaseModel {
  @Field(Number)
  public score: number;
}

export class MaximumPointScalesModel extends PointScaleModel {
  @ObjectList(PointScaleModel)
  minimumPointScales: PointScaleModel[];
  @Field(String)
  public evaluationUserId: string;
}

export class CriteriaItemModel extends Model {
  @Field(String)
  public technicalRequirement: string;
  @ObjectList(MaximumPointScalesModel)
  maximumPointScales: MaximumPointScalesModel[];
}

export class EvaluationCriteriaModel extends OptionBaseModel {
  @Field(String)
  public note?: string;

  @ObjectList(CriteriaItemModel)
  criteriaItems: CriteriaItemModel[];
  @Field(Boolean) public isDefault: boolean;
}

export class EvaluationCriteriaModelBase extends OptionBaseModel {
  @Field(String) public evaluationCriteriaId?: string;
  @Field(Boolean) public isDefault?: boolean;
  @Field(Number) public minimumPointScale?: number;
  @Field(Number) public maximumPointScale?: number;
  @Field(String) public note?: string;
  @Field(Number) public orderNumber?: number;
  @Field(String) public technicalRequirement?: string;
  @ObjectField(OptionBaseModel) public user?: OptionBaseModel;
}

export class ConvertibleGoodsItems extends GoodService {
  branch?: OptionNoEnumModel;
  category?: OptionNoEnumModel;
  categoryId?: string;
  convertTotalAmount?: string;
  convertibleGoodsItems?: string;
  description?: string;
  goodsId?: string;
  manufacturerId?: string;
  note?: string;
  order?: string;
  price?: number;
  quantity?: number;
  quotationNote?: string;
  tax?: Tax;
  taxAmount?: number;
  taxId?: string;
  totalAmount?: number;
  totalAmountBeforeTax?: number;
  unit?: OptionNoEnumModel;
  unitId?: string;

  constructor(data?: ConvertibleGoodsItems) {
    super();
    this.id = undefined;

    if (!data) return;
    Object.assign(this, data);
    this.id = uuidValidate(data.id) ? data.id : undefined;
  }
}
