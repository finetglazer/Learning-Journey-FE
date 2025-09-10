/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROOT_ROUTE } from "core/config/consts";
import { ComponentType, lazy } from "react";
import { Redirect } from "react-router-dom";
import { Route } from "./config-type";
import {
  ACCEPTANCE_ROUTE,
  APP_USER_ROUTE,
  AREA_UNIT_CODE_ROUTE,
  BAND_ROUTE,
  BANK_ROUTE,
  BUDGET_ROUTE,
  BUSINESS_BRANCH_ROUTE,
  BUSINESS_DEPARTMENT_ROUTE,
  CENTRAL_PURCHASE_UNIT_ROUTE,
  COMMERCIAL_TERMS_ROUTE,
  CONTRACT_CLASSIFICATION_ROUTE,
  CONTRACT_METHOD_ROUTE,
  CONTRACT_PRINCIPLE_ROUTE,
  CONTRACT_ROUTE,
  CONTRACT_TERM_ROUTE,
  CONTRACT_TERMINATION_ROUTE,
  COST_DRIVER_ROUTE,
  COST_ITEM_GOODS_SERVICES_ROUTE,
  COST_ITEM_ROUTE,
  COST_LINE_COST_ITEM_ROUTE,
  COST_LINE_ROUTE,
  COST_TYPE_ROUTE,
  CURRENCY_ROUTE,
  DASHBROAD_ROUTE,
  DOCUMENT_TYPE_ROUTE,
  EXCHANGE_RATE_ROUTE,
  GL_ACCOUNT_ROUTE,
  GOOD_SERVICE_TYPE_ROUTE,
  GOODS_SERVICE_CATEGORY_ROUTE,
  GOODS_SERVICES_ROUTE,
  GUARANTEE_TYPE_ROUTE,
  LEGAL_ENTITY_ROUTE,
  LEGAL_SIGNATURE_ROUTE,
  LOG_TRACKING_ROUTE,
  MANUFACTURER_CATEGORIES_ROUTE,
  NATION_ROUTE,
  PAYMENT_CONDITION_ROUTE,
  PAYMENT_ROUTE,
  PERSONNEL_BY_UNIT_ROUTE,
  POSITION_ROUTE,
  PROFILE_ROUTE,
  PROJECT_SETTLEMENT_ROUTE,
  PROMOTION_ROUTE,
  PROPOSAL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_ROUTE,
  PURCHASE_REQUEST_ROUTE,
  PURCHASING_PLAN_BIDDING_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_ROUTE,
  PURCHASING_PLAN_ROUTE,
  RANK_ROUTE,
  RECEIVING_GOODS_ROUTE,
  REPORT_BUDGET_CONTROL_ROUTER,
  REPORT_BUDGET_USAGE_ROUTER,
  REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER,
  REPORT_GOODS_RECEIPT_TRACKING_ROUTER,
  REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER,
  REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER,
  REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER,
  REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER,
  REPORT_ORDER_TRANSACTION_DAILY_ROUTER,
  REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_ROUTER,
  REPORT_PAYMENT_BY_COST_ITEM_ROUTER,
  REPORT_PAYMENT_BY_PROMO_ROUTER,
  REPORT_PROPOSAL_SUMMARY_ROUTER,
  REPORT_PURCHASE_DETAIL_ROUTER,
  REPORT_PURCHASE_ORDER_DETAIL_ROUTER,
  REPORT_PURCHASE_ORDER_ROUTER,
  REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER,
  REPORT_PURCHASE_SUMMARY_ROUTER,
  REPORT_SLA_ROUTER,
  REPORT_SUPPLIER_GOODS_DETAIL_ROUTER,
  SETTLEMENT_ROUTE,
  SIGNATURE_CONFIG_ROUTE,
  SIGNATURE_SUPPLIER_ROUTE,
  SPECIALIZED_BANK_ROUTE,
  SUPPLIER_CATEGORY_CONFIG_ROUTE,
  SUPPLIER_EVALUATION_CONFIG_ROUTE,
  SUPPLIER_ROUTE,
  SUPPLIER_TYPE_ROUTE,
  SYSTEM_ADMINISTRATION_ROUTE,
  TAX_ROUTE,
  TEMPORARY_IMPORT_ASSET_ROUTE,
  UNIT_OF_MEASURE_GROUP_ROUTE,
  UNIT_OF_MEASURE_ROUTE,
  USE_ELECTRONIC_INVOICE_ROUTE,
  WARRANTY_METHOD_ROUTE,
  WARRANTY_TYPE_ROUTE,
} from "./route-const";

type LazyImport<T = any> = {
  default?: ComponentType<T>;
  [key: string]: any;
};

export const modules: Record<string, () => Promise<LazyImport>> = {
  BudgetPage: () => import("pages/BudgetPage/BudgetPage"),
  AreaUnitCodePage: () => import("pages/Catalog/AreaUnitCode/AreaUnitCodePage"),
  BankPage: () => import("pages/Catalog/BankPage/BankPage"),
  BusinessBranchPage: () =>
    import("pages/Catalog/BusinessBranchPage/BusinessBranchPage"),
  BusinessDepartmentPage: () =>
    import("pages/Catalog/BusinessDepartmentPage/BusinessDepartmentPage"),
  CentralPurchaseUnitPage: () =>
    import("pages/Catalog/CentralPurchaseUnit/CentralPurchaseUnitPage"),
  UseCommercialTermsPage: () =>
    import("pages/Catalog/CommercialTerms/CommercialTermsPage"),
  ContractClassificationPage: () =>
    import("pages/Catalog/ContractClassification/ContractClassificationPage"),
  CostDriverPage: () => import("pages/Catalog/CostDriver/CostDriverPage"),
  CostItemPage: () => import("pages/Catalog/CostItemPage/CostItemPage"),
  CostLinePage: () => import("pages/Catalog/CostLine/CostLinePage"),
  CostTypePage: () => import("pages/Catalog/CostTypePage/CostTypePage"),
  CurrencyPage: () => import("pages/Catalog/CurrencyPage/CurrencyPage"),
  UseDocumentTypePage: () =>
    import("pages/Catalog/DocumentType/DocumentTypePage"),
  ExchangeRatePage: () =>
    import("pages/Catalog/ExchangeRatePage/ExchangeRatePage"),
  GLAccountPage: () => import("pages/Catalog/GLAccountPage/GLAccountPage"),
  GoodServiceTypePage: () =>
    import("pages/Catalog/GoodServiceTypePage/GoodServiceTypePage"),
  GoodsServicesCategoryPage: () =>
    import("pages/Catalog/GoodsServicesCategoryPage/GoodsServicesCategoryPage"),
  GoodsServicesPage: () =>
    import("pages/Catalog/GoodsServicesPage/GoodsServicesPage"),
  UseGuaranteeTypePage: () =>
    import("pages/Catalog/GuaranteeType/GuaranteeTypePage"),
  UseLegalEntityPage: () => import("pages/Catalog/LegalEntity/LegalEntityPage"),
  ManufacturerCategoriesPage: () =>
    import("pages/Catalog/ManufacturerCategories/ManufacturerCategoriesPage"),
  PaymentConditionPage: () =>
    import("pages/Catalog/PaymentCondition/PaymentConditionPage"),
  PersonnelByUnitPage: () =>
    import("pages/Catalog/PersonnelByUnit/PersonnelByUnitPage"),
  PromotionPage: () => import("pages/Catalog/PromotionPage/PromotionPage"),
  SpecializedBankPage: () =>
    import("pages/Catalog/SpecializedBank/SpecializedBankPage"),
  TaxPage: () => import("pages/Catalog/TaxPage/TaxPage"),
  UnitOfMeasureGroupPage: () =>
    import("pages/Catalog/UnitOfMeasureGroupPage/UnitOfMeasureGroupPage"),
  UnitOfMeasurePage: () =>
    import("pages/Catalog/UnitOfMeasurePage/UnitOfMeasurePage"),
  UseElectronicInvoicePage: () =>
    import("pages/Catalog/UseElectronicInvoice/UseElectronicInvoicePage"),
  UseWarrantyMethodPage: () =>
    import("pages/Catalog/WarrantyMethod/WarrantyMethodPage"),
  UseWarrantyTypePage: () =>
    import("pages/Catalog/WarrantyType/WarrantyTypePage"),
  DashboardPage: () => import("pages/DashboardPage/DashboardPage"),
  LogTrackingPage: () => import("pages/LogTrackingPage/LogTrackingPage"),
  ProfilePage: () => import("pages/ProfilePage/ProfilePage"),
  AcceptancePage: () => import("pages/PurchasePage/Acceptance/AcceptancePage"),
  ContractPage: () => import("pages/PurchasePage/ContractPage/ContractPage"),
  ContractPrinciplePage: () =>
    import("pages/PurchasePage/ContractPrinciplePage/ContractPrinciplePage"),
  ProposalPage: () => import("pages/PurchasePage/ProposalPage/ProposalPage"),
  PurchaseRequestPage: () =>
    import("pages/PurchasePage/PurchaseRequestPage/PurchaseRequestPage"),
  PurchasingPlanPage: () =>
    import("pages/PurchasePage/PurchasingPlanPage/PurchasingPlanPage"),
  PurchasingPlanPrinciplePage: () =>
    import(
      "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrinciplePage"
    ),
  ReceivingGoodsPage: () =>
    import("pages/PurchasePage/ReceivingGoods/ReceivingGoodsPage"),
  TemporaryImportAssetPage: () =>
    import(
      "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetPage"
    ),
  SystemAdministrationPage: () =>
    import("pages/SystemAdministration/SystemAdministrationPage"),
  PaymentPage: () => import("../pages/PaymentPage/PaymentPage"),
  BandPage: () => import("pages/Catalog/BandPage/BandPage"),
  ContractMethodPage: () =>
    import("pages/Catalog/ContractMethodPage/ContractMethodPage"),
  ContractTermPage: () =>
    import("pages/Catalog/ContractTermPage/ContractTermPage"),
  CostItemGoodsServicesPage: () =>
    import("pages/Catalog/CostItemGoodsServicesPage/CostItemGoodsServicesPage"),
  CostLineCostItemPage: () =>
    import("pages/Catalog/CostLineCostItemPage/CostLineCostItemPage"),
  PositionPage: () => import("pages/Catalog/PositionPage/PositionPage"),
  RankPage: () => import("pages/Catalog/RankPage/RankPage"),
  SupplierEvaluationConfigPage: () =>
    import(
      "pages/Catalog/SupplierEvaluationConfigPage/SupplierEvaluationConfigPage"
    ),
  SupplierTypePage: () =>
    import("pages/Catalog/SupplierTypePage/SupplierTypePage"),
  LegalSignaturePage: () => import("pages/LegalSignature/LegalSignaturePage"),
  ContractTerminationPage: () =>
    import(
      "pages/PurchasePage/ContractTerminationPage/ContractTerminationPage"
    ),
  ProjectSettlementPage: () =>
    import("pages/PurchasePage/ProjectSettlement/ProjectSettlementPage"),
  PurchasePlanAdjustBidPage: () =>
    import(
      "pages/PurchasePage/PurchasePlanAdjustBidPage/PurchasePlanAdjustBidPage"
    ),
  PurchasePlanAdjustCompetitiveOfferPage: () =>
    import(
      "pages/PurchasePage/PurchasePlanAdjustCompetitiveOfferPage/PurchasePlanAdjustCompetitiveOfferPage"
    ),
  PurchasingPlanBiddingPage: () =>
    import(
      "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingPage"
    ),
  PurchasingPlanCompetitiveOfferPage: () =>
    import(
      "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferPage"
    ),
  ControlReportPage: () =>
    import("pages/ReportPage/Budget/Control/ControlReportPage"),
  UsageReportPage: () =>
    import("pages/ReportPage/Budget/Usage/UsageReportPage"),
  InvestmentProjectPortfolioPage: () =>
    import(
      "pages/ReportPage/Budget/InvestmentProjectPortfolio/InvestmentProjectPortfolio"
    ),
  ApprovalAuthorityReportPage: () =>
    import(
      "pages/ReportPage/Payment/ApprovalAuthority/ApprovalAuthorityReportPage"
    ),
  ConstItemReportPage: () =>
    import("pages/ReportPage/Payment/CostItems/ConstItemReportPage"),
  PromotionReportPage: () =>
    import("pages/ReportPage/Payment/Promotion/PromotionReportPage"),
  OrderContractSummaryPage: () =>
    import(
      "pages/ReportPage/Purchase/OrderContractSummary/OrderContractSummaryPage"
    ),
  OrderContractSummaryDetailPage: () =>
    import(
      "pages/ReportPage/Purchase/OrderContractSummaryDetail/OrderContractSummaryDetailPage"
    ),
  ContractDebtDetailPage: () =>
    import(
      "pages/ReportPage/Purchase/ContractDebtDetail/ContractDebtDetailPage"
    ),
  ChangeSupplierInfoPage: () =>
    import(
      "pages/ReportPage/Purchase/ChangeSupplierInfo/ChangeSupplierInfoPage"
    ),
  GoodsServicesDetailPage: () =>
    import(
      "pages/ReportPage/Purchase/GoodsServicesDetailPage/GoodsServicesDetailPage"
    ),
  TransactionDailyPage: () =>
    import("pages/ReportPage/Purchase/TransactionDaily/TransactionDailyPage"),
  settlementPage: () => import("../pages/SettlementPage/SettlementPage"),
  PurchasePlanSummaryPage: () =>
    import(
      "pages/ReportPage/Purchase/PurchasePlanSummary/PurchasePlanSummaryPage"
    ),
  PurchasePlanDetailPage: () =>
    import(
      "pages/ReportPage/Purchase/PurchasePlanDetail/PurchasePlanDetailPage"
    ),
  GoodsReceiptTrackingPage: () =>
    import(
      "pages/ReportPage/Purchase/GoodsReceiptTracking/GoodsReceiptTrackingPage"
    ),
  DetailedSupplierPayablesPage: () =>
    import(
      "pages/ReportPage/Purchase/DetailedSupplierPayables/DetailedSupplierPayablesPage"
    ),
  SupplierPage: () => import("pages/Catalog/Supplier/SupplierPage"),
  SLAPage: () => import("pages/ReportPage/Purchase/SLA/SLAPage"),
  SignatureSupplierPage: () =>
    import("pages/Catalog/SignatureSupplierPage/SignatureSupplierPage"),
  NationPage: () => import("pages/Catalog/NationPage/NationPage"),
  AppUserPage: () => import("pages/AppUserPage/AppUserPage"),
  SignatureConfigPage: () =>
    import("pages/Catalog/SignatureConfigPage/SignatureConfigPage"),
  SupplierCategoryConfigPage: () =>
    import(
      "pages/Catalog/SupplierCategoryConfigPage/SupplierCategoryConfigPage"
    ),
  ProposalSummaryPage: () =>
    import("pages/ReportPage/Purchase/ProposalSummary/ProposalSummaryPage"),
  SupplierGoodsItemsDetailPage: () =>
    import(
      "pages/ReportPage/Purchase/SupplierGoodsItemsDetail/SupplierGoodsItemsDetailPage"
    ),
  PurchaseRequirementSummaryPage: () =>
    import(
      "pages/ReportPage/Purchase/PurchaseRequirementSummary/PurchaseRequirementSummaryPage"
    ),
  HomePage: () => import("pages/HomePage/HomePage"),
};

async function retryImport(
  fn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    // eslint-disable-next-line no-console
    console.warn(`Retrying import... Attempts left: ${retries}`);
    return await new Promise((resolve) =>
      setTimeout(() => resolve(retryImport(fn, retries - 1, delay)), delay)
    );
  }
}

// Hàm lazyLoad
export const lazyLoad = (key: keyof typeof modules) =>
  lazy(() =>
    retryImport(modules[key]).then((module) => ({
      default: module.default ?? module[key as string],
    }))
  );

const BudgetPage = lazyLoad("BudgetPage");
const AreaUnitCodePage = lazyLoad("AreaUnitCodePage");
const BankPage = lazyLoad("BankPage");
const BusinessBranchPage = lazyLoad("BusinessBranchPage");
const BusinessDepartmentPage = lazyLoad("BusinessDepartmentPage");
const CentralPurchaseUnitPage = lazyLoad("CentralPurchaseUnitPage");
const UseCommercialTermsPage = lazyLoad("UseCommercialTermsPage");
const ContractClassificationPage = lazyLoad("ContractClassificationPage");
const CostDriverPage = lazyLoad("CostDriverPage");
const CostItemPage = lazyLoad("CostItemPage");
const CostLinePage = lazyLoad("CostLinePage");
const CostTypePage = lazyLoad("CostTypePage");
const CurrencyPage = lazyLoad("CurrencyPage");
const UseDocumentTypePage = lazyLoad("UseDocumentTypePage");
const ExchangeRatePage = lazyLoad("ExchangeRatePage");
const GLAccountPage = lazyLoad("GLAccountPage");
const GoodServiceTypePage = lazyLoad("GoodServiceTypePage");
const GoodsServicesCategoryPage = lazyLoad("GoodsServicesCategoryPage");
const GoodsServicesPage = lazyLoad("GoodsServicesPage");
const UseGuaranteeTypePage = lazyLoad("UseGuaranteeTypePage");
const UseLegalEntityPage = lazyLoad("UseLegalEntityPage");
const ManufacturerCategoriesPage = lazyLoad("ManufacturerCategoriesPage");
const PaymentConditionPage = lazyLoad("PaymentConditionPage");
const PersonnelByUnitPage = lazyLoad("PersonnelByUnitPage");
const PromotionPage = lazyLoad("PromotionPage");
const SpecializedBankPage = lazyLoad("SpecializedBankPage");
const TaxPage = lazyLoad("TaxPage");
const UnitOfMeasureGroupPage = lazyLoad("UnitOfMeasureGroupPage");
const UnitOfMeasurePage = lazyLoad("UnitOfMeasurePage");
const UseElectronicInvoicePage = lazyLoad("UseElectronicInvoicePage");
const UseWarrantyMethodPage = lazyLoad("UseWarrantyMethodPage");
const UseWarrantyTypePage = lazyLoad("UseWarrantyTypePage");
// const DashboardPage = lazyLoad("DashboardPage");
const LogTrackingPage = lazyLoad("LogTrackingPage");
const ProfilePage = lazyLoad("ProfilePage");
const AcceptancePage = lazyLoad("AcceptancePage");
const ContractPage = lazyLoad("ContractPage");
const ContractPrinciplePage = lazyLoad("ContractPrinciplePage");
const ProposalPage = lazyLoad("ProposalPage");
const PurchaseRequestPage = lazyLoad("PurchaseRequestPage");
const PurchasingPlanPage = lazyLoad("PurchasingPlanPage");
const PurchasingPlanPrinciplePage = lazyLoad("PurchasingPlanPrinciplePage");
const ReceivingGoodsPage = lazyLoad("ReceivingGoodsPage");
const TemporaryImportAssetPage = lazyLoad("TemporaryImportAssetPage");
const SystemAdministrationPage = lazyLoad("SystemAdministrationPage");
const PaymentPage = lazyLoad("PaymentPage");
const BandPage = lazyLoad("BandPage");
const ContractMethodPage = lazyLoad("ContractMethodPage");
const ContractTermPage = lazyLoad("ContractTermPage");
const CostItemGoodsServicesPage = lazyLoad("CostItemGoodsServicesPage");
const CostLineCostItemPage = lazyLoad("CostLineCostItemPage");
const PositionPage = lazyLoad("PositionPage");
const RankPage = lazyLoad("RankPage");
const SupplierEvaluationConfigPage = lazyLoad("SupplierEvaluationConfigPage");
const SupplierTypePage = lazyLoad("SupplierTypePage");
const LegalSignaturePage = lazyLoad("LegalSignaturePage");
const ContractTerminationPage = lazyLoad("ContractTerminationPage");
const ProjectSettlementPage = lazyLoad("ProjectSettlementPage");
const PurchasePlanAdjustBidPage = lazyLoad("PurchasePlanAdjustBidPage");
const PurchasePlanAdjustCompetitiveOfferPage = lazyLoad(
  "PurchasePlanAdjustCompetitiveOfferPage"
);
const PurchasingPlanBiddingPage = lazyLoad("PurchasingPlanBiddingPage");
const PurchasingPlanCompetitiveOfferPage = lazyLoad(
  "PurchasingPlanCompetitiveOfferPage"
);
const ControlReportPage = lazyLoad("ControlReportPage");
const UsageReportPage = lazyLoad("UsageReportPage");
const InvestmentProjectPortfolioPage = lazyLoad(
  "InvestmentProjectPortfolioPage"
);
const ApprovalAuthorityReportPage = lazyLoad("ApprovalAuthorityReportPage");
const ConstItemReportPage = lazyLoad("ConstItemReportPage");
const PromotionReportPage = lazyLoad("PromotionReportPage");
const OrderContractSummaryPage = lazyLoad("OrderContractSummaryPage");
const OrderContractSummaryDetailPage = lazyLoad(
  "OrderContractSummaryDetailPage"
);
const ContractDebtDetailPage = lazyLoad("ContractDebtDetailPage");
const ChangeSupplierInfoPage = lazyLoad("ChangeSupplierInfoPage");
const GoodsServicesDetailPage = lazyLoad("GoodsServicesDetailPage");
const TransactionDailyPage = lazyLoad("TransactionDailyPage");
const settlementPage = lazyLoad("settlementPage");
const PurchasePlanSummaryPage = lazyLoad("PurchasePlanSummaryPage");
const PurchasePlanDetailPage = lazyLoad("PurchasePlanDetailPage");
const GoodsReceiptPage = lazyLoad("GoodsReceiptTrackingPage");
const DetailedSupplierPayablesPage = lazyLoad("DetailedSupplierPayablesPage");
const PurchaseRequirementSummaryPage = lazyLoad(
  "PurchaseRequirementSummaryPage"
);
const ProposalSummaryPage = lazyLoad("ProposalSummaryPage");
const SupplierPage = lazyLoad("SupplierPage");
const SLAPage = lazyLoad("SLAPage");
const SignatureSupplierPage = lazyLoad("SignatureSupplierPage");
const NationPage = lazyLoad("NationPage");
const AppUserPage = lazyLoad("AppUserPage");
const SignatureConfigPage = lazyLoad("SignatureConfigPage");
const SupplierCategoryConfigPage = lazyLoad("SupplierCategoryConfigPage");
const SupplierGoodsItemsDetailPage = lazyLoad("SupplierGoodsItemsDetailPage");
const HomePage = lazyLoad("HomePage");

const userRoutes: Route[] = [
  // Adding routes here:
  {
    path: DASHBROAD_ROUTE,
    component: HomePage,
  },
  {
    path: PROFILE_ROUTE,
    component: ProfilePage,
  },
  {
    path: BUDGET_ROUTE,
    component: BudgetPage,
  },
  {
    path: PAYMENT_ROUTE,
    component: PaymentPage,
  },
  {
    path: LEGAL_SIGNATURE_ROUTE,
    component: LegalSignaturePage,
  },

  {
    path: REPORT_PURCHASE_SUMMARY_ROUTER,
    component: PurchasePlanSummaryPage,
  },
  {
    path: REPORT_PURCHASE_DETAIL_ROUTER,
    component: PurchasePlanDetailPage,
  },
  {
    path: REPORT_GOODS_RECEIPT_TRACKING_ROUTER,
    component: GoodsReceiptPage,
  },
  {
    path: REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER,
    component: DetailedSupplierPayablesPage,
  },
  {
    path: REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER,
    component: PurchaseRequirementSummaryPage,
  },
  {
    path: REPORT_SLA_ROUTER,
    component: SLAPage,
  },
  {
    path: COST_LINE_ROUTE,
    component: CostLinePage,
  },
  {
    path: PROPOSAL_ROUTE,
    component: ProposalPage,
  },
  {
    path: PURCHASE_REQUEST_ROUTE,
    component: PurchaseRequestPage,
  },
  {
    path: PURCHASING_PLAN_ROUTE,
    component: PurchasingPlanPage,
  },
  {
    path: PURCHASING_PLAN_PRINCIPLE_ROUTE,
    component: PurchasingPlanPrinciplePage,
  },
  {
    path: PURCHASING_PLAN_BIDDING_ROUTE,
    component: PurchasingPlanBiddingPage,
  },
  {
    path: PURCHASING_PLAN_COMPETITIVE_OFFER_ROUTE,
    component: PurchasingPlanCompetitiveOfferPage,
  },
  {
    path: PURCHASE_PLAN_ADJUST_BID_ROUTE,
    component: PurchasePlanAdjustBidPage,
  },
  {
    path: PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_ROUTE,
    component: PurchasePlanAdjustCompetitiveOfferPage,
  },
  {
    path: TEMPORARY_IMPORT_ASSET_ROUTE,
    component: TemporaryImportAssetPage,
  },
  {
    path: CONTRACT_ROUTE,
    component: ContractPage,
  },
  {
    path: SYSTEM_ADMINISTRATION_ROUTE,
    component: SystemAdministrationPage,
  },
  {
    path: SPECIALIZED_BANK_ROUTE,
    component: SpecializedBankPage,
  },
  {
    path: AREA_UNIT_CODE_ROUTE,
    component: AreaUnitCodePage,
  },

  {
    path: REPORT_BUDGET_USAGE_ROUTER,
    component: UsageReportPage,
  },
  {
    path: REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER,
    component: InvestmentProjectPortfolioPage,
  },
  {
    path: REPORT_BUDGET_CONTROL_ROUTER,
    component: ControlReportPage,
  },

  {
    path: REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_ROUTER,
    component: ApprovalAuthorityReportPage,
  },
  {
    path: REPORT_PAYMENT_BY_COST_ITEM_ROUTER,
    component: ConstItemReportPage,
  },
  {
    path: REPORT_PAYMENT_BY_PROMO_ROUTER,
    component: PromotionReportPage,
  },
  {
    path: REPORT_PURCHASE_ORDER_ROUTER,
    component: OrderContractSummaryPage,
  },
  {
    path: REPORT_PURCHASE_ORDER_DETAIL_ROUTER,
    component: OrderContractSummaryDetailPage,
  },
  {
    path: REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER,
    component: ContractDebtDetailPage,
  },
  {
    path: REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER,
    component: ChangeSupplierInfoPage,
  },
  {
    path: REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER,
    component: GoodsServicesDetailPage,
  },
  {
    path: REPORT_ORDER_TRANSACTION_DAILY_ROUTER,
    component: TransactionDailyPage,
  },
  {
    path: REPORT_SUPPLIER_GOODS_DETAIL_ROUTER,
    component: SupplierGoodsItemsDetailPage,
  },
  {
    path: PERSONNEL_BY_UNIT_ROUTE,
    component: PersonnelByUnitPage,
  },
  {
    path: CONTRACT_CLASSIFICATION_ROUTE,
    component: ContractClassificationPage,
  },
  {
    path: COST_DRIVER_ROUTE,
    component: CostDriverPage,
  },
  {
    path: MANUFACTURER_CATEGORIES_ROUTE,
    component: ManufacturerCategoriesPage,
  },
  {
    path: PAYMENT_CONDITION_ROUTE,
    component: PaymentConditionPage,
  },
  {
    path: CENTRAL_PURCHASE_UNIT_ROUTE,
    component: CentralPurchaseUnitPage,
  },
  {
    path: LOG_TRACKING_ROUTE,
    component: LogTrackingPage,
  },
  {
    path: RECEIVING_GOODS_ROUTE,
    component: ReceivingGoodsPage,
  },

  {
    path: SUPPLIER_EVALUATION_CONFIG_ROUTE,
    component: SupplierEvaluationConfigPage,
  },
  {
    path: SUPPLIER_ROUTE,
    component: SupplierPage,
  },
  {
    path: ACCEPTANCE_ROUTE,
    component: AcceptancePage,
  },
  {
    path: PROJECT_SETTLEMENT_ROUTE,
    component: ProjectSettlementPage,
  },
  {
    path: USE_ELECTRONIC_INVOICE_ROUTE,
    component: UseElectronicInvoicePage,
  },
  {
    path: COMMERCIAL_TERMS_ROUTE,
    component: UseCommercialTermsPage,
  },
  {
    path: GUARANTEE_TYPE_ROUTE,
    component: UseGuaranteeTypePage,
  },
  {
    path: CONTRACT_METHOD_ROUTE,
    component: ContractMethodPage,
  },
  {
    path: BAND_ROUTE,
    component: BandPage,
  },
  {
    path: POSITION_ROUTE,
    component: PositionPage,
  },
  {
    path: RANK_ROUTE,
    component: RankPage,
  },

  {
    path: CONTRACT_TERM_ROUTE,
    component: ContractTermPage,
  },
  {
    path: WARRANTY_TYPE_ROUTE,
    component: UseWarrantyTypePage,
  },
  {
    path: WARRANTY_METHOD_ROUTE,
    component: UseWarrantyMethodPage,
  },
  {
    path: DOCUMENT_TYPE_ROUTE,
    component: UseDocumentTypePage,
  },
  {
    path: NATION_ROUTE,
    component: NationPage,
  },
  {
    path: SIGNATURE_SUPPLIER_ROUTE,
    component: SignatureSupplierPage,
  },
  {
    path: SUPPLIER_CATEGORY_CONFIG_ROUTE,
    component: SupplierCategoryConfigPage,
  },
  {
    path: SIGNATURE_CONFIG_ROUTE,
    component: SignatureConfigPage,
  },
  {
    path: LEGAL_ENTITY_ROUTE,
    component: UseLegalEntityPage,
  },
  {
    path: CONTRACT_PRINCIPLE_ROUTE,
    component: ContractPrinciplePage,
  },
  {
    path: BUSINESS_BRANCH_ROUTE,
    component: BusinessBranchPage,
  },

  {
    path: BUSINESS_DEPARTMENT_ROUTE,
    component: BusinessDepartmentPage,
  },
  {
    path: BANK_ROUTE,
    component: BankPage,
  },
  {
    path: EXCHANGE_RATE_ROUTE,
    component: ExchangeRatePage,
  },
  {
    path: COST_ITEM_ROUTE,
    component: CostItemPage,
  },
  {
    path: COST_TYPE_ROUTE,
    component: CostTypePage,
  },
  {
    path: COST_LINE_COST_ITEM_ROUTE,
    component: CostLineCostItemPage,
  },
  {
    path: CURRENCY_ROUTE,
    component: CurrencyPage,
  },
  {
    path: TAX_ROUTE,
    component: TaxPage,
  },
  {
    path: GOODS_SERVICES_ROUTE,
    component: GoodsServicesPage,
  },
  {
    path: GOODS_SERVICE_CATEGORY_ROUTE,
    component: GoodsServicesCategoryPage,
  },
  {
    path: GOOD_SERVICE_TYPE_ROUTE,
    component: GoodServiceTypePage,
  },
  {
    path: COST_ITEM_GOODS_SERVICES_ROUTE,
    component: CostItemGoodsServicesPage,
  },
  {
    path: UNIT_OF_MEASURE_GROUP_ROUTE,
    component: UnitOfMeasureGroupPage,
  },
  {
    path: UNIT_OF_MEASURE_ROUTE,
    component: UnitOfMeasurePage,
  },
  {
    path: GL_ACCOUNT_ROUTE,
    component: GLAccountPage,
  },
  {
    path: PROMOTION_ROUTE,
    component: PromotionPage,
  },
  {
    path: SUPPLIER_TYPE_ROUTE,
    component: SupplierTypePage,
  },
  {
    path: SETTLEMENT_ROUTE,
    component: settlementPage,
  },
  {
    path: CONTRACT_TERMINATION_ROUTE,
    component: ContractTerminationPage,
  },
  {
    path: APP_USER_ROUTE,
    component: AppUserPage,
  },
  {
    path: REPORT_PROPOSAL_SUMMARY_ROUTER,
    component: ProposalSummaryPage,
  },
  // This base route should be at the end of all other routes
  {
    path: ROOT_ROUTE,
    // exact: true,
    component: () => <Redirect to={DASHBROAD_ROUTE} />,
  },
];

export { userRoutes };
