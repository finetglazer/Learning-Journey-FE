import { Model } from "react-3layer-common";

export class CriteriaContent extends Model {
  public code?: string;
  public name?: string;
  public id?: string;
  public maximumScore?: number;
  public description?: string;
  public isActive?: boolean = true;
}
