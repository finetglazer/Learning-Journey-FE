import { IdFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class TemporaryImportAssetFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  public code?: string;
  public note?: string;
  public assetCode?: string;
  public contractCode?: string;
  public contractNumber?: string;
  public contractName?: string;

  @ObjectField(IdFilter)
  public status?: IdFilter = new IdFilter();

  @ObjectField(NumberFilter)
  public totalRangeFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public totalRangeTo?: NumberFilter = new NumberFilter();

  @ObjectField(IdFilter)
  public goodIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public supplierIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createdUser?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessDepartmentIds?: IdFilter = new IdFilter();
}
