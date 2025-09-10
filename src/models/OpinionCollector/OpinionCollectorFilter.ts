import { StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";

export class ListOpinionFilter extends ModelFilter {
  topicType?: number;
  topicId?: string;
}

export class ResponderFilter extends ModelFilter {
  name?: StringFilter = new StringFilter();
  currentUserEmail?: string;
  isStatus?: boolean;
  isSupplier?: boolean;
  isActive?: boolean;
}
