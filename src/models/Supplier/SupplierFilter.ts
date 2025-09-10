import { DateFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";

export class SupplierFilter extends ModelFilter {
  public code?: string;
  public name?: string;
  public status?: number[];
  public provinces?: string[];
  public nationIds?: string[];
  public supplierTypeId?: number;
  public supplierTypesId?: string[];

  public phone?: string;
  public email?: string;
  public createdDateRange?: DateFilter = new DateFilter();
}
