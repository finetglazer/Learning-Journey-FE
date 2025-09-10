import { WorkflowCondition } from "models/WorkflowCondition/WorkflowCondition";
import { WorkflowState } from "models/WorkflowState";
import { WorkflowTransitionActor } from "models/WorkflowTransitionActor";
import { Model } from "react-3layer-common";

export class WorkflowTransition extends Model {
  public id?: string;
  public workflowTypeId?: string;
  public workflowDefinitionId?: string;
  public fromStateId?: string;
  public fromState?: WorkflowState;
  public fromStateName?: string;
  public toStateName?: string;
  public toStateId?: string;
  public toState?: WorkflowState;
  public triggerType?: number;
  public triggerRef?: string;
  public conditionId?: string;
  public name?: string;
  public description?: string;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public color?: string;
  public condition?: WorkflowCondition;
  public fromStateNavigation?: WorkflowState;
  public workflowTransitionActors?: WorkflowTransitionActor[];
}
