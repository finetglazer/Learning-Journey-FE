import { ModelFilter } from "react-3layer-common";

export class WorkflowRequestStateFilter extends ModelFilter {
  public requestId?: string;

  public stateCode?: string;

  public createdUser?: number;
}
