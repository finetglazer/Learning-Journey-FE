import { DateFilter } from "react-3layer-advance-filters";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(Boolean)
  public canView?: boolean;

  @Field(Boolean)
  public canEdit?: boolean;

  @Field(Boolean)
  public canCancel?: boolean;

  @Field(Boolean)
  public canDelete?: boolean;

  @Field(Boolean)
  public canAction?: boolean;

  @Field(Boolean)
  public canViewApprove?: boolean;

  @Field(Boolean)
  public canCopy?: boolean;

  @Field(Number)
  public status?: number;
}

export class ReceivingGoodModel extends BaseModel {
  @Field(String)
  public contractId?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractName?: string;

  @Field(String)
  public supplierId?: string;

  @Field(String)
  public supplierName?: string;

  @Field(String)
  public supplierTaxCode?: string;

  @Field(String)
  public recipientUnitId?: string;

  @Field(String)
  public recipientUnitName?: string;

  @Field(String)
  public receiptPersonId?: string;

  @Field(String)
  public receiptPerson?: string;

  @Field(Date)
  public receiptDate?: DateFilter;

  @Field(Number)
  public contractValue?: number;

  @Field(Date)
  public createDate?: DateFilter;
}

// config Receiving Waiting

export class BusinessDepartment extends BaseModel {
  @Field(String)
  public businessUnitId?: string;

  @Field(String)
  public businessUnitCode?: string;

  @Field(String)
  public businessUnitName?: string;
}

export class SupplierWaiting extends BaseModel {
  @Field(String)
  public address?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public type?: string;
}

export class OriginalPurchaseRequest extends BaseModel {
  @Field(String)
  public purchaseProposalCode?: string;

  @Field(String)
  public originalPurchaseRequestCode?: string;

  @Field(String)
  public originalPurchaseRequestName?: string;

  @Field(String)
  public createUser?: string;

  @Field(String)
  public createUserName?: string;

  @Field(String)
  public originalPurchaseRequestId?: string;

  @Field(String)
  public description?: string;

  @ObjectField(BusinessDepartment)
  public businessDepartment?: BusinessDepartment;

  @Field(Date)
  public createdDate?: Date;

  @Field(Number)
  public total?: number;

  @Field(Boolean)
  public isReturn?: boolean;

  @Field(Number)
  public appointmentMethod?: number;

  @Field(String)
  public estimatedDelivery?: string;

  @Field(String)
  public reason?: string;

  @ObjectField(SupplierWaiting)
  public supplier?: SupplierWaiting;

  @Field(Boolean)
  public canCreatePurchaseRequestAdjustment?: boolean;
}

export class ReceivedWaitingModel extends BaseModel {
  @ObjectField(OriginalPurchaseRequest)
  public originalPurchaseRequest?: OriginalPurchaseRequest;

  @Field(String)
  public contractNo?: string;

  @Field(Date)
  public effectiveDate?: Date;

  @Field(String)
  public supplier?: string;

  @Field(String)
  public manager?: string;
}

// config TagFilterList
export interface TagFilterList {
  title: string;
  value: string;
}

// Model organization

export class OrganizationModel extends BaseModel {
  @Field(String)
  public parentId?: string;

  @Field(String)
  public parentName?: string;

  @Field(Array)
  public parentIds?: string[];

  @Field(Boolean)
  public isActive?: boolean;

  @Field(String)
  public address?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public avatarFileId?: string;

  @Field(String)
  public avatarPath?: string;
}
