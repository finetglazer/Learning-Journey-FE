import { APP_OVERVIEW } from "config/route-const";
import { numberConstants } from "core/config/consts";
import dayjs from "dayjs";
import { t } from "i18next";

export const listStatus = [
  {
    id: numberConstants.ONE,
    code: "ACTIVE",
    name: t("CM.txt_status_active"),
  },
  {
    id: numberConstants.ZERO,
    code: "DEACTIVATE",
    name: t("CM.txt_status_deactivate"),
  },
];

export const TEXT_AREA_MAX_LENGTH = 500;

export const CURRENT_MONTH = dayjs().month() + numberConstants.ONE;

export const catalogBreadcrumb = [
  {
    name: t("CM.menu_title_home"),
    path: APP_OVERVIEW,
  },
  {
    name: t("CM.menu_title_catalog"),
  },
];

export const organizationManagementBaseBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_organization_management"),
  },
];

export const financialInformationManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_financial_infomation_management"),
  },
];

export const contractManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_contract_management"),
  },
];

export const budgetManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_budget_management"),
  },
];

export const supplierManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_supplier_management"),
  },
];

export const goodsManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_goods_management"),
  },
];

export const othersManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_other_management"),
  },
];

export const signatureManagementBreadcrumb = [
  ...catalogBreadcrumb,
  {
    name: t("CM.menu_title_signature_management"),
  },
];
