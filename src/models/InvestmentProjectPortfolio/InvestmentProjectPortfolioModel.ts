import { Model } from "react-3layer-common";

export class InvestmentProjectPortfolioModel extends Model {
  public projectCode?: string;
  public projectName?: string;
  public startDate?: string;
  public endDate?: string;
  public businessUnitHandling?: string;
  public approvedAmount?: string;
  public settlementAmount?: string;
  public paidAmount?: string;
  public payableAmount?: string;
  public status?: number;
}