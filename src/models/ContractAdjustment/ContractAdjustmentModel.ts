import { ArgsProps } from "antd/lib/notification";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import type { History } from "history";
import { ConfirmModalType } from "models/ContractLiquidation/ContractLiquidation";
import { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { TicketTypePayment } from "../Payment";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  CONTRACT_ORDER,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
  CONTRACT_ROUTE_VIEW,
  CONTRACT_TERMINATION_VIEW_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
} from "../../config/route-const";
import { ContractAppendixItem } from "../ContractAnnex";
import { ParamType } from "../../pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetailHook";

export class ContractAdjustmentContextModel extends Model {
  model: ContractAdjustmentModel;
  history: History;
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
  handleSave: ({ isDraft, callbackFc }: ParamType) => void;
  handleUploadFileError: (error: any) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleChangeAllField: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  notifyToast: (args: ArgsProps) => void;
  errorsModal: ModalType;
  setErrorsModal: Dispatch<SetStateAction<ModalType>>;
  setTabKey: Dispatch<SetStateAction<string>>;
  tabKey: string;
  handleUploadAttachmentError: (error: any) => void;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  handleDownloadFile: (file?: FileModel) => void;
  loadingButtonConfirm: boolean;
  dispatch: React.Dispatch<GeneralAction<ContractAdjustmentModel>>;
  handleApplyButtonInConfirmModal: (
    model: ContractAdjustmentModel,
    reason?: string
  ) => void;
}

export class ContractAdjustmentModel extends Model {
  public contractAppendixGoodsItems: ContractAppendixItem[] = [];
  public contractAppendixGoodsItemsSelected: ContractAppendixItem[] = [];
  public desciption: string; // Mô tả dieu chinh
  public organization: Unit; //Đơn vị quản lý hợp đồng
  public manager: Unit; //Người quản lý hợp đồng
  public contract: ContractAdjustmentDetailModel;
  public isEditGoods?: boolean;
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

export interface Unit {
  id: string;
  name: string;
  code: string;
  email?: string;
}
export interface Tax {
  code: string;
  name: string;
  rate: number;
  isActive: boolean;
  taxType: number;
  id: string;
}

export type Breadcrumbs = { name: string; path?: string };
interface UserInfo {
  createUser: {
    name: string;
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    departmentId: string;
    organizationId: string;
    positionId: string;
    userName: string;
    code: string;
  };
  organizationName: string;
  positionName: string;
}

interface Ticket {
  id: string;
  code: string;
  ticketType: string;
  ticketTypeNumber: number;
  createdBy: string;
  createdName: string;
  createdDate: string; // ISO 8601 Date format (YYYY-MM-DDTHH:mm:ss.sssZ)
  name: string;
  approveDate: string; // ISO 8601 Date format
}

export type ticketRelated = {
  purchasePlanRelateds: Ticket[];
};

interface ContractType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxOverpaymentAmount: number;
  maxOverpaymentPercentage: number;
  isActive: boolean;
}

interface Bank {
  id: string;
  name: string;
}

interface SupplierPayment {
  bank: Bank;
  bankAccountNo: string;
  bankAccountName: string;
  isIsDomestic?: boolean; // Giá trị tùy chọn
}

interface Supplier {
  supplierId: string;
  supplierName: string;
  address: string;
  taxCode: string;
  agentPerson: string;
  agentPersonPosition: string;
  procuration: string;
  contactPerson: string;
  email: string;
  phone: string;
  supplierPaymentId: string;
  supplierPayment: SupplierPayment;
}

interface Organization {
  id: string;
  name: string;
  code: string;
  organizationId: string;
  email: string;
  phone: string;
  taxCode: string;
  address: string;
  personAgent: string;
  position: string;
}

interface Person {
  id: string;
  name: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  departmentId: string;
  organizationId: string;
  positionId: string;
  userName: string;
  code: string;
}

interface ReceiverInfos {
  id: string;
  shippingDate: string; // ISO 8601 Date format
  quantity: number;
  organizationId: string;
  organization: Organization;
  person: string;
  personObj: Person;
  phone: string;
  address: string;
  note: string;
}

export type ContractGoodsItems = {
  id: string;
  code: string;
  name: string;
  goodsId: string;
  categoryId: string;
  category: Unit;
  branchId: string;
  branch: Unit;
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
  tax: Tax;
  taxAmount: number;
  note: string;
  receiverInfos: ReceiverInfos[];
  purchaseItemId: string;
  contractGoodsItemId: string;
  isActiveReceive: boolean;
};

export type ContractAdjustmentDetailModel = {
  id: string;
  contractId: string;
  desciption?: string; // Fixing the typo in "desciption"
  isEmpower?: boolean;
  user?: UserInfo;
  ticketRelated?: ticketRelated;
  isContractTermination: boolean;
  code: string;
  contractNo: string;
  name: string;
  totalAmount: number;
  currency: string;
  rate: number;
  effectiveDate: string;
  endDate: string;
  contractFormId: string;
  contractForm: Unit;
  contractTypeId: string;
  contractType: ContractType;
  organizationId: string;
  organization: Unit;
  manager: string;
  managerObj: Unit;
  orgBusinessUnitName: string;
  orgBusinessBranchName: string;
  legalEntityId: string;
  legalEntity: OwnerOrganizationModel;
  contractSupplier: Supplier;
  isActiveReceive: boolean;
  receivedType: ReceivedType;
  receiverInfo: ReceiverInfoModel;
  contractGoodsItems: ContractGoodsItems[];
  status: number;
  contractRequestType: ContractRequestType;
  receiverInfos: ReceiverInfos[];
  isChangeGeneral?: boolean;
  contractCode: string;
  costType: string;
  costGroup: string;
  isReturn: boolean;
  canDelete: boolean;
  canCancel: boolean;
  canEdit: boolean;
  isChangeReceiver?: boolean;
  signatureType?: any; // Assuming signatureType can be any type, adjust as necessary
  commands: any;
};

export enum TYPE_PAGE {
  CREATE,
  VIEW,
  EDIT,
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

export type ContractAdjustmentSubmitModel = {
  contractId: string;
  desciption: string;
  receivedType: ReceivedType;
  receiverInfo: ReceiverInfoModel;
  contractGoodsItems: ContractGoodsItem[];
  organizationId: string;
  manager: string;
  isDraft: boolean;
  id: string;
  isHardValidate?: boolean; // Thêm trường isHardValidate để xác định có cần validate cứng hay không
};

export interface ReceiverInfoDetail {
  shippingDate: string; // ISO 8601 Date
  address: string;
  note: string;
}

export type ReceiverInfoModel = {
  id?: string;
  organizationId: string;
  organizationName?: string;
  personId: string;
  person: string;
  phone: string;
  personName?: string;
  receiverInfoDetails: ReceiverInfoDetail[];
};

export interface ContractGoodsReceiverInfo {
  shippingDate: string; // ISO 8601 Date
  quantity: number;
  organizationId: string;
  person: string;
  phone: string;
  address: string;
  note: string;
}

export interface ContractGoodsItem {
  id: string;
  goodsId: string;
  purchaseItemId?: string;
  contractGoodsItemId?: string;
  branchId: string;
  description: string;
  quantity: number;
  unitPrice?: number; // Lỗi cú pháp thiếu dấu ":" ở JSON, đã sửa thành unitPrice
  taxId: string;
  taxAmount: number;
  note?: string;
  unitId?: string;
  receiverInfos: ContractGoodsReceiverInfo[];
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: ContractAdjustmentModel;
  errorMessage?: string;
}

export enum ContractRequestType {
  Contract, //Hợp đồng
  PurchaseOrder, //Đơn đặt hàng
  PurchaseOrderHDNT, //Đơn  đặt hàng theo HĐNT
}
export const listRedirectTicketTypePayment = [
  {
    id: TicketTypePayment.PurchasePlan,
    url: PURCHASING_PLAN_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.PurchaseProposal,
    url: PROPOSAL_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.PurchaseRequest,
    url: PURCHASE_REQUEST_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.ContractPrinciple,
    url: CONTRACT_PRINCIPLE_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.ContractSettlement,
    url: SETTLEMENT_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.Liquidation,
    url: CONTRACT_TERMINATION_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.Acceptance,
    url: ACCEPTANCE_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.ProjectSettlement,
    url: PROJECT_SETTLEMENT_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.ContractLiquidation,
    url: CONTRACT_TERMINATION_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.GoodsReceiptRequest,
    url: RECEIVING_GOODS_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.Contract,
    url: CONTRACT_ROUTE_VIEW,
  },
  {
    id: TicketTypePayment.Order,
    url: CONTRACT_ORDER,
  },
];

export enum ReceivedType {
  /** Một người nhận */
  OnePersonal,

  /** Nhiều người nhận */
  MultiplePersonal,
}

export type ContentInfoModel = {
  label: string;
  value: string;
  colSpan: number;
  isShowTag: boolean;
  textTag: string;
  isNotBorder: boolean;
  isShow?: boolean;
  isLink?: boolean;
  onClick?: () => void;
  valueTooltip?: string;
};

export interface GoodItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  unitPrice: number;
  unitQuantity: number;
  currency: string;
  currencyRate: number;
  description: string;
  goodCategory: Unit;
  goodUnit: Unit;
  taxModel: Tax;
  goodBranch: Unit;
  taxAmount: number;
  taxAmountConvert: number;
  amount: number;
  amountConvert: number;
  totalAmount: number;
  totalAmountConvert: number;
  note: string;
  quantity: number;
  isActiveReceive: boolean;
  purchaseItemId?: string;
  contractGoodsItemId?: string;
  childrens: GoodItem[];
}
