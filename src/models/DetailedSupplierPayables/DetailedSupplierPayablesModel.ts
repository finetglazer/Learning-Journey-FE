import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class DetailedSupplierPayablesModel extends Model {
  @Field(String) public supplierName?: string;
  @Field(String) public taxCode?: string;
  @Field(String) public contractCode?: string;
  @Field(String) public contractId?: string;
  @Field(String) public contractNo?: string;
  @Field(String) public contractName?: string;
  @Field(String) public approvedDate?: string;
  @Field(String) public contractClassification?: string;
  @Field(String) public effectiveDate?: string;
  @Field(String) public endDate?: string;
  @Field(String) public currency?: string;
  @Field(String) public amount?: string;
  @Field(String) public convertedAmount?: string;
  @Field(String) public settlementAmount?: string;
  @Field(String) public advanceAmount?: string;
  @Field(String) public retainedAmount?: string;
  @Field(String) public remainingAmountAccordingToSettlement?: string;
  @Field(String) public remainingAmountAccordingToContract?: string;
}
