import { ArgsProps } from "antd/lib/notification";
import { AxiosError } from "axios";
import { UserModel } from "components/Comment/Comment.model";
import { BreadcrumbInterface } from "components/PageHeader/PageHeader";
import {
  listPaymentMilestoneType,
  listTypeSuggestion,
  listWarrantyCalculationTime,
} from "config/const";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
} from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import type { TFunction } from "i18next";
import { BusinessDepartmentModel } from "models/Budget/Budget";
import { FileModelExtend } from "models/OpinionCollector";
import { Organization } from "models/Organization";
import { TYPE_OF_PROPOSAL } from "models/Payment";
import { Account, BusinessBranch, BusinessDepartment } from "models/Profile";
import { GoodService } from "models/Proposal/GoodService";
import { Currency } from "models/PurchaseRequest";
import { Supplier } from "models/Supplier/Supplier";
import { ConfirmModalType } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleMaster/ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";
import { ErrorModalType } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { Dispatch, SetStateAction } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { AppendixStatus } from "./ContractFilter";

export class Base extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

export class ManageSupplier extends Model {
  supplierType: {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
  };
  taxCode: string;
  email: string;
  manageStatus: number;
  createdDate: string;
  id: string;
  code: string;
  name: string;
}

export class Contract extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  code?: string;

  @Field(String)
  managerName?: string;

  @Field(String)
  managerEmail?: string;

  @Field(String)
  effectiveDate?: Dayjs | string;

  @Field(String)
  endDate?: Dayjs | string;

  @Field(String)
  contractNo?: string;

  @Field(String)
  contractType?: string;

  @Field(String)
  name?: string;

  @Field(String)
  supplierId?: string;

  @Field(String)
  supplierName?: string;

  @Field(String)
  supplierTaxCode?: string;

  @Field(String)
  createUserName?: string;

  @Field(Number)
  total?: number;

  @Field(String)
  costGroup?: string;

  @Field(Number)
  status?: number;

  contractRequestType?: ContractAddType;
}

export class PaymentSchedules extends Model {
  public id?: string;
  public percent?: number;
  public description?: string;
  public suggestionType?: (typeof listTypeSuggestion)[0];
  public expectedValue?: number;
  public paymentBatch?: string;
  public paymentDay?: SelectModel;
  public months?: SelectModel[];
  public paymentMilestoneType?: (typeof listPaymentMilestoneType)[0];
  public amount?: number;
  public paymentCondition?: string;
  public referenceDocument?: string;
  public paymentTerm?: string;
}

export interface SelectModel {
  id?: string;
  name?: string;
  code?: string;
}

export enum ActiveTabKeys {
  GenerationInfo = "0",
  ContractTerms = "1",
  commercialTerms = "2",
  PaymentSchedule = "3",
  Warranty = "4",
  ContractFile = "5",
  ApprovalHistory = "6",
  RelatedTickets = "7",
  ContractAppendix = "8",
  AdjustmentHistory = "9",
}

export enum CONTRACT_STATUS {
  DRAFT = 0,
  IN_PROGRESS = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCEL = 4,
  CLOSED = 5,
}

export type ContractDetailModel = {
  canSetContractTerms: React.MutableRefObject<boolean>;
  activeTabKey?: ActiveTabKeys;
  setActiveTabKey?: Dispatch<SetStateAction<ActiveTabKeys>>;
  loading?: boolean;
  setLoading?: React.Dispatch<SetStateAction<boolean>>;
  breadcrumbs?: BreadcrumbInterface[];
  principleTitle?: string;
  notifyToast: (args: ArgsProps) => void;
  model: ContractDetailFormModel;
  dispatchModel: React.Dispatch<GeneralAction<ContractDetailFormModel>>;
  handleSave?: (value?: { isDraft?: boolean; callbackFc?: () => void }) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  translate?: TFunction<"translation", undefined>;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  isOpenGoodsServicesModal: boolean;
  setIsOpenGoodsServicesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGoodsServices: GoodService[];
  setSelectedGoodsServices: React.Dispatch<React.SetStateAction<GoodService[]>>;
  selectedDetailGoodsServices: ContractGoodsServices;
  selectedDetailGoodsServicesId: string;
  setSelectedDetailGoodsServicesId: React.Dispatch<
    React.SetStateAction<string>
  >;
  selectedUserEmailWaitForReceiveGoods: string;
  setSelectedUserEmailWaitForReceiveGoods: React.Dispatch<
    React.SetStateAction<string>
  >;
  handleChangeBoolField?: (config: ConfigField) => (value: boolean) => void;
  getBankExchangeRate?: (code: string, model: ContractDetailFormModel) => void;
  errorsModal?: ErrorModalType;
  setErrorsModal: Dispatch<SetStateAction<ErrorModalType>>;
  titlePageHeader?: string;
  contractId?: string;
  handleUploadAttachmentError?: (error: unknown) => void;
  handleDownloadFileAttached?: (file?: FileModelExtend) => void;
  isDetail?: boolean;
  handleChangeAllField: (data: ContractDetailFormModel) => void;
  setIsOpenModalPaymentSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenModalPaymentSchedule: boolean;
  setRecordEditPaymentSchedule: React.Dispatch<
    React.SetStateAction<PaymentSchedules>
  >;
  recordEditPaymentSchedule: PaymentSchedules;
  modalConfirm?: ModelConfirmType | null;
  handleUpdateTypeModal: (type: ModelConfirmType | null) => void;
  listReceiverInfos: ContractReceiverInfos[];
  setListReceiverInfos: Dispatch<SetStateAction<ContractReceiverInfos[]>>;
  handleDownloadFile?: (file?: FileModel) => void;
  handleUploadFileError?: (error: AxiosError) => void;
  getBusinessUnitByOrganization?: (id: string) => void;
  getLinkRouter?: (type: ContractAddType, action?: ActionRowType) => void;
  currentContractRequestType?: ContractAddType;
  handleUploadFileToContract: (file: ContractFile) => void;
  setCanChangeExchangeRateByCurrency?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  inputNumberType?: "LONG" | "DECIMAL";
  selectedModal: SelectedModal | null;
  setSelectedModal: React.Dispatch<React.SetStateAction<SelectedModal | null>>;
  handleApplyButtonInConfirmModal: (model: Contract, reason: string) => void;
  loadingModal?: boolean;
  handleInitDataCreate?: () => void;
};

export interface SelectedModal {
  type: ConfirmModalType;
  model: Contract;
  errorMessage?: string;
}

export interface PurchaseRequestItemModel {
  code?: string;
  id?: string;
  name?: string;
}

export enum ShoppingMethod {
  ASSIGN_WARRANTY = 1,
  CONTRACT_FOLLOW = 2,
  COMPETITIVE_OFFERING = 3,
  BIDDING = 4,
}

export enum ColumnKey {
  ID = "id",
  CODE = "code",
  FORM = "form",
  NAME = "name",
  PURCHASE_PLAN_TYPE = "purchasePlanType",
  CREATE_DATE = "createdDate",
  UPDATE_DATE = "updatedDate",
  CREATE_PERSON = "createUser",
  APPROVE_PERSON = "approveUser",
  CREATE_UNIT = "businessDepartment",
  SUPPLIER = "suppliers",
  TICKET_TYPE = "ticketType",
  CREATE_BY = "createdBy",
  SHIPPING_DATE = "shippingDate",
  ADDRESS = "address",
  NOTE = "note",
  ORGANIZATION = "organization",
  COSTGROUP = "costGroup",
}

export enum ModelConfirmType {
  RETURN = "return",
  REJECT = "reject",
  CLOSE = "close",
  CANCEL = "cancel",
  DELETE = "delete",
  APPROVE = "approve",
}

export class ContractPlanModal extends Model {
  public code?: string;
  public name?: string;
  public purchasePlanType?: ShoppingMethod;
  public businessDepartment?: BusinessDepartmentModel;
  public createdDate?: Date;
}

export class ContractManagerModel extends Model {
  public code?: string;
  public userName?: string;
  public fullName?: string;
  public email?: string;
  public businessDepartment?: BusinessDepartmentModel;
  public phoneNumber?: string;
}
export interface ReceiverInfo {
  shippingDate?: string;
  quantity?: number;
  organizationId?: string;
  organization?: Organization;
  person?: string;
  personObj?: UserModel;
  phone?: string;
  address?: string;
  note?: string;
}

export interface ContractGoodsItem {
  goodsId?: string;
  branchId?: string;
  unitId?: string;
  description?: string;
  receivedDate?: string;
  quantity?: number;
  unitPrice?: number;
  taxId?: string;
  taxPercent?: number;
  taxAmount?: number;
  totalAmount?: number;
  otherAmount?: number;
  manufactureYear?: number;
  note?: string;
  receiverInfos?: ReceiverInfo[];
}

export enum ReceivedType {
  SingleReceiver,
  MultipleReceivers,
}

export enum ContractClassificationType {
  Contract,
  PrincipleContract,
}

export interface ContractFile {
  id?: string;
  attachments?: RequestAttachment[];
  note?: string;
  uploadedDate?: string;
}

export class ContractDetailFormModel extends Model {
  public attachments?: RequestAttachment[];
  public name?: string;
  public contractNo?: string;
  public contractTypeId?: string;
  public rate?: number;
  public contractFormId?: string;
  public isDraft?: boolean;
  public contractTicketType?: number;
  public effectiveDate?: Dayjs | string;
  public endDate?: Dayjs | string;
  public organizationId?: string;
  public manager?: ContractManagerModel;
  public legalEntityId?: string;
  public receivedType?: ReceivedType;
  public isContractTermination?: boolean;
  public contractSupplier?: ContractSupplierModel;
  public originalPurchasePlanId?: string;
  public contractGoodsItems?: ContractGoodsItem[];
  public contractGoodsServicesList?: ContractGoodsServices[];
  public paymentSchedules?: PaymentSchedules[];
  public appendixs?: ContractAppendix[];
  public contractFiles?: ContractFile[];
  public contractFileHistories?: ContractFile[];
  public isEmpower?: boolean;
  public canReturn?: boolean;
  public canApprove?: boolean;
  public canDecline?: boolean;
  public canDelete?: boolean;
  public canEdit?: boolean;
  public canCancel?: boolean;
  public canCloseRequest?: boolean;
  public isSuggestive?: boolean;
  public paymentTrackings?: PaymentTrackings[];
  public status?: number;
  public isDetail?: boolean;
  public warranties?: Warranty[];
  public guarantees?: Guarantee[];
  public ticketRelated?: TicketRelated;
  public contractTerms?: ContractTerms[];
  public commercialTerms?: CommercialTerms[];
  public totalAmountContractGoodsServicesList?: number;
  public isPrinciple?: boolean;
  public applicableOrganization?: SelectModel;
  public applicableUnit?: SelectModel;
  public applicableBranch?: SelectModel;
  public contractAppendixs?: ContractAppendix[];
  public adjustmentContracts?: AdjustmentContract[];
}

export class Warranty extends Model {
  public name?: string;
  public warrantyTypeId?: string;
  public warrantyType?: SelectModel;
  public warrantyPeriod?: number;
  public warrantyTermsId?: string;
  public warrantyTerms?: SelectModel;
  public warrantyCalculationTime?: (typeof listWarrantyCalculationTime)[0];
  public description?: string;
}

export class WarrantyRequestBody {
  public warrantyTypeId?: string;
  public warrantyType?: SelectModel;
  public warrantyPeriod?: number;
  public warrantyTermsId?: string;
  public warrantyTerms?: SelectModel;
  public warrantyCalculationTime?: number;
  public description?: string;
}

export class Guarantee extends Model {
  public guaranteeTypeId: string;
  public guaranteeType: SelectModel;
  public fromDate: string;
  public toDate: string;
  public amount: number;
  public description: string;
}

export interface TicketRelated {
  purchasePlanRelateds: PurchasePlanRelated[];
  waitingReceipts: WaitingReceipt[];
  ticketReceipts: TicketReceipt[];
  ticketAcceptances: TicketAcceptance[];
}

export class PurchasePlanRelated extends Model {
  code: string;
  ticketType: TicketType;
  ticketTypeNumber: TicketTypeNumber;
  createdBy: string;
  createdName: string;
  createdDate: string;
  name: string;
  costGroup: string;
  costType: string;
}

export class ContractAppendix extends Model {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  appendixTerms?: AppendixTerm[];
  contractAppendixNo?: string;
  effectiveDate?: string;
  approvedDate?: string;
  createdDate?: string;
  user?: Account;
  status?: AppendixStatus;
}

export interface AdjustmentContract {
  id?: string;
  code?: string;
  name?: string;
  approvedDate?: string;
  user?: Account;
  createdDate?: string;
}

export class WaitingReceipt extends Model {
  email: string;
  name: string;
  phoneNumber: string;
  organizationName: string;
  orgBusinessBranchCode: string;
  orgBusinessBranchName: string;
  orgBusinessDepartmentCode: string;
  orgBusinessDepartmentName: string;
}

export class TicketReceipt extends Model {
  receiptCode: string;
  receiver: string;
  createdDate: string;
  actualReceiptedDate: string;
  status: number;
}

export class TicketAcceptance extends Model {
  acceptanceCode: string;
  createdBy: string;
  organizationName: string;
  approvedDate: string;
  createdDate: string;
  description: string;
  status: number;
}

export class WaitForReceiveGoodsByUser extends Model {
  name: string;
  code: string;
  branch: Base;
  unit: Base;
  expectedQuantity: number;
  actualQuantity: number;
  remainingQuantity: number;
  description: string;
}

export interface PaymentTrackings {
  paymentId?: string;
  code?: string;
  createdUser?: string;
  createdUserName?: string;
  description?: string;
  requestAmount?: number;
  paidAmount?: number;
  currency?: Currency;
  status?: number;
  erpStatus?: number;
  isTotal?: boolean;
  title?: string;
  createUserName?: string;
  type?: TYPE_OF_PROPOSAL;
  createUser?: string;
}

export interface RelateShoppingPlanModel extends Model {
  id?: string;
  code?: string;
  createdBy?: string;
  createdName?: string;
  createdDate?: Date;
  name?: string;
  ticketType?: string;
  ticketTypeNumber?: TicketTypeNumber;
}
export class RelateShoppingPlan<T extends RelateShoppingPlanModel>
  implements RelateShoppingPlanModel
{
  public id?: string;
  public code?: string;
  public createdBy?: string;
  public createdName?: string;
  public createdDate?: Date;
  public name?: string;
  public ticketType?: string;
  public ticketTypeNumber?: TicketTypeNumber;

  constructor(value?: T) {
    if (value) {
      this.id = value.id;
      this.code = value.code;
      this.createdBy = value.createdBy;
      this.createdName = value.createdName;
      this.createdDate = value.createdDate;
      this.name = value.name;
      this.ticketType = value.ticketType;
      this.ticketTypeNumber = value.ticketTypeNumber;
    } else {
      this.id = "";
      this.code = "";
      this.createdBy = "";
      this.createdName = "";
      this.createdDate = new Date();
      this.name = "";
      this.ticketType = "";
      this.ticketTypeNumber = TicketTypeNumber.ShoppingPlan;
    }
  }
}

export interface ContractSupplierModel extends Model {
  supplierId?: string;
  address?: string;
  agentPerson?: string;
  agentPersonPosition?: string;
  procuration?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  supplierPayments?: Supplier[];
  supplierPaymentId?: string;
  currency?: string;
}

export class ContractOrganizationModel extends Model {
  id?: string;
  code?: string;
  name?: string;
  parentId?: string;
  parentName?: string;
  parentIds?: string[];
  isActive?: boolean;
  address?: string;
  email?: string;
  phone?: string;
  taxCode?: string;
  avatarFileId?: string;
  avatarPath?: string;
}

export interface ShippingInfo {
  id?: string;
  shippingDate?: string;
  quantity?: number;
  receivedOrganization?: Base;
  receiver?: Base;
  phoneNumber?: number;
  address?: string;
  note?: string;
}

export class ContractGoodsServices extends Model {
  id?: string;
  goodsId?: string;
  code?: string;
  name?: string;
  branchId?: string;
  unitId?: string;
  description?: string;
  note?: string;
  unit?: Base;
  manufacturer?: Base;
  category?: Base;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  totalConvertedAmount?: number;
  tax?: Base;
  taxAmount?: number;
  otherAmount?: number;
  shippingInfo?: ShippingInfo[];
}

export class ContractReceiverInfos extends Model {
  id?: string | number;
  shippingDate?: Dayjs | string;
  address?: string;
  note?: string;
  phone?: string;
  person?: string;
  organizationId?: string;

  constructor(data?: ContractReceiverInfos) {
    super();
    this.id = 0;
    this.shippingDate = dayjs(new Date());
    this.address = "";
    this.note = "";
    this.phone = "";
    this.person = "";
    this.organizationId = "";

    if (data) {
      this.id = data.id;
      this.shippingDate = dayjs(data.shippingDate);
      this.address = data.address;
      this.note = data.note;
      this.phone = data.phone;
      this.person = data.person;
      this.organizationId = data.organizationId;
    }
  }
}

export class RequestAttachment implements FileModel {
  public systemFileId?: string;
  public name?: string;
  public size?: number;
  public type?: string;
  public lastModified?: number;
}

export interface ContractTerms {
  id?: string;
  name?: string;
  description?: string;
}

export interface CommercialTerms {
  id?: string;
  name?: string;
  supplier?: Supplier;
  supplierName?: string;
  commercialTermsId?: string;
  commercialTerms?: Base;
  description?: string;
}

export interface CommercialTermsRequestBody {
  commercialTermsId?: string;
  description?: string;
}

export interface PaymentSchedulesBodyRequest {
  suggestionType: number;
  paymentTimeType: number;
  paymentMilestoneType: number;
  months: string[];
  amount?: number;
  percent?: number;
  paymentDay?: number;
  paymentBatch: string;
  referenceDocument: string;
}

export interface ContractFileRequest {
  attachments?: RequestAttachment[];
  note?: string;
}

export class ContractDetailBodyRequest extends Model {
  public name?: string;
  public contractNo?: string;
  public contractTypeId?: string;
  public rate?: number;
  public contractFormId?: string;
  public isDraft?: boolean;
  public contractTicketType?: number;
  public effectiveDate?: Dayjs | string;
  public endDate?: Dayjs | string;
  public organizationId?: string;
  public manager?: string;
  public legalEntityId?: string;
  public receivedType?: ReceivedType;
  public isContractTermination?: boolean;
  public isEmpower?: boolean;
  public currency?: string;
  public contractSupplier?: ContractSupplierModel;
  public originalPurchasePlanId?: string;
  public contractGoodsItems?: ContractGoodsItem[];
  public contractGoodsServicesList?: ContractGoodsServices[];
  public attachments?: RequestAttachment[];
  public contractTerms?: ContractTerms[];
  public commercialTerms?: CommercialTermsRequestBody[];
  public calculationValue?: number;
  public paymentSchedules?: PaymentSchedulesBodyRequest[];
  public contractFile?: ContractFileRequest;
  public warranties?: WarrantyRequestBody[];
}

export class ResponseOriginalPurchaseShoppingPlan extends Model {
  public attachments?: [];
  public categories?: string;
  public createUser?: string;
  public startDate?: Date;
  public endDate?: Dayjs | string;
  public estimatedDelivery?: string;
  public goodsItems?: string[];
  public id?: string;
  public isDraft?: boolean;
  public name?: string;
  public note?: string;
  public purchasePlanType?: number;
  public reason?: number;
  public supplierPurchasePlans?: ContractSupplierModel[];
  public user?: Account;
}

export class ResponseBusinessUnitByOrganization extends Model {
  public businessBranch?: BusinessBranch;
  public businessDepartment?: BusinessDepartment;
  public businessUnit?: BusinessBranch;
  public id?: string;
  public organization?: Organization;
}
export class ContractTempReceiptFilter extends ModelFilter {
  public code?: string;
  public contractNo?: string;
}

export enum TicketType {
  ShoppingPlan = "Phương án mua sắm",
  Policy = "Tờ trình chủ trương",
  ShoppingRequest = "Yêu cầu mua sắm",
}

export enum TicketTypeNumber {
  ShoppingPlan,
  Policy,
  ShoppingRequest,
  Acceptance,
}

export enum ActionRowType {
  VIEW,
  EDIT,
  CANCEL,
  DELETE,
  VIEW_APPROVE,
  CREATE_ADJUSTMENT_CONTRACT,
  CREATE_APPENDIX_CONTRACT,
  VIEW_SHOPPING_PLAN,
  VIEW_FROM_MASTER,
  CREATE_CONTRACT,
  CREATE_ORDER,
  CREATE_PRINCIPLE,
  CLOSE,
}

export class ContractTerm extends Model {
  public id?: string;
  public name?: string;
  public description?: string;
}

export class AppendixTerm extends Model {
  public id?: string;
  public name?: string;
  public description?: string;
}

export enum ContractAddType {
  Contract,
  PurchaseOrder,
  PurchaseOrderContractPrinciples,
}

export enum RequestStatus {
  PENDING = 1,
  APPROVED = 2,
  RETURNED = 3,
  REJECTED = 4,
  REVOKE = 5,
}

export enum ERPStatus {
  Final,
  Pending,
  Error,
  Reject,
}
