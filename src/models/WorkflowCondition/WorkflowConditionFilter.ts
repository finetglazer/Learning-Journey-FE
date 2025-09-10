import { ModelFilter } from "react-3layer-common";

export class WorkflowConditionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public workflowDefinitionId?: string;
}
