import { Model } from "react-3layer-common";

export interface PurchaseRequestBranch {
  id?: string;
  code?: string;
  name?: string;
}

export interface PurchaseRequestUnit {
  id?: string;
  code?: string;
  name?: string;
}

export interface PurchaseRequestDepartment {
  id?: string;
  code?: string;
  name?: string;
}

export interface PurchaseSummary extends Model {
  id?: string;
  purchasePlanId?: string;
  code?: string;
  name?: string;
  classification?: number;
  createdDate?: string;
  approvedDate?: string;
  amountBeforeTax?: string;
  taxAmount?: string;
  totalAmount?: string;
  currency?: string;
  supplierId?: string;
  supplierCode?: string;
  supplierName?: string;
  costSaving?: string;
  createdUser?: string;
  createdUserFullName?: string;
  organizationId?: string;
  organizationCode?: string;
  organizationName?: string;
  status?: number;
  purchaseRequestId?: string;
  purchaseRequestCode?: string;
  purchaseRequestName?: string;
  purchaseRequestCreatedDate?: string;
  purchaseRequestCurrency?: string;
  purchaseRequestTotalAmount?: number;
  purchaseRequestSubmissionDate?: string;
  purchaseRequestBranch?: PurchaseRequestBranch;
  purchaseRequestUnit?: PurchaseRequestUnit;
  purchaseRequestDepartment?: PurchaseRequestDepartment;
  purchaseRequestCreatedUser?: string;
  purchaseRequestCreatedUserFullName?: string;
}
