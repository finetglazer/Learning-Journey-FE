import { ModelFilter } from "react-3layer-common";
import { DateFilter } from "react-3layer-advance-filters";
import { ObjectField } from "react-3layer-decorators";

interface ReportBaseSLAFilter {
  id?: string;
  code?: string;
  name?: string;
}

export class SLAFilter extends ModelFilter {
  @ObjectField(DateFilter)
  public createdDate?: DateFilter = new DateFilter();

  @ObjectField(DateFilter)
  public approvedDate?: DateFilter = new DateFilter();

  public reportType?: number;
  public reports?: ReportBaseSLAFilter[];
}
