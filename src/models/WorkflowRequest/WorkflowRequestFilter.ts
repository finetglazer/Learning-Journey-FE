import { ModelFilter } from "react-3layer-common";

export class WorkflowRequestFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public scheme?: string;

  public createdUser?: string;

  public workflowDefinition?: string;
}
