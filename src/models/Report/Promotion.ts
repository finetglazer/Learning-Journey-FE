import { Model } from "react-3layer-common";

export interface BusinessEntity {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface BusinessDepartment extends BusinessEntity {
  businessUnitId: string;
  businessUnitCode: string;
  businessUnitName: string;
}

export interface PromotionItem extends BusinessEntity {
  budget: number;
  startDate: string;
  endDate: string;
}

export interface Promotion extends Model {
  id: string;
  paymentRequestId?: string;
  businessBranch?: BusinessEntity;
  businessUnit?: BusinessEntity;
  businessDepartment?: BusinessDepartment;
  code: string;
  paymentRequestType?: number;
  costGroup?: BusinessEntity;
  costType?: BusinessEntity;
  paymentMethod?: number;
  description?: string;
  currency?: string;
  amount?: number;
  exchangeAmount?: number;
  promotion?: Promotion;
  status?: number;
  createUser?: string;
  createUserFullName?: string;
  updateUser?: string;
  updateUserFullName?: string;
}
