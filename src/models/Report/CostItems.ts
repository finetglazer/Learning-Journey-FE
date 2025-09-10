import { Model } from "react-3layer-common";

export enum PaymentRequestTypeGroup {
  Payment = 0, // Thanh toán
  Advance = 1, // Tạm ứng
  PlanToSpend = 2, // Dự chi
  Accounting = 3, // Hạch toán
  Deposit = 4, // Đặt cọc
}

export enum PaymentMethod {
  BankTransfer = 0, // Chuyển khoản
  BankTransferWithReimbursement = 1, // Chuyển khoản, có hoàn ứng
  Reimbursement = 2, // Hoàn ứng
  NotSpendMoney = 3, // Không chi tiền
}

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

export interface CostItems extends Model {
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
  status?: number;
  approveUser?: string;
  finalERPDate?: string;
}

export const PaymentRequestType: Record<PaymentRequestTypeGroup, string> = {
  [PaymentRequestTypeGroup.Payment]: "Thanh toán",
  [PaymentRequestTypeGroup.Advance]: "Tạm ứng",
  [PaymentRequestTypeGroup.PlanToSpend]: "Dự chi",
  [PaymentRequestTypeGroup.Accounting]: "Hạch toán",
  [PaymentRequestTypeGroup.Deposit]: "Đặt cọc",
};

export const PaymentMethodType: Record<PaymentMethod, string> = {
  [PaymentMethod.BankTransfer]: "Chuyển khoản",
  [PaymentMethod.BankTransferWithReimbursement]: "Chuyển khoản, có hoàn ứng",
  [PaymentMethod.Reimbursement]: "Hoàn ứng",
  [PaymentMethod.NotSpendMoney]: "Không chi tiền",
};

export type User = {
  code?: string;
  departmentId?: string;
  email?: string;
  fullName?: string;
  id?: string;
  name?: string;
  organizationId?: string;
  phoneNumber?: string;
  positionId?: string;
  userName?: string;
};
