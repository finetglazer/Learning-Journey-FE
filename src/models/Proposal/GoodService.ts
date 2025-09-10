import { Model, ModelFilter } from "react-3layer-common";
import { CostGroup, CostType, PurchaseItem } from "./Proposal";
import { FileInfo } from "models/CostOwner/BudgetPlan";

export class GoodService extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public goodsServicesCategory?: CostType;
  public goodsServiceUnit?: GoodServiceValue;
  public costGroup?: CostGroup;
  public costType?: CostType;
  public referencePriceMin?: number;
  public referencePriceMax?: number;
  public contractPriceMin?: number;
  public contractPriceMax?: number;
}

export type CostLine = {
  id?: string;
  code?: string;
  name?: string;
  parentId?: string;
  parentName?: string;
  budgetPeriod?: number;
  budgetCalculationMethod?: number;
  costDriverId?: string;
  costDriver?: CostType;
  costDriverName?: string;
  isTransfer?: boolean;
  isBudgetOverruns?: boolean;
  isActive?: boolean;
  isUsed?: boolean;
  message?: string;
};

export class GoodServiceExtend extends GoodService {
  renderId?: string;
  quantity?: number;
  manufacturer?: GoodServiceValue;
  description?: string;
  unitPrice?: number;
  tax?: GoodServiceTax;
  note?: string;
  amountBeforeTax?: number;
  taxAmount?: number;
  totalAmount?: number;
  otherAmount?: number;
  category?: GoodServiceValue;
  notEdit?: boolean;
  originalTotalAmount?: number;
  isOriginalItem?: boolean;
}

export type GoodServiceByCategory = {
  id?: string;
  renderId?: string;
  goodsServicesCategoryId?: string;
  goodsServicesCategoryIsActive?: boolean;
  goodsServicesCategoryCode?: string;
  goodsServicesCategoryName?: string;
  children?: GoodServiceExtend[];
};

export class GoodServiceFilter extends ModelFilter {
  goodsServicesCategory?: GoodServiceCategory[];
  costType?: CostType;
  costGroup?: CostGroup;
}

export class GoodServiceResponseModel extends Model {
  public totalRecords: number;
  public pageIndex: number;
  public items: GoodService[];
}

export class Currency extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public symbol?: string;
}

export type GoodServiceResponseObservableModel = {
  data: GoodServiceResponseModel;
};

export type GoodServiceValue = {
  id?: string;
  code?: string;
  name?: string;
};

export interface GoodServiceCategory extends GoodServiceValue {
  isActive?: boolean;
}

export interface GoodServiceTax extends GoodServiceValue {
  rate?: number;
  taxType?: number;
  isActive?: boolean;
}

export interface SummaryItem {
  goodsId?: string;
  code?: string;
  name?: string;
  categoryId?: string;
  category?: GoodServiceCategory;
  purchaseProposalQuantity?: number;
  purchaseProposalTotalAmount?: number;
  remainingQuantity?: number;
  remainingTotalAmount?: number;
  renderId?: string;
}

export interface SummaryItemByCategory {
  id?: string;
  categoryId?: string;
  categoryCode?: string;
  categoryName?: string;
  children?: SummaryItem[];
}

export interface UploadFileGoodsServices {
  fileInfo?: FileInfo;
  purchaseItems?: PurchaseItem[];
}
