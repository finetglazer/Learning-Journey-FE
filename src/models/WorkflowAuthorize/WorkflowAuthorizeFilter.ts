import { ModelFilter } from "react-3layer-common";

export class WorkflowAuthorizeFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number;

  public workflowType?: string;

  public workflowState?: string;
}
