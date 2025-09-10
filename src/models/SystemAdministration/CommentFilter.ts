import { DateFilter } from "react-3layer-advance-filters";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class CommentFilter extends Model {
  @Field(String)
  public code?: string;

  @Field(String)
  public content?: string;

  @Field(Array)
  public tagIds?: string[]; // Users tag in comment

  @Field(Array)
  public creatorIds?: string[]; // Users who created the comment

  @ObjectField(DateFilter)
  public startDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;

  @Field(Boolean)
  public isReset?: boolean;
}
