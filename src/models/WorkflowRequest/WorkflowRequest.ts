import { Dayjs } from "dayjs";
import { WorkflowDefinition } from "models/WorkflowDefinition";
import { WorkflowRequestParameter } from "models/WorkflowRequestParameter";
import { WorkflowRequestState } from "models/WorkflowRequestState";
import { Model } from "react-3layer-common";

export class WorkflowRequest extends Model {
  public id?: string;
  public workflowDefinitionId?: string;
  public name?: string;
  public description?: string;
  public scheme: string;
  public metaData?: string;
  public status?: number;
  public createdDate?: Dayjs;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Dayjs;
  public updatedUserName?: string;
  public createdUserName?: string;
  public workflowDefinition?: WorkflowDefinition;
  public workflowRequestParameters?: WorkflowRequestParameter[];
  public workflowRequestStates?: WorkflowRequestState[];
}
