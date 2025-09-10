import { HistoryType, TopicType } from "core/models/History";
import { Model } from "react-3layer-common";

export interface HistoryModel extends Model {
  adjustmentSlipId?: string;
  performer?: string;
  actionName?: string;
  performerRole?: string;
  executionTime?: string;
  signatureFileLink?: string;
  type?: TopicType;
  historyType?: HistoryType;
  createdDate?: string;
  createUserId?: string;
  createUser?: string;
}

export interface HistoryProps
  extends Pick<HistoryModel, "type" | "historyType"> {
  topicId: string;
  originalId?: string;
  hasBorder?: boolean;
  defaultActiveKey?: string[];
}
