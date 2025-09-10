import CommonFilter from "models/CommonFilter";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export interface Seller {
  sellerName: string;
  sellerTaxNum: string;
}

export class UseElectronicInvoice extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public sellerName?: string;

  @Field(String)
  public no?: string;

  @Field(String)
  public date?: string;

  @Field(Number)
  public totalAmount?: number;

  @Field(Number)
  public statusEPro?: number;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public poNo?: string;

  @Field(String)
  public fromEmail?: string;

  @Field(String)
  public substitutePerson?: string;
}

export class UseElectronicInvoiceDetail extends UseElectronicInvoice {
  @Field(String)
  public sellerTaxNum: string;

  public invoiceKind: {
    id: string;
    name: string;
    code: string;
  };

  @Field(String)
  public formNo?: string;

  @Field(String)
  public notation?: string;

  @Field(String)
  public pdfUrl?: string;

  @Field(String)
  public statusMessages?: string;
}

export class UseElectronicInvoiceCreation extends Model {
  @Field(String)
  public ids?: string[];

  public substitutePerson?: CommonFilter;
}
