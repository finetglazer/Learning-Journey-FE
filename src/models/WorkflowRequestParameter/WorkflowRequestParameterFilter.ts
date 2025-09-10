import { ModelFilter } from "react-3layer-common";

export class WorkflowRequestParameterFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public requestId?: string;
}
