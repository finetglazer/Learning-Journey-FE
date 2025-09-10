import { Model } from "react-3layer-common";

export class CriteriaConfiguration extends Model {
  public code?: string;
  public name?: string;
  public id?: string;
  public criteriaGroupCode?: string;
  public criteriaGroupName?: string;
  public criteriaGroupId?: string;
  public criteriaIds?: string[];
  public isActive?: boolean = true;
  public criteriaCode?: string;
  public criteriaName?: string;
}
