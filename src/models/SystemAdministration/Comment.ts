import { Model } from "react-3layer-common";
import { Field, ObjectList } from "react-3layer-decorators";

export class UserModel extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public positionId?: string;

  @Field(String)
  public departmentId?: string;
}

export class Comment extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public topicId?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public content?: string;

  @Field(String)
  public createdDate?: string;

  @Field(Array)
  public tagIds?: string[]; // Users tag in comment

  @ObjectList(UserModel)
  public userTags?: UserModel[];

  @ObjectList(UserModel)
  public creator?: UserModel[];
}
