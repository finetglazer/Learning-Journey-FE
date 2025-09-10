export interface BasicEntity {
  id?: string;
  name?: string;
  code?: string;
}

export interface Tax extends BasicEntity {
  rate?: number;
}

export interface GoodsItem {
  id: string;
  goodsId?: string;
  code?: string;
  name?: string;
  taxId?: string;
  unitId?: string;
  manufacturerId?: string;
  quantity?: number;
  unitPrice?: number;
  description?: string;
  note?: string;
  unit?: BasicEntity;
  branch?: BasicEntity;
  tax?: Tax;
  taxAmount?: number;
  amountBeforeTax?: number;
  totalAmount?: number;
  currency?: string;
  supplierId?: string;
  selectedSupplier?: BasicEntity;
  numberOfRounds?: number;
}

export interface ContractTerm {
  id: string;
  name?: string;
  description?: string;
}

export interface PurchaseDataType {
  id: string;
  code?: string;
  name?: string;
  classification?: number;
  createdDate?: string;
  approvedDate?: string;
  createUser?: string;
  createUserFullName?: string;
  organization?: BasicEntity;
  note?: string;
  costType?: BasicEntity;
  costGroup?: BasicEntity;
  purchaseProposalCode?: string;
  purchaseProposalId?: string;
  purchaseRequestCode?: string;
  purchaseRequestId?: string;
  purchaseRequestTotalAmount?: number;
  currency?: string;
  goodsItems?: GoodsItem[];
  contractTerms?: ContractTerm[];
}
