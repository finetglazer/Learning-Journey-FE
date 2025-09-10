import { Model } from "react-3layer-common";

export interface PurchaseRequirementSummaryModel extends Model {
  order?: string;
  purchaseRequestCreatedDate?: string;
  proposalId?: string;
  proposalCode?: string;
  purchaseRequestId?: string;
  purchaseRequestCode?: string;
  purchaseRequestName?: string;
  purchaseRequestApprovedDate?: string;
  project?: string;
  costType?: string;
  costGroup?: string;
  amountBeforeTax?: string;
  otherAmount?: string;
  tax?: string;
  totalAmount?: string;
  currency?: string;
  status?: string;
  purchaseUnit?: string;
  branchTransactionOfficeCreated?: string;
  bankBlockCreated?: string;
  departmentCreated?: string;
  creator?: string;
}
