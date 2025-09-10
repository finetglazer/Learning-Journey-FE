import { ActorType } from "models/ActorType";
import { WorkflowActorContent } from "models/WorkflowActorContent";
import { WorkflowTransitionActor } from "models/WorkflowTransitionActor";
import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowActor extends Model {
  public id?: string;
  public type?: number;
  public typeRef?: string[];
  public name?: string;
  public value?: string;
  public description?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public isUseAllWorkflow?: boolean;
  public updatedUserName?: string;
  public createdUserName?: string;
  public displayOrder?: number;
  public workflowTypeId?: string;
  public workflowTransitionActors?: WorkflowTransitionActor[];
  public workflowType?: WorkflowType;
  public actorType?: ActorType;
  public workflowActorContents?: WorkflowActorContent[];
}
