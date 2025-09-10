import { WorkflowRequestTask } from "models/WorkflowRequestTask";
import { WorkflowState } from "models/WorkflowState";
import { Model } from "react-3layer-common";

export class WorkflowRequestTransition extends Model {
  public id?: string;
  public requestId?: string;
  public workflowStateId?: string;
  public toState?: string;
  public toActivity?: string;
  public trigger?: string;
  public rule?: string;
  public actor?: string;
  public condition?: string;
  public name?: string;
  public description?: string;
  public isActive?: boolean;
  public isDeleted?: boolean;
  public comment?: string;
  public workflowRequestTasks?: WorkflowRequestTask[];
  public workflowState?: WorkflowState;
}
