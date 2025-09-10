import { Model } from "react-3layer-common";

export class WorkflowCommand extends Model {
  public id?: string;
  public name?: string;
  public description?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public workflowTypeId?: string;

  public requestTaskId?: string;
}
