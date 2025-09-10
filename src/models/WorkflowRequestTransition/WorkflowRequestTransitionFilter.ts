import { ModelFilter } from "react-3layer-common";

export class WWorkflowRequestTransitionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number;

  public workflowStateId?: string;

  public requestId?: string;
}
