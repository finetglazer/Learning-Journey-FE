import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowTimer extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public workflowTypeId?: string;
  public type?: string;
  public value?: number;
  public days?: number;
  public hours?: number;
  public description?: string;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
  public displayOrder?: number;
  public workflowType?: WorkflowType;
}
