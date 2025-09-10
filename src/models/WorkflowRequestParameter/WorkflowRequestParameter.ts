import { WorkflowRequest } from "models/WorkflowRequest/WorkflowRequest";
import { Model } from "react-3layer-common";

export class WorkflowRequestParameter extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public requestId?: string;
  public value: string;
  public dataType: string;
  public purpose: string;
  public request?: WorkflowRequest;
}
