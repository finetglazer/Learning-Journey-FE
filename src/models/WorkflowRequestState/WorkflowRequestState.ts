import { WorkflowRequest } from "models/WorkflowRequest/WorkflowRequest";
import { WorkflowRequestTransition } from "models/WorkflowRequestTransition";
import { Model } from "react-3layer-common";

export class WorkflowRequestState extends Model {
  public id?: string;
  public requestId?: string;
  public stateCode?: string;
  public activityCode?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public isFinalized: boolean;
  public isInitial?: boolean;
  public request?: WorkflowRequest;
  public workflowRequestTransitions?: WorkflowRequestTransition[];
}
