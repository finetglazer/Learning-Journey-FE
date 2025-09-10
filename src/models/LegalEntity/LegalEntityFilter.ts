import { IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class LegalEntityFilter extends ModelFilter {
  public codes?: string;
  public name?: string;
  public address?: string;
  public isDefaultLegalEntities?: boolean[];
  @ObjectField(IdFilter)
  public taxCode?: string;
  @ObjectField(IdFilter)
  public representativeIds?: IdFilter = new IdFilter();
  @ObjectField(IdFilter)
  public representativePositionIds?: IdFilter = new IdFilter();
}
