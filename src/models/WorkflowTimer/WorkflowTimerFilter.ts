import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowTimerFilter extends ModelFilter {
  public status?: number[];

  public workflowTypeId?: string;

  public createdDate?: Dayjs;

  public createdUser?: string;
}
