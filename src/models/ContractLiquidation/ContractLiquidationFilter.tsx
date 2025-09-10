import { IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class ContractLiquidationFilter extends ModelFilter {
  @Field(String)
  public tab?: string;
  public code?: string;
  public description?: string;
  public contractCode?: string;
  public contractNumber?: string;
  public contractName?: string;

  @ObjectField(IdFilter)
  public status?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createdUser?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public organizationIds?: IdFilter = new IdFilter();
}
