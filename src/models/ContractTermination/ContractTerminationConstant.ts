import {
  ACCEPTANCE_DETAIL_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";

export const VND_CURRENCY = "VND";

export enum ContractRequestType {
  Contract, //Hợp đồng
  PurchaseOrder, //Đơn đặt hàng
  PurchaseOrderHDNT, //Đơn  đặt hàng theo HĐNT
}

export enum RelatedSlipType {
  PurchaseProposal = 1, // Chủ trương
  PurchaseRequest = 2, // Yêu cầu mua sắm
  PurchasePlan = 3, // Phương án mua sắm
  Acceptance = 4, //Nghiệm thu
}

export const listRedirectTicketTypeNumber = [
  {
    id: RelatedSlipType.PurchaseProposal,
    url: PROPOSAL_DETAIL_ROUTE,
  },
  {
    id: RelatedSlipType.PurchaseRequest,
    url: PURCHASE_REQUEST_VIEW_ROUTE,
  },
  {
    id: RelatedSlipType.PurchasePlan,
    url: PURCHASING_PLAN_VIEW_ROUTE,
  },
  {
    id: RelatedSlipType.Acceptance,
    url: ACCEPTANCE_DETAIL_ROUTE,
  },
];

export enum TAB_MASTER {
  ALL = "0",
  MINE = "1",
  IN_PROGRESS = "2",
  APPROVAL = "3",
}
export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  EDIT,
  CREATE,
  VIEW_CONTRACT,
}

export enum PricingType {
  SETTLEMENT = "Quyết toán",
  CONTRACT = "Hợp đồng",
  DIFFERENCE = "Chênh lệch",
}

export enum SettlementType {
  NEW_PURCHASE = "Mua mới",
  UPGRADE = "Nâng cấp",
}

export enum ContractTerminationStatus {
  WAITING_FOR_APPROVE = 1, // Chờ duyệt
  APPROVED = 2, // Đã duyệt
  DECLINED = 3, // Từ chối
  CANCELED = 4, // Đã hủy
}
