import { HistoryType, TopicType } from "core/models/History";
import { ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class HistoryRequestModel extends ModelFilter {
  @Field(String)
  public topicId: string;
  @Field(String)
  public originalId?: string;
  @Field(Number)
  public type: TopicType;
  @Field(Number)
  public historyType: HistoryType;
}
