import { WorkflowActivity } from "models/WorkflowActivity";
import { WorkflowDefinition } from "models/WorkflowDefinition";
import { WorkflowParameter } from "models/WorkflowParameter";
import { WorkflowTransition } from "models/WorkflowTransition";
import { Model } from "react-3layer-common";

export class WorkflowState extends Model {
  public id?: string;
  public workflowTypeId?: string;
  public workflowDefinitionId?: string;
  public activityCode?: string;
  public workflowActivityId?: string;
  public name?: string;
  public description?: string;
  public status?: number;
  public isInitial?: boolean;
  public isFinal?: boolean;
  public slaToComplete?: number;
  public slaToStart?: number;
  public metaData?: string;
  public displayOrder?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public positionX?: number;
  public positionY?: number;
  public color?: string;
  public isReturn?: boolean;
  public workflowActivity?: WorkflowActivity;
  public workflowDefinition?: WorkflowDefinition;
  public workflowParameters?: WorkflowParameter[];
  public workflowTransitions?: WorkflowTransition[];
}
