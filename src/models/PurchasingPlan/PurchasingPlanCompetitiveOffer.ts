import { PurchasingPlanModel, PurchasingPlanTypeModel } from "./PurchasingPlan";

export interface SelectSupplierTabDefaultProps {
  contextValue: PurchasingPlanModel;
  data?: any;
  isDetailTicket?: boolean;
}

export interface IExchangeRateTable {
  id?: string;
  supplierId?: string;
  name?: string;
  supplier?: {
    id?: string;
    name?: string;
    code?: string;
    shortName?: string;
  };
  supplierName?: string;
  supplierShortName?: string;
  description?: string;
  quotationCode?: string;
  currency?: string;
  quoteRate?: string;
  supplierPurchasePlanId?: string;
  closingRate?: number;
}
