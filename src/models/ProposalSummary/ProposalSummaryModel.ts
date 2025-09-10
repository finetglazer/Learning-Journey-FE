import { Model } from "react-3layer-common";

export class ProposalSummaryModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public createdDate?: string;
  public approvedDate?: string;
  public costType?: string;
  public costGroup?: string;
  public projectCode?: string;
  public projectName?: string;
  public amountBeforeTax?: string;
  public tax?: string;
  public otherAmount?: string;
  public reservedAmount?: string;
  public totalAmount?: string;
  public currency?: string;
  public status?: string;
  public businessBranchCreated?: string;
  public bankBlockCreated?: string;
  public departmentCreated?: string;
  public creator?: string;
}
