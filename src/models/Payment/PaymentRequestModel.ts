import { Dayjs } from "dayjs";
import type { History } from "history";
import React, { Dispatch, SetStateAction } from "react";
import { IdFilter } from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";
import { ConfigField, GeneralAction } from "../../core/services/service-types";
import { RequestAttachment } from "../CostOwner/BudgetPlan";
import {
  MatchStatus,
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PURPOSE_OF_PURCHASE_TYPES,
  TAX_TYPE_ENUM,
  TYPE_CREATE_PAYMENT_INHERITANCE,
} from "./PaymentRequestConstant";
// eslint-disable-next-line import/no-unresolved
import { ArgsProps } from "antd/lib/notification";

import type { TFunction } from "i18next";
import { CostLine } from "models/CostLine";
import {
  BusinessBranch,
  BusinessDepartment,
  BusinessUnit,
  Project,
} from "models/Project/Project";
import { ConfirmModalType } from "pages/PaymentPage/PaymentConfirmModal/PaymentConfirmModal";
import { ModalType } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export class PaymentRequestModel extends Model {
  public id?: string;
  public paymentRequestType: PaymentModel;
  public costType?: PaymentModel;
  public costGroup?: PaymentModel;
  public invoiceType?: PaymentModel = { id: "1", name: "Hóa đơn mới" };
  public costPeriod?: PaymentModel = { id: "0", name: "1 lần" };
  public allocationDate?: Dayjs;
  public service_usage_time?: [Dayjs, Dayjs];
  public amount?: number;
  public foreignCurrencyAmount?: number;

  public currency?: CurrencyModel;
  public isExchangeRate?: boolean = true;
  public paymentMethod?: PaymentModel = { id: "0", name: "Chuyển khoản" };
  public proposalExplanation?: string;
  public purposeOfPurchase?: PaymentModel = PURPOSE_OF_PURCHASE_TYPES[0];
  public purposeOfPurchaseNote?: string;
  public promoCode?: PromotionModel;
  public project?: PaymentModel;
  public assetCode?: string;
  public exchangeRateNumber?: number;
  public exchangeRateDate?: Dayjs;
  public exchangeRateSource?: string;
  public supplier?: SupplierModel;
  public isCheckImport? = false;
  public transferContent?: string;
  public receivingBank?: PaymentModel;
  public bankAccountNumber?: string;
  public nameAccountBank?: string;
  public retentionAmount?: number = 0;
  public depositReversalAmount?: number = 0;
  public expenseReversalAmount?: number = 0;
  public totalAmountPayable?: number = 0;
  public retentionNote?: string;
  public outputInvoice?: OutputInvoiceModel;
  public rateInfo: RateInfoModel;
  public paymentDueDate?: Dayjs;
  public initIsRefundedToCompany?: boolean = false;

  public infoFileTransferBank?: TransferInfoListModel;
  public purchasingDocumentsAttach?: PurchasingDocumentAttachModel[] = [];
  public documentType?: PaymentModel;
  public descriptionAttachment?: string;
  public supplierType?: PaymentModel;
  public actionDate?: Dayjs;
  public phoneNumber?: string;
  public invoicesOtherDocument?: InvoicesOtherDocumentModel[] = [];
  public bankName?: string;
  public advancePaymentList?: PaymentTypeApplicationModel[] = [];
  public depositApplicationList?: PaymentTypeApplicationModel[] = [];
  public expenseApplicationList?: PaymentTypeApplicationModel[] = [];
  public taxTypeInvoiceSubmit?: number = TAX_TYPE_ENUM.VAT;
  public isShowAllocation?: boolean;
  public createUser?: string;
  public createUserName?: string;
  public createdDate?: string;

  //var test
  public name?: string;
  public RefundCompanyChecked?: boolean = false;

  public costAllocation?: CostAllocation[] = [];
  public invoices?: InvoiceModel[] = [];

  public taxTypeEnum?: number = 0;
  public paymentAutoCostAllocation?: AutoCostAllocationModel;
  public autoCostAllocationDocumentsAttach?: AutoCostAllocationDocumentAttachModel[] =
    [];

  public accountingEntry?: AccountingEntryModel[] = [];
  public isShowPurchaseDocumentsAttached: boolean;
  public isShowMapInvoice: boolean;

  public matchingInvoiceStatus?: MatchStatus;
}

export class AccountingEntryModel extends Model {
  public id: string;
  public businessBranchId?: BusinessBranch;
  public businessUnitId?: BusinessUnit;
  public businessDepartmentId?: BusinessDepartment;
  public description?: string;
  public accountEntry?: AccountingAccountModel;
  public debitAmount?: number;
  public creditAmount?: number;
}

export class ExpenseReversalModel extends Model {
  public id: string;
  public code?: string;
  public description?: string;
  public createdDate?: string;
  public endDate?: string;
  public currencyDTO?: PaymentModel;
  public amount?: number;
  public startPeriod?: string;
  public endPeriod?: string;
  public createUsers?: string;
  public costPeriod?: number;
}
export type supplierDTOModel = {
  id: string;
  code: string;
  name: string;
  taxCode: string;
  type: number;
};

export class PaymentTypeApplicationModel extends Model {
  id: string;
  code: string;
  description: string;
  businessUnitDTO: BusinessUnitDTOModel;
  businessBranchDTO: BusinessUnitDTOModel;
  businessDepartmentDTO: BusinessUnit;
  costTypeDTO: BusinessUnitDTOModel;
  costGroupDTO: BusinessUnitDTOModel;
  invoiceType: number;
  costPeriod: number;
  actionDate: string;
  allocationDate: string;
  startPeriod: string;
  endPeriod: string;
  currencyDTO: BusinessUnitDTOModel;
  amount: number;
  paymentMethod: number;
  supplierDTO: supplierDTOModel;
  retention: number;
  retentionNote: string;
  status: number;
  phoneNumber: string;
  createdDate: string;
  convertedAmount: number;
  createUser: string;
  invoices: InvoiceModel[];
  otherDocuments: InvoicesOtherDocumentModel[];
  costAllocation: CostAllocation;
  outputInvoice: OutputInvoiceModel;
  paymentPurpose: PaymentPurposeModel;
  paymentInformation: TransferDetail;
  documentGroups: DocumentGroupModel[];
  paymentRequestType: BusinessUnitDTOModel;
  rateInfo: ExChangeRateModel;
}

export interface BusinessUnitDTOModel {
  id: string;
  code: string;
  name: string;
}

export type PaymentTypeApplicationResponseModel = {
  totalRecords: number;
  pageIndex: number;
  items: PaymentTypeApplicationModel[];
};

export type PaymentTypeApplicationResponseObservableModel = {
  data: PaymentTypeApplicationResponseModel;
};

export type PaymentInvoicesIdsObservableModel = string[];

export class PaymentTypeApplicationFilter extends ModelFilter {
  public paymentRequestTypeGroup?: number = 0;
  public createUsers?: string[] = [];
  public currencyId?: string;
  public supplierId?: string;
  public ids?: string[] = [];
}

export class RequesterValueModel extends Model {
  public id: string;
  public email: string;
  public name?: string;
}

export class PurchasingDocumentsModel extends Model {
  public id?: string;
  public typeOfVoucher?: string;
  public voucherCode?: string;
  public voucherContent?: string;
  public totalAmount?: string;
  public attachedDoc?: RequestAttachment[] = [];
}

export class AttachDocumentModel extends Model {
  public id?: string;
  public typeDoc: string;
  public attachedDoc: RequestAttachment[] = [];
  public descriptionDoc: string;
}
export class AutoCostAllocationDocumentModel extends Model {}

export class PurchasingDocumentAttachModel extends Model {
  public systemFileId?: string;
  public documentTypeId?: string;
  public documentType?: PaymentModel | null;
  public description?: string;
  public fileInfo?: FileInfo[];
}

export class CostAllocation extends Model {
  id?: string;
  businessBranchId?: BusinessBranch;
  businessDepartmentId?: BusinessDepartment;
  businessUnitId?: BusinessUnit;
  costLineId?: CostLine;
  expenseDetail?: string;
  preTaxAmount?: number;
  projectId?: Project;
  taxAmount?: number;
  taxId?: TaxTypeModel;
  allocationMonth?: string;
  preTaxToTalAmount?: number;
  taxToTalAmount?: number;
  autoCostAllocationDocumentsAttach?: AutoCostAllocationDocumentAttachModel;
  priceExcludingTax?: number;
}

export class AutoCostAllocationDocumentAttachModel extends Model {
  public businessBranchId?: BusinessBranch;
  public businessDepartmentId?: BusinessDepartment;
  public businessUnitId?: BusinessUnit;
  public area?: number;
  public quantity?: number;
  public preTaxUnitPrice?: number;
  public employeeCount?: number;
  public percentage?: number;
  public value?: number;
}

export class AutoCostAllocationModel extends Model {
  public costCenterAllocationMethod?: string;
  public allocationMonth?: string;
  public expenseDetail?: string;
  public projectId?: string;
  public costLineId?: string;
  public preTaxToTalAmount?: string;
  public taxToTalAmount?: string;
  public taxId?: string;
}

export const DEFAULT_MODAL_TYPE = "NONE";

export type PaymentCreateModel = {
  model: PaymentRequestModel;
  title?: string;
  dispatchModel: React.Dispatch<GeneralAction<PaymentRequestModel>>;
  history: History;
  translate: TFunction<"translation", undefined>;
  loading: boolean;
  isVNDOrJPY?: boolean;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  breadcrumbs: { name: string; path?: string }[];
  listPuchasingDocument: PurchasingDocumentsModel[];
  PaymentType: string;
  formatNumberToCurrency: (
    value: number,
    shouldRound?: boolean,
    code?: string
  ) => string;
  handleSave: (
    isDraft: boolean,
    idDetail?: string,
    callbackFc?: () => void
  ) => void;
  modal: string;
  setModalType: React.Dispatch<SetStateAction<string>>;
  listInformationTransfer: TransferDetail[];
  setListInformationTransfer: React.Dispatch<SetStateAction<TransferDetail[]>>;
  handleUploadFileError: (error: any) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleChangeAllField: any;
  forceUpdateModal: any;
  updateModal: number;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  typeGroup: TypeFilterModel;
  getBankExchangeRate: (
    currency: CurrencyModel,
    modelContext: PaymentRequestModel,
    isExchangeRate?: boolean
  ) => void;
  handleClickAddCostAllocationLine: () => void;
  notifyToast: (args: ArgsProps) => void;
  getForeignCurrencyAmount: (modelContext: PaymentRequestModel) => void;
  modalCostAllocation: ModalType;
  setModalCostAllocation: React.Dispatch<SetStateAction<ModalType>>;
  handleGetListCostCenterByAllocationMonth: () => void;
  isLoadingButtonGetListCostCenter: boolean;
  setIsLoadingButtonGetListCostCenter: React.Dispatch<SetStateAction<boolean>>;
  handleUpdateListCostCenterByAllocationMonth: () => void;
  endPath: string;
  path: string;
  initSearchInvoiceParams: InitSearchParamInvoiceModel;
  handleGetTransferInfo: (
    search: string,
    bankId?: string,
    bankName?: string
  ) => void;
  idDetail?: string;
  getLastPath: (path: string, idDetail?: string) => string;
  setModelSelected: React.Dispatch<SetStateAction<ModelSelect | null>>;
  modelSelected: ModelSelect | null;
  handleApplyButtonInConfirmModal: (
    model: PaymentRequestModel,
    reason: string
  ) => void;
  errorsModal: ModalType;
  setErrorsModal: Dispatch<SetStateAction<ModalType>>;
  handleApplyInvoiceFDA: (data: InvoiceModel[], isReturn?: boolean) => void;
  isDisableAllocationMonth: boolean;
  setIsDisableAllocationMonth: React.Dispatch<SetStateAction<boolean>>;
  setAcceptInvoiceWarning: React.Dispatch<
    SetStateAction<PaymentValidateInvoiceModel>
  >;
  inheritanceType?: PAYMENT_INHERITANCE_TYPE_SUBMIT;
  setInitSearchInvoiceParams: React.Dispatch<
    SetStateAction<InitSearchParamInvoiceModel>
  >;
  handleClickResetCostAllocationLine: () => void;
  paymentInheritanceInformation?: {
    paymentInheritanceId?: string;
    paymentInheritanceType?: PAYMENT_INHERITANCE_TYPE_SUBMIT;
  };
  costDriverDefault?: string;
  handleGoMaster?: () => void;
  handleConvertRequestBodyPayment?: (isDraft?: boolean) => PaymentModel;
  handleMatchingInvoice?: (modelPass: PaymentRequestModel) => void;
  checkInternalAccount?: (accountNumber: string, accountName: string) => void;
};

export type PaymentDetailModel = {
  model: PaymentDetailTypeModel;
  modelInvoice: PaymentListInvoiceDetail[];
  translate: TFunction<"translation", undefined>;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  breadcrumbs: { name: string; path?: string }[];
  listPuchasingDocument: PurchasingDocumentsModel[];
  listAttachDocument: AttachDocumentModel[];
  setModelInvoice: React.Dispatch<SetStateAction<PaymentListInvoiceDetail[]>>;
  tabRepositories: RepoStateDetail[];
  isVNDOrJPY?: boolean;
  formatNumberToCurrency: (value: number, roundNumber?: number) => string;
  renderPaymentMethod: () => string;
  renderInvoiceType: () => string;
  renderCostPeriod: () => string;
  handleDownloadFileAttached: (file?: FileModel) => void;
  modal: string;
  setModalType: React.Dispatch<SetStateAction<string>>;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleApprovePaymentRequest: () => void;
  handleRejectPaymentRequest: () => void;
  handleReturnPaymentRequest: () => void;
  handleDirectToEditPage: () => void;
  handleDeletePaymentRequest: () => void;
  handleCancelPaymentRequest: () => void;
  renderTitleHeader?: () => string;
  processAfterFeedbackSubmission?: () => void;
  handleChangeAllField: any;
  handleDownloadFileMatchingInvoice: () => void;
};

export class PaymentListInvoiceDetail extends Model {
  public billExplanation?: string;
  public netAmount?: string;
  public taxRate?: string;
  public taxAmount?: string;
  public totalAmount?: string;
  public paymentAmount?: string;
  public retainAmount?: string;
  public paid?: string;
  public invoiceNumber?: string;
  public invoiceDate?: string;
}

export interface RepoStateDetail {
  tabKey?: string;
  tabTitle: JSX.Element | string;
  children: JSX.Element;
  type?: number;
}

export class PaymentModel extends Model {
  public id?: string | number;
  public name?: string;
  public code?: string;
  public paymentGroup?: number;
}

export class CostDriverModel extends Model {
  public id?: string;
  public name?: string;
}

export class TypeFilterModel extends ModelFilter {
  public name?: string;
  public typeGroup?: string;
  public isProject?: boolean;
}

export class CostLineFilterModel extends ModelFilter {
  public name?: string;
  public BudgetId?: string;
}

export class CostTypeGroupFilterModel extends ModelFilter {
  public name?: string;
  CostTypeId?: IdFilter = new IdFilter();
}

export class CostTypeResModel extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

export class ExChangeRateModel extends Model {
  public source?: string;
  public date?: string;
  public rate?: number;
}

export class PromotionModel extends Model {
  public budget?: number;
  public code?: string;
  public fromDate?: string;
  public toDate?: string;
  public name?: string;
}

export class SupplierModel extends Model {
  public code: string;
  public id: string;
  public isActive: boolean;
  public name: string;
  public taxCode: string;
  public type: number;
  public nameSupplier: string;
}

export class FileInfo extends Model {
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
  public systemFileId?: string;
}

export class TransferDetail extends ModelFilter {
  id: number;
  transferAmount: number;
  description: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface TransferInformationModel {
  bankId: string;
  bankName: string;
  isActive: boolean;
  id: string;
  code: string;
  name: string;
  bank: BankInfoModel;
}

export class BankInfoModel extends Model {
  public id: string;
  public code: string;
  public name: string;
  public isActive: boolean;
}

export type PaymentPurposeModel = {
  type: number;
  note?: string;
  promotionId?: string;
  assetCode?: string;
  projectId?: string;
  promotionDTO?: PromotionType;
  projectDTO?: BusinessUnitDTOModel;
};

export type PromotionType = {
  id: string;
  name: string;
  code: string;
  budget: number;
  fromDate: string;
  toDate: string;
};

export type TransferInfoListModel = {
  fileInfo: FileInfo;
  transferDetails: TransferDetail[];
};

export type PaymentInformationModel = {
  transferInfos?: TransferDetail[];
  systemFileId?: string;
  invoices?: InvoicesViewModel[];
  otherDocuments?: InvoicesOtherDocumentViewModel[];

  transferAmount?: number;
  description?: string;
  bankId?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  isRefundedToCompany?: boolean;
};

export type RateInfoModel = {
  rate: number;
  source: string;
  date?: Dayjs | string;
  id?: number;
};

export class SupplierFilter extends ModelFilter {
  public supplierType?: PaymentModel;
  public currencyCode?: string;
}

export type CurrencyModel = {
  code: string;
  name: string;
  symbol?: string;
  id: string;
};

export type PeopleAmountModel = {
  amount: number;
  retentionAmount: number;
  totalAmount: number;
};

export class OutputInvoiceModel extends Model {
  public name: string;
  public taxCode: string;
  public address: string;
  public amount: number;
  public description: string;
}

export class TaxTypeModel extends Model {
  public id: string;
  public name: string;
  public code: string;
  public taxType: string;
  public rate: string;
  public isActive: string;
}

export class BudgetOverViewStatusFilter extends ModelFilter {
  public costCenterIds?: CostCenterIdsModel[];
  public isProject?: boolean;
}

interface CostCenterIdsModel {
  businessBranchId: string;
  businessUnitId: string;
  businessDepartmentId: string;
}

interface BudgetProjectModel {
  id: string;
  code: string;
  name: string;
}

interface CostLineModel {
  id: string;
  code: string;
  name: string;
  budgetPeriod: string;
  budgetCalculationMethod: string;
  isBudgetOverruns: boolean;
}

export interface BudgetDetailsModel {
  budgetProject: BudgetProjectModel;
  costLine: CostLineModel;
  budgetStatus: number;
  month: number;
  year: number;
  isOverBudget: boolean;
  total: number;
  usedAmount: number;
  requestAmount: number;
  reallocateAmount: number;
  remainingAmount: number;
  periodText?: string;
}

export type BudgetOverViewStatusResponseModel = {
  isOverBudget: boolean;
  projectStatus: {
    items: BudgetDetailsModel[];
  };
  totalRecords: number;
  pageIndex: number;
};

export class PaymentDetailTypeModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public status?: number;
  public description?: string;
  public businessUnitDTO?: PaymentDetailType;
  public businessBranchDTO?: PaymentDetailType;
  public businessDepartmentDTO?: PaymentDetailBusinessDepartment;
  public costTypeDTO?: PaymentDetailType;
  public costGroupDTO?: PaymentDetailType;
  public invoiceType?: string;
  public costPeriod?: string;
  public actionDate?: string;
  public allocationDate?: string;
  public startPeriod?: string;
  public endPeriod?: string;
  public currencyDTO?: PaymentDetailType;
  public amount?: number;
  public paymentMethod?: number;
  public supplierDTO?: SupplierType;
  public retention?: number;
  public retentionNote?: string;
  public outputInvoice?: string;
  public paymentPurpose?: PaymentPurposeModel;
  public paymentInformation?: PaymentInformationModel;
  public paymentDetailInformation?: PaymentDetailInformation;
  public documentGroups?: DocumentGroupModel[];
  public rateInfo?: RateInfoModel;
  public costTypeId?: string;
  public costGroupId?: string;
  public paymentRequestType?: PaymentModel;
  public phoneNumber?: string;
  public paymentGroup?: number;
  public createdDate?: string;
  public refundPlanToSpents?: PaymentTypeApplicationModel[];
  public applyAdvances?: PaymentTypeApplicationModel[];
  public isShowPurchaseDocumentsAttached?: boolean;
  public isShowMapInvoice?: boolean;
}

export type InvoicesViewModel = {
  invoiceDetail: InvoiceModel;
  invoiceId: string;
  description: string;
  paymentAmount: number;
  taxType: number;
  isTotal?: boolean;
};

export type InvoicesOtherDocumentViewModel = {
  tax: TaxTypeModel;
} & InvoicesOtherDocumentModel;

export class PaymentDetailInformation extends Model {
  public id: string;
  public code?: string;
  public name?: string;
  public status?: number;
  public description?: string;
  public businessUnitDTO?: PaymentDetailType;
  public businessBranchDTO?: PaymentDetailType;
  public businessDepartmentDTO?: PaymentDetailBusinessDepartment;
  public costTypeDTO?: PaymentDetailType;
  public costGroupDTO?: PaymentDetailType;
  public invoiceType?: string;
  public costPeriod?: string;
  public actionDate?: string;
  public allocationDate?: string;
  public startPeriod?: string;
  public endPeriod?: string;
  public currencyDTO?: PaymentDetailType;
  public amount?: number;
  public paymentMethod?: number;
  public supplierDTO?: SupplierType;
  public retention?: number;
  public retentionNote?: string;
  public outputInvoice?: string;
  public paymentPurpose?: PaymentPurposeModel;
  public paymentInformation?: PaymentInformationModel;
  public documentGroups?: DocumentGroupModel[];
  public rateInfo?: RateInfoModel;
  public costTypeId?: string;
  public costGroupId?: string;
  public paymentRequestType?: PaymentModel;
  public phoneNumber?: string;
  public paymentGroup?: number;
  public createdDate?: string;
  public costAllocation?: CostAllcationDetail;
  public canApproved?: boolean;
  public canDeclined?: boolean;
  public canGiveBack?: boolean;
  public canEdit?: boolean;
  public canCancel?: boolean;
  public canDelete?: boolean;
}

export class CostAllcationDetail extends Model {
  public allocationMonth?: string;
  public costAllocationLines?: CostAllocation[];
  public costDriverDTO?: PaymentModel;
  public costDriverId?: string;
  public preTaxToTalAmount?: number;
  public taxToTalAmount?: number;
}

export type SupplierType = {
  id: string;
  name: string;
  code: string;
  type: string;
  taxCode: string;
};

export class DocumentGroupModel extends Model {
  public documentType: PaymentDetailType;
  public description: string;
  public requestDocuments: RequestDocumentType;
}

export class RequestDocumentType extends Model {
  public systemFileId: string;
  public name: string;
  public contentType: string;
  public size: number;
  public path: string;
}

export class PaymentDetailType extends Model {
  public id: string;
  public code: string;
  public name: string;
}

export class PaymentDetailBusinessDepartment extends Model {
  public id: string;
  public code: string;
  public name: string;
  public businessUnitId: string;
  public businessUnitCode: string;
  public businessUnitName: string;
}

export type AccountInfoModel = {
  name: string;
  email: string;
};

export class PaymentGetListCostCenter extends Model {
  public item: PaymentListCostCenterAllocation[];
  public totalRecords: number;
  public pageIndex: number;
}

export class PaymentListCostCenterAllocation extends Model {
  public id: string;
  public type: number;
  public value: number;
  public month: number;
  public year: number;
  public businessBranch: BusinessBranch;
  public businessDepartment: BusinessDepartment;
  public businessUnit: BusinessUnit;
  public totalRecords: number;
  public pageIndex: number;
}

export class FilterListCostCenter extends ModelFilter {
  public allocateMonth: string;
  public costCenters: CostCenters[];
  public type: number;
}

export class CostCenters extends Model {
  public businessBranchId: string;
  public businessUnitId: string;
  public businessDepartmentId: string;
}

export class InvoiceModel extends Model {
  //field submit
  public invoiceId: string;
  public descriptionSubmit: string;
  public paymentAmountSubmit: number;
  public taxTypeInvoiceSubmit?: number;

  public id: string;
  public amountBeforeTax: number;
  public TaxCode: number;
  public description: string;
  public taxAmount: number;
  public totalAmount: number;
  public no: string;
  public date: string;
  public sellerTaxNum: string;
  public sellerName: string;
  public sellerCode: string;
  public notation: string;
  public formNo: string;
  public invoiceKind: string;
  public statusMessages: string;
  public pdfUrl: string;
  public xmlUrl: string;
  public status: number;
  public invoiceRelated: string;
  public paid: number;
  public retainedAmount: number;
  public hold?: number;
}

export class InvoicesOtherDocumentModel extends Model {
  public id: string;
  public description: string;
  public netAmount: number;
  public taxId: string;
  public taxAmount: number;
  public paymentAmount: number;
  public documentNumber: string;
  public documentDate: Dayjs;
  public supplierTaxCode: string;
  public supplierName: string;
  public supplierCode: string;
  public totalAmount: number;
}

export class InvoiceResponseModel extends Model {
  public totalRecords: number;
  public pageIndex: number;
  public items: InvoiceModel[];
}

export type InvoiceResponseObservableModel = {
  data: InvoiceResponseModel;
};

export class ListResult extends Model {
  public totalRecords: number;
  public pageIndex: number;
  public items: ExpenseReversalModel[];
}

export type ExpenseResponseObservableModel = {
  data: ListResult;
};

export type ExpenseByIdResponse = {
  data: ExpenseReversalModel[];
};

export type InitSearchParamInvoiceModel = {
  isNew: boolean;
  topicType: number;
};

export type AccountingAccountModel = {
  id: string;
  code: string;
  name: string;
  parentId: string;
};

export interface ModelSelect {
  type: ConfirmModalType;
  model: PaymentRequestModel;
  errorMessage?: string;
}

export class paramsGetBankModel extends ModelFilter {
  public bankId?: string;
}

export interface InvoiceRequestModel {
  invoiceIds: string[];
  topicType: number;
  currencyCode: string;
}

export type PaymentValidCostCenterModel = {
  businessBranchId: string;
  businessUnitId: string;
  businessDepartmentId: string;
  budgetId: string;
  costLineId: string;
};

export type PaymentValidateInvoiceModel = {
  acceptInvoiceWarning: boolean;
  isDraft: boolean;
};

export type ParamsGetDetailInheritanceFromProposal = {
  paymentType?: TYPE_CREATE_PAYMENT_INHERITANCE;
  purchaseProposalId: string;
};

export type ContractSettlementInfo = {
  id: string;
  name: string;
  code: string;
  contractNo: string;
  currency: string;
  contractRequestType: number;
  rate: number;
  total: number;
  exchangeTotal: number;
  effectiveDate: string;
  endDate: string;
  managerEmail: string;
  managerName: string;
  purchaseOrganization: PurchaseOrganization;
};

export type assetFormations = {
  amount: number;
  typeName: string;
  type: number;
};

export type PurchaseOrganization = {
  email: string;
  phone: string;
  taxCode: string;
  address: string;
  personAgent: string | null;
  position: string | null;
  id: string;
  name: string;
  code: string;
};

export type MatchingFDA = {
  invoiceMatchingResultIds: string[];
  status: number;
};

type InvoiceMatchingIds = {
  invoiceId: string;
  invoiceFdaId: string;
};

export type ParamMatchingFDA = {
  contractId?: string;
  supplierId?: string;
  invoiceDtos: InvoiceMatchingIds[];
};

export type ParamsDownloadMatchingFDA = {
  invoiceMatchingResultIds: string[];
  contractId: string;
};

export type DataCheckingInternal = {
  isInternalAccount: boolean;
  message: string;
};
