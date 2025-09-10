import { ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class CalculatorParamConfigFilter extends ModelFilter {
  @Field(String)
  public description?: string;

  @Field(String)
  public configValue?: string;

  @Field(Boolean)
  public isActive?: boolean;

  public statuses?: number[];

  public codes?: string[];

  @Field(String)
  public name?: string;
}
