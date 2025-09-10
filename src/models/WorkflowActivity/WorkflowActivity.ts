import { WorkflowState } from "models/WorkflowState";
import { WorkflowTypeActivity } from "models/WorkflowTypeActivity";
import { Model } from "react-3layer-common";

export class WorkflowActivity extends Model {
  public id: string;
  public code: string;
  public name: string;
  public className: string;
  public description?: string;
  public image?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public displayOrder?: number;
  public workflowStates?: WorkflowState[];
  public workflowTypeActivities?: WorkflowTypeActivity[];
}
