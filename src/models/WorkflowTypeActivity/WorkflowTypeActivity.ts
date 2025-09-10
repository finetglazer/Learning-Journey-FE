import { WorkflowActivity } from "models/WorkflowActivity";
import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowTypeActivity extends Model {
  public id?: string;
  public workflowTypeId?: string;
  public workflowActivityId?: string;
  public workflowActivity?: WorkflowActivity;
  public workflowType?: WorkflowType;
}
