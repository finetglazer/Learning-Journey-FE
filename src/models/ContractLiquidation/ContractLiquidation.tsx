import { Model } from "react-3layer-common";

export interface TagFilterList {
  title: string;
  value: string;
}

export enum TAB_MASTER {
  ALL = "0",
  MINE = "1",
  IN_PROGRESS = "2",
  APPROVAL = "3",
}

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  RETURN = "RETURN",
  REJECT = "REJECT",
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: ContractLiquidation;
  errorMessage?: string;
}

export class Organization {
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

export class Attachment {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

export class FileEntry {
  id: string;
  attachments: Attachment[];
  note: string;
  uploadedDate: string;
  isHistory: boolean;
}

export class Creator {
  name: string;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  departmentId: string;
  organizationId: string;
  positionId: string;
}

export class Contract {
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canAction: boolean;
  canViewApprove: boolean;
  canCopy: boolean;
  canGiveBack: boolean;
  canApproved: boolean;
  canApprovedCanceled: boolean;
  canChooseSupplier: boolean;
  canRound: boolean;
  canQuoted: boolean;
  canSaveDraft: boolean;
  canWaitingForApprove: boolean;
  canDeclined: boolean;
  canRefuse: boolean;
  canApproveSupplier: boolean;
  canReturn: boolean;
  canCreateAdjustmentContract: boolean;
  canCreateAppendixContract: boolean;
  id: string;
  code: string;
  managerEmail: string;
  managerName: string;
  effectiveDate: string;
  endDate: string;
  contractNo: string;
  name: string;
  supplierId: string;
  supplierName: string;
  supplierTaxCode: string;
  createUserName: string;
  costGroup: string;
  contractType: string;
  contractRequestType: number;
  total: number;
  status: number;
  contractClassification: number;
  currency: string;
  organizationName: string;
  createdDate: string;
  creator: Creator;
  isReturn: boolean;
}

export class ContractLiquidation extends Model {
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canAction: boolean;
  canViewApprove: boolean;
  canCopy: boolean;
  canGiveBack: boolean;
  canApproved: boolean;
  canApprovedCanceled: boolean;
  canChooseSupplier: boolean;
  canRound: boolean;
  canQuoted: boolean;
  canSaveDraft: boolean;
  canWaitingForApprove: boolean;
  canDeclined: boolean;
  canRefuse: boolean;
  canApproveSupplier: boolean;
  canReturn: boolean;
  id: string;
  code: string;
  contractId: string;
  supplierName: string;
  supplierTaxCode: string;
  effectiveDate: string;
  totalPrice: number;
  description: string;
  createdOrganizationId: string;
  positionId: string;
  status: number;
  isReturn: boolean;
  createdDate: string;
  costGroup: string;
  createUser: string;
  createUserFullName: string;
  organization: Organization;
  contract: Contract;
  files: FileEntry[];
}

export class ContractLiquidationTypeModel extends Model {
  public id: string;
}
