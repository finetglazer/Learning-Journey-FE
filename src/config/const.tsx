import {
  User,
  UserActivity,
  UserAdmin,
  UserCertification,
} from "@carbon/icons-react";
import { numberConstants } from "core/config/consts";
import i18nTranslation, { translate } from "core/config/i18n";
import { t } from "i18next";
import { ReceivedType, ShoppingMethod } from "models/Contract";
import { TYPE_OF_PAYMENT_TYPE } from "models/Payment";
import {
  EContractValueType,
  EDirectContractingType,
  PurposeShoppingEnum,
} from "models/Proposal";
import {
  DocumentEvaluationStatus,
  EvaluationResultsStatus,
  PassFlag,
} from "models/PurchasingPlan";

i18nTranslation.initialize();

export const globalAdminType = {
  bgColor: "#EDE5FF",
  color: "#491D8B",
  icon: <UserCertification size={24} />,
  description: translate("adminTypes.description.globalAdmin"),
  subSystemDescription: translate(
    "adminTypes.subSystemDescription.globalAdmin"
  ),
};

export const organizationAdminType = {
  bgColor: "#D0E2FF",
  color: "#002D9C",
  icon: <UserAdmin size={24} />,
  description: translate("adminTypes.description.organizationAdmin"),
  subSystemDescription: translate(
    "adminTypes.subSystemDescription.organizationAdmin"
  ),
};

export const siteAdminType = {
  bgColor: "#D9FBFB",
  color: "#004144",
  icon: <UserActivity size={24} />,
  description: translate("adminTypes.description.siteAdmin"),
  subSystemDescription: translate("adminTypes.subSystemDescription.siteAdmin"),
};

export const user = {
  bgColor: "#F4F4F4",
  color: "#525252",
  icon: <User size={24} />,
  description: translate("adminTypes.description.user"),
  subSystemDescription: translate("adminTypes.subSystemDescription.user"),
};

export const fieldType = {
  ID: "ID",
  STRING: "STRING",
  LONG: "LONG",
  DECIMAL: "DECIMAL",
  DATE: "DATE",
};

export const permissionOperator = {
  ID_EQ: "ID_EQ",
  ID_NE: "ID_NE",
  ID_IN: "ID_IN",
  ID_NI: "ID_NI",
  ID_IN_TR: "ID_IN_TR",
  ID_NI_TR: "ID_NI_TR",
  STRING_NE: "STRING_NE",
  STRING_EQ: "STRING_EQ",
  STRING_SW: "STRING_SW",
  STRING_NSW: "STRING_NSW",
  STRING_EW: "STRING_EW",
  STRING_NEW: "STRING_NEW",
  STRING_CTL: "STRING_CT",
  STRING_NC: "STRING_NC",
  LONG_GT: "LONG_GT",
  LONG_GE: "LONG_GE",
  LONG_LT: "LONG_LT",
  LONG_LE: "LONG_LE",
  LONG_NE: "LONG_NE",
  LONG_EQ: "LONG_EQ",
  LONG_GROUPIN_LT_LT: "LONG_GROUPIN_LT_LT",
  LONG_GROUPIN_LE_LE: "LONG_GROUPIN_LE_LE",
  LONG_GROUPIN_LT_LE: "LONG_GROUPIN_LT_LE",
  LONG_GROUPIN_LE_LT: "LONG_GROUPIN_LE_LT",
  DECIMAL_GT: "DECIMAL_GT",
  DECIMAL_GE: "DECIMAL_GE",
  DECIMAL_LT: "DECIMAL_LT",
  DECIMAL_LE: "DECIMAL_LE",
  DECIMAL_NE: "DECIMAL_NE",
  DECIMAL_EQ: "DECIMAL_EQ",
  DECIMAL_GROUPIN_LT_LT: "DECIMAL_GROUPIN_LT_LT",
  DECIMAL_GROUPIN_LE_LE: "DECIMAL_GROUPIN_LE_LE",
  DECIMAL_GROUPIN_LT_LE: "DECIMAL_GROUPIN_LT_LE",
  DECIMAL_GROUPIN_LE_LT: "DECIMAL_GROUPIN_LE_LT",
  DATE_GT: "DATE_GT",
  DATE_GE: "DATE_GE",
  DATE_LT: "DATE_LT",
  DATE_LE: "DATE_LE",
  DATE_NE: "DATE_NE",
  DATE_EQ: "DATE_EQ",
  DATE_GROUPIN_LT_LT: "DATE_GROUPIN_LT_LT",
  DATE_GROUPIN_LE_LE: "DATE_GROUPIN_LE_LE",
  DATE_GROUPIN_LT_LE: "DATE_GROUPIN_LT_LE",
  DATE_GROUPIN_LE_LT: "DATE_GROUPIN_LE_LT",
};

export const userApproval = {
  APPUSER_APPROVE: "APPUSER_APPROVE",
  ROLE_APPROVE: "ROLE_APPROVE",
  PARTNER_APPROVE: "PARTNER_APPROVE",
  PARTNER_ROLE_APPROVE: "PARTNER_ROLE_APPROVE",
};

export const listStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("CM.txt_status_cancelled") },
];

export const listPaymentStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") }, //nháp
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") }, //Chờ duyệt
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") }, //"Đã duyệt
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") }, //Từ chối
  { id: 4, code: "ERROR", name: t("CM.txt_status_cancelled") }, //Đã hủy
];

export const listProposalStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("CM.txt_cancel") },
  { id: 5, code: "INFO", name: t("CM.txt_status_closed") },
];

export const listPurchaseRequestStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") },
  { id: 1, code: "SUCCESS", name: t("CM.txt_status_approved") },
  { id: 2, code: "INFO", name: t("CM.txt_status_created_pams") },
  { id: 3, code: "SUCCESS", name: t("CM.txt_status_completed") },
  { id: 4, code: "ERROR", name: t("CM.btn_cancel") },
  { id: 5, code: "ERROR", name: t("CM.txt_status_rejected") },
  { id: 6, code: "IN_PROGRESS", name: t("CM.txt_status_queue") }, //Chờ duyệt
];

export enum PurchaseRequestStatus {
  DRAFT = 0,
  APPROVED = 1,
  CREATED = 2,
  COMPLETED = 3,
  CANCEL = 4,
}

export enum ProposalStatus {
  DRAFT = 0,
  IN_PROGRESS = 1,
  SUCCESS = 2,
  ERROR = 3,
  CANCEL = 4,
  CLOSED = 5,
}

export const listPaymentStatusErpEnum = [
  { id: 0, code: "DEFAULT", name: "Final ERP" },
  { id: 1, code: "PENDING", name: "Pending ERP" },
  { id: 2, code: "ERROR", name: "Error ERP" },
  { id: 3, code: "REJECTED", name: "Rejected ERP" },
  { id: 4, code: "PROCESSING", name: "Processing ERP" },
  { id: 5, code: "NOT_EXISTED", name: "Not Existed ERP" },
  { id: 6, code: "NULL", name: "Null" },
];

export const listTypeEnum = [
  { id: 0, name: t("CM.txt_type_create"), code: 0 },
  { id: 1, name: t("CM.txt_type_adjust"), code: 1 },
  { id: 2, name: t("CM.txt_type_adjust"), code: 2 },
  { id: 3, name: t("CM.txt_type_settlement"), code: 3 },
];

export const listTypeEnumFilter = [
  { id: 0, name: t("CM.txt_type_create"), code: 0 },
  { id: 1, name: t("CM.txt_type_adjust"), code: 1 },
  { id: 3, name: t("CM.txt_type_settlement"), code: 3 },
];

export const listTypeEnumStatusResponse = [
  { id: 1, name: t("OC.not_response_yet"), code: "DEFAULT" },
  { id: 2, name: t("OC.agree"), code: "SUCCESS" },
  { id: 3, name: t("OC.disagree"), code: "ERROR" },
  { id: 5, name: t("OC.overdue"), code: "DEFAULT" },
];

export const listPaymentMethodEnum = [
  { id: 0, code: "BankTransfer", name: t("PM.txt_bank_transfer") },
  {
    id: 1,
    code: "BankTransferWithReimbursement ",
    name: t("PM.txt_bank_transfer_reimbursement"),
  },
  { id: 2, code: "Reimbursement", name: t("PM.txt_bank_reimbursement") },
  { id: 3, code: "Reimbursement", name: t("PM.no_payment") },
];

export const listPurposeShoppingEnum = [
  {
    id: PurposeShoppingEnum.RegularPurchasing,
    code: "RegularPurchasing",
    name: t("PM.txt_regular_purchasing"),
  },
  {
    id: PurposeShoppingEnum.PromotionalPurchasing,
    code: "PromotionalPurchasing",
    name: t("PM.txt_promotional_purchasing"),
  },
  {
    id: PurposeShoppingEnum.RepairAndMaintenance,
    code: "RepairAndMaintenance",
    name: t("PM.txt_repair_maintenance"),
  },
  {
    id: PurposeShoppingEnum.ProjectBased,
    code: "ProjectBased",
    name: t("PM.txt_project_based"),
  },
  {
    id: PurposeShoppingEnum.StoragePurchasing,
    code: "StoragePurchasing",
    name: t("PM.txt_buy_stock_storage"),
  },
  {
    id: PurposeShoppingEnum.FinancialLease,
    code: "AssetLease",
    name: t("PM.txt_finance_lease"),
  },

  { id: PurposeShoppingEnum.Other, code: "Other", name: t("PM.txt_other") },
];

export const listFeedbackOpinionStatusEnum = [
  { id: -2, name: t("OC.not_response_yet"), code: "DEFAULT" },
  { id: -1, name: t("OC.overdue"), code: "DEFAULT" },
  { id: 1, name: t("OC.agree"), code: "SUCCESS" },
  { id: 2, name: t("OC.disagree"), code: "ERROR" },
  { id: 3, name: t("OC.no_comment"), code: "INFO" },
];

export const listMenuShoppingType = [
  {
    id: ShoppingMethod.ASSIGN_WARRANTY,
    name: t("CT.create_contract.purchase_plan_type.assign_warranty"),
    code: ShoppingMethod.ASSIGN_WARRANTY,
  },
  {
    id: ShoppingMethod.CONTRACT_FOLLOW,
    name: t("CT.create_contract.purchase_plan_type.contract_follow"),
    code: ShoppingMethod.CONTRACT_FOLLOW,
  },
  {
    id: ShoppingMethod.COMPETITIVE_OFFERING,
    name: t("CT.create_contract.purchase_plan_type.competitive_offering"),
    code: ShoppingMethod.COMPETITIVE_OFFERING,
  },
  {
    id: ShoppingMethod.BIDDING,
    name: t("CT.create_contract.purchase_plan_type.bidding"),
    code: ShoppingMethod.BIDDING,
  },
];

export const listCurrency = [
  {
    id: 0,
    name: t("CT.currency.vnd"),
  },
  {
    id: 1,
    name: t("CT.currency.usd"),
  },
];

export const listAppointmentMethodEnum = [
  {
    id: EDirectContractingType.DIRECT_CONTRACTING_WITH_ASSESSMENT,
    name: t("PP.direct_contracting_with_assessment"),
  },
  {
    id: EDirectContractingType.DIRECT_CONTRACTING_WITHOUT_ASSESSMENT,
    name: t("PP.direct_contracting_without_assessment"),
  },
];

export const listContractValueTypeEnum = [
  {
    id: EContractValueType.INCLUSIVE_OF_TAX,
    name: t("PP.inclusive_of_tax_text"),
  },
  {
    id: EContractValueType.EXCLUSIVE_OF_TAX,
    name: t("PP.exclusive_of_tax_text"),
  },
];

export const listReceivedType = [
  {
    id: ReceivedType.SingleReceiver,
    code: ReceivedType.SingleReceiver,
    name: t("CT.create_contract.title.one_person_received"),
  },
  {
    id: ReceivedType.MultipleReceivers,
    code: ReceivedType.MultipleReceivers,
    name: t("CT.create_contract.title.more_people_received"),
  },
];

export const listLogServiceEnum = [
  {
    id: "Auth",
    name: "Auth",
  },
  {
    id: "Budget",
    name: "Budget",
  },
  {
    id: "Email",
    name: "Email",
  },
  {
    id: "File",
    name: "File",
  },
  {
    id: "Gateway",
    name: "Gateway",
  },
  {
    id: "MasterData",
    name: "MasterData",
  },
  {
    id: "Payment",
    name: "Payment",
  },
  {
    id: "Purchasing",
    name: "Purchasing",
  },
  {
    id: "Share",
    name: "Share",
  },
];

export const listLogLevelEnum = [
  {
    id: "Verbose",
    name: "Verbose",
  },
  {
    id: "Debug",
    name: "Debug",
  },
  {
    id: "Information",
    name: "Information",
  },
  {
    id: "Warning",
    name: "Warning",
  },
  {
    id: "Error",
    name: "Error",
  },
  {
    id: "Fatal",
    name: "Fatal",
  },
];

export const fileEtx = {
  JS: "js",
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpeg",
  CSV: "csv",
  DOC: "doc",
  DOCX: "docx",
  XLS: "xls",
  XLSX: "xlsx",
  TXT: "txt",
  ZIP: "zip",
  RAR: "rar",
  PDF: "pdf",
  SVG: "svg",
  PPT: "ppt",
  PPTX: "pptx",
  XLSM: "xlsm",
};

export const LOCAL_STORAGE_BUDGET_LIST = "LOCAL_STORAGE_BUDGET_LIST";

export const LIST_TYPE_BUDGET_ADJUST = [
  {
    id: 1,
    name: t("BG.budget_transfer"),
  },
  {
    id: 2,
    name: t("BG.budget_increase_decrease"),
  },
];

export const LIST_TYPE_PROPOSAL = [
  {
    id: 0,
    name: t("PP.regular_procurement"),
  },
  {
    id: 1,
    name: t("PP.direct_payment"),
  },
];

export const LIST_TYPE_PURCHASE_FROM = [
  {
    id: 1,
    name: t("PR.decentralized_purchase"),
  },
  {
    id: 0,
    name: t("PR.centralized_purchase"),
  },
];

export const LIST_EVALUATION_METHOD = [
  {
    id: 0,
    name: t("PL.txt_scoring"),
  },
  {
    id: 1,
    name: t("PL.txt_pass_or_fail"),
  },
];

export const LIST_ROLE_EVALUATION = [
  {
    id: 0,
    name: t("PL.txt_technical_team_member"),
  },
  {
    id: 1,
    name: t("PL.txt_finance_team_member"),
  },
  {
    id: 2,
    name: t("PL.txt_technical_leader"),
  },
  {
    id: 3,
    name: t("PL.txt_financial_leader"),
  },
  {
    id: 4,
    name: t("PL.txt_project_director"),
  },
];

export const TOPIC_TYPE = {
  BUDGET_REQUEST: 1,
  PAYMENT_REQUEST: 2,
  PURCHASE_REQUEST: 3,
  PURCHASE_PROPOSAL: 4,
  CONTRACT: 11,
  CONTRACT_PRINCIPLE: 18,
  ADJUST_PURCHASE_PROPOSAL: 12,
  ADJUST_PURCHASE_REQUEST: 13,
  PURCHASE_PLAN: 14,
  CONTRACT_ADJUSTMENT: 16,
  TEMPORARY_IMPORT_ASSET: 17,
  ACCEPTANCE: 19,
  ADJUST_PURCHASE_PLAN: 20,
  CONTRACT_SETTLEMENT: 21,
  PROJECT_SETTLEMENT: 22,
  TOPIC_FINANCIAL: 23,
  CONTRACT_LIQUIDATION: 25,
  PURCHASING_PLAN_ADJUST_COMPETITIVE_OFFER: 26,
  PURCHASING_PLAN_COMPETITIVE_OFFER: 28,
  PURCHASING_PLAN_ADJUST_BIDDING: 29,
};

export const LOCAL_STORAGE_PAYMENT_LIST = "LOCAL_STORAGE_PAYMENT_LIST";

export const LOCAL_STORAGE_PROPOSAL_LIST = "LOCAL_STORAGE_PROPOSAL_LIST";

export const LOCAL_STORAGE_PURCHASE_REQUEST_LIST =
  "LOCAL_STORAGE_PURCHASE_REQUEST_LIST";

export const LOCAL_STORAGE_CONTRACT_LIST = "LOCAL_STORAGE_CONTRACT_LIST";
export const LOCAL_STORAGE_PURCHASING_PLAN_LIST =
  "LOCAL_STORAGE_PURCHASING_PLAN_LIST";

export const LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST =
  "LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST";

export const LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET =
  "LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET";
export const LOCAL_STORAGE_SETTLEMENT = "LOCAL_STORAGE_SETTLEMENT";
export const LOCAL_STORAGE_CONTRACT_LIQUIDATION =
  "LOCAL_STORAGE_CONTRACT_LIQUIDATION";
export const REMEMBER_ME = "LOCAL_STORAGE_REMEMBER_ME";
export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const VIEW_TOKEN = "VIEW_TOKEN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const EMAIL = "email";
export const PROTECT = "protect";
export const NUMBER_MAX_13 = 9999999999999.99;
export const MAX_DIGITAL_NUMBER_4_DIGITS = 4;
export const MAX_DIGITAL_NUMBER_2_DIGITS = 2;
export const NOT_AVAILABLE = "N/A";

export const listStatus = [
  {
    id: numberConstants.ZERO,
    code: "INACTIVE",
    name: t("CM.txt_status_deactivate"),
  },
  {
    id: numberConstants.ONE,
    code: "ACTIVE",
    name: t("CM.txt_status_active"),
  },
];

export const listPurchasingPlanType = [
  { id: 1, name: t("PL.type_direct_bid"), code: 1 },
  { id: 2, name: t("PL.type_contract"), code: 2 },
  { id: 3, name: t("PL.type_competitive_bid"), code: 3 },
  { id: 4, name: t("PL.type_bidding"), code: 4 },
];

export const listPurchasingPlanStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") }, // Nháp
  { id: 14, code: "IN_PROGRESS", name: t("CM.txt_status_pending_approval") }, // Chờ duyệt HS
  { id: 15, code: "SUCCESS", name: t("CM.txt_status_approved_profile") }, // Đã duyệt HS
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") }, // Từ chối
  { id: 4, code: "ERROR", name: t("CM.txt_awaiting_cancel") }, // Chờ hủy
  { id: 11, code: "ERROR", name: t("CM.txt_status_cancelled") }, // Đã hủy
  { id: 16, code: "IN_PROGRESS", name: t("CM.txt_status_issued") }, // Phát hành HS
  { id: 5, code: "IN_PROGRESS", name: t("CM.txt_status_pending_quote") }, // Chờ báo giá
  { id: 9, code: "INFO", name: t("CM.txt_status_bidding") }, // Chào thầu
  { id: 6, code: "INFO", name: t("CM.txt_status_provided_quote") }, // Đã báo giá
  { id: 13, code: "IN_PROGRESS", name: t("CM.txt_status_pending_open") }, // Chờ mở hồ sơD
  { id: 12, code: "INFO", name: t("CM.txt_status_opened") }, // Mở hồ sơ
  { id: 17, code: "INFO", name: t("CM.txt_status_scoring") }, // Chấm chào giá
  { id: 10, code: "INFO", name: t("CM.txt_status_bid_review") }, // Chấm thầu
  { id: 18, code: "INFO", name: t("CM.txt_status_negotiated") }, // Đàm phán
  { id: 19, code: "INFO", name: t("CM.txt_status_negotiating") }, // Đang đàm phán
  { id: 7, code: "INFO", name: t("CM.txt_status_select_supplier") }, // Chọn NCC
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") }, // Chờ duyệt
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") }, // Đã duyệt
  { id: 20, code: "SUCCESS", name: t("CM.txt_bid_end") }, // Kết thúc chấm thầu
];

export const goodsReceiptTrackingStatus = [
  { id: 0, name: t("CM.txt_status_create_new"), code: "DEFAULT" }, // Tạo mới
  { id: 1, name: t("CM.txt_status_pending_approval"), code: "IN_PROGRESS" }, // Gửi duyệt
  { id: 2, name: t("CM.txt_status_approved"), code: "SUCCESS" }, // Phê duyệt
  { id: 3, name: t("CM.txt_status_declined"), code: "ERROR" }, // Từ chối
  { id: 4, name: t("CM.txt_status_canceled"), code: "ERROR" }, // Huỷ
];

export const purchaseRequirementSummaryStatus = [
  { id: 0, name: t("CM.txt_status_draft"), code: "DEFAULT" }, // Nháp
  { id: 1, name: t("CM.txt_status_approved"), code: "SUCCESS" }, // Phê duyệt
  { id: 2, name: t("CM.txt_status_created_pams"), code: "IN_PROGRESS" }, // Đã tạo PAMS
  { id: 3, name: t("CM.txt_status_completed"), code: "SUCCESS" }, // Đã hoàn thành
  { id: 4, name: t("CM.txt_status_canceled"), code: "ERROR" }, // Huỷ
  { id: 5, name: t("CM.txt_status_rejected"), code: "ERROR" }, // Từ chối
];

export const proposalSummaryStatus = [
  { id: 0, name: t("CM.txt_status_draft"), code: "DEFAULT" }, // Nháp
  { id: 1, name: t("CM.txt_status_pending_approval"), code: "IN_PROGRESS" }, // Chờ duyệt
  { id: 2, name: t("CM.txt_status_approved"), code: "SUCCESS" }, // Phê duyệt
  { id: 3, name: t("CM.txt_status_declined"), code: "ERROR" }, // Từ chối
  { id: 4, name: t("CM.txt_status_canceled"), code: "ERROR" }, // Huỷ
  { id: 5, name: t("CM.txt_status_closed"), code: "ERROR" }, // Đã đóng
];

export enum PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS {
  DRAFT = 0, // Bản nháp
  WAITING_FOR_APPROVE = 1, // Chờ duyệt
  APPROVED = 2, // Đã duyệt
  DECLINED = 3, // Từ chối
  WAITING_CANCELED = 4, // Chờ hủy
  WAITING_QUOTE = 5, // Chờ báo giá
  QUOTED = 6, // Đã báo giá
  SELECT_SUPPLIER = 7, // Chọn nhà cung cấp (NCC)
  SELECTED_SUPPLIER = 8, // Đã chọn NCC
  BID = 9, // Chào thầu
  BIDDING = 10, // Chấm thầu
  CANCEL = 11, // Đã hủy
  OPEN_PROFILE = 12, // Mở hồ sơ
  WAITING_FOR_OPEN_PROFILE = 13, // Chờ mở hồ sơ
  PROFILE_WAITING_FOR_APPROVE = 14, // Chờ duyệt HS
  PROFILE_APPROVED = 15, // Đã duyệt HS
  PROFILE_PUBLISHED = 16, // Phát hành HS
  EVALUATE_QUOTATION = 17, // Chấm chào giá
  NEGOTIATE = 18, // Đàm phán
  NEGOTIATING = 19, // Đang đàm phán
  END_OF_BIDDING = 20, // Kết thúc chấm thầu
}

export const listAdjustPurchasingPlanStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") }, // Nháp
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") }, // Chờ duyệt
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") }, // Đã duyệt
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") }, // Từ chối
  { id: 4, code: "ERROR", name: t("CM.txt_awaiting_cancel") }, // Chờ hủy
  { id: 5, code: "ERROR", name: t("CM.txt_status_cancel") }, // Đã hủy
];

export const listTemporaryImportAssetStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("TIA.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("TIA.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("TIA.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("TIA.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("TIA.txt_status_cancelled") },
];

export const listSettlementContractEnum = [
  { id: 0, code: "DEFAULT", name: t("TIA.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("TIA.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("TIA.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("TIA.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("TIA.txt_status_cancelled") },
];

export const listContractLiquidationEnum = [
  { id: 0, code: "DEFAULT", name: t("TIA.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("TIA.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("TIA.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("TIA.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("TIA.txt_status_cancelled") },
];

export const listReportCostItemsEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") },
  { id: 1, code: "IN_PROGRESS", name: t("CM.txt_status_queue") },
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("CM.txt_status_cancelled") },
];

export const listInvestmentProjectPortfolioStatusEnum = [
  { id: 0, code: "DEFAULT", name: t("CM.txt_status_draft") },
  {
    id: 1,
    code: "IN_PROGRESS",
    name: t("CM.txt_waiting_for_approval"),
  },
  { id: 2, code: "SUCCESS", name: t("CM.txt_status_approved") },
  { id: 3, code: "ERROR", name: t("CM.txt_status_rejected") },
  { id: 4, code: "ERROR", name: t("CM.txt_status_cancelled") },
  { id: 5, code: "DEFAULT", name: t("CM.txt_status_closed") },
];

export const listReportTypeEnum = [
  { id: 0, name: t("CM.txt_budget_plan") },
  { id: 1, name: t("CM.txt_budget_adjust") },
  { id: 2, name: t("CM.txt_budget_settlement") },
  { id: 3, name: t("CM.txt_purchase_proposal") },
  { id: 4, name: t("CM.txt_purchase_proposal_adjust") },
  { id: 5, name: t("CM.txt_purchase_request") },
  { id: 6, name: t("CM.txt_purchase_request_adjust") },
  { id: 7, name: t("CM.txt_purchasing_plan_direct_award") },
  { id: 8, name: t("CM.txt_purchasing_plan_principle") },
  { id: 9, name: t("CM.txt_purchasing_plan_competitive_bidding") },
  { id: 10, name: t("CM.txt_purchase_plan_bidding") },
  { id: 11, name: t("CM.txt_contract") },
  { id: 12, name: t("CM.txt_contract_appendix") },
  { id: 13, name: t("CM.txt_contract_adjust") },
  { id: 14, name: t("CM.txt_receiving_goods") },
  { id: 15, name: t("CM.txt_acceptance") },
  { id: 16, name: t("CM.txt_temporary_import_asset") },
  { id: 17, name: t("CM.txt_contract_settlement") },
  { id: 18, name: t("CM.txt_contract_termination") },
  { id: 19, name: t("CM.txt_project_settlement") },
  { id: 20, name: t("CM.txt_payment") },
  { id: 21, name: t("CM.txt_advance_payment") },
  { id: 22, name: t("CM.txt_advance_request") },
  { id: 23, name: t("CM.txt_deposit") },
  { id: 24, name: t("CM.txt_accounting") },
  { id: 25, name: t("CM.txt_contract_principle") },
  { id: 26, name: t("CM.txt_contract_principle_appendix") },
  { id: 27, name: t("CM.txt_purchasing_plan_bidding_adjust") },
  { id: 28, name: t("CM.txt_purchasing_plan_competitive_bidding_adjust") },
];

export enum CalculationValue {
  ABSOLUTE_VALUE = 0,
  PERCENTAGE_RATE = 1,
  PAYMENT_TERM = 2,
}

export const listValueCalculationPaymentSchedule = [
  {
    id: CalculationValue.ABSOLUTE_VALUE,
    name: t("CT.absolute_value"),
  },
  {
    id: CalculationValue.PERCENTAGE_RATE,
    name: t("CT.percentage_rate"),
  },
  {
    id: CalculationValue.PAYMENT_TERM,
    name: t("CT.payment_term"),
  },
];

export const listTypeSuggestion = [
  {
    id: 0,
    name: t("CT.payment"),
    type: TYPE_OF_PAYMENT_TYPE.PAYMENT,
  },
  {
    id: 1,
    name: t("CT.advance"),
    type: TYPE_OF_PAYMENT_TYPE.ADVANCE,
  },
  {
    id: 2,
    name: t("CT.estimate"),
    type: TYPE_OF_PAYMENT_TYPE.EXPENSE,
  },
  {
    id: 3,
    name: t("CT.deposit"),
    type: TYPE_OF_PAYMENT_TYPE.DEPOSIT,
  },
];

export enum PaymentTimeType {
  DAYS = 0,
  DATE = 1,
}

export enum PaymentMilestoneType {
  CONTRACT = 0,
  SETTLEMENT = 1,
  LIQUIDATION = 2,
}

export const listPaymentTimeType = [
  {
    id: PaymentTimeType.DAYS,
    name: t("CT.enter_days"),
  },
  {
    id: PaymentTimeType.DATE,
    name: t("CT.enter_date"),
  },
];

export const listPaymentMilestoneType = [
  {
    id: PaymentMilestoneType.CONTRACT,
    name: t("CT.from_contract_effective_date"),
  },
  {
    id: PaymentMilestoneType.SETTLEMENT,
    name: t("CT.from_settlement_effective_date"),
  },
  {
    id: PaymentMilestoneType.LIQUIDATION,
    name: t("CT.from_liquidation_effective_date"),
  },
];

export enum TextMode {
  INSERT = "insert",
  COMMAND = "command",
}

export enum DragActions {
  MOVE = "MOVE",
  SCALE = "SCALE",
  NO_MOVEMENT = "NO_MOVEMENT",
}

export enum WarrantyCalculationTime {
  ActualDate = 0,
  Commissioning = 1,
}

export const listWarrantyCalculationTime = [
  {
    id: WarrantyCalculationTime.ActualDate,
    name: t("CT.actual_receipt_date"),
  },
  {
    id: WarrantyCalculationTime.Commissioning,
    name: t("CT.commissioning_date"),
  },
];

export enum WarrantyCalculationTimeEnum {
  ActualReceivedDate, // Ngày nhận thực tế
  DateOfUse, // Ngày đưa vào sử dụng
}

export const listEvaluationResultsStatus = [
  {
    id: EvaluationResultsStatus.Reviewing,
    name: t("PL.txt_reviewing"),
    code: "INFO",
  },
  {
    id: EvaluationResultsStatus.Reviewed,
    name: t("PL.txt_reviewed"),
    code: "SUCCESS",
  },
  {
    id: EvaluationResultsStatus.GatherOpinion,
    name: t("PL.txt_gather_opinion"),
    code: "IN_PROGRESS",
  },
  {
    id: EvaluationResultsStatus.WaitingForApproval,
    name: t("PL.txt_waiting_forApproval"),
    code: "IN_PROGRESS",
  },
  {
    id: EvaluationResultsStatus.Completed,
    name: t("PL.txt_completed"),
    code: "SUCCESS",
  },
  {
    id: EvaluationResultsStatus.AwaitingGrading,
    name: t("PL.waiting_for_review"),
    code: "IN_PROGRESS",
  },
];

export const listDocumentEvaluationStatus = [
  {
    id: DocumentEvaluationStatus.Reviewing,
    name: t("PL.txt_reviewing"),
    code: "INFO",
  },
  {
    id: DocumentEvaluationStatus.Reviewed,
    name: t("PL.txt_reviewed"),
    code: "SUCCESS",
  },
  {
    id: DocumentEvaluationStatus.GatherOpinion,
    name: t("PL.waiting_for_review"),
    code: "IN_PROGRESS",
  },
];

export const listEvaluation = [
  {
    id: PassFlag.Passed,
    name: t("PL.txt_pass"),
  },
  {
    id: PassFlag.NotPassed,
    name: t("PL.txt_not_pass"),
  },
];

export const QUERY_PARAM_PREFIX = "?";

export const QUERY_PARAM_SEPARATOR = "&";

export const QUERY_KEY_VALUE_SEPARATOR = "=";

export enum EModal {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  VIEW = "VIEW",
  DELETE = "DELETE",
  CREATE_NEXT_QUOTATION_ROUND = "CreateNextQuotationRound",
  CONFIRM_NEXT_NEGOTIATION_ROUND = "ConfirmNextNegotiationRound",
  CONFIRM_SELECT_FINAL_SUPPLIER = "ConfirmSelectFinalSupplier",
  SELECT_SUPPLIER = "SelectSupplier",
}

export enum MENU_CODE {
  PKG = "PKG",
  PKG_REQUEST = "PKG_REQUEST",
  PAYMENT = "PAYMENT",
  PAYMENT_REQUEST = "PAYMENT_REQUEST",
  PURCHASE = "PURCHASE",
  PURCHASE_PROPOSAL = "PURCHASE_PROPOSAL",
  PURCHASE_REQUEST = "PURCHASE_REQUEST",
  PURCHASE_PLAN = "PURCHASE_PLAN",
  PURCHASE_PRINCIPLE_CONTRACT = "PURCHASE_PRINCIPLE_CONTRACT",
  PURCHASE_CONTRACT = "PURCHASE_CONTRACT",
  PURCHASE_GOODS_RECEIPT = "PURCHASE_GOODS_RECEIPT",
  PURCHASE_ACCEPTANCE = "PURCHASE_ACCEPTANCE",
  PURCHASE_TEMP_RECEIPT = "PURCHASE_TEMP_RECEIPT",
  PURCHASE_CONTRACT_SETTLEMENT = "PURCHASE_CONTRACT_SETTLEMENT",
  PURCHASE_PROJECT_SETTLEMENT = "PURCHASE_PROJECT_SETTLEMENT",
  PURCHASE_CONTRACT_LIQUIDATION = "PURCHASE_CONTRACT_LIQUIDATION",
  CATALOG = "CATALOG",
  CATALOG_COSTLINE = "CATALOG_COSTLINE",
  CATALOG_COST_DRIVER = "CATALOG_COST_DRIVER",
  CATALOG_BUSINESS_BRANCH = "CATALOG_BUSINESS_BRANCH",
  CATALOG_BUSINESS_DEPARTMENT = "CATALOG_BUSINESS_DEPARTMENT",
  CATALOG_BUSINESS_UNIT = "CATALOG_BUSINESS_UNIT",
  CATALOG_GOODS_SERVICES_CATEGORY = "CATALOG_GOODS_SERVICES_CATEGORY",
  CATALOG_GOODS_SERVICE = "CATALOG_GOODS_SERVICE",
  CATALOG_GOODSERVICETYPE = "CATALOG_GOODSERVICETYPE",
  CATALOG_UNIT_OF_MEASURE_GROUP = "CATALOG_UNIT_OF_MEASURE_GROUP",
  CATALOG_BANK = "CATALOG_BANK",
  CATALOG_CURRENCY = "CATALOG_CURRENCY",
  CATALOG_RATEOFEXCHANGE = "CATALOG_RATEOFEXCHANGE",
  CATALOG_TAX = "CATALOG_TAX",
  CATALOG_COST_TYPE = "CATALOG_COST_TYPE",
  CATALOG_COSTITEM = "CATALOG_COSTITEM",
  CATALOG_COSTLINE_COSTGROUP_CONFIG = "CATALOG_COSTLINE_COSTGROUP_CONFIG",
  CATALOG_UNIT_OF_MEASURE = "CATALOG_UNIT_OF_MEASURE",
  CATALOG_SUPPLIER_TYPE = "CATALOG_SUPPLIER_TYPE",
  CATALOG_GL_ACCOUNT = "CATALOG_GL_ACCOUNT",
  CATALOG_PROMOTION = "CATALOG_PROMOTION",
  CATALOG_GUARANTEE_TYPE = "CATALOG_GUARANTEE_TYPE",
  CATALOG_WARRANTY_TYPE = "CATALOG_WARRANTY_TYPE",
  CATALOG_WARRANTY_METHOD = "CATALOG_WARRANTY_METHOD",
  CATALOG_GOODS_SERVICE_COSTGROUP_CONFIG = "CATALOG_GOODS_SERVICE_COSTGROUP_CONFIG",
  CATALOG_LEGAL_ENTITY = "CATALOG_LEGAL_ENTITY",
  CATALOG_DOCUMENT_TYPE = "CATALOG_DOCUMENT_TYPE",
  CATALOG_DEPARTMENT_SEGMENT_MAPPING = "CATALOG_DEPARTMENT_SEGMENT_MAPPING",
  CATALOG_CONTRACT_METHOD = "CATALOG_CONTRACT_METHOD",
  CATALOG_CONTRACT_TERM = "CATALOG_CONTRACT_TERM",
  CATALOG_SUPPLIER_EVALUATION_CONFIG = "CATALOG_SUPPLIER_EVALUATION_CONFIG",
  CATALOG_MANUFACTURERS = "CATALOG_MANUFACTURERS",
  CATALOG_PAYMENT_CONDITION = "CATALOG_PAYMENT_CONDITION",
  CATALOG_CONTRACT_TYPE = "CATALOG_CONTRACT_TYPE",
  CATALOG_CENTRALIZED_PURCHASING_UNIT = "CATALOG_CENTRALIZED_PURCHASING_UNIT",
  CATALOG_CALCULATOR_PARAM_CONFIG = "CATALOG_CALCULATOR_PARAM_CONFIG",
  CATALOG_MANAGE_SUPPLIER = "CATALOG_MANAGE_SUPPLIER",
  CATALOG_INVOICE = "CATALOG_INVOICE",
  CATALOG_BAND = "CATALOG_BAND",
  CATALOG_RANK = "CATALOG_RANK",
  CATALOG_POSITION = "CATALOG_POSITION",
  CATALOG_COSTCENTERALLOCATION = "CATALOG_COSTCENTERALLOCATION",
  CATALOG_PERSONNEL_BY_UNIT = "CATALOG_PERSONNEL_BY_UNIT",
  CATALOG_SUPPLIER_CATEGORY_CONFIG = "CATALOG_SUPPLIER_CATEGORY_CONFIG",
  CATALOG_SIGNATURE_CONFIG = "CATALOG_SIGNATURE_CONFIG",
  CATALOG_SIGNATURE_SUPPLIER = "CATALOG_SIGNATURE_SUPPLIER",
  CATALOG_NATION = "CATALOG_NATION",
  SYSTEM_MANAGEMENT = "SYSTEM_MANAGEMENT",
  SYSTEM_MANAGEMENT_COMMENT = "SYSTEM_MANAGEMENT_COMMENT",
  REPORT_PAYMENT = "REPORT_PAYMENT",
  REPORT_PAYMENT_BY_COSTGROUP = "REPORT_PAYMENT_BY_COSTGROUP",
  REPORT_PAYMENT_BY_PROMOTION = "REPORT_PAYMENT_BY_PROMOTION",
  REPORT_PAYMENT_BY_APPROVAL_AUTHORITY = "REPORT_PAYMENT_BY_APPROVAL_AUTHORITY",
  REPORT_BUDGET = "REPORT_BUDGET",
  REPORT_BUDGET_USAGE_MASTER = "REPORT_BUDGET_USAGE_MASTER",
  REPORT_BUDGET_CONTROL_MASTER = "REPORT_BUDGET_CONTROL_MASTER",
  REPORT_INVESTMENT_PROJECT_PORTFOLIO_MASTER = "REPORT_INVESTMENT_PROJECT_PORTFOLIO_MASTER",
  REPORT_PURCHASE = "REPORT_PURCHASE",
  REPORT_PURCHASE_PLAN_SUMMARY = "REPORT_PURCHASE_PLAN_SUMMARY",
  REPORT_PURCHASE_PLAN_DETAIL = "REPORT_PURCHASE_PLAN_DETAIL",
  REPORT_PURCHASE_ORDER_CONTRACT_MASTER = "REPORT_PURCHASE_ORDER_CONTRACT_MASTER",
  REPORT_PURCHASE_ORDER_CONTRACT_DETAIL = "REPORT_PURCHASE_ORDER_CONTRACT_DETAIL",
  REPORT_PURCHASE_GOODS_SERVICE_OF_CONTRACT_DETAIL = "REPORT_PURCHASE_GOODS_SERVICE_OF_CONTRACT_DETAIL",
  REPORT_PURCHASE_TRACKING_DELIVERY_GOODS_SERVICE = "REPORT_PURCHASE_TRACKING_DELIVERY_GOODS_SERVICE",
  REPORT_PURCHASE_DEBT_OF_CONTRACT_DETAIL = "REPORT_PURCHASE_DEBT_OF_CONTRACT_DETAIL",
  REPORT_PURCHASE_CHANGE_SUPPLIER_INFO = "REPORT_SUPPLIER_HISTORY",
  REPORT_PURCHASE_GOODS_SERVICE_DETAIL = "REPORT_PURCHASE_GOODS_SERVICE_DETAIL",
  REPORT_PURCHASE_DAILY_TRANSACTION = "REPORT_PURCHASE_DAILY_TRANSACTION",
  REPORT_PURCHASE_DEBT_OF_SUPPLIER_DETAIL = "REPORT_PURCHASE_DEBT_OF_SUPPLIER_DETAIL",
  REPORT_PURCHASE_REQUEST_SUMMARY = "REPORT_PURCHASE_REQUEST_SUMMARY",
  REPORT_PURCHASE_SUMMARY_PURCHASING_POLICY = "REPORT_PURCHASE_SUMMARY_PURCHASING_POLICY",
  SLA = "SLA",
}
