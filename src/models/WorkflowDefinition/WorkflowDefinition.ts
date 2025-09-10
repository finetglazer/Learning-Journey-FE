import { Dayjs } from "dayjs";
import { WorkflowOrganization } from "models/WorkflowOrganization";
import { WorkflowRequest } from "models/WorkflowRequest";
import { WorkflowState } from "models/WorkflowState";
import { WorkflowTransition } from "models/WorkflowTransition";
import { WorkflowType } from "models/WorkflowType";
import { Model } from "react-3layer-common";

export class WorkflowDefinition extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public description?: string;
  public startDate?: Dayjs;
  public endDate?: Dayjs;
  public status?: number;
  public classifier?: number;
  public createdDate?: Dayjs;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Dayjs;
  public updatedUserName?: string;
  public createdUserName?: string;
  public diagram?: string;
  public workflowTypeId?: string;
  public organizationId?: string;
  public organization?: WorkflowOrganization;
  public workflowRequests?: WorkflowRequest[];
  public workflowStates?: WorkflowState[];
  public workflowTransitions?: WorkflowTransition[];
  public workflowType?: WorkflowType;
}
