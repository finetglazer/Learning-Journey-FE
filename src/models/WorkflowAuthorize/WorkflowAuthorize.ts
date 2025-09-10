import { Model } from "react-3layer-common";

export class WorkflowActor extends Model {
  public id?: string;
  public authorizeBy?: string;
  public authorizeTo?: string;
  public workflowType?: string;
  public workflowState?: string;
  public workflowTransition?: string;
  public requestId?: string;
  public condition?: string;
  public startDate?: Date;
  public endDate?: Date;
  public status?: number;
  public createdDate?: Date;
  public createdUser?: string;
  public updatedUser?: string;
  public updatedDate?: Date;
  public updatedUserName?: string;
  public createdUserName?: string;
}
