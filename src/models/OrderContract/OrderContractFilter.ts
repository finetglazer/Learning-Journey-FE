import { ModelFilter } from "react-3layer-common";
import { Field, ObjectList } from "react-3layer-decorators";

export class OrderContractFilter extends ModelFilter {
  @Field(String) public from?: string;
  @Field(String) public to?: string;
  @ObjectList(String) public contractTypeIds?: string[];
  @ObjectList(String) public costItemIds?: string[];
  @ObjectList(String) public createdOrganizationIds?: string[];
  @ObjectList(String) public createdBusinessBranchIds?: string[];
  @ObjectList(String) public manageOrganizationIds?: string[];
  @ObjectList(Number) public statuses?: number[];
  @ObjectList(String) public updateUser?: string[];
}
