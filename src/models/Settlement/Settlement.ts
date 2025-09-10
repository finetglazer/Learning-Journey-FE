import { Model } from "react-3layer-common";

export enum SettlementStatus {
  DRAFT,
  WAITING_FOR_APPROVAL,
  APPROVED,
  REJECTED,
  CANCELED,
  TERMINATION,
  CLOSED,
}
export class Settlement extends Model {
  canView: true;
  canEdit: false;
  canCancel: false;
  canDelete: false;
  canAction: false;
  canViewApprove: false;
  canCopy: false;
  canGiveBack: false;
  canApproved: false;
  canApprovedCanceled: false;
  canChooseSupplier: false;
  canRound: false;
  canQuoted: false;
  canSaveDraft: false;
  canWaitingForApprove: false;
  canDeclined: false;
  canRefuse: false;
  canApproveSupplier: false;
  id: string;
  code: string;
  contractId: string;
  description: string;
  status: number;
  createUser: string;
  costGroup: string;
  createdDate: string;
  supplierName: string;
  effectiveDate: string;
  rate: number;
  createdOrganizationId: string;
  positionId: string;
  isReturn: boolean;
  organization: OrganizationType;
  contract: ContractType;
}

export class OrganizationType extends Model {
  id: string;
  email: string;
  phone: string;
  taxCode: string;
  address: string;
  personAgent: string;
  position: string;
  name: string;
  code: string;
}

export class ContractType extends Model {
  id: string;
  code: string;
  managerEmail: string;
  managerName: string;
  effectiveDate: string;
  endDate: string;
  contractNo: string;
  name: string;
  supplierId: string | null;
  supplierName: string;
  supplierTaxCode: string;
  createUserName: string;
  costGroup: string;
  contractType: string;
  contractRequestType: number;
  total: number | null;
  status: number;
  contractClassification: number;
  currency: string;
  organizationName: string | null;
  canCreateAdjustmentContract: boolean;
  canCreateAppendixContract: boolean;
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
}

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  RETURN = "RETURN",
  REJECT = "REJECT",
}
