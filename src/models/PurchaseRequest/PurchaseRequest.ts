/* eslint-disable import/no-unresolved */
import { ArgsProps } from "antd/lib/notification";
import {
  LIST_TYPE_PURCHASE_FROM,
  listAppointmentMethodEnum,
} from "config/const";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { UserModel } from "models/Budget/Budget";
import { Organization } from "models/Organization";
import {
  Account,
  BusinessBranch,
  BusinessDepartment,
  Position,
} from "models/Profile";
import {
  ContractorAppointment,
  RateInfoJSON,
  RequestAttachment,
} from "models/Proposal";
import { ErrorModalType } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestDetailHook";
import { ModelSelect } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestMaster/PurchaseRequestMasterHook";
import { Dispatch, SetStateAction } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Supplier } from "models/Supplier/Supplier";

export class PurchaseRequest extends Model {
  id?: string;
  code?: string;
  name?: string;
  purchaseProposalCode?: string;
  createUser?: string;
  createUserName?: string;
  businessDepartment?: BusinessDepartment;
  createdDate?: Date;
  total?: number;
  isReturn?: boolean;
  status?: number;
  canView?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canCreatePurchaseRequestAdjustment?: boolean;
  isAdjust?: boolean;
}

export class PurchaseRequestCreate extends Model {
  id?: string;
  code?: string;
  name?: string;
  isDraft?: boolean;
  purchaseProposalCode?: string;
  createUser?: string;
  createUserName?: string;
  businessDepartment?: BusinessDepartment;
  createdDate?: Date;
  total?: number;
  isReturn?: boolean;
  status?: number;
  canCreatePurchaseRequestAdjustment?: boolean;
  expectedReceiveDate?: Dayjs;
  purchasingMethod?: (typeof LIST_TYPE_PURCHASE_FROM)[0];
  purchaseProposalId?: PurchaseProposal;
  purchaseBusinessDepartmentId?: BusinessDepartment;
  purchaseItems?: GoodsServices[];
  isDetail?: boolean;
  isAdjust?: boolean;
  user?: Account;
  businessBranch?: BusinessBranch;
  recipientInforJson?: RecipientInfor;
  originalPurchaseRequestCode?: string;
  description?: string;
}

export interface PurchaseRequestBody {
  id?: string;
  isDraft: boolean;
  expectedReceiveDate?: string;
  name: string;
  description?: string;
  attachments?: RequestAttachment[];
  purchaseBusinessDepartmentId?: string;
  purchaseProposalId: string;
  purchasingMethod: number;
  purchaseItems?: PurchaseItemBody[];
  recipientInforJson?: RecipientInfor;
  purchaseRequestType?: number;
  originalPurchaseRequestId?: string;
  purchaseOrganizationId?: string;
  appointmentMethod?: (typeof listAppointmentMethodEnum)[number] | number;
}

interface PurchaseItemBody {
  branchId?: string;
  unitId?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxId?: string;
  taxAmount: number;
  otherAmount?: number;
  note?: string;
  totalConvertedAmount?: number;
  goodsId?: string;
  taxPercent?: number;
}

export interface PurchaseProposal {
  id: string;
  code: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  totalEstimateAmount: number;
  totalContingencyAmount: number;
  usedAmount: number;
  description: string;
  user: Account;
  businessDepartment: BusinessDepartment;
  position: Position;
  createdDate: Dayjs;
  total: number;
  createUser: string;
  rateInfoJson: RateInfoJSON;
  currency: Currency;
  costType: CostType;
  costGroup: CostGroup;
  purchaseItems: GoodsServices[];
  contractorAppointment?: ContractorAppointment;
  recipientInforJson?: RecipientInfor[];
  organization?: Organization;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface CostType {
  id: string;
  code: string;
  name: string;
}

export interface CostGroup {
  id: string;
  code: string;
  name: string;
}

export type PurchaseRequestDetailModel = {
  model: PurchaseRequestCreate;
  dispatchModel: React.Dispatch<GeneralAction<PurchaseRequest>>;
  loading: boolean;
  title?: string;
  breadcrumbs: { name: string; path?: string }[];
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleSave?: (value?: { isDraft?: boolean }) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleChangeAllField: (data: unknown) => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  notifyToast: (args: ArgsProps) => void;
  handleGoMaster: () => void;
  handleUploadAttachmentError: (error: any) => void;
  handleRemoveFileAttachment: (fileId: string | number) => void;
  handleUpdateListAttachments: (listFile: FileModel[]) => void;
  setIsShowModalProposal?: React.Dispatch<SetStateAction<boolean>>;
  isShowModalProposal?: boolean;
  setIsShowModalGoodsServices?: React.Dispatch<SetStateAction<boolean>>;
  isShowModalGoodsServices?: boolean;
  changeListSelectedGoodsServices?: (data: GoodServiceByCategory) => void;
  handleViewPurchaseProposal?: () => void;
  handlePressEdit?: () => void;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<React.SetStateAction<ModelSelect | null>>;
  loadingModal: boolean;
  handleApplyButtonInConfirmModal: (
    model: PurchaseRequest,
    reason: string
  ) => void;
  errorsModal: ErrorModalType;
  setErrorsModal: Dispatch<SetStateAction<ErrorModalType>>;
  handleClickOriginalCode?: (id: string) => void;
  exchangeRateNumberType?: "LONG" | "DECIMAL";
  convertPurchaseRequestBody?: (isDraft: boolean) => PurchaseRequestCreate;
};

export class PurchaseProposalFilter extends ModelFilter {
  public code?: string;
  public name?: string;
}

export class GoodsServices extends Model {
  id?: string;
  code?: string;
  name?: string;
  goods?: {
    id: string;
    code: string;
    name: string;
  };
  branch?: {
    id: string;
    code: string;
    name: string;
  };
  unit?: {
    id: string;
    code: string;
    name: string;
  };
  category?: {
    id: string;
    code: string;
    name: string;
  };
  tax?: TaxType;
  remainingRequestQuantity?: number;
  originalQuantity?: number;
  registeredQuantity?: number;
  unitPrice?: number;
  description?: string;
  categoryId?: string;
  quantity?: number;
  taxAmount?: number;
  otherAmount?: number;
  totalAmount?: number;
  totalConvertedAmount?: number;
  buyQuantity?: number;
  amountBeforeTax?: number;
  note?: string;
  currency?: string;
  supplierSuppliedGoods?: SupplierSuppliedGoods[];
}

interface TaxType {
  id: string;
  code: string;
  name: string;
  rate: number;
  taxType: string;
}
export class GoodServiceByCategory extends GoodsServices {
  isTotal?: boolean;
  children?: GoodsServices[];
}

export class GoodServiceDrawer extends Model {}
export interface GoodsServicesCategory {
  id: string;
  code: string;
  name: string;
}

export class GoodsServicesFilter extends ModelFilter {
  categoryIds?: GoodsServicesCategory[];
  id?: string;
  isFullQuantity?: boolean;
}

export enum EntitySelection {
  TTCT,
  YCMS,
}

export interface RecipientInfor extends Model {
  receiveBusinessDepartmentId?: BusinessDepartment;
  receiveUser?: UserModel;
  phoneNumber?: string;
  address?: string;
  note?: string;
}

export enum ActiveTabKeys {
  GenerationInfo = "0",
  GoodsServices = "1",
  DirectAssignContract = "2",
  ApprovalHistory = "3",
}

export interface SupplierSuppliedGoods {
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  supplier?: Supplier;
  unit?: {
    id: string;
    code: string;
    name: string;
  };
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  currency?: string;
  taxRate?: number;
  taxAmount?: number;
  branchId?: string;
  isTotal?: boolean;
  note?: string;
}
