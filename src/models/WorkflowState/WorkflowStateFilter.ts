import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowStateFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;
  public workflowDefinitionId?: string;
  public activityCode?: string;
  public workflowActivityId?: string;
  public createdDate?: Dayjs;
  public createdUser?: string;
}
