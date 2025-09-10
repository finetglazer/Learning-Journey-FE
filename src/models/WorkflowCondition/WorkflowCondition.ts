import { WorkflowTransition } from "models/WorkflowTransition";
import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowCondition extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public description?: string;
  public query?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public displayOrder?: number;
  public workflowTypeId?: string;
  public workflowTransitions?: WorkflowTransition[];
  public workflowType?: WorkflowType;
}
