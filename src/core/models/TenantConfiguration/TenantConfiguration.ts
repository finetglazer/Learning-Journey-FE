import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class TenantConfiguration extends Model {
  @Field(String)
  public companyLogo?: string;
  @Field(String)
  public companyName?: string;
  @Field(String)
  public companyDomain?: string;
}
