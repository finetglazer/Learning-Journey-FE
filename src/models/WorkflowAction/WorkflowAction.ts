import { Model } from "react-3layer-common";

export class WorkflowAction extends Model {
  public id?: string;
  public reason?: string;
  public requestTaskId?: string;
  public commandCode?: string;
}
