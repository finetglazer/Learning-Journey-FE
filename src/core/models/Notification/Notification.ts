import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";

export class Notification extends Model {
  // public unread?: boolean;
  // public titleWeb?: string;
  // public contentWeb?: string;
  // public time?: Dayjs;

  public id?: string;
  public requestId?: string;
  public requestCode?: string;
  public requestName?: string;
  public notificationType?: number;
  public description?: string;
  public topicType?: number;
  public isReaded?: true;
  public createdDate?: Dayjs;
  public receiveUserIds?: string[];
}
