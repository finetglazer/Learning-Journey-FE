import { RequesterDetail } from "models/OpinionCollector";
import { Model } from "react-3layer-common";

export class OpinionFeedback extends Model {
  id?: string;
  code?: string;
  title?: string;
  responseDueDate?: string;
  isRequired?: boolean;
  topicId?: string;
  topicType?: number;
  createUserDetail?: RequesterDetail;
  respondedCount?: number;
  responseStatus?: number;
  detailUrl?: string;
}
