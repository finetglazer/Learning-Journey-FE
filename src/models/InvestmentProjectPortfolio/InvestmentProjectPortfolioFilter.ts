import {
  BusinessBranch,
  BusinessDepartment,
  BusinessUnit,
  Project,
} from "models/Project/Project";
import { ModelFilter } from "react-3layer-common";

export interface ProjectTimeRange {
  fromYear: number;
  toYear: number;
}

export class InvestmentProjectPortfolioFilter extends ModelFilter {
  public projectYear?: ProjectTimeRange;
  public project?: Project;
  public businessUnit?: BusinessUnit; // Bank block
  public businessBranch?: BusinessBranch;
  public businessDepartment?: BusinessDepartment;
}
