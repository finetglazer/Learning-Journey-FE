import { Dayjs } from "dayjs";
import { WorkflowRequestTransition } from "models/WorkflowRequestTransition";
import { Model } from "react-3layer-common";

export class WorkflowRequestTask extends Model {
  public id?: string;
  public requestId?: string;
  public requestTransitionId?: string;
  public actorIdentityId?: string;
  public actorName?: string;
  public description?: string;
  public dateCreation?: Dayjs;
  public deadlineToStart?: Dayjs;
  public deadlineToComplete?: Dayjs;
  public dateStart?: Dayjs;
  public dateFinish?: Dayjs;
  public status: number;
  public requestTransition?: WorkflowRequestTransition;
}
