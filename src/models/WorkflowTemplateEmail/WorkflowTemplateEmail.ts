import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";

export class WorkflowTemplateEmail extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public template?: string;
  public description?: string;
  public status?: number;
  public createdDate?: Dayjs;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Dayjs;
  public updatedUserName?: string;
  public createdUserName?: string;
}
