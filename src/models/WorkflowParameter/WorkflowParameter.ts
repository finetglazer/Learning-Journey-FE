import { Dayjs } from "dayjs";
import { WorkflowState } from "models/WorkflowState";
import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowParameter extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public workflowTypeId?: string;
  public dataType?: number;
  public description?: string;
  public status?: number;
  public createdDate?: Dayjs;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Dayjs;
  public updatedUserName?: string;
  public createdUserName?: string;
  public displayOrder?: number;
  public purpose?: string;
  public workflowStateId?: string;
  public workflowState?: WorkflowState;
  public workflowType?: WorkflowType;
}
