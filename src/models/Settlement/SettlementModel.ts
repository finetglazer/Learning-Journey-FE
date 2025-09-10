import { ArgsProps } from "antd/lib/notification";
import { ConfigField } from "core/services/service-types";
import { Dayjs } from "dayjs";
import type { History } from "history";
import type { TFunction } from "i18next";
import { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { SettlementFile } from "pages/SettlementPage/SettlementDetail/components/SettlementFileTab/components/SettlementFile/SettlementFile";
import { ConfirmModalType } from "./Settlement";
import { WorkflowCommand } from "models/WorkflowCommand";
import { SignedForm } from "models/SignatureInfo";

export class SettlementHookModel extends Model {
  model: SettlementModel;
  history: History;
  translate: TFunction<"translation", undefined>;
  loading: boolean;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  breadcrumbs: Breadcrumbs[];
  formatNumberToCurrency: (
    value: number,
    shouldRound?: boolean,
    code?: string
  ) => string;
  handleSave: (isDraft: boolean, callbackFc: () => void) => void;
  modal: string;
  setModalType: Dispatch<SetStateAction<string>>;
  handleUploadFileError: (error: any) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleChangeAllField: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleUploadFileToContract: (file: SettlementFile) => void;
  notifyToast: (args: ArgsProps) => void;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>>;
  modelSelected: ModelSelect | null;
  loadingModal: boolean;
  loadingButtonConfirm: boolean;
  handleApplyButtonInConfirmModal: (
    model: SettlementModel,
    reason: string
  ) => void;
  errorsModal: ModalType;
  setErrorsModal: Dispatch<SetStateAction<ModalType>>;
  setTabKey: Dispatch<SetStateAction<string>>;
  tabKey: string;
  handleUploadAttachmentError: (error: any) => void;
  handleGetContractDetail: (
    id: string,
    modelPass: SettlementModel
  ) => Promise<void>;
  handleCalculateTotalProposedPaymentValue: (
    pricings: PricingModel[],
    name: string
  ) => number;
  handleChangeMultipleItem: (
    modelPass: SettlementModel,
    data: object,
    name: string,
    contentType: number,
    indexBeforeValidate: number,
    nameErrors: string[],
    nameSub?: string
  ) => void;
  handleApprove: (id: string) => void;
}

export type StatusIntergrationAssetInfo = {
  batchDocId?: string;
  code?: string;
  comment?: string;
  status?: number;
  requestId?: string;
};
export class SettlementModel extends Model {
  public id: string;
  public code = ""; //Mã quyết toán
  public description: string; //Mô tả quyết toán
  public effectiveDate: string; //Ngày hiệu lực quyết toán
  public rate: number; //Tỷ giá
  public isShowRate: boolean; //Hiển thị tỷ giá
  public contactOrderInfo: ContractDetailModel; //Thông tin hợp đồng/ đơn đặt hàng
  public attachments: FileModel[]; //File đính kèm
  public supplierName: string; //Tên nhà cung cấp
  public supplierTaxCode: string; //Mã số thuế nhà cung cấp
  public supplierRepresentative: string; //Người đại diện nhà cung cấp
  public supplierPosition: string; //Chức vụ người đại diện nhà cung cấp
  public supplierAuthorizationLetter: string; //Giấy ủy quyền của nhà cung cấp
  public isSupplierAuthorized: boolean; //Nhà cung cấp đã ủy quyền
  public supplierContact: string; //Người liên hệ nhà cung cấp
  public supplierEmail: string; //Email nhà cung cấp
  public supplierPhone: string; //Số điện thoại nhà cung cấp
  public pricings: PricingModel[]; //Bảng tính giá trị đề nghị thanh toán
  public assetFormations: AssetFormationModel[]; //Giá trị hình thành tài sản
  public relatedSlips: RelatedSlipsModel[]; //Các chứng từ liên quan
  public contactOrderInfoId: string; //Id hợp đồng/ đơn đặt hàng
  public settlementDescription?: string;
  public toTalAssetFormation: number;
  public statusIntergrationAssetInfos: StatusIntergrationAssetInfo[];
}

export type RelatedSlipsModel = {
  id?: string;
  code?: string;
  name?: string;
  type?: number;
  typeName?: string;
  creator: CreatorModel;
  createdDate?: Dayjs;
};

export type AssetFormationModel = {
  amount?: number;
  type?: number;
  toTalAssetFormation?: number;
  amountExchange?: number;
};

export type PricingModel = {
  index: string;
  contentType?: number;
  stt?: string;
  contentTypeName?: string;
  contractPrice?: number;
  settlementPrice?: number;
  id?: string;
  contractExchangePrice?: number;
  settlementExchangePrice?: number;
  note?: string;
  indexBeforeValidate?: number;
  contractSettlementId?: string;
};

export interface ModelSelect {
  type: ConfirmModalType;
  model: SettlementModel;
  errorMessage?: string;
}

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

export enum AssetFormationType {
  Fixed = 1, //Tài sản cố định
  FixedTangible = 101, //Tài sản cố định hữu hình
  FixedIntangible = 102, //Tài sản cố định vô hình
  Tools = 2, //Công cụ dụng cụ
  Cost = 3, //Chi phí
}

export const AssetFormationTypeListCalculator = [
  AssetFormationType.FixedTangible,
  AssetFormationType.FixedIntangible,
  AssetFormationType.Tools,
];

export type contactDetailInListModel = {
  id: string;
  code: string;
  managerEmail?: string;
  managerName?: string;
  effectiveDate?: string;
  endDate?: string;
  contractNo?: string;
  name?: string;
  supplierId?: string;
  supplierName?: string;
  supplierTaxCode?: string;
  createUserName?: string;
  costGroup?: string;
  contractType?: string;
  contractRequestType?: number;
  total?: number;
  status?: number;
  contractClassification?: number;
  currency?: string;
  organizationName?: string;
  creator: CreatorModel;
  error?: object;
};

export type CreatorModel = {
  name: string;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  departmentId: string;
  organizationId: string;
  positionId: string;
};

export type ResponseContactModel = {
  items: contactDetailInListModel[];
  totalRecords: number;
  pageIndex: number;
};

// Root interface mô tả toàn bộ dữ liệu
export interface ContractDetailModel {
  contractRequestType: number;
  id: string;
  name: string;
  code: string;
  contractNo: string;
  currency: string;
  rate: number;
  total: number;
  effectiveDate: string;
  endDate: string;
  managerEmail: string;
  managerName: string;
  legalEntity: PurchaseOrganization;
  contractSupplier: ContractSupplier;
  isEmpower: boolean;
  assetFormations: AssetFormationModel[];
  toTalAssetFormation: number;
  relatedSlips: RelatedSlipsModel[];
  pricings: PricingModel[];
  goodsItems: GoodsItem[];
  assetItems: any[];
  statusIntergrationAssetInfos: StatusIntergrationAssetInfo[];
}

export interface PurchaseOrganization {
  email: string;
  phone: string;
  taxCode: string;
  address: string;
  personAgent: string;
  position: string;
  id: string;
  name: string;
  code: string;
}

export interface ContractSupplier {
  supplierId: string;
  supplier: Supplier;
  address: string;
  taxCode: string;
  agentPerson: string;
  agentPersonPosition: string;
  procuration: string;
  contactPerson: string;
  email: string;
  phone: string;
  supplierPaymentId: string;
  supplierPayment: string;
  supplierPayments: string;
}
export interface Supplier {
  taxCode: string;
  type: string;
  address: string;
  id: string;
  name: string;
  code: string;
}

export interface GoodsItem {
  id: string;
  contractGoodsItemId: string;
  contractGoodsItem: ContractGoodsItem;
  note: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reducedPrice: number;
  taxId: string;
  tax: Tax;
  taxAmount: number;
  totalAmount: number;
  totalExchangeAmount: number;
  contractQuantity: number;
  contractUnitPrice: number;
  contractTotalPrice: number;
  contractReducedPrice: number;
  contractTaxId: string;
  contractTax: Tax;
  contractTaxAmount: number;
  contractTotalAmount: number;
  contractTotalExchangeAmount: number;
  diffQuantity: number;
  diffUnitPrice: number;
  diffTotalPrice: number;
  diffReducedPrice: number;
  diffTaxId: string;
  diffTax: Tax;
  diffTaxAmount: number;
  diffTotalAmount: number;
  diffTotalExchangeAmount: number;
}

export interface ContractGoodsItem {
  id: string;
  code: string;
  name: string;
  goodsId: string;
  categoryId: string;
  category: Category;
  branchId: string;
  branch: Branch;
  unitId: string;
  unit: Unit;
  description: string;
  quantity: number;
  unitPrice: number;
  amountBeforeTax: number;
  taxConvertedAmount: number;
  convertedAmountBeforeTax: number;
  totalAmount: number;
  totalConvertedAmount: number;
  taxId: string;
  tax: Tax | null;
  taxPercent: number;
  taxAmount: number;
  otherAmount: number;
  convertedOtherAmount: number;
  requestQuantity: number;
  remainingQuantity: number;
  note: string;
  receiverInfos: ReceiverInfo[];
}

export interface Category {
  id: string;
  name: string;
  code: string;
}
export interface Branch {
  id: string;
  name: string;
  code: string;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
}
export interface Tax {
  code: string;
  name: string;
  rate: number;
  isActive: boolean;
  taxType: number;
  id: string;
}

export interface ReceiverInfo {
  id: string;
  shippingDate: string;
  quantity: number;
  organizationId: string;
  organization: string;
  orgBusinessUnit: string;
  orgBusinessBranch: string;
  orgBusinessDepartment: string;
  person: string;
  personObj: string;
  phone: string;
  address: string;
  note: string;
}

export type Breadcrumbs = { name: string; path?: string };

export type SettlementDetailModel = {
  assetItems: AssetItems;
  id: string;
  code: string;
  contractId: string;
  effectiveDate: string;
  rate: number;
  description: string;
  createdOrganizationId: string;
  createdOrganization: string;
  positionId: string;
  position: Unit;
  createUser: string;
  creator: CreatorModel;
  createdDate: Dayjs;
  updatedDate: Dayjs;
  attachments: FileModel[];
  status: number;
  isReturn: boolean;
  assetCost: number;
  supplierName: string;
  supplierTaxCode: string;
  supplierAddress: string;
  isSupplierAuthorized: boolean;
  supplierRepresentative: string;
  supplierPosition: string;
  files: SettlementFile;
  supplierAuthorizationLetter: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierContact?: string;
  contract: ContractModel;
  assetFormations: AssetFormationModel[];
  toTalAssetFormation: number;
  relatedSlips: RelatedSlipsModel[];
  pricings: PricingModel[];
  goodsItems: GoodsItem[];
  isApproveCanClick: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canCloseRequest: boolean;
  canCloseButton: boolean;
  canReturn: boolean;
  canDecline: boolean;
  canApprove: boolean;
  canIntergrationAsset: boolean;
  canCreatePaymentRequest: boolean;
  statusIntergrationAssetInfos: StatusIntergrationAssetInfo[];
  commands?: WorkflowCommand[];
  signedForm?: SignedForm;
  isOpinionValid?: boolean;
};

interface ContractModel {
  id: string;
  name: string;
  code: string;
  contractNo: string;
  currency: string;
  contractRequestType: number;
  rate: number;
  total: number;
  effectiveDate: string;
  endDate: string;
  managerEmail: string;
  managerName: string;
  legalEntity: PurchaseOrganization;
}

export enum TYPE_PAGE {
  VIEW,
  EDIT,
}

export interface GoodsItemsType {
  id: string | number;
  title: string;
  contractGoodsItem?: ContractGoodsItem;
  unit?: Unit;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  reducedPrice?: number;
  taxId?: string;
  tax?: Tax;
  taxAmount?: number;
  totalAmount?: number;
  totalExchangeAmount?: number;
  note?: string;
  contractTaxId?: string;
  contractQuantity?: number;
  contractUnitPrice?: number;
  contractTotalPrice?: number;
  contractTax?: Tax;
  contractTaxAmount?: number;
  contractTotalAmount?: number;
  contractReducedPrice?: number;
  contractTotalExchangeAmount?: number;
  diffQuantity?: number;
  diffTotalAmount?: number;
  diffTotalExchangeAmount?: number;
  diffUnitPrice?: number;
  diffTotalPrice?: number;
  diffReducedPrice?: number;
  diffTaxId?: string;
  diffTax?: Tax;
  diffTaxAmount?: number;
}

export interface CommonModel {
  id: string;
  name: string;
  code: string;
  isSynced?: boolean;
}

export interface OwnerOrganizationModel {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  taxCode: string;
  address: string;
  personAgent: string;
  position: string;
}

export interface OwnerUser {
  name: string;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  departmentId: string;
  organizationId: string;
  positionId: string;
}

export interface AssetItems {
  id: string;
  assetId: string;
  asset: CommonModel;
  code: string;
  name: string;
  quantity: number;
  originNo: string;
  serialNumber: string;
  goodsId: string;
  goods: CommonModel;
  branchId: string;
  branch: Branch;
  goodsDescription: string;
  goodsNote: string;
  ownerOrganizationId: string;
  ownerOrganization: OwnerOrganizationModel;
  ownerUserId: string;
  ownerUser: OwnerUser;
  originalCost: number;
  type: number;
  classify: string;
  depreciationMonths: number;
  usageStartDate: string;
  depreciationStartDate: string;
  note: string;
}

interface PricingSubmit {
  contentType: number;
  settlementPrice: number;
  settlementExchangePrice: number;
  note: string;
}

interface GoodsItemSubmit {
  contractGoodsItemId: string;
  note: string;
  quantity: number;
  unitPrice: number;
  reducedPrice: number;
  taxId: string;
  taxAmount: number;
  totalExchangeAmount: number;
}

export interface AssetItemSubmit {
  assetId?: string; //Nhập tay thì ko cần truyền
  code: string;
  goodsId: string;
  branchId: string;
  goodsDescription: string;
  goodsNote: string;
  ownerOrganizationId: string;
  ownerUserId: string;
  originalCost: number;
  type: number;
  usageStartDate: string;
  depreciationStartDate: string;
  note: string;
}

export interface FileAttachment {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

interface FileItem {
  id: string;
  attachments: FileAttachment[];
  note: string;
}

export interface ContractDataSubmitModel extends Model {
  id?: string;
  idEdit?: string;
  description: string;
  contractId: string;
  assetCost: number;
  effectiveDate: string;
  rate: number;
  isDraft: boolean;
  supplierName: string;
  supplierTaxCode: string;
  supplierAddress: string;
  isSupplierAuthorized: boolean;
  supplierRepresentative: string;
  supplierPosition: string;
  supplierAuthorizationLetter: string;
  supplierContact: string;
  supplierEmail: string;
  supplierPhone: string;
  attachments: FileAttachment[];
  pricings?: PricingSubmit[];
  goodsItems?: GoodsItemSubmit[];
  assetItems?: AssetItemSubmit[];
  files?: FileItem[];
  statusIntergrationAssetInfos: StatusIntergrationAssetInfo[];
}

export enum SettlementStatus {
  DRAFT,
  IN_PROGRESS,
  APPROVE,
  REJECT,
  CANCEL,
}
export type assetInformationModel = {
  assetCode: string;
  goodsServicesCode: string;
  goodsServicesName: string;
  branchType: string;
  descriptionGoodsServices: string;
  goodsServicesNote: string;
  unitName: string;
  personName: string;
  settlementOriginalPrice: number;
  settlementClassify: string;
};

export type AssetTypePass = {
  classifyType: number;
  originalCost: number;
};

export type ErrorModel = {
  errors: {
    totalRange: string;
  };
};
