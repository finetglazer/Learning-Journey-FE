import { ModelFilter } from "react-3layer-common";

export interface CostCenterIdsModel {
  businessBranchId: string;
  businessUnitId: string;
  businessDepartmentId: string;
}

export class BudgetOverViewStatusFilter extends ModelFilter {
  public costCenterIds?: CostCenterIdsModel[];
  public isProject?: boolean;
}
