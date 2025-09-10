import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowDefinitionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number[];

  public workflowTypeId?: string;

  public startDate?: Dayjs;

  public endDate?: Dayjs;

  public organizationId?: string;
}
