import { ROOT_ROUTE } from "core/config/consts";
import {
  TYPE_OF_PAYMENT_DETAIL_TYPE,
  TYPE_OF_PAYMENT_TYPE,
} from "models/Payment";
import { join } from "path";

// Portal Route:
export const PORTAL_ROUTE = "/portal";
export const PORTAL_APP_CATALOG_ROUTE = "/app-catalog";
export const PORTAL_LANDING_PAGE_ROUTE = "/landing-page";
export const PORTAL_APP_USER_ROUTE = join(PORTAL_ROUTE, "/app-user");

export const APP_ROUTE = join(ROOT_ROUTE, PORTAL_ROUTE);

// Dashbroad Route:
export const DASHBROAD_ROUTE = join(APP_ROUTE, "/home");

// Profile Route:
export const PROFILE_ROUTE = join(APP_ROUTE, "/profile");
export const OPINION_COLLECTOR_LIST_ROUTE = join(
  PROFILE_ROUTE,
  "/opinior-collector-list"
);

export const USER_NOTIFICATION_ROUTE = "/portal/user-notification";

// AppUser Route:
export const APP_USER_ROUTE = join(APP_ROUTE, "/app-user");
export const APP_USER_MASTER_ROUTE = join(APP_USER_ROUTE, "/app-user-master");
export const APP_USER_DETAIL_ROUTE = join(APP_USER_ROUTE, "/app-user-detail");
export const APP_USER_VIEW_ROUTE = join(APP_USER_DETAIL_ROUTE, "/view");
export const APP_USER_EDIT_ROUTE = join(APP_USER_DETAIL_ROUTE, "/edit");

// Budget Route:
export const BUDGET_ROUTE = join(APP_ROUTE, "/budget");
export const BUDGET_MASTER_ROUTE = join(BUDGET_ROUTE, "/budget-master");
export const BUDGET_DETAIL_ROUTE = join(BUDGET_ROUTE, "/budget-detail");
export const BUDGET_CREATE_ROUTE = join(BUDGET_ROUTE, "/budget-create");
export const BUDGET_EDIT_ROUTE = join(BUDGET_ROUTE, "/budget-edit");
export const BUDGET_ADJUST_CREATE_ROUTE = join(
  BUDGET_ROUTE,
  "/budget-adjust-create"
);
export const BUDGET_ADJUST_DETAIL_ROUTE = join(
  BUDGET_ROUTE,
  "/budget-adjust-detail"
);
export const BUDGET_ADJUST_EDIT_ROUTE = join(
  BUDGET_ROUTE,
  "/budget-adjust-edit"
);
export const BUDGET_CREATE_SETTLEMENT_ROUTE = join(
  BUDGET_ROUTE,
  "/budget-create-settlement"
);
export const BUDGET_EDIT_SETTLEMENT_ROUTE = join(
  BUDGET_ROUTE,
  "/budget-edit-settlement"
);

// Payment Route:
export const PAYMENT_ROUTE = join(APP_ROUTE, "/payment");
export const PAYMENT_MASTER_ROUTE = join(PAYMENT_ROUTE, "/payment-master");
export const PAYMENT_DETAIL_ROUTE = join(PAYMENT_ROUTE, "/payment-detail");
export const ACCOUNTING_ENTRY_VIEW_ROUTE = join(
  PAYMENT_ROUTE,
  "/accounting-entry-view"
);
export const PAYMENT_REQUEST_VIEW_ROUTE = join(
  PAYMENT_ROUTE,
  "/payment-request-view"
);
export const ADVANCE_VIEW_ROUTE = join(PAYMENT_ROUTE, "/advance-view");
export const EXPENSE_VIEW_ROUTE = join(PAYMENT_ROUTE, "/expense-view");
export const DEPOSIT_VIEW_ROUTE = join(PAYMENT_ROUTE, "/deposit-view");
export const PAYMENT_CREATE_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_TYPE.PAYMENT
);
export const PAYMENT_CREATE_ADVANCE_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_TYPE.ADVANCE
);
export const PAYMENT_CREATE_EXPENSE_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_TYPE.EXPENSE
);
export const PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_TYPE.ACCOUNTING_ENTRY
);
export const PAYMENT_CREATE_DEPOSIT_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_TYPE.DEPOSIT
);
export const PAYMENT_REQUEST_DETAIL_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_DETAIL_TYPE.PAYMENT
);
export const ADVANCE_DETAIL_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_DETAIL_TYPE.ADVANCE
);
export const EXPENSE_DETAIL_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_DETAIL_TYPE.EXPENSE
);
export const ACCOUNTING_ENTRY_DETAIL_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_DETAIL_TYPE.ACCOUNTING_ENTRY
);
export const DEPOSIT_DETAIL_ROUTE = join(
  PAYMENT_ROUTE,
  TYPE_OF_PAYMENT_DETAIL_TYPE.DEPOSIT
);

// Report Route:
export const REPORT_ROUTE = join(APP_ROUTE, "/report");
export const REPORT_PAYMENT_ROUTER = join(REPORT_ROUTE, "/payment");
export const REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_ROUTER = join(
  REPORT_PAYMENT_ROUTER,
  "/approval-authority"
);
export const REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_MASTER_ROUTER = join(
  REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_ROUTER,
  "/approval-authority-master"
);
export const REPORT_PAYMENT_BY_COST_ITEM_ROUTER = join(
  REPORT_PAYMENT_ROUTER,
  "/cost-item"
);
export const REPORT_PAYMENT_BY_COST_ITEM_MASTER_ROUTER = join(
  REPORT_PAYMENT_BY_COST_ITEM_ROUTER,
  "/cost-item-master"
);
export const REPORT_PAYMENT_BY_PROMO_ROUTER = join(
  REPORT_PAYMENT_ROUTER,
  "/promo"
);
export const REPORT_PAYMENT_BY_PROMO_MASTER_ROUTER = join(
  REPORT_PAYMENT_BY_PROMO_ROUTER,
  "/promo-master"
);

export const REPORT_BUDGET_ROUTER = join(REPORT_ROUTE, "/budget");
export const REPORT_BUDGET_USAGE_ROUTER = join(REPORT_BUDGET_ROUTER, "/usage");
export const REPORT_BUDGET_USAGE_MASTER_ROUTER = join(
  REPORT_BUDGET_USAGE_ROUTER,
  "/usage-master"
);
export const REPORT_BUDGET_CONTROL_ROUTER = join(
  REPORT_BUDGET_ROUTER,
  "/control"
);
export const REPORT_BUDGET_CONTROL_MASTER_ROUTER = join(
  REPORT_BUDGET_CONTROL_ROUTER,
  "/control-master"
);
export const REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER = join(
  REPORT_BUDGET_ROUTER,
  "/investment-project-portfolio"
);

export const REPORT_PURCHASE_ROUTER = join(REPORT_ROUTE, "/purchase");
export const REPORT_PURCHASE_SUMMARY_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/summary"
);
export const REPORT_PURCHASE_PLAN_SUMMARY_ROUTER = join(
  REPORT_PURCHASE_SUMMARY_ROUTER,
  "/purchase-plan-summary"
);

export const REPORT_PURCHASE_ORDER_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/order"
);
export const REPORT_ORDER_CONTRACT_MASTER_ROUTER = join(
  REPORT_PURCHASE_ORDER_ROUTER,
  "/order-contract-master"
);

export const REPORT_PURCHASE_ORDER_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/order-detail"
);

export const REPORT_ORDER_CONTRACT_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ORDER_DETAIL_ROUTER,
  "/order-contract-detail"
);

export const REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/contract-debt-detail"
);

export const REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/change-supplier-info"
);

export const REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/goods-services-detail"
);
export const REPORT_ORDER_TRANSACTION_DAILY_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/transaction-daily"
);
export const REPORT_PURCHASE_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/detail"
);
export const REPORT_PURCHASE_PLAN_DETAIL_ROUTER = join(
  REPORT_PURCHASE_DETAIL_ROUTER,
  "/purchase-plan-detail"
);
export const REPORT_SUPPLIER_DETAIL_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/supplier"
);
export const REPORT_GOODS_RECEIPT_TRACKING_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/goods-receipt-tracking"
);
export const REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/detailed-supplier-payables"
);
export const REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/purchase-requirement-summary"
);

export const REPORT_SUPPLIER_GOODS_DETAIL_ROUTER = join(
  REPORT_SUPPLIER_DETAIL_ROUTER,
  "/supplier-goods-items-detail"
);

export const REPORT_PROPOSAL_SUMMARY_ROUTER = join(
  REPORT_PURCHASE_ROUTER,
  "/proposal-summary"
);

export const REPORT_SLA_ROUTER = join(REPORT_PURCHASE_ROUTER, "/sla");

// Organization Type Route:
export const ORGANIZATION_TYPE_ROUTE = join(APP_ROUTE, "/organization-type");
export const ORGANIZATION_TYPE_MASTER_ROUTE = join(
  ORGANIZATION_TYPE_ROUTE,
  "/organization-type-master"
);

// Overview Route:
export const APP_OVERVIEW = join(APP_ROUTE, "/overview");
export const APP_USER_ADMIN_TYPE_MASTER_ROUTE = join(
  APP_USER_ROUTE,
  "/app-user-admin-master"
);

export const PURCHASE_ROUTE = join(APP_ROUTE, "/purchase");

//Proposal Route:
export const PROPOSAL_ROUTE = join(PURCHASE_ROUTE, "/proposal");
export const PROPOSAL_MASTER_ROUTE = join(PROPOSAL_ROUTE, "/proposal-master");
export const PROPOSAL_DETAIL_ROUTE = join(PROPOSAL_ROUTE, "/proposal-detail");
export const PROPOSAL_CREATE_ROUTE = join(PROPOSAL_ROUTE, "/proposal-create");

// Proposal Adjust Route
export const PROPOSAL_ADJUST_DETAIL_ROUTE = join(
  PROPOSAL_ROUTE,
  "/proposal-adjust-detail"
);
export const PROPOSAL_ADJUST_VIEW_ROUTE = join(
  PROPOSAL_ROUTE,
  "/proposal-adjust-view"
);

// purchase request route
export const PURCHASE_REQUEST_ROUTE = join(PURCHASE_ROUTE, "/purchase-request");
export const PURCHASE_REQUEST_MASTER_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-master"
);
export const PURCHASE_REQUEST_VIEW_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-view"
);

export const PURCHASE_REQUEST_DETAIL_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-detail"
);

export const PURCHASE_REQUEST_CREATE_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-detail"
);

//Proposal Route:

// Purchase Request adjust Route
export const PURCHASE_REQUEST_ADJUST_VIEW_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-adjust-view"
);
export const PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE = join(
  PURCHASE_REQUEST_ROUTE,
  "/purchase-request-adjust-detail"
);

// Sourcing Route
export const PURCHASING_PLAN_ROUTE = join(PURCHASE_ROUTE, "/purchasing-plan");
export const PURCHASING_PLAN_MASTER_ROUTE = join(
  PURCHASING_PLAN_ROUTE,
  "/purchasing-plan-master"
);
export const PURCHASING_PLAN_VIEW_ROUTE = join(
  PURCHASING_PLAN_ROUTE,
  "/purchase-plan-view"
);

export const PURCHASING_PLAN_DETAIL_ROUTE = join(
  PURCHASING_PLAN_ROUTE,
  "/purchasing-plan-detail"
);

// Sourcing Principal Route
export const PURCHASING_PLAN_PRINCIPLE_ROUTE = join(
  PURCHASE_ROUTE,
  "/purchase-plan-principle"
);

export const PURCHASE_PRINCIPLE_CONTRACT_DETAIL_ROUTER = join(
  PURCHASE_ROUTE,
  "/contract-principle/contract-principle-view"
);

export const PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE = join(
  PURCHASING_PLAN_PRINCIPLE_ROUTE,
  "/purchase-plan-principle-view"
);

export const PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE = join(
  PURCHASING_PLAN_PRINCIPLE_ROUTE,
  "/purchase-plan-principle-detail"
);

// Sourcing Bidding Route
export const PURCHASING_PLAN_BIDDING_ROUTE = join(
  PURCHASE_ROUTE,
  "/purchase-plan-bidding"
);

export const PURCHASING_PLAN_BIDDING_VIEW_ROUTE = join(
  PURCHASING_PLAN_BIDDING_ROUTE,
  "/purchase-plan-bidding-view"
);

export const PURCHASING_PLAN_BIDDING_DETAIL_ROUTE = join(
  PURCHASING_PLAN_BIDDING_ROUTE,
  "/purchase-plan-bidding-detail"
);

// Purchase Plan Adjust Bid Route
export const PURCHASE_PLAN_ADJUST_BID_ROUTE = join(
  PURCHASE_ROUTE,
  "/purchase-plan-adjust-bid"
);

export const PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE = join(
  PURCHASE_PLAN_ADJUST_BID_ROUTE,
  "/purchase-plan-adjust-bid-view"
);

export const PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE = join(
  PURCHASE_PLAN_ADJUST_BID_ROUTE,
  "/purchase-plan-adjust-bid-detail"
);

// Sourcing Competitive Route
export const PURCHASING_PLAN_COMPETITIVE_OFFER_ROUTE = join(
  PURCHASE_ROUTE,
  "/purchase-plan-competitive-offer"
);

export const PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE = join(
  PURCHASING_PLAN_COMPETITIVE_OFFER_ROUTE,
  "/purchase-plan-competitive-offer-view"
);

export const PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE = join(
  PURCHASING_PLAN_COMPETITIVE_OFFER_ROUTE,
  "/purchase-plan-competitive-offer-detail"
);

// Purchase Plan Adjust Competitive Offer Route
export const PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_ROUTE = join(
  PURCHASE_ROUTE,
  "/purchase-plan-adjust-competitive-offer"
);

export const PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE = join(
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_ROUTE,
  "/purchase-plan-adjust-competitive-offer-view"
);

export const PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE = join(
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_ROUTE,
  "/purchase-plan-adjust-competitive-offer-detail"
);

// Temporary Import Asset Route
export const TEMPORARY_IMPORT_ASSET_ROUTE = join(
  PURCHASE_ROUTE,
  "/temporary-import-asset"
);
export const TEMPORARY_IMPORT_ASSET_MASTER_ROUTE = join(
  TEMPORARY_IMPORT_ASSET_ROUTE,
  "/temporary-import-asset-master"
);
export const TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE = join(
  TEMPORARY_IMPORT_ASSET_ROUTE,
  "/temporary-import-asset-detail"
);
export const TEMPORARY_IMPORT_ASSET_VIEW_ROUTE = join(
  TEMPORARY_IMPORT_ASSET_ROUTE,
  "/temporary-import-asset-view"
);

export const LEGAL_SIGNATURE_ROUTE = join(APP_ROUTE, "/legal-signature");
export const LEGAL_SIGNATURE_MASTER_ROUTE = join(
  LEGAL_SIGNATURE_ROUTE,
  "/legal-signature-master"
);

// contract route
export const CONTRACT_ROUTE = join(PURCHASE_ROUTE, "/contract");
export const CONTRACT_ROUTE_MASTER = join(CONTRACT_ROUTE, "/contract-master");

export const CONTRACT_ROUTE_VIEW = join(CONTRACT_ROUTE, "/contract-view");
export const CONTRACT_ORDER = join(CONTRACT_ROUTE, "/contract-order-view");
export const CONTRACT_ORDER_PRINCIPAL = join(
  CONTRACT_ROUTE,
  "/contract-order-principal-view"
);

export const CONTRACT_ROUTE_CREATE = join(CONTRACT_ROUTE, "/contract-detail");
export const CONTRACT_ORDER_CREATE = join(
  CONTRACT_ROUTE,
  "/contract-order-detail"
);
export const CONTRACT_ORDER_PRINCIPAL_CREATE = join(
  CONTRACT_ROUTE,
  "/contract-order-principal-detail"
);

// Contract Principle Route
export const CONTRACT_PRINCIPLE_ROUTE = join(
  PURCHASE_ROUTE,
  "/contract-principle"
);
export const CONTRACT_PRINCIPLE_MASTER_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/contract-principle-master"
);
export const CONTRACT_PRINCIPLE_VIEW_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/contract-principle-view"
);

export const CONTRACT_PRINCIPLE_DETAIL_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/contract-principle-detail"
);

export enum SETTLEMENT_ROUTE_ENUM {
  SETTLEMENT_VIEW = "/settlement-view",
  SETTLEMENT_DETAIL = "/settlement-detail",
}

export enum CONTRACT_TERMINATION_ROUTE_ENUM {
  CONTRACT_TERMINATION_VIEW = "/contract-termination-view",
  CONTRACT_TERMINATION_DETAIL = "/contract-termination-detail",
}

//settlement route
export const SETTLEMENT_ROUTE = join(PURCHASE_ROUTE, "/settlement");
export const SETTLEMENT_MASTER_ROUTE = join(
  SETTLEMENT_ROUTE,
  "/settlement-master"
);
export const SETTLEMENT_VIEW_ROUTE = join(
  SETTLEMENT_ROUTE,
  SETTLEMENT_ROUTE_ENUM.SETTLEMENT_VIEW
);
export const SETTLEMENT_DETAIL_ROUTE = join(
  SETTLEMENT_ROUTE,
  SETTLEMENT_ROUTE_ENUM.SETTLEMENT_DETAIL
);

//contract termination route
export const CONTRACT_TERMINATION_ROUTE = join(
  PURCHASE_ROUTE,
  "/contract-termination"
);
export const CONTRACT_TERMINATION_MASTER_ROUTE = join(
  CONTRACT_TERMINATION_ROUTE,
  "/contract-termination-master"
);

export const CONTRACT_TERMINATION_VIEW_ROUTE = join(
  CONTRACT_TERMINATION_ROUTE,
  CONTRACT_TERMINATION_ROUTE_ENUM.CONTRACT_TERMINATION_VIEW
);

export const CONTRACT_TERMINATION_DETAIL_ROUTE = join(
  CONTRACT_TERMINATION_ROUTE,
  CONTRACT_TERMINATION_ROUTE_ENUM.CONTRACT_TERMINATION_DETAIL
);

// System Administration
export const SYSTEM_ADMINISTRATION_ROUTE = join(
  APP_ROUTE,
  "/system-administration"
);
export const COMMENT_MANAGEMENT_ROUTE = join(
  SYSTEM_ADMINISTRATION_ROUTE,
  "/comment-management"
);

export const REPORT_TEMPLATE_MANAGEMENT_ROUTE = join(
  SYSTEM_ADMINISTRATION_ROUTE,
  "/report-template-management"
);

// Catalog Route
export const CATALOG_ROUTE = join(APP_ROUTE, "/catalog");

// others management route
export const OTHERS_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/others-management"
);

export const NATION_ROUTE = join(OTHERS_MANAGEMENT_ROUTE, "/nation");
export const NATION_MASTER_ROUTE = join(NATION_ROUTE, "/nation-master");

export const USE_ELECTRONIC_INVOICE_ROUTE = join(
  OTHERS_MANAGEMENT_ROUTE,
  "/use-electronic-invoice"
);
export const USE_ELECTRONIC_INVOICE_ROUTE_MASTER = join(
  USE_ELECTRONIC_INVOICE_ROUTE,
  "/use-electronic-invoice-master"
);

export const DOCUMENT_TYPE_ROUTE = join(
  OTHERS_MANAGEMENT_ROUTE,
  "/document-type"
);
export const DOCUMENT_TYPE_ROUTE_MASTER = join(
  DOCUMENT_TYPE_ROUTE,
  "/document-type-master"
);

// signature management route
export const SIGNATURE_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/signature-management"
);

export const SIGNATURE_SUPPLIER_ROUTE = join(
  SIGNATURE_MANAGEMENT_ROUTE,
  "/signature-supplier"
);
export const SIGNATURE_SUPPLIER_MASTER = join(
  SIGNATURE_SUPPLIER_ROUTE,
  "/signature-supplier-master"
);

export const SIGNATURE_CONFIG_ROUTE = join(
  SIGNATURE_MANAGEMENT_ROUTE,
  "/signature-config"
);
export const SIGNATURE_CONFIG_MASTER = join(
  SIGNATURE_CONFIG_ROUTE,
  "/signature-config-master"
);

// Report Route
export const REPORT_PAYMENT_ROUTE = join(REPORT_ROUTE, "/report-payment");
export const REPORT_PAYMENT_MASTER_ROUTE = join(
  REPORT_PAYMENT_ROUTE,
  "/by-cost-item"
);

// Promotion route
export const PROMOTION_ROUTE = join(OTHERS_MANAGEMENT_ROUTE, "/promotion");
export const PROMOTION_MASTER_ROUTE = join(
  PROMOTION_ROUTE,
  "/promotion-master"
);
export const PROMOTION_DETAIL_ROUTE = join(
  PROMOTION_ROUTE,
  "/promotion-detail"
);

// GL Account route
export const GL_ACCOUNT_ROUTE = join(OTHERS_MANAGEMENT_ROUTE, "/gl-account");
export const GL_ACCOUNT_MASTER_ROUTE = join(
  GL_ACCOUNT_ROUTE,
  "/gl-account-master"
);
export const GL_ACCOUNT_DETAIL_ROUTE = join(
  GL_ACCOUNT_ROUTE,
  "/gl-account-detail"
);

// goods management route
export const CONTRACT_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/contract-management"
);

// Catalog Contract Classification Route
export const CONTRACT_CLASSIFICATION_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/contract-classification"
);
export const CONTRACT_CLASSIFICATION_ROUTE_MASTER = join(
  CONTRACT_CLASSIFICATION_ROUTE,
  "/contract-classification-master"
);

export const WARRANTY_TYPE_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/warranty-type"
);
export const WARRANTY_TYPE_ROUTE_MASTER = join(
  WARRANTY_TYPE_ROUTE,
  "/warranty-type-master"
);

export const GUARANTEE_TYPE_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/guarantee-type"
);
export const GUARANTEE_TYPE_ROUTE_MASTER = join(
  GUARANTEE_TYPE_ROUTE,
  "/guarantee-type-master"
);

// contract type route
export const CONTRACT_TYPE_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/contract-type"
);
export const CONTRACT_TYPE_MASTER_ROUTE = join(
  CONTRACT_TYPE_ROUTE,
  "/contract-type-master"
);

// contract type route
export const CONTRACT_METHOD_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/contract-method"
);
export const CONTRACT_METHOD_MASTER_ROUTE = join(
  CONTRACT_METHOD_ROUTE,
  "/contract-method-master"
);

// contract term route
export const CONTRACT_TERM_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/contract-term"
);
export const CONTRACT_TERM_MASTER_ROUTE = join(
  CONTRACT_TERM_ROUTE,
  "/contract-term-master"
);

export const WARRANTY_METHOD_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/warranty-method"
);
export const WARRANTY_METHOD_ROUTE_MASTER = join(
  WARRANTY_METHOD_ROUTE,
  "/warranty-method-master"
);

export const LEGAL_ENTITY_ROUTE = join(
  CONTRACT_MANAGEMENT_ROUTE,
  "/legal-entity"
);
export const LEGAL_ENTITY_ROUTE_MASTER = join(
  LEGAL_ENTITY_ROUTE,
  "/legal-entity-master"
);
export const LEGAL_ENTITY_ROUTE_DETAIL = join(
  LEGAL_ENTITY_ROUTE,
  "/legal-entity-detail"
);
export const LEGAL_ENTITY_ROUTE_VIEW = join(
  LEGAL_ENTITY_ROUTE,
  "/legal-entity-view"
);

// goods management route
export const GOODS_MANAGEMENT_ROUTE = join(CATALOG_ROUTE, "/goods-management");

// cost line cost item route
export const COST_ITEM_GOODS_SERVICES_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/cost-item-goods-services"
);
export const COST_ITEM_GOODS_SERVICES_MASTER_ROUTE = join(
  COST_ITEM_GOODS_SERVICES_ROUTE,
  "/cost-item-goods-services-master"
);
export const COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE = join(
  COST_ITEM_GOODS_SERVICES_ROUTE,
  "/cost-item-goods-services-detail"
);

export const GOODS_SERVICES_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/goods-services"
);
export const GOODS_SERVICES_MASTER_ROUTE = join(
  GOODS_SERVICES_ROUTE,
  "/goods-services-master"
);
export const GOODS_SERVICES_DETAIL_ROUTE = join(
  GOODS_SERVICES_ROUTE,
  "/goods-services-detail"
);

export const GOODS_SERVICES_PREVIEW_ROUTE = join(
  GOODS_SERVICES_ROUTE,
  "/goods-services-preview"
);

// GoodService Type route
export const GOOD_SERVICE_TYPE_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/good-service-type"
);

export const GOOD_SERVICE_TYPE_MASTER_ROUTE = join(
  GOOD_SERVICE_TYPE_ROUTE,
  "/good-service-type-master"
);

// unit of measure route
export const UNIT_OF_MEASURE_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/unit-of-measure"
);

export const UNIT_OF_MEASURE_MASTER_ROUTE = join(
  UNIT_OF_MEASURE_ROUTE,
  "/unit-of-measure-master"
);

// unit of measure group route
export const UNIT_OF_MEASURE_GROUP_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/unit-of-measure-group"
);

export const UNIT_OF_MEASURE_GROUP_MASTER_ROUTE = join(
  UNIT_OF_MEASURE_GROUP_ROUTE,
  "/unit-of-measure-group-master"
);

// goods service category route
export const GOODS_SERVICE_CATEGORY_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/goods-services-category"
);
export const GOODS_SERVICE_CATEGORY_MASTER_ROUTE = join(
  GOODS_SERVICE_CATEGORY_ROUTE,
  "/goods-services-category-master"
);

export const MANUFACTURER_CATEGORIES_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/manufacturer-categories"
);
export const MANUFACTURER_CATEGORIES_ROUTE_MASTER = join(
  MANUFACTURER_CATEGORIES_ROUTE,
  "/manufacturer-categories-master"
);

export const PAYMENT_CONDITION_ROUTE = join(
  GOODS_MANAGEMENT_ROUTE,
  "/payment-condition"
);
export const PAYMENT_CONDITION_ROUTE_MASTER = join(
  PAYMENT_CONDITION_ROUTE,
  "/payment-condition-master"
);

// supplier management route
export const SUPPLIER_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/supplier-management"
);

export const SUPPLIER_ROUTE = join(SUPPLIER_MANAGEMENT_ROUTE, "/supplier");
export const SUPPLIER_MASTER_ROUTE = join(SUPPLIER_ROUTE, "/supplier-master");
export const SUPPLIER_DETAIL_ROUTE = join(SUPPLIER_ROUTE, "/supplier-detail");
export const SUPPLIER_VIEW_ROUTE = join(SUPPLIER_ROUTE, "/supplier-view");
export const SUPPLIER_APPROVE_ROUTE = join(SUPPLIER_ROUTE, "/supplier-approve");

export const SUPPLIER_EVALUATION_CONFIG_ROUTE = join(
  SUPPLIER_MANAGEMENT_ROUTE,
  "/supplier-evaluation-config"
);
export const SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE = join(
  SUPPLIER_EVALUATION_CONFIG_ROUTE,
  "/supplier-evaluation-config-master"
);
export const SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE = join(
  SUPPLIER_EVALUATION_CONFIG_ROUTE,
  "/supplier-evaluation-config-detail"
);

export const SUPPLIER_EVALUATION_CONFIG_PREVIEW_ROUTE = join(
  SUPPLIER_EVALUATION_CONFIG_ROUTE,
  "/supplier-evaluation-config-preview"
);

export const SUPPLIER_TYPE_ROUTE = join(
  SUPPLIER_MANAGEMENT_ROUTE,
  "/supplier-type"
);
export const SUPPLIER_TYPE_MASTER_ROUTE = join(
  SUPPLIER_TYPE_ROUTE,
  "/supplier-type-master"
);
export const SUPPLIER_TYPE_DETAIL_ROUTE = join(
  SUPPLIER_TYPE_ROUTE,
  "/supplier-type-detail"
);

export const SUPPLIER_CATEGORY_CONFIG_ROUTE = join(
  SUPPLIER_MANAGEMENT_ROUTE,
  "/supplier-category-config"
);

export const SUPPLIER_CATEGORY_CONFIG_MASTER_ROUTE = join(
  SUPPLIER_CATEGORY_CONFIG_ROUTE,
  "/supplier-category-config-master"
);

// budget management route
export const FINANCIAL_INFORMATION_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/financial-information-management"
);
// bank route
export const BANK_ROUTE = join(FINANCIAL_INFORMATION_MANAGEMENT_ROUTE, "/bank");

export const BANK_MASTER_ROUTE = join(BANK_ROUTE, "/bank-master");

// currency route
export const CURRENCY_ROUTE = join(
  FINANCIAL_INFORMATION_MANAGEMENT_ROUTE,
  "/currency"
);

export const CURRENCY_MASTER_ROUTE = join(CURRENCY_ROUTE, "/currency-master");

// exchange-rate route
export const EXCHANGE_RATE_ROUTE = join(
  FINANCIAL_INFORMATION_MANAGEMENT_ROUTE,
  "/exchange-rate"
);

export const EXCHANGE_RATE_MASTER_ROUTE = join(
  EXCHANGE_RATE_ROUTE,
  "/exchange-rate-master"
);

// tax route
export const TAX_ROUTE = join(FINANCIAL_INFORMATION_MANAGEMENT_ROUTE, "/tax");

export const TAX_MASTER_ROUTE = join(TAX_ROUTE, "/tax-master");

// budget management route
export const BUDGET_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/budget-management"
);

// cost line cost item route
export const COST_LINE_COST_ITEM_ROUTE = join(
  BUDGET_MANAGEMENT_ROUTE,
  "/cost-line-cost-item"
);
export const COST_LINE_COST_ITEM_MASTER_ROUTE = join(
  COST_LINE_COST_ITEM_ROUTE,
  "/cost-line-cost-item-master"
);
export const COST_LINE_COST_ITEM_DETAIL_ROUTE = join(
  COST_LINE_COST_ITEM_ROUTE,
  "/cost-line-cost-item-detail"
);

// Cost line route
export const COST_LINE_ROUTE = join(BUDGET_MANAGEMENT_ROUTE, "/cost-line");
export const COST_LINE_MASTER_ROUTE = join(
  COST_LINE_ROUTE,
  "/cost-line-master"
);
export const COST_LINE_DETAIL_ROUTE = join(
  COST_LINE_ROUTE,
  "/cost-line-detail"
);
export const COST_LINE_CREATE_ROUTE = join(
  COST_LINE_ROUTE,
  "/cost-line-create"
);

export const COST_DRIVER_ROUTE = join(BUDGET_MANAGEMENT_ROUTE, "/cost-driver");
export const COST_DRIVER_ROUTE_MASTER = join(
  COST_DRIVER_ROUTE,
  "/cost-driver-master"
);

export const COST_ITEM_ROUTE = join(BUDGET_MANAGEMENT_ROUTE, "/cost-item");
export const COST_ITEM_MASTER_ROUTE = join(
  COST_ITEM_ROUTE,
  "/cost-item-master"
);

// cost type route
export const COST_TYPE_ROUTE = join(BUDGET_MANAGEMENT_ROUTE, "/cost-type");

export const COST_TYPE_MASTER_ROUTE = join(
  COST_TYPE_ROUTE,
  "/cost-type-master"
);

export const ORGANIZATION_MANAGEMENT_ROUTE = join(
  CATALOG_ROUTE,
  "/organization-management"
);

export const SPECIALIZED_BANK_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/specialized-bank"
);
export const SPECIALIZED_BANK_ROUTE_MASTER = join(
  SPECIALIZED_BANK_ROUTE,
  "/specialized-bank-master"
);

// business branch route
export const BUSINESS_BRANCH_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/business-branch"
);
export const BUSINESS_BRANCH_MASTER_ROUTE = join(
  BUSINESS_BRANCH_ROUTE,
  "/business-branch-master"
);

// band route
export const BAND_ROUTE = join(ORGANIZATION_MANAGEMENT_ROUTE, "/band");
export const BAND_MASTER_ROUTE = join(BAND_ROUTE, "/band-master");

// rank route
export const RANK_ROUTE = join(ORGANIZATION_MANAGEMENT_ROUTE, "/rank");
export const RANK_MASTER_ROUTE = join(RANK_ROUTE, "/rank-master");

// position route
export const POSITION_ROUTE = join(ORGANIZATION_MANAGEMENT_ROUTE, "/position");
export const POSITION_MASTER_ROUTE = join(POSITION_ROUTE, "/position-master");

// business department route
export const BUSINESS_DEPARTMENT_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/business-department"
);

export const BUSINESS_DEPARTMENT_MASTER_ROUTE = join(
  BUSINESS_DEPARTMENT_ROUTE,
  "/business-department-master"
);

export const AREA_UNIT_CODE_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/area-unit-code"
);
export const AREA_UNIT_CODE_ROUTE_MASTER = join(
  AREA_UNIT_CODE_ROUTE,
  "/area-unit-code-master"
);

export const PERSONNEL_BY_UNIT_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/personnel-by-unit"
);
export const PERSONNEL_BY_UNIT_ROUTE_MASTER = join(
  PERSONNEL_BY_UNIT_ROUTE,
  "/personnel-by-unit-master"
);

export const CENTRAL_PURCHASE_UNIT_ROUTE = join(
  ORGANIZATION_MANAGEMENT_ROUTE,
  "/central-purchase-unit"
);
export const CENTRAL_PURCHASE_UNIT_ROUTE_MASTER = join(
  CENTRAL_PURCHASE_UNIT_ROUTE,
  "/central-purchase-unit-master"
);

export const ACCEPTANCE_ROUTE = join(PURCHASE_ROUTE, "/acceptance");
export const ACCEPTANCE_ROUTE_MASTER = join(
  ACCEPTANCE_ROUTE,
  "/acceptance-master"
);
export const ACCEPTANCE_DETAIL_ROUTE = join(
  ACCEPTANCE_ROUTE,
  "/acceptance-detail"
);
export const ACCEPTANCE_CREATE_ROUTE = join(
  ACCEPTANCE_ROUTE,
  "/acceptance-create"
);

export const ACCEPTANCE_EDIT_ROUTE = join(ACCEPTANCE_ROUTE, "/acceptance-edit");

// ProjectSettlement Route
export const PROJECT_SETTLEMENT_ROUTE = join(
  PURCHASE_ROUTE,
  "/project-settlement"
);
export const PROJECT_SETTLEMENT_MASTER_ROUTE = join(
  PROJECT_SETTLEMENT_ROUTE,
  "/project-settlement-master"
);
export const PROJECT_SETTLEMENT_DETAIL_ROUTE = join(
  PROJECT_SETTLEMENT_ROUTE,
  "/project-settlement-detail"
);
export const PROJECT_SETTLEMENT_CREATE_ROUTE = join(
  PROJECT_SETTLEMENT_ROUTE,
  "/project-settlement-create"
);
export const PROJECT_SETTLEMENT_EDIT_ROUTE = join(
  PROJECT_SETTLEMENT_ROUTE,
  "/project-settlement-edit"
);

export const RECEIVING_GOODS_ROUTE = join(PURCHASE_ROUTE, "/receiving-goods");
export const RECEIVING_GOODS_ROUTE_MASTER = join(
  RECEIVING_GOODS_ROUTE,
  "/receiving-goods-master"
);
export const RECEIVING_GOODS_DETAIL_ROUTE = join(
  RECEIVING_GOODS_ROUTE,
  "/receiving-goods-detail"
);

export const RECEIVING_GOODS_CREATE_ROUTE = join(
  RECEIVING_GOODS_ROUTE,
  "/receiving-create"
);

export const RECEIVING_GOODS_EDIT_ROUTE = join(
  RECEIVING_GOODS_ROUTE,
  "/receiving-edit"
);

export const COMMERCIAL_TERMS_ROUTE = join(CATALOG_ROUTE, "/commercial-terms");
export const COMMERCIAL_TERMS_ROUTE_MASTER = join(
  COMMERCIAL_TERMS_ROUTE,
  "/commercial-terms-master"
);

// Log Root
export const LOG_TRACKING_ROUTE = join(APP_ROUTE, "/logs");

// Annex
export const CONTRACT_ANNEX_ROUTE = join(CONTRACT_ROUTE, "/annex");
export const CONTRACT_ANNEX_DETAIL_ROUTE = join(
  CONTRACT_ROUTE,
  "/annex-detail"
);
export const CONTRACT_ANNEX_CREATE_ROUTE = join(
  CONTRACT_ROUTE,
  "/annex-create"
);
export const CONTRACT_ANNEX_EDIT_ROUTE = join(CONTRACT_ROUTE, "/annex-edit");

export enum CONTRACT_ADJUSTMENT_ROUTE_ENUM {
  CONTRACT_ADJUSTMENT_VIEW = "/contract-adjustment-view",
  CONTRACT_ADJUSTMENT_DETAIL = "/contract-adjustment-detail",
  CONTRACT_ADJUSTMENT_MASTER = "/contract-adjustment",
}

// Contract Adjustment
export const CONTRACT_ADJUSTMENT_MASTER_ROUTE = join(
  CONTRACT_ROUTE,
  CONTRACT_ADJUSTMENT_ROUTE_ENUM.CONTRACT_ADJUSTMENT_MASTER
);
export const CONTRACT_ADJUSTMENT_VIEW_ROUTE = join(
  CONTRACT_ADJUSTMENT_MASTER_ROUTE,
  CONTRACT_ADJUSTMENT_ROUTE_ENUM.CONTRACT_ADJUSTMENT_VIEW
);
export const CONTRACT_ADJUSTMENT_DETAIL_ROUTE = join(
  CONTRACT_ADJUSTMENT_MASTER_ROUTE,
  CONTRACT_ADJUSTMENT_ROUTE_ENUM.CONTRACT_ADJUSTMENT_DETAIL
);
export const CONTRACT_ADJUSTMENT_CREATE_ROUTE = join(
  CONTRACT_ADJUSTMENT_MASTER_ROUTE,
  "/contract-adjustment-create"
);

//  Contract Principle Appendix
export const CONTRACT_PRINCIPLE_APPENDIX_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/appendix"
);
export const CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/appendix-detail"
);
export const CONTRACT_PRINCIPLE_APPENDIX_CREATE_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/appendix-create"
);

export const CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE = join(
  CONTRACT_PRINCIPLE_ROUTE,
  "/appendix-edit"
);
