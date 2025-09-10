import { Dayjs } from "dayjs";
import { WorkflowDefinition } from "models/WorkflowDefinition";
import { Model } from "react-3layer-common";

export class WorkflowOrganization extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public description?: string;
  public status?: number;
  public parentId?: string;
  public createdDate?: Dayjs;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Dayjs;
  public updatedUserName?: string;
  public createdUserName?: string;
  public inverseParent?: WorkflowOrganization[];
  public parent?: WorkflowOrganization;
  public workflowDefinitions?: WorkflowDefinition[];
}
