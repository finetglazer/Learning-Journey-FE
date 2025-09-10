import { t } from "i18next";
import { isNil } from "lodash";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  BUDGET_ADJUST_DETAIL_ROUTE,
  BUDGET_DETAIL_ROUTE,
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
  CONTRACT_ANNEX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
  CONTRACT_ROUTE_VIEW,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_ADJUST_VIEW_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";

export enum TagFilterEnum {
  ALL = -1,
  WAIT_SIGNE,
  SIGNED,
}

export interface TagFilterList {
  title: string;
  value: string;
}

export const listLegalStatus = () => [
  {
    id: TagFilterEnum.WAIT_SIGNE,
    code: "IN_PROGRESS",
    name: t("legalSignature.waiting_for_signature"),
  },
  {
    id: TagFilterEnum.SIGNED,
    code: "SUCCESS",
    name: t("legalSignature.signed"),
  },
];

/**
 * Combines two strings with a dash separator.
 * If both strings are undefined or null, an empty string is returned.
 * If only one of the strings is undefined or null, the other string is returned.
 * If both strings have values, they are concatenated with a dash separator.
 *
 * @param text1 - The first string to be combined.
 * @param text2 - The second string to be combined.
 * @returns The combined string.
 * @summary David's - david.jonathan@mail.com
 */
export const combineText = (text1?: string, text2?: string): string => {
  let dash = "";
  if (isNil(text1) && isNil(text2)) {
    return dash;
  }

  if (!isNil(text1) && !isNil(text2)) {
    dash = " - ";
  }

  return `${text1 || ""}${dash}${text2 || ""}`;
};

export enum TicketType {
  Budget, // Yêu cầu ngân sách
  BudgetAdjustment, // Điều chỉnh kế hoạch ngân sách
  BudgetSettlement, // Quyết toán ngân sách
  PurchaseProposal, // Chủ trương
  PurchaseProposalAdjustment, // Điều chỉnh chủ trương
  PurchaseRequest, // Yêu cầu mua sắm
  PurchaseRequestAdjustment, // Điều chỉnh yêu cầu mua sắm
  PurchasePlan, // Phương án mua sắm,
  Contract, // Hợp đồng/Đơn đặt hàng
  ContractAppendix, // Phụ lục hợp đồng/Đơn đặt hàng
  ContractAdjustment, // Điều chỉnh hợp đồng/PO
  PrincipleContract, // Hợp đồng nguyên tắc
  PrincipleContractAppendix, // Phụ lục hợp đồng nguyên tắc
  Receipt, // Nhận hàng
  Acceptance, // Nghiệm thu
  TempReceipt, // Tạm nhập tài sản
  ContractSettlement, // Quyết toán hợp đồng/PO
  ProjectSettlement, // Quyết toán dự án
  PaymentRequest, // Đề nghị thanh toán
  AdvanceRequest, // Đề nghị tạm ứng
  PlanToSpendRequest, // Đề nghị dự chi
  AccountingRequest, // Đề nghị hạch toán
  DepositRequest, // Đề nghị đặt cọc
}

export const listTicketType = [
  {
    id: TicketType.Budget,
    url: BUDGET_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.budget"),
  },
  {
    id: TicketType.BudgetAdjustment,
    url: BUDGET_ADJUST_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.budget_adjustment"),
  },
  {
    id: TicketType.BudgetSettlement,
    url: BUDGET_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.budget_settlement"),
  },
  {
    id: TicketType.PurchaseProposal,
    url: PROPOSAL_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.purchase_proposal"),
  },
  {
    id: TicketType.PurchaseProposalAdjustment,
    url: PROPOSAL_ADJUST_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.purchase_proposal_adjustment"),
  },
  {
    id: TicketType.PurchaseRequest,
    url: PURCHASE_REQUEST_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.purchase_request"),
  },
  {
    id: TicketType.PurchaseRequestAdjustment,
    url: PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.purchase_request_adjustment"),
  },
  {
    id: TicketType.PurchasePlan,
    url: PURCHASING_PLAN_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.purchase_plan"),
  },
  {
    id: TicketType.Contract,
    url: CONTRACT_ROUTE_VIEW,
    name: t("legalSignature.ticket_type.contract"),
  },
  {
    id: TicketType.ContractAppendix,
    url: CONTRACT_ANNEX_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.contract_appendix"),
  },
  {
    id: TicketType.ContractAdjustment,
    url: CONTRACT_ADJUSTMENT_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.contract_adjustment"),
  },
  {
    id: TicketType.PrincipleContract,
    url: CONTRACT_PRINCIPLE_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.principle_contract"),
  },
  {
    id: TicketType.PrincipleContractAppendix,
    url: CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.principle_contract_appendix"),
  },
  {
    id: TicketType.Receipt,
    url: RECEIVING_GOODS_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.receipt"),
  },
  {
    id: TicketType.Acceptance,
    url: ACCEPTANCE_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.acceptance"),
  },
  {
    id: TicketType.TempReceipt,
    url: TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.temp_receipt"),
  },
  {
    id: TicketType.ContractSettlement,
    url: SETTLEMENT_VIEW_ROUTE,
    name: t("legalSignature.ticket_type.contract_settlement"),
  },
  {
    id: TicketType.ProjectSettlement,
    url: PROJECT_SETTLEMENT_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.project_settlement"),
  },
  {
    id: TicketType.PaymentRequest,
    url: PAYMENT_REQUEST_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.payment_request"),
  },
  {
    id: TicketType.AdvanceRequest,
    url: ADVANCE_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.advance_request"),
  },
  {
    id: TicketType.PlanToSpendRequest,
    url: EXPENSE_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.plan_to_spend_request"),
  },
  {
    id: TicketType.AccountingRequest,
    url: ACCOUNTING_ENTRY_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.accounting_request"),
  },
  {
    id: TicketType.DepositRequest,
    url: DEPOSIT_DETAIL_ROUTE,
    name: t("legalSignature.ticket_type.deposit_request"),
  },
];
