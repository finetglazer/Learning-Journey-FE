import { ModelFilter } from "react-3layer-common";
import { Field, ObjectList } from "react-3layer-decorators";

export class PurchasingPlanDetailFilter extends ModelFilter {
  @Field(String) public purchasePlanId?: string;
  @ObjectList(String) public supplierIds?: string[];
}
