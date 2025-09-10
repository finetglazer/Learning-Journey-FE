import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";

export interface LogTrackingModel extends Model {
  timestamp?: Dayjs;
  requestKey?: string;
  service?: string;
  level?: string;
  message?: string;
  environment?: string;
}
