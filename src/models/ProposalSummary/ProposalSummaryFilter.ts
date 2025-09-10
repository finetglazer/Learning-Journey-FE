import { DateFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class ProposalSummaryFilter extends ModelFilter {
  @ObjectField(DateFilter)
  public createdDate?: DateFilter = new DateFilter();

  @ObjectField(String)
  public costTypeIds?: string[];

  @ObjectField(String)
  public costGroupIds?: string[];

  @ObjectField(String)
  public unitCreatedIds?: string[];

  @ObjectField(String)
  public businessBranchIds: string[];

  @ObjectField(String)
  public statuses: string[];
}
