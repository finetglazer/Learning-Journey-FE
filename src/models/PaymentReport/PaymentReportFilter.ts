import { ModelFilter } from "react-3layer-common";
import { Field, ObjectList } from "react-3layer-decorators";

export class PaymentReportAuthorityFilter extends ModelFilter {
  @Field(String) public createDateFrom?: string;
  @Field(String) public createDateTo?: string;
  @Field(String) public updateDateFrom?: string;
  @Field(String) public updateDateTo?: string;
  @ObjectList(String) public updateUser?: string[];
}
