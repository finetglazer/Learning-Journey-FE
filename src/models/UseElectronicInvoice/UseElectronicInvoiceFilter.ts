import { ModelFilter } from "react-3layer-common";
import { Enum, Field } from "react-3layer-decorators";

export enum UseElectronicInvoiceEProStatus {
  NOT_USED,
  PARTIALLY_USED,
  USED,
}

export enum UseElectronicInvoiceStatus {
  NEW_INVOICE,
  REPLACEMENT_INVOICE,
  REPLACED_INVOICE,
  ADJUST_INVOICE,
  ADJUSTED_INVOICE,
}

export interface DataRange {
  from: string;
  to: string;
}

export interface TotalAmountRange {
  from: string;
  to: string;
}

export class UseElectronicInvoiceFilter extends ModelFilter {
  @Enum(UseElectronicInvoiceEProStatus)
  public statusEPro?: UseElectronicInvoiceEProStatus[];

  @Enum(UseElectronicInvoiceStatus)
  public status?: UseElectronicInvoiceStatus[];

  @Field(String)
  public sellerTaxNums?: string[];

  @Field(String)
  public sellerName?: string;

  @Field(String)
  public fromEmails?: string[];

  @Field(String)
  public no?: string;

  @Field(String)
  public notation?: string;

  @Field(String)
  public formNo?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public poNo?: string;

  @Field(String)
  public statusMessages?: string;

  public totalAmountRange?: TotalAmountRange;

  public dateRange?: DataRange;

  @Field(String)
  public substitutePersons?: string[];
}
