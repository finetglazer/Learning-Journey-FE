import {
  CONTRACT_ORDER,
  CONTRACT_ORDER_CREATE,
  CONTRACT_ORDER_PRINCIPAL,
  CONTRACT_ORDER_PRINCIPAL_CREATE,
  CONTRACT_ROUTE_CREATE,
  CONTRACT_ROUTE_VIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { AcceptanceStatus } from "models/Acceptance/AcceptanceFilter";
import {
  ActionRowType,
  ContractAddType,
  ContractAdvancedFilters,
  ContractStatus,
  ContractType,
  TicketTypeNumber,
} from "models/Contract";
import { ProjectSettlementStatus } from "models/ProjectSettlement";
import { PurchasingPlan, PurchasingPlanTypeModel } from "models/PurchasingPlan";
import { ReceivedGoodsStatus } from "models/ReceivingGood";
import { PaymentAdvancedFilters } from "../../models/Payment";

export const listContractStatus = [
  { id: ContractStatus.DRAFT, code: "DEFAULT", name: t("CM.txt_status_draft") },
  {
    id: ContractStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: ContractStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ContractStatus.REJECTED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ContractStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancel"),
  },
  {
    id: ContractStatus.TERMINATION,
    code: "INFO",
    name: t("CM.txt_status_termination"),
  },
  {
    id: ContractStatus.CLOSED,
    code: "INFO",
    name: t("CM.txt_status_closed"),
  },
];

export const listContractType = [
  { id: ContractType.CONTRACT, name: t("CM.txt_contract_type_contract") },
  { id: ContractType.PO, name: t("CM.txt_contract_type_po") },
  {
    id: ContractType.PO_CONTRACT_PRINCIPLES,
    name: t("CM.txt_contract_type_po_contract_principles"),
  },
];

export const listContractAdvancedFilters = [
  {
    id: ContractAdvancedFilters.AWAITING_DELIVERY,
    name: t("CM.txt_contract_advanced_filters_awaiting_delivery"),
  },
  {
    id: ContractAdvancedFilters.LATE_DELIVERY,
    name: t("CM.txt_contract_advanced_filters_late_delivery"),
  },
];

export const contractRequestTypeMap = {
  [ContractType.CONTRACT]: t("CT.txt_contract"),
  [ContractType.PO]: t("CT.txt_purchase_order"),
  [ContractType.PO_CONTRACT_PRINCIPLES]: t(
    "CT.txt_purchase_order_contract_principles"
  ),
};

export const paymentAdvancedFilters = [
  {
    id: PaymentAdvancedFilters.AWAITING_PAYMENT,
    name: t("CM.txt_awaiting_payment"),
  },
];

export const LOCAL_STORAGE_CONTRACT_LIST = "LOCAL_STORAGE_CONTRACT_LIST";
export const LOCAL_STORAGE_CONTRACT_WAIT_CREATE_LIST =
  "LOCAL_STORAGE_CONTRACT_WAIT_CREATE_LIST";

export const LOCAL_STORAGE_ACTION_STATE = "LOCAL_STORAGE_STATE";
export const LOCAL_STORAGE_ACCEPTANCE = "LOCAL_STORAGE_ACCEPTANCE";
export const LOCAL_STORAGE_CONTRACT_ANNEX = "LOCAL_STORAGE_CONTRACT_ANNEX";
export const LOCAL_STORAGE_CONTRACT_ADJUSTMENT =
  "LOCAL_STORAGE_CONTRACT_ADJUSTMENT";

//  receive goods
export const listReceivedGoodsStatus = () => [
  {
    id: ReceivedGoodsStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_draft"),
  },
  {
    id: ReceivedGoodsStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: ReceivedGoodsStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ReceivedGoodsStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ReceivedGoodsStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_cancel"),
  },
];

//  acceptance
export const listAcceptanceStatus = () => [
  {
    id: AcceptanceStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_draft"),
  },
  {
    id: AcceptanceStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: AcceptanceStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: AcceptanceStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: AcceptanceStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_cancelled"),
  },
];

// project settlement
export const listProjectSettlementStatus = () => [
  {
    id: ProjectSettlementStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_draft"),
  },
  {
    id: ProjectSettlementStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: ProjectSettlementStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ProjectSettlementStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ProjectSettlementStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_cancelled"),
  },
];

export const combineNameAndCode = (code?: string, name?: string): string => {
  if (isEmpty(code) && isEmpty(name)) {
    return "";
  }

  return `${code} - ${name}`;
};

export const listContractRequestTypeKey = [
  {
    id: CONTRACT_ROUTE_CREATE,
    code: ContractAddType.Contract,
    name: t("CT.txt_contract"),
    action: [ActionRowType.EDIT],
  },
  {
    id: CONTRACT_ORDER_CREATE,
    code: ContractAddType.PurchaseOrder,
    name: t("CT.txt_purchase_order"),
    action: [ActionRowType.EDIT],
  },
  {
    id: CONTRACT_ORDER_PRINCIPAL_CREATE,
    code: ContractAddType.PurchaseOrderContractPrinciples,
    name: t("CT.txt_purchase_order_contract_principles"),
    action: [ActionRowType.EDIT],
  },
  {
    id: CONTRACT_ROUTE_VIEW,
    code: ContractAddType.Contract,
    name: t("CT.txt_contract"),
    action: [ActionRowType.VIEW, ActionRowType.VIEW_APPROVE],
  },
  {
    id: CONTRACT_ORDER,
    code: ContractAddType.PurchaseOrder,
    name: t("CT.txt_purchase_order"),
    action: [ActionRowType.VIEW, ActionRowType.VIEW_APPROVE],
  },
  {
    id: CONTRACT_ORDER_PRINCIPAL,
    code: ContractAddType.PurchaseOrderContractPrinciples,
    name: t("CT.txt_purchase_order_contract_principles"),
    action: [ActionRowType.VIEW, ActionRowType.VIEW_APPROVE],
  },
];

export const listRedirectTicketTypeNumber = [
  {
    id: TicketTypeNumber.ShoppingPlan,
    code: PURCHASING_PLAN_VIEW_ROUTE,
    name: TicketTypeNumber.ShoppingPlan,
  },
  {
    id: TicketTypeNumber.ShoppingRequest,
    code: PURCHASE_REQUEST_VIEW_ROUTE,
    name: TicketTypeNumber.ShoppingPlan,
  },
  {
    id: TicketTypeNumber.Policy,
    code: PROPOSAL_DETAIL_ROUTE,
    name: "proposal",
  },
];

export const getPurchasingPlanObject = (model: PurchasingPlanTypeModel) => {
  if (!model) return;
  const purchasingPlan = new PurchasingPlan();
  purchasingPlan.id = model.id;
  purchasingPlan.code = model.code;
  purchasingPlan.name = model.name;
  purchasingPlan.createUser = model.createUser;
  purchasingPlan.createUserName = model.createUserName;
  purchasingPlan.purchasePlanType = model.purchasePlanType?.id;
  purchasingPlan.status = model.status;
  purchasingPlan.profileEvaluation = model.profileEvaluation;
  return purchasingPlan;
};
