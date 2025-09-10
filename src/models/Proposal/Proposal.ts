/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-unresolved
import { ArgsProps } from "antd/lib/notification";
import {
  listAppointmentMethodEnum,
  listContractValueTypeEnum,
  listPurposeShoppingEnum,
} from "config/const";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { CostLine } from "models/CostLine";
import { Organization } from "models/Organization";
import { Account, Position } from "models/Profile";
import {
  BusinessBranch,
  BusinessDepartment,
  BusinessUnit,
  Project,
} from "models/Project/Project";
import { MODEL_CONFIRM_TYPE } from "pages/BudgetPage/BudgetCreate/BudgetCreateHook";
import { ErrorModalType } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { ModelSelect } from "pages/PurchasePage/ProposalPage/ProposalMaster/ProposalMasterHook";
import { Dispatch, SetStateAction } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import {
  Currency,
  GoodServiceExtend,
  GoodServiceTax,
  GoodServiceValue,
  SummaryItem,
} from "./GoodService";

interface PurchasePurpose {
  type: string | number;
  assetCode: string;
  assetName: string;
  note: string;
  promotion: Promotion;
  project: Project;
  investmentLocation?: string;
}
export class Proposal extends Model {
  id?: string;
  code?: string;
  name?: string;
  type?: number;
  businessDepartmentId?: string;
  description?: string;
  status?: number;
  totalAmount?: number;
  usedAmount?: number;
  remainingAmount?: number;
  createUser?: string;
  createUserName?: string;
  createdDate?: string;
  businessDepartment?: BusinessDepartment;
  contractorAppointment?: ContractorAppointment;
  exchangeRateEnabled?: boolean;
  costType?: CostType;
  costGroup?: CostGroup;
  canView?: boolean;
  canViewApprove?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canReturn?: boolean;
  canApprove?: boolean;
  canDecline?: boolean;
  canCreateAdjustmentProposal?: boolean;
  canCreatePaymentRequest?: boolean;
  canCreateAdvancePaymentRequest?: boolean;
  canCreateExpenditureRequest?: boolean;
  purchasePurpose?: PurchasePurpose;
  purchaseItems?: PurchaseItem[];
  documentGroups?: DocumentGroup[];
  attachments?: RequestAttachment[];
  user?: Account;
  costAllocation?: CostAllocation[];
  originalPurchaseProposalId?: string;
  Organization?: Organization;
}

export interface Promotion {
  id?: string;
  name?: string;
}

export interface Asset {
  id?: string;
  code?: string;
  name?: string;
}

export interface RateInfoJSON {
  rate?: number;
  source?: string;
  date?: Date;
}

export interface DocumentGroup {
  description?: string;
  purchaseProposalId?: string;
  attachments?: RequestAttachment[];
}

export interface PurchaseItem {
  id?: string;
  goodsId?: string;
  branchId?: string;
  unitId?: string;
  description?: string;
  receivedDate?: Date;
  quantity?: number;
  unitPrice?: number;
  taxAmount?: number;
  taxConvertedAmount?: number;
  totalAmount?: number;
  totalConvertedAmount?: number;
  amountBeforeTax?: number;
  convertedAmountBeforeTax?: number;
  taxId?: string;
  otherAmount?: number;
  manufactureYear?: number;
  note?: string;
  code?: string;
  name?: string;
  categoryId?: string;
  unit?: GoodServiceValue;
  branch?: GoodServiceValue;
  category?: GoodServiceValue;
  tax?: GoodServiceTax;
  originalTotalAmount?: number;
  isOriginalItem?: boolean;
  isPurchaseItemNotEdit?: boolean;
}

export class ProposalReferences extends Model {
  public id?: string;
  public description?: string;
  public RequestAttachment?: FileModel[];
}

export class RequestAttachment extends Model {
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
  public systemFileId?: string | number;
}

export class CostType extends Model {
  costGroups?: CostGroup[];
  id?: string;
  code?: string;
  name?: string;
  isActive?: boolean;
}

export type CostGroup = {
  costTypeId?: string;
  costLines?: CostLine[];
  id?: string;
  code?: string;
  name?: string;
};

export class ProposalRequestModel extends Model {
  public name?: string;
  public procurementPurpose?: (typeof listPurposeShoppingEnum)[0] =
    listPurposeShoppingEnum[0];
  public proposalReferences?: Array<ProposalReferences> | null;
  public positionApproveId?: string[];
  public positionApproves?: Position[];
  public positionApprove?: Position;
  public description?: string;
  public currency?: Currency;
  public costType?: CostType;
  public costGroup?: CostGroup;
  public isExchangeRate?: boolean;
  public selectedListGoodsServices?: GoodServiceExtend[];
  public rateInfo?: RateInfoModel;
  public contractorAppointment?: ContractorAppointment;
  public costAllocationLines?: CostAllocation[];
  public itemsSummary?: SummaryItem[];
  public isAdjust?: boolean;
  public isLoadingGoodsServicesUpload?: boolean;
  public originalPurchaseProposalId?: string;
  public originalDescription?: string;
  public isPriceExcludingTax?: boolean;
  public project?: ProposalModel;
  public investmentLocation?: string;
}

export enum EDirectContractingType {
  DIRECT_CONTRACTING_WITH_ASSESSMENT = 1,
  DIRECT_CONTRACTING_WITHOUT_ASSESSMENT = 2,
}

export enum EContractValueType {
  INCLUSIVE_OF_TAX = 1,
  EXCLUSIVE_OF_TAX = 2,
}

export interface ContractorAppointment {
  code?: string;
  name?: string;
  appointmentMethod?: (typeof listAppointmentMethodEnum)[number] | number;
  executionTime?: string;
  appointmentReason?: string;
  supplier?: SupplierItem;
  supplierId?: string;
  contractValue?: string;
  contractValueType?: (typeof listContractValueTypeEnum)[number];
  taxPayer?: string;
  contractType?: string;
  paymentTerms?: string;
  guaranteeContent?: string;
  warrantyContent?: string;
  purchaseProposalId?: string;
}

export interface Supplier extends Model {
  items?: SupplierItem[];
}

export interface SupplierItem extends Model {
  code?: string;
  id?: string;
  isActive?: boolean;
  name?: string;
  taxCode?: string;
  type?: string;
}

export enum ETabKeys {
  ProposalGenerationInfo = "0",
  GoodsServices = "1",
  ApprovalHistory = "2",
  CostAllocation = "3",
  DirectContracting = "4",
  OpinionCollector = "5",
}

export type ErrorModalImport = {
  show: boolean;
  message?: string | string[];
};

export type ProposalCreateModel = {
  model: ProposalRequestModel;
  activeTabKey?: ETabKeys;
  title?: string;
  setActiveTabKey?: Dispatch<SetStateAction<ETabKeys>>;
  dispatchModel: React.Dispatch<GeneralAction<ProposalRequestModel>>;
  loading: boolean;
  breadcrumbs: { name: string; path?: string }[];
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeMultipleSelectField?: (
    config: ConfigField
  ) => (values: Model[]) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleSave?: (value?: { isDraft?: boolean }) => void;
  handleConvertRequestBodyProposal?: (isDraft: boolean) => ProposalRequestModel;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleChangeAllField: (data: unknown) => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  notifyToast: (args: ArgsProps) => void;
  handleGoMaster: () => void;
  handleAddNewBasis: () => void;
  handleCheckAsset: () => void;
  getBankExchangeRate: (
    currencyCode: string,
    modelContext: ProposalRequestModel
  ) => void;
  handleUploadAttachmentError: (error: any) => void;
  isShowComponentForeignCurrency: boolean;
  changeListSelectedGood: (data: GoodServiceExtend) => void;
  handleClickAddCostAllocationLine: () => void;
  handleOpenModalAutoCostAllocation: () => void;
  modalCostAllocation: ModalType;
  setModalCostAllocation: React.Dispatch<SetStateAction<ModalType>>;
  costGroup?: ProposalModel;
  costAllocation?: CostAllocation;
  handleGetListCostCenterByAllocationMonth: () => void;
  modalConfirm?: string;
  handleUpdateTypeModal: (type: MODEL_CONFIRM_TYPE | null) => void;
  handleApproveProposal: () => void;
  handleRejectProposal: () => void;
  handleReturnProposal: () => void;
  handleCloseProposal: () => void;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  isLoadingModal: boolean;
  handleApplyButtonInConfirmModal: (model: Proposal, reason: string) => void;
  handleUploadGoodsServicesFile?: (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit?: boolean,
    purchaseItems?: PurchaseItem[]
  ) => void;
  handleCancelUploadGoodsServicesFile: () => void;
  handleDownloadGoodsServicesTemplate: () => void;
  handleClickOriginalCode?: (id: string) => void;
  errorModalImport?: ErrorModalImport;
  setErrorModalImport?: React.Dispatch<React.SetStateAction<ErrorModalImport>>;
  handleUpdateListCostCenterByAllocationMonth: () => void;
  isPriceExcludingTax?: boolean;
  errorsModal: ErrorModalType;
  setErrorsModal: Dispatch<SetStateAction<ErrorModalType>>;
  isRowDisabled: (record: AutoCostAllocationDocumentAttachModel) => boolean;
  exchangeRateNumberType?: "LONG" | "DECIMAL";
};

export enum PurposeShoppingEnum {
  Other = 0,
  RegularPurchasing,
  PromotionalPurchasing,
  RepairAndMaintenance,
  ProjectBased,
  StoragePurchasing,
  FinancialLease,
}

export class ExChangeRateModel extends Model {
  public source?: string;
  public date?: string;
  public rate?: number;
}

export type RateInfoModel = {
  rate: number;
  source: string;
  date?: Dayjs | string;
  id?: number;
};
export class CostAllocation extends Model {
  id?: string;
  businessBranchId?: BusinessBranch;
  businessDepartmentId?: BusinessDepartment;
  businessUnitId?: BusinessUnit;
  costLineId?: CostLine;
  estimateAmount?: number;
  contingencyAmount?: number;
  projectId?: Project;
  automaticCostAllocationJson?: AutoCostAllocationDocumentModel;
  positionApproveId?: Position;
  totalEstimateAmount?: number;
  totalContingencyAmount?: number;
  usedAmount?: number;
  originalTotalAmount?: number;
}

export interface ModalType {
  type: "CREATE" | "UPDATE" | "DETAIL" | "DELETE" | "NONE";
  id?: string;
}

export const DEFAULT_MODAL_TYPE: ModalType = { type: "NONE", id: undefined };

export enum LIST_TYPE_COST {
  COST__ABSOLUTE_AMOUNT = "ABSOLUTEAMOUNT",
  COST__AREA = "AREA",
  COST__EMPLOYEE_QUANTITY = "EMPLOYEEQUANTITY",
  COST__PERCENTAGE = "PERCENTAGE",
  COST__QUANTITY = "QUANTITY",
}

export enum SHOPPING_PURPOSES {
  OTHER = 0,
  NORMAL_SHOPPING = 1,
  PROMOTION_PROGRAM = 2,
  REPAIR_MAINTENANCE = 3,
  ACCORDING_PROJECT = 4,
}

export enum PROPOSAL_STATUS {
  DRAFT = 0,
  IN_PROGRESS = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCEL = 4,
  CLOSED = 5,
}

export class AutoCostAllocationDocumentModel extends Model {
  public costDriverId?: string;
  public costDriverName?: string;
  public projectId?: string;
  public projectName?: string;
  public costLineId?: string;
  public costLineName?: string;
  public allocationMonth?: Dayjs | string;
  public isUniqueUnitPrice?: boolean;
  public estimateAmount?: number;
  public contingencyAmount?: number;
  public lines?: AutoCostAllocationDocumentAttachModel[];
}

export class AutoCostAllocationDocumentAttachModel extends Model {
  public businessBranchId?: BusinessBranch;
  public businessDepartmentId?: BusinessDepartment;
  public businessUnitId?: BusinessUnit;
  public area?: number;
  public quantity?: number;
  public estimateIncludesTax?: number;
  public contingencyIncludesTax?: number;
  public employeeCount?: number;
  public percentage?: number;
  public value?: number;
}

export class TypeFilterModel extends ModelFilter {
  public name?: string;
  public typeGroup?: string;
  public isProject?: boolean;
  public isActive?: boolean;
}

export class ProposalModel extends Model {
  public id?: string | number;
  public name?: string;
  public code?: string;
}

export class CostDriverModel extends Model {
  public id?: string;
  public name?: string;
}

export class CostCenters extends Model {
  public businessBranchId: string;
  public businessUnitId: string;
  public businessDepartmentId: string;
}

export class FilterListCostCenter extends ModelFilter {
  public allocateMonth: string;
  public costCenters: CostCenters[];
  public type: number;
}

export class ProposalGetListCostCenter extends Model {
  public item: ProposalListCostCenterAllocation[];
  public totalRecords: number;
  public pageIndex: number;
}

export class ProposalListCostCenterAllocation extends Model {
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

export type ProposalValidCostCenterModel = {
  businessBranchId: string | number;
  businessUnitId: string | number;
  businessDepartmentId: string | number;
  budgetId: string | number;
  costLineId: string | number;
};

export type ContentHtml = {
  content: string;
  id: string;
};

export type DownloadFileProposalProps = {
  CostTypeId?: string;
  CostGroupId?: string;
};
