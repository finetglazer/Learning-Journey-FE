import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class EvaluationCriteria extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public description?: string;

  @Field(Number)
  public fromRatingScore?: number;

  @Field(Number)
  public toRatingScore?: number;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(Boolean)
  public isUsed?: boolean;
}
