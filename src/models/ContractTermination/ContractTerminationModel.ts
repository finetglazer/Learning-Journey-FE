import { ArgsProps } from "antd/lib/notification";
import { ConfigField } from "core/services/service-types";
import { Dayjs } from "dayjs";
import type { History } from "history";
import { ConfirmModalType } from "models/ContractLiquidation/ContractLiquidation";
import { SignedForm } from "models/SignatureInfo";
import { WorkflowCommand } from "models/WorkflowCommand";
import { ContractTerminationFile } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/Components/ContractTerminationFile/Components/ContractTerminationFile/ContractTerminationFile";
import { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export class ContractTerminationContextModel extends Model {
  model: ContractTerminationModel;
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
  handleSave: (isDraft: boolean, callbackFc: () => void) => void;
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
  handleGetContractDetail: (
    id: string,
    modelPass: ContractTerminationModel
  ) => Promise<void>;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  handleUploadFileToContract: (file: ContractTerminationFile) => void;
  handleDownloadFile: (file?: FileModel) => void;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>>;
  modelSelected: ModelSelect | null;
  returnContractTermination: (id: string, reason: string) => void;
  rejectContractTermination: (id: string, reason: string) => void;
  loadingButtonConfirm: boolean;
  handleApplyButtonInConfirmModal: (
    model: ContractTerminationModel,
    reason: string
  ) => void;
}

export class ContractTerminationModel extends Model {
  public id: string;
  public contractId: string; //Id hợp đồng
  public code = ""; //Mã
  public description: string; //Mô tả
  public effectiveDate: string; //Ngày hiệu lực thanh lý
  public attachments: Attachment[]; //File đính kèm
  public supplierName: string; //Tên nhà cung cấp
  public supplierAddress: string; //Địa chỉ nhà cung cấp
  public supplierTaxCode: string; //Mã số thuế nhà cung cấp
  public supplierRepresentative: string; //Người đại diện nhà cung cấp
  public supplierPosition: string; //Chức vụ người đại diện nhà cung cấp
  public supplierAuthorizationLetter: string; //Giấy ủy quyền của nhà cung cấp
  public isSupplierAuthorized: boolean; //Theo ủy quyền
  public supplierContact: string; //Người liên hệ nhà cung cấp
  public supplierEmail: string; //Email nhà cung cấp
  public supplierPhone: string; //Số điện thoại nhà cung cấp
  public taskContent: string; //Nội dung công việc
  public generalTerms: string; //Điều khoản chung
  public warrantyTerms: string; //Điều khoản bảo hành
  public files: FileDetail[]; //File đính kèm
  public contactOrderInfo: ContractTerminationDetailModel;
  public contractTerminationDetail: ContractTerminationDetailModel;
  public createdOrganization: Unit;
  public position: Unit;
  public creator: CreatorModel;
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

export type contactDetailInListTerminationModel = {
  id: string;
  code: string;
  contractNo: string;
  name: string;
  supplierName: string;
  supplierTaxCode: string;
  creator: Unit;
  costGroup: string;
  contractType: string;
  contractRequestType: number;
  total: number;
  status: number;
  currency: string;
  organizationName: string;
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

export interface Supplier {
  taxCode: string;
  type: string;
  address: string;
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

export type Breadcrumbs = { name: string; path?: string };
export type ContractPaymentValueModel = {
  contractAmount: number;
  contractConvertedAmount: number;
  contractSettlementAmount: number;
  contractSettlementConvertedAmount: number;
  paymentAmount: number;
  remainAmount: number;
};

export type ContractTerminationDetailModel = {
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canCloseRequest: boolean;
  canCloseButton: boolean;
  canReturn: boolean;
  canDecline: boolean;
  canApprove: boolean;
  canCreatePaymentRequest: boolean;
  id: string;
  code: string;
  currency: string;
  contractId: string;
  effectiveDate: string;
  rate: number;
  description: string;
  createdOrganizationId: string;
  createdOrganization: Unit;
  positionId: string;
  position: Unit;
  createUser: string;
  creator: CreatorModel;
  createdDate: string;
  updatedDate: string;
  attachments: Attachment[];
  status: number;
  taskContent: string;
  contractPaymentValue: ContractPaymentValueModel;
  generalTerms: string;
  warrantyTerms: string;
  isReturn: boolean;
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
  contract: ContractDetailModel;
  files: FileDetail[];
  isApproveCanClick: boolean;
  commands?: WorkflowCommand[];
  signedForm?: SignedForm;
  isOpinionValid?: boolean;
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

export interface Attachment {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

type FileDetail = {
  id: string;
  attachments: Attachment[];
  note?: string;
  uploadedDate?: string;
  isHistory?: boolean;
};

type ContractDetailModel = {
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
  legalEntity: OwnerOrganizationModel;
};

export type ContractTerminationSubmitModel = {
  idDetail?: string;
  isDraft: boolean;
  description: string;
  contractId: string;
  effectiveDate: string;
  supplierName: string;
  supplierTaxCode: string;
  supplierAddress: string;
  isSupplierAuthorized: boolean;
  supplierRepresentative: string;
  supplierPosition: string;
  supplierContact: string;
  supplierEmail: string;
  supplierPhone: string;
  taskContent: string;
  generalTerms: string;
  warrantyTerms: string;
  attachments: Attachment[];
  files: FileDetail[];
  isHardValidate?: boolean;
};

export interface ModelSelect {
  type: ConfirmModalType;
  model: ContractTerminationModel;
  errorMessage?: string;
}
