import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class WorkflowOrganizationFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public status?: number;

  public workflowTypeId?: string;

  public createdUser?: string;

  public updatedDate?: Dayjs;

  public createdUserName?: string;
}
