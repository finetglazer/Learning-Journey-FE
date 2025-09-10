import { LayoutCell, OneLineText } from "react-components-design-system";
import type { ColumnProps } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { formatNumber } from "core/helpers/number";
import { NOT_AVAILABLE } from "config/const";
import { Link, useHistory } from "react-router-dom";
import styles from "pages/ReportPage/Payment/ReportPage.module.scss";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { isNil } from "lodash";
import { useCallback } from "react";
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
  CONTRACT_TERMINATION_VIEW_ROUTE,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_ADJUST_VIEW_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { TRANSACTION_TYPE } from "./TransactionTypeConstanst";

export function useColumns({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}): ColumnProps<any>[] {
  const [translate] = useTranslation();
  const history = useHistory();

  const transactionTypeToRoute = {
    [TRANSACTION_TYPE.ACCEPTANCE]: (id: string) =>
      `${ACCEPTANCE_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.ACCOUNTING]: (id: string) =>
      `${ACCOUNTING_ENTRY_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.ADVANCE_PAYMENT]: (id: string) =>
      `${ADVANCE_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.ADVANCE_REQUEST]: (id: string) =>
      `${EXPENSE_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.BUDGET_ADJUST]: (id: string) =>
      `${BUDGET_ADJUST_DETAIL_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.BUDGET_PLAN]: (id: string) =>
      `${BUDGET_DETAIL_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.BUDGET_SETTLEMENT]: (id: string) =>
      `${BUDGET_DETAIL_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.CONTRACT]: (id: string) => `${CONTRACT_ROUTE_VIEW}/${id}`,
    [TRANSACTION_TYPE.CONTRACT_ADJUST]: (id: string) =>
      `${CONTRACT_ADJUSTMENT_VIEW_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.CONTRACT_APPENDIX]: (id: string) =>
      `${CONTRACT_ANNEX_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.CONTRACT_PRINCIPLE]: (id: string) =>
      `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.CONTRACT_PRINCIPLE_APPENDIX]: (id: string) =>
      `${CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.CONTRACT_SETTLEMENT]: (id: string) =>
      `${SETTLEMENT_VIEW_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.CONTRACT_TERMINATION]: (id: string) =>
      `${CONTRACT_TERMINATION_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.DEPOSIT]: (id: string) =>
      `${DEPOSIT_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.PAYMENT]: (id: string) =>
      `${PAYMENT_REQUEST_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.PROJECT_SETTLEMENT]: (id: string) =>
      `${PROJECT_SETTLEMENT_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_BIDDING]: (id: string) =>
      `${PURCHASING_PLAN_BIDDING_VIEW_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_BIDDING_ADJUST]: (id: string) =>
      `${PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.PURCHASE_PROPOSAL]: (id: string) =>
      `${PROPOSAL_DETAIL_ROUTE}/${id}`,
    [TRANSACTION_TYPE.PURCHASE_PROPOSAL_ADJUST]: (id: string) =>
      `${PROPOSAL_ADJUST_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.PURCHASE_REQUEST]: (id: string) =>
      `${PURCHASE_REQUEST_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.PURCHASE_REQUEST_ADJUST]: (id: string) =>
      `${PURCHASE_REQUEST_ADJUST_VIEW_ROUTE}/${id}`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_COMPETITIVE_BIDDING]: (id: string) =>
      `${PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_COMPETITIVE_BIDDING_ADJUST]: (
      id: string
    ) =>
      `${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE}/${id}?isViewWaitingApprove=true`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_DIRECT_AWARD]: (id: string) =>
      `${PURCHASING_PLAN_VIEW_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.PURCHASING_PLAN_PRINCIPLE]: (id: string) =>
      `${PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE}/${id}?isViewWaitingApprove=false`,
    [TRANSACTION_TYPE.RECEIVING_GOODS]: (id: string) =>
      `${RECEIVING_GOODS_DETAIL_ROUTE}/${id}?isView=true`,
    [TRANSACTION_TYPE.TEMPORARY_IMPORT_ASSET]: (id: string) =>
      `${TEMPORARY_IMPORT_ASSET_VIEW_ROUTE}/${id}?isViewWaitingApprove=false`,
  };

  const getLinkToTransaction = useCallback(
    (record?: any): string | null => {
      if (!record?.transactionTypeCode || !record?.id) return null;

      const routeBuilder = transactionTypeToRoute[record?.transactionTypeCode];
      return routeBuilder ? routeBuilder(record.id) : null;
    },
    [history.location.pathname]
  );

  return [
    {
      title: translate("report.purchase.transaction_daily.table.index"),
      width: 55,
      key: "index",
      dataIndex: "index",
      render(_, __, index: number) {
        return (
          <LayoutCell position={"center"}>
            <OneLineText
              value={((pageIndex - 1) * pageSize + (index + 1)).toString()}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.createdDate"),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 96,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.approveDate"),
      key: "approveDate",
      dataIndex: "approveDate",
      width: 96,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.effectiveDate"),
      key: "effectiveDate",
      dataIndex: "effectiveDate",
      width: 96,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.transaction_daily.table.transactionTypeName"
      ),
      width: 200,
      key: "transactionTypeName",
      dataIndex: "transactionTypeName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.code"),
      width: 189,
      key: "code",
      dataIndex: "code",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Link
              to={getLinkToTransaction(record)}
              target="_blank"
              className="text-decoration-none"
            >
              <OneLineText
                className={styles["text-table-content-primary"]}
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.costGroupName"),
      width: 150,
      key: "costGroupName",
      dataIndex: "costGroupName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record?.costGroup?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.name"),
      width: 250,
      key: "name",
      dataIndex: "name",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.totalAfterTax"),
      width: 145,
      key: "totalAfterTax",
      dataIndex: "totalAfterTax",
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.currencyCode"),
      width: 150,
      key: "currencyCode",
      dataIndex: "currencyCode",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record?.currency?.code} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.status"),
      width: 120,
      key: "status",
      dataIndex: "status",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.createdBy"),
      width: 200,
      key: "createdBy",
      dataIndex: "createdBy",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.transaction_daily.table.createdStaffCode"
      ),
      width: 170,
      key: "createdStaffCode",
      dataIndex: "createdStaffCode",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.transaction_daily.table.organizationName"
      ),
      width: 200,
      key: "organizationName",
      dataIndex: "organizationName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record?.organization?.organization?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.transaction_daily.table.businessBranch"
      ),
      width: 200,
      key: "businessBranch",
      dataIndex: "businessBranch",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record?.organization?.businessBranch?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.transaction_daily.table.businessUnit"),
      width: 200,
      key: "businessUnit",
      dataIndex: "businessUnit",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record?.organization?.businessUnit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.transaction_daily.table.businessDepartment"
      ),
      width: 200,
      key: "businessDepartment",
      dataIndex: "businessDepartment",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText
              value={record?.organization?.businessDepartment?.name}
            />
          </LayoutCell>
        );
      },
    },
  ];
}
