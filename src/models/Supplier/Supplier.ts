import { Bank } from "models/Bank";
import { Currency } from "models/Currency";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class SupplierAuthorizationAttachment extends Model {
  public systemFileId?: string;

  public name?: string;

  public contentType?: string;

  public size?: number;

  public path?: string;
}
export interface SupplierContacts {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
  isCreateAccount?: boolean;
}

export interface SupplierPayment {
  id?: string;
  isActive?: boolean;
  currencyId?: string;
  currency?: Currency;
  bankId?: string;
  bank?: Bank;
  bankAccountNo?: string;
  bankAccountName?: string;
}

export class SupplierAuthorization extends Model {
  public authorizedPerson?: string;

  public authorizedPersonCitizenID?: string;

  public authorizedPersonPosition?: string;

  public authorizationLetter?: string;

  public authorizedStartDate?: string;

  public authorizedEndDate?: string;

  public isRepresentativeDefault?: boolean;

  public supplierAuthorizationAttachments?: SupplierAuthorizationAttachment[];
}

export class Nation extends Model {
  @Field(String)
  public id: string;

  @Field(Number)
  public index?: number;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;
}

export class Province extends Model {
  @Field(String)
  public id: string;

  @Field(Number)
  public index?: number;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;
}

export class SupplierType extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public description?: string;

  @Field(Boolean)
  public isActive?: boolean;
}

export enum SupplierApprovalStatus {
  WaitingApproval = 1,
  Rejected,
  Approved,
}

export enum SupplierApprovalStatusI18n {
  WaitingApproval = "waiting_approval",
  Rejected = "rejected",
  Approved = "approved",
}

export enum SupplierApprovalStatusColor {
  WaitingApproval = "IN_PROGRESS",
  Rejected = "ERROR",
  Approved = "SUCCESS",
}

export class Supplier extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public shortName?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public address?: string;

  @Field(String)
  public province?: Province;

  @Field(String)
  public nationId?: string;

  @ObjectField(Nation)
  public nation?: Nation;

  @Field(Number)
  public status?: number;

  @Field(Boolean)
  public hasAccount?: boolean;

  @ObjectField(SupplierType)
  public supplierType?: SupplierType;

  @Field(String)
  public bankAccountNo?: string;

  @Field(String)
  public bankAccountName?: string;
}
