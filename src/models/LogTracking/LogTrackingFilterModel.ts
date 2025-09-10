import {
  DateFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";

export class LogTrackingFilterModel extends ModelFilter {
  logTime?: DateFilter;
  serviceName?: IdFilter;
  level?: IdFilter;
  serviceSearchKey?: StringFilter = new StringFilter();
  levelSearchKey?: StringFilter = new StringFilter();
  serviceNameValue?: Model[];
  levelValue?: Model[];
}
