import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

/** Base Model */
export class BaseModel extends Model {
  @Field(String) public id?: string;
  @Field(String) public code?: string;
  @Field(String) public name?: string;
}

export class PermissionModel extends BaseModel {
  @Field(Boolean) public canView?: boolean;
  @Field(Boolean) public canEdit?: boolean;
  @Field(Boolean) public canCancel?: boolean;
  @Field(Boolean) public canDelete?: boolean;
  @Field(Boolean) public canAction?: boolean;
  @Field(Boolean) public canViewApprove?: boolean;
  @Field(Boolean) public canCopy?: boolean;
  @Field(Boolean) public canGiveBack?: boolean;
  @Field(Boolean) public canApproved?: boolean;
  @Field(Boolean) public canApprovedCanceled?: boolean;
  @Field(Boolean) public canChooseSupplier?: boolean;
  @Field(Boolean) public canRound?: boolean;
  @Field(Boolean) public canQuoted?: boolean;
  @Field(Boolean) public canSaveDraft?: boolean;
  @Field(Boolean) public canWaitingForApprove?: boolean;
  @Field(Boolean) public canDeclined?: boolean;
  @Field(Boolean) public canRefuse?: boolean;
  @Field(Boolean) public canApproveSupplier?: boolean;
  @Field(Boolean) public canReturn?: boolean;
}

export class ContractPrincipleAppendixListModel extends PermissionModel {
  @Field(String) public appendixDate?: string;
  @Field(String) public contractId?: string;
  @Field(String) public contractNo?: string;
  @Field(String) public contractName?: string;
  @Field(String) public contractType?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public managerName?: string;
  @Field(String) public managerEmail?: string;
  @Field(String) public effectiveDate?: string;
  @Field(String) public costItem?: string;
  @Field(Number) public status?: number;
}

export class ContractPrincipleAppendixModel extends BaseModel {}
