import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class GoodsReceiptModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public quantity?: string;

  @Field(String)
  public receiptOrganization?: string;

  @Field(String)
  public receiptDepartmentCode?: string;

  @Field(String)
  public receiptDepartmentName?: string;

  @Field(String)
  public receiptPersonName?: string;

  @Field(String)
  public receiptPersonEmail?: string;

  @Field(String)
  public receiptDate?: string;
}
