import { Model } from "react-3layer-common";

export class GLAccount extends Model {
  public id?: string;

  public code?: string;

  public name?: string;

  public startDate?: string;

  public endDate?: string;

  public isActive?: boolean;
}
