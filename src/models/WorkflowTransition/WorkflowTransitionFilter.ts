import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowTransitionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public trigger?: string;

  public createdDate?: Dayjs;

  public createdUser?: string;

  public workflowDefinitionId?: string;

  public fromWorkflowStateId?: string;

  public toWorkflowStateId?: string;
}
