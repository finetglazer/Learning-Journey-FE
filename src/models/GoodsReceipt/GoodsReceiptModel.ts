import { OptionBaseModel } from "models/Common/Common";
import { Field } from "react-3layer-decorators";

export class GoodsReceiptModel extends OptionBaseModel {
  @Field(String) public createdDate?: string;
  @Field(String) public receiptDate?: string;
  @Field(String) public contractId?: string;
  @Field(String) public contractCode?: string;
  @Field(String) public contractNo?: string;
  @Field(String) public contractName?: string;
  @Field(String) public supplierCode?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public receiverUnit?: string;
  @Field(String) public receiverName?: string;
  @Field(String) public receiverEmail?: string;
  @Field(String) public receiptPersonPhone?: string;
  @Field(String) public status?: string;

}
