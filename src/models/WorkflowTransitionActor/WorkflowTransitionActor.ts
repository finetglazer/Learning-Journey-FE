import { WorkflowActor } from "models/WorkflowActor";
import { WorkflowTransition } from "models/WorkflowTransition/WorkflowTransition";
import { Model } from "react-3layer-common";

export class WorkflowTransitionActor extends Model {
  public id?: string;
  public transitionId?: string;
  public actorId?: string;
  public actor?: WorkflowActor;
  public transition?: WorkflowTransition;
  public isActive?: boolean;
}
