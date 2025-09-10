import { Model } from "react-3layer-common";

export class SLAModel extends Model {
  public order?: string;
  public id?: string;
  public code?: string;
  public name?: string;
  public secondaryCode?: string;
  public executionTime?: string;
  public reportType?: string;
  public reportTypeName?: string;
  public reportTypeCode?: string;
  public reportCode?: string;
  public proponent?: string;
  public createdBusinessUnit?: string;
  public unitProposing?: string;
  public createdDate?: string;
  public reviewer?: string;
  public approvedDate?: string;
  public amount?: string;
  public currency?: string;
  public status?: string;
}
