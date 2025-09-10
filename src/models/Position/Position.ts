import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";

export class Position extends Model {
  public id?: string;

  public name?: string;

  public type?: number;

  public effectiveDate?: Dayjs;

  public isActive?: boolean = true;

  public reportToId?: string;

  public reportToName?: string;
}
