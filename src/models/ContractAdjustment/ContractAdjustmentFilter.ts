import { ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ContractAdjustmentFilter extends ModelFilter {
  @Field(String)
  public tab?: string;
}

export class ContractAdjustmentSettlementFilter extends ModelFilter {
  createDateFrom: string | undefined;
  createDateTo: string | undefined;
  contractValueFrom: number | undefined;
  contractValueTo: number | undefined;
}

export class SelectAdjustableGoodsServicesFilterByContract extends ModelFilter {
  @Field(String)
  public contractId?: string;
  @Field(String)
  public categoryId?: string;
  public selectedIds?: string[];
}
