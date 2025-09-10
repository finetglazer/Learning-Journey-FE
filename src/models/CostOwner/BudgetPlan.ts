import { BudgetType } from "pages/BudgetPage/BudgetMaster/BudgetMasterHook";
import { Model } from "react-3layer-common";
import { Project as BudgetProject, BusinessUnit } from "../Project/Project";
export class CostLine extends Model {
  public costLineId?: string;
  public totalAmountC3?: number;
}

export class Project extends Model {
  public projectId?: string;
  public totalAmountC2?: number;
  public costLines?: CostLine[];
}

export class BusinessBranch extends Model {
  public businessBranchId?: string;
  public businessDepartmentId?: string;
  public positionId?: string;
  public totalAmountC1?: number;
  public projects?: Project[];
}

export class FileInfo extends Model {
  public id?: string;
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
  public projectId?: string;
  public totalAmountC2?: number;
  public costLines?: CostLine[];
}

export class BudgetPlanTemplate extends Model {
  public fileInfo?: FileInfo;
  public summary?: BusinessBranch[];
}

export class RequestAttachment extends Model {
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
}

export enum StatusBudgetPlan {
  DRAFT = 0,
  IN_PROGRESS = 1,
  APPROVE = 2,
  REJECT = 3,
  CANCEL = 4,
}
export class BudgetPlan extends Model {
  public id?: string;
  public code?: string;
  public businessUnit?: BusinessUnit;
  public type?: BudgetType;
  public name?: string;
  public description?: string;
  public summary?: BusinessBranch[];
  public requestAttachments?: RequestAttachment[];
  public isDetail?: boolean;
  public isConfirmDeleteBudgetPlan?: boolean;
  public budgets?: BudgetProject[];
  public status?: StatusBudgetPlan;
  public budgetSettlementType?: number;
  public isReturn?: boolean;
  public isOpinionValid?: boolean;
  public isViewWaitingApprove?: boolean;
}
