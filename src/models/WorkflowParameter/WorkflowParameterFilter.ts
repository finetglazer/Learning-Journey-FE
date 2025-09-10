import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowParameterFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public createdUserName?: string;

  public createdUser?: string;

  public createdDate?: Dayjs;
}
